export const SITE_SETTINGS_QUERY = `
  query SiteSettings {
    generalSettings {
      title
      description
      url
    }
  }
`;

export const PRIMARY_MENU_QUERY = `
  query PrimaryMenu {
    menuItems(first: 100) {
      nodes {
        label
        path
      }
    }
  }
`;

export const RECENT_POSTS_QUERY = `
  query RecentPosts($first: Int = 6) {
    posts(first: $first) {
      nodes {
        slug
        title
        excerpt
        date
        author {
          node {
            name
          }
        }
        categories {
          nodes {
            name
          }
        }
        tags {
          nodes {
            name
          }
        }
        featuredImage {
          node {
            sourceUrl
          }
        }
      }
    }
  }
`;

export const POST_SLUGS_QUERY = `
  query PostSlugs {
    posts(first: 100) {
      nodes {
        slug
      }
    }
  }
`;

export const POST_BY_SLUG_QUERY = `
  query PostBySlug($slug: ID!) {
    post(id: $slug, idType: SLUG) {
      slug
      title
      excerpt
      content
      date
      author {
        node {
          name
        }
      }
      categories {
        nodes {
          name
        }
      }
      tags {
        nodes {
          name
        }
      }
      featuredImage {
        node {
          sourceUrl
        }
      }
    }
  }
`;

export const FEATURED_PROPERTIES_QUERY = `
  query FeaturedProperties($first: Int = 6) {
    properties(first: $first, where: { status: PUBLISH }) {
      nodes {
        slug
        title
        excerpt
        featuredImage {
          node {
            sourceUrl
          }
        }
        propertyFields {
          price
          propertyType
          location
          bedrooms
          bathrooms
          area
          propertyStatus
        }
      }
    }
  }
`;

export const PROPERTY_SLUGS_QUERY = `
  query PropertySlugs {
    properties(first: 100) {
      nodes {
        slug
      }
    }
  }
`;

export const PROPERTY_BY_SLUG_QUERY = `
  query PropertyBySlug($slug: ID!) {
    property(id: $slug, idType: SLUG) {
      slug
      title
      excerpt
      content
      date
      featuredImage {
        node {
          sourceUrl
        }
      }
      propertyFields {
        price
        propertyType
        location
        bedrooms
        bathrooms
        area
        propertyStatus
        gallery {
          sourceUrl
        }
      }
    }
  }
`;

export const PAGE_BY_SLUG_QUERY = `
  query PageBySlug($slug: String!) {
    page(id: $slug, idType: URI) {
      slug
      title
      content
      date
      modified
      featuredImage {
        node {
          sourceUrl
          altText
        }
      }
    }
  }
`;

export const PAGE_SLUGS_QUERY = `
  query PageSlugs {
    pages(first: 100) {
      nodes {
        slug
      }
    }
  }
`;
