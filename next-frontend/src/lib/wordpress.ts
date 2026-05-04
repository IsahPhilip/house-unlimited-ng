import {
  FEATURED_PROPERTIES_QUERY,
  POST_BY_SLUG_QUERY,
  POST_SLUGS_QUERY,
  PRIMARY_MENU_QUERY,
  PROPERTY_BY_SLUG_QUERY,
  PROPERTY_SLUGS_QUERY,
  RECENT_POSTS_QUERY,
  SITE_SETTINGS_QUERY
} from "@/lib/graphql/queries";

const endpoint =
  process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_ENDPOINT ||
  `${process.env.NEXT_PUBLIC_WORDPRESS_URL || "http://localhost/wordpress"}/graphql`;
const restEndpoint =
  `${process.env.NEXT_PUBLIC_WORDPRESS_URL || "http://localhost/wordpress"}/wp-json/hun/v1`;
const wpRestEndpoint =
  `${process.env.NEXT_PUBLIC_WORDPRESS_URL || "http://localhost/wordpress"}/wp-json/wp/v2`;

const fallbackSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const fallbackWordPressUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL || "http://localhost/wordpress";
const revalidateSeconds = Number(process.env.NEXT_PUBLIC_REVALIDATE_SECONDS || 120);

type GraphQLResponse<T> = {
  data?: T;
  errors?: Array<{ message: string }>;
};

type RestProperty = {
  slug: string;
  title: string;
  excerpt?: string;
  content?: string;
  image?: string;
  price?: string;
  type?: string;
  location?: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: string;
  status?: string;
  gallery?: string[];
};

type WordPressRestProperty = {
  slug?: string;
  title?: { rendered?: string };
  excerpt?: { rendered?: string };
  content?: { rendered?: string };
  featured_media?: number;
  _embedded?: {
    ["wp:featuredmedia"]?: Array<{ source_url?: string }>;
  };
  acf?: {
    price?: string;
    property_type?: string;
    location?: string;
    bedrooms?: number;
    bathrooms?: number;
    area?: string;
    property_status?: string;
    gallery?: Array<number | string | { url?: string }>;
  };
};

export type MenuItem = {
  label: string;
  path: string;
};

export type SiteSettings = {
  title: string;
  description: string;
  siteUrl: string;
  phone: string;
  email: string;
  address: string;
  heroTitle: string;
  heroDescription: string;
  heroImage: string;
};

export type PostPreview = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  categories: string[];
  featuredImage?: string;
  content?: string;
};

export type PropertyPreview = {
  slug: string;
  title: string;
  excerpt: string;
  image?: string;
  price?: string;
  type?: string;
  location?: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: string;
  status?: string;
  gallery?: string[];
  content?: string;
};

async function fetchGraphQL<T>(query: string, variables?: Record<string, unknown>): Promise<T | null> {
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ query, variables }),
      next: { revalidate: revalidateSeconds }
    });

    if (!response.ok) {
      throw new Error(`WPGraphQL request failed with status ${response.status}`);
    }

    const result = (await response.json()) as GraphQLResponse<T>;

    if (result.errors?.length) {
      throw new Error(result.errors.map((item) => item.message).join("; "));
    }

    return result.data ?? null;
  } catch (error) {
    console.error("GraphQL fetch error:", error);
    return null;
  }
}

async function fetchRest<T>(path: string, options?: { suppressNotFound?: boolean }): Promise<T | null> {
  try {
    const response = await fetch(`${restEndpoint}${path}`, {
      next: { revalidate: revalidateSeconds }
    });

    if (!response.ok) {
      if (response.status === 404 && options?.suppressNotFound) {
        return null;
      }

      throw new Error(`Headless REST request failed with status ${response.status}`);
    }

    return (await response.json()) as T;
  } catch (error) {
    console.error("REST fetch error:", error);
    return null;
  }
}

async function fetchWordPressRest<T>(path: string, options?: { suppressNotFound?: boolean }): Promise<T | null> {
  try {
    const response = await fetch(`${wpRestEndpoint}${path}`, {
      next: { revalidate: revalidateSeconds }
    });

    if (!response.ok) {
      if (response.status === 404 && options?.suppressNotFound) {
        return null;
      }

      throw new Error(`WordPress REST request failed with status ${response.status}`);
    }

    return (await response.json()) as T;
  } catch (error) {
    console.error("WordPress REST fetch error:", error);
    return null;
  }
}

