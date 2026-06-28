export type OrganizationSchema = {
  "@context": "https://schema.org";
  "@type": "RealEstateAgent";
  name: string;
  alternateName?: string;
  description: string;
  url: string;
  logo?: string;
  image?: string;
  telephone: string;
  email: string;
  address: {
    "@type": "PostalAddress";
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  geo?: {
    "@type": "GeoCoordinates";
    latitude: number;
    longitude: number;
  };
  sameAs?: string[];
  foundingDate?: string;
};

export type BreadcrumbListSchema = {
  "@context": "https://schema.org";
  "@type": "BreadcrumbList";
  itemListElement: Array<{
    "@type": "ListItem";
    position: number;
    name: string;
    item: string;
  }>;
};

export type WebSiteSchema = {
  "@context": "https://schema.org";
  "@type": "WebSite";
  name: string;
  alternateName?: string;
  url: string;
  description: string;
  inLanguage: string;
  copyrightNotice?: string;
  publisher?: {
    "@type": "Organization";
    name: string;
    url: string;
  };
};

export type FAQPageSchema = {
  "@context": "https://schema.org";
  "@type": "FAQPage";
  mainEntity: Array<{
    "@type": "Question";
    name: string;
    acceptedAnswer: {
      "@type": "Answer";
      text: string;
    };
  }>;
};

export type RealEstateListingSchema = {
  "@context": "https://schema.org";
  "@type": "RealEstateListing" | "Product";
  name: string;
  description: string;
  url: string;
  image?: string;
  offers?: {
    "@type": "Offer";
    price: string;
    priceCurrency: string;
    availability: string;
    url?: string;
  };
  address?: {
    "@type": "PostalAddress";
    streetAddress?: string;
    addressLocality: string;
    addressRegion: string;
    addressCountry: string;
  };
  numberOfBedrooms?: number;
  numberOfBathroomsTotal?: number;
  floorSize?: {
    "@type": "QuantitativeValue";
    value: number;
    unitCode: string;
  };
  additionalProperty?: Array<{
    "@type": "PropertyValue";
    name: string;
    value: string;
  }>;
};

export type BlogPostingSchema = {
  "@context": "https://schema.org";
  "@type": "BlogPosting" | "Article";
  headline: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified?: string;
  author: {
    "@type": "Organization";
    name: string;
    url?: string;
  };
  publisher: {
    "@type": "Organization";
    name: string;
    url: string;
    logo?: {
      "@type": "ImageObject";
      url: string;
    };
  };
  image?: string;
  mainEntityOfPage?: {
    "@type": "WebPage";
    "@id": string;
  };
};

export type ReviewSchema = {
  "@context": "https://schema.org";
  "@type": "Review";
  itemReviewed: {
    "@type": "Organization";
    name: string;
    url: string;
  };
  author: {
    "@type": "Person";
    name: string;
  };
  reviewRating: {
    "@type": "Rating";
    ratingValue: number;
    bestRating: number;
    worstRating: number;
  };
  reviewBody: string;
};

export type AggregateRatingSchema = {
  "@context": "https://schema.org";
  "@type": "AggregateRating";
  itemReviewed: {
    "@type": "Organization";
    name: string;
    url: string;
  };
  ratingValue: number;
  reviewCount: number;
  bestRating: number;
  worstRating: number;
};

export type JobPostingSchema = {
  "@context": "https://schema.org";
  "@type": "JobPosting";
  title: string;
  description: string;
  datePosted: string;
  employmentType: string;
  hiringOrganization: {
    "@type": "Organization";
    name: string;
    url: string;
    sameAs?: string[];
  };
  jobLocation: {
    "@type": "Place";
    address: {
      "@type": "PostalAddress";
      addressLocality: string;
      addressRegion: string;
      addressCountry: string;
    };
  };
  url: string;
};