function stripHtml(value: string | null | undefined): string {
  if (!value) {
    return "";
  }

  return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function formatDate(value: string | null | undefined): string {
  if (!value) {
    return "";
  }

  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const [data, restSettings] = await Promise.all([
    fetchGraphQL<{
      generalSettings?: {
        title?: string;
        description?: string;
        url?: string;
      };
    }>(SITE_SETTINGS_QUERY),
    fetchRest<{
      frontendUrl?: string;
      graphqlUrl?: string;
      siteUrl?: string;
      phone?: string;
      email?: string;
      address?: string;
    }>("/settings", { suppressNotFound: true })
  ]);

  return {
    title: data?.generalSettings?.title || "House Unlimited Nigeria",
    description:
      data?.generalSettings?.description ||
      "A headless WordPress and Next.js real-estate frontend for fast pages and better SEO.",
    siteUrl: restSettings?.siteUrl || fallbackSiteUrl,
    phone: restSettings?.phone || "+234 904 375 2708",
    email: restSettings?.email || "official@houseunlimitednigeria.com",
    address: restSettings?.address || "Abuja, Nigeria",
    heroTitle: "Modern editorial and listing workflows, without giving up WordPress.",
    heroDescription:
      "Use WordPress for publishing, menus, media, and plugin data. Use Next.js for SSR, routing, caching, and performance.",
    heroImage: ""
  };
}

export async function getPrimaryMenu(): Promise<MenuItem[]> {
  const restMenu = await fetchRest<{
    items?: Array<{ label?: string; path?: string }>;
  }>("/menu", { suppressNotFound: true });

  const restItems =
    restMenu?.items
      ?.filter((item) => item.label && item.path)
      .map((item) => ({
        label: item.label as string,
        path: normalizeWpPath(item.path as string)
      })) || [];

  if (restItems.length > 0) {
    return restItems;
  }

  const data = await fetchGraphQL<{
    menuItems?: {
      nodes?: Array<{ label?: string; path?: string }>;
    };
  }>(PRIMARY_MENU_QUERY);

  const items =
    data?.menuItems?.nodes
      ?.filter((node) => node.label && node.path)
      .map((node) => ({
        label: node.label as string,
        path: normalizeWpPath(node.path as string)
      })) || [];

  return items.length > 0
    ? items
    : [
        { label: "Home", path: "/" },
        { label: "Properties", path: "/properties" },
        { label: "Blog", path: "/blog" }
      ];
}

export async function getRecentPosts(first = 6): Promise<PostPreview[]> {
  const data = await fetchGraphQL<{
    posts?: {
      nodes?: Array<{
        slug?: string;
        title?: string;
        excerpt?: string;
        date?: string;
        author?: { node?: { name?: string } };
        categories?: { nodes?: Array<{ name?: string }> };
        featuredImage?: { node?: { sourceUrl?: string } };
      }>;
    };
  }>(RECENT_POSTS_QUERY, { first });

  return (
    data?.posts?.nodes?.map((node) => ({
      slug: node.slug || "",
      title: node.title || "Untitled post",
      excerpt: stripHtml(node.excerpt),
      date: formatDate(node.date),
      author: node.author?.node?.name || "",
      categories: node.categories?.nodes?.map((item) => item.name || "").filter(Boolean) || [],
      featuredImage: node.featuredImage?.node?.sourceUrl
    })) || []
  );
}

export async function getPostSlugs(): Promise<string[]> {
  const data = await fetchGraphQL<{
    posts?: {
      nodes?: Array<{ slug?: string }>;
    };
  }>(POST_SLUGS_QUERY);

  return data?.posts?.nodes?.map((node) => node.slug || "").filter(Boolean) || [];
}

export async function getPostBySlug(slug: string): Promise<PostPreview | null> {
  const data = await fetchGraphQL<{
    post?: {
      slug?: string;
      title?: string;
      excerpt?: string;
      content?: string;
      date?: string;
      author?: { node?: { name?: string } };
      categories?: { nodes?: Array<{ name?: string }> };
      featuredImage?: { node?: { sourceUrl?: string } };
    };
  }>(POST_BY_SLUG_QUERY, { slug });

  if (!data?.post) {
    return null;
  }

  return {
    slug: data.post.slug || slug,
    title: data.post.title || "Untitled post",
    excerpt: stripHtml(data.post.excerpt),
    content: data.post.content || "",
    date: formatDate(data.post.date),
    author: data.post.author?.node?.name || "",
    categories: data.post.categories?.nodes?.map((item) => item.name || "").filter(Boolean) || [],
    featuredImage: data.post.featuredImage?.node?.sourceUrl
  };
}

function mapRestProperty(property: RestProperty): PropertyPreview {
  return {
    slug: property.slug || "",
    title: property.title || "Untitled property",
    excerpt: stripHtml(property.excerpt),
    content: property.content || "",
    image: property.image,
    price: property.price,
    type: property.type,
    location: property.location,
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    area: property.area,
    status: property.status,
    gallery: property.gallery || []
  };
}

function mapWordPressRestProperty(property: WordPressRestProperty): PropertyPreview {
  const gallery =
    property.acf?.gallery?.map((item) => {
      if (typeof item === "string") {
        return item;
      }

      if (typeof item === "object" && item && "url" in item && item.url) {
        return item.url;
      }

      return "";
    }).filter(Boolean) || [];

  return {
    slug: property.slug || "",
    title: stripHtml(property.title?.rendered) || "Untitled property",
    excerpt: stripHtml(property.excerpt?.rendered),
    content: property.content?.rendered || "",
    image: property._embedded?.["wp:featuredmedia"]?.[0]?.source_url,
    price: property.acf?.price,
    type: property.acf?.property_type,
    location: property.acf?.location,
    bedrooms: property.acf?.bedrooms,
    bathrooms: property.acf?.bathrooms,
    area: property.acf?.area,
    status: property.acf?.property_status,
    gallery
  };
}

export async function getFeaturedProperties(first = 6): Promise<PropertyPreview[]> {
  const restData = await fetchRest<{
    items?: RestProperty[];
  }>(`/properties?per_page=${first}`, { suppressNotFound: true });

  if (restData?.items?.length) {
    return restData.items.map(mapRestProperty);
  }

  const wpRestData = await fetchWordPressRest<WordPressRestProperty[]>(
    `/property?per_page=${first}&_embed=wp:featuredmedia`,
    { suppressNotFound: true }
  );

  if (wpRestData?.length) {
    return wpRestData.map(mapWordPressRestProperty);
  }

  const data = await fetchGraphQL<{
    properties?: {
      nodes?: Array<{
        slug?: string;
        title?: string;
        excerpt?: string;
        featuredImage?: { node?: { sourceUrl?: string } };
        propertyFields?: {
          price?: string;
          propertyType?: string;
          location?: string;
        };
      }>;
    };
  }>(FEATURED_PROPERTIES_QUERY, { first });

  return (
    data?.properties?.nodes?.map((node) => ({
      slug: node.slug || "",
      title: node.title || "Untitled property",
      excerpt: stripHtml(node.excerpt),
      image: node.featuredImage?.node?.sourceUrl,
      price: node.propertyFields?.price,
      type: node.propertyFields?.propertyType,
      location: node.propertyFields?.location
    })) || []
  );
}

export async function getPropertySlugs(): Promise<string[]> {
  const restData = await fetchRest<{
    items?: RestProperty[];
  }>("/properties?per_page=24", { suppressNotFound: true });

  if (restData?.items?.length) {
    return restData.items.map((item) => item.slug || "").filter(Boolean);
  }

  const wpRestData = await fetchWordPressRest<WordPressRestProperty[]>(
    "/property?per_page=24",
    { suppressNotFound: true }
  );

  if (wpRestData?.length) {
    return wpRestData.map((item) => item.slug || "").filter(Boolean);
  }

  const data = await fetchGraphQL<{
    properties?: {
      nodes?: Array<{ slug?: string }>;
    };
  }>(PROPERTY_SLUGS_QUERY);

  return data?.properties?.nodes?.map((node) => node.slug || "").filter(Boolean) || [];
}

export async function getPropertyBySlug(slug: string): Promise<PropertyPreview | null> {
  const restProperty = await fetchRest<RestProperty>(`/properties/${slug}`, { suppressNotFound: true });

  if (restProperty?.slug) {
    return mapRestProperty(restProperty);
  }

  const wpRestProperty = await fetchWordPressRest<WordPressRestProperty[]>(
    `/property?slug=${encodeURIComponent(slug)}&_embed=wp:featuredmedia`,
    { suppressNotFound: true }
  );

  if (wpRestProperty?.[0]?.slug) {
    return mapWordPressRestProperty(wpRestProperty[0]);
  }

  const data = await fetchGraphQL<{
    property?: {
      slug?: string;
      title?: string;
      excerpt?: string;
      content?: string;
      date?: string;
      featuredImage?: { node?: { sourceUrl?: string } };
      propertyFields?: {
        price?: string;
        propertyType?: string;
        location?: string;
        bedrooms?: number;
        bathrooms?: number;
        area?: string;
        propertyStatus?: string;
        gallery?: Array<{ sourceUrl?: string }>;
      };
    };
  }>(PROPERTY_BY_SLUG_QUERY, { slug });

  if (!data?.property) {
    return null;
  }

  return {
    slug: data.property.slug || slug,
    title: data.property.title || "Untitled property",
    excerpt: stripHtml(data.property.excerpt),
    content: data.property.content || "",
    image: data.property.featuredImage?.node?.sourceUrl,
    price: data.property.propertyFields?.price,
    type: data.property.propertyFields?.propertyType,
    location: data.property.propertyFields?.location,
    bedrooms: data.property.propertyFields?.bedrooms,
    bathrooms: data.property.propertyFields?.bathrooms,
    area: data.property.propertyFields?.area,
    status: data.property.propertyFields?.propertyStatus,
    gallery: data.property.propertyFields?.gallery?.map((img) => img.sourceUrl || "").filter(Boolean) || []
  };
}

function normalizeWpPath(path: string): string {
  if (!path) {
    return "/";
  }

  if (path.startsWith(fallbackWordPressUrl)) {
    const normalized = path.replace(fallbackWordPressUrl, "");
    return normalized || "/";
  }

  return path;
}
