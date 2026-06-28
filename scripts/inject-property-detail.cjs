const fs = require('fs');
const file = 'next-frontend/app/properties/[slug]/page.tsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('import { JsonLd }')) {
  content = content.replace(
    'import { Bed, Bath, Square, MapPin, Phone, Mail } from "lucide-react";',
    'import { JsonLd } from "@/lib/json-ld";\nimport { Bed, Bath, Square, MapPin, Phone, Mail } from "lucide-react";'
  );
}

if (!content.includes('const breadcrumbListSchema') && content.includes('export default async function PropertyPage')) {
  const marker =
    'export default async function PropertyPage({ params }: PropertyPageProps) {\r\n' +
    '  const { slug } = await params;\r\n' +
    '  const property = await getPropertyBySlug(slug);\r\n' +
    '\r\n' +
    '  if (!property) {\r\n' +
    '    notFound();\r\n' +
    '  }\r\n' +
    '\r\n' +
    '  return (\r\n' +
    '    <div className="py-24 bg-gray-50 min-h-screen">';

  const replacement =
    'export default async function PropertyPage({ params }: PropertyPageProps) {\r\n' +
    '  const { slug } = await params;\r\n' +
    '  const property = await getPropertyBySlug(slug);\r\n' +
    '\r\n' +
    '  if (!property) {\r\n' +
    '    notFound();\r\n' +
    '  }\r\n' +
    '\r\n' +
    '  const siteUrl = "https://houseunlimitednigeria.com";\r\n' +
    '  const breadcrumbListSchema = {\r\n' +
    '    "@context": "https://schema.org",\r\n' +
    '    "@type": "BreadcrumbList",\r\n' +
    '    itemListElement: [\r\n' +
    '      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },\r\n' +
    '      { "@type": "ListItem", position: 2, name: "Properties", item: siteUrl + "/properties" },\r\n' +
    '      { "@type": "ListItem", position: 3, name: property.title, item: siteUrl + "/properties/" + property.slug },\r\n' +
    '    ],\r\n' +
    '  };\r\n' +
    '\r\n' +
    '  const numericArea = property.area ? Number.parseFloat(String(property.area).replace(/[^0-9.]/g, "")) : undefined;\r\n' +
    '\r\n' +
    '  const listingSchema = {\r\n' +
    '    "@context": "https://schema.org",\r\n' +
    '    "@type": "RealEstateListing",\r\n' +
    '    name: property.title,\r\n' +
    '    description: property.excerpt || property.content || "",\r\n' +
    '    url: siteUrl + "/properties/" + property.slug,\r\n' +
    '    image: property.image,\r\n' +
    '    additionalProperty: [\r\n' +
    '      property.bedrooms !== undefined && { "@type": "PropertyValue", name: "Bedrooms", value: String(property.bedrooms) },\r\n' +
    '      property.bathrooms !== undefined && { "@type": "PropertyValue", name: "Bathrooms", value: String(property.bathrooms) },\r\n' +
    '      property.type && { "@type": "PropertyValue", name: "Property Type", value: property.type },\r\n' +
    '      property.status && { "@type": "PropertyValue", name: "Status", value: property.status },\r\n' +
    '      numericArea && { "@type": "PropertyValue", name: "Area", value: String(numericArea) },\r\n' +
    '    ].filter(Boolean),\r\n' +
    '  };\r\n' +
    '\r\n' +
    '  if (property.price) {\r\n' +
    '    listingSchema.offers = {\r\n' +
    '      "@type": "Offer",\r\n' +
    '      price: String(property.price).replace(/[^0-9.]/g, ""),\r\n' +
    '      priceCurrency: "NGN",\r\n' +
    '      availability: "https://schema.org/InStock",\r\n' +
    '      url: siteUrl + "/properties/" + property.slug,\r\n' +
    '    };\r\n' +
    '  }\r\n' +
    '\r\n' +
    '  if (property.location) {\r\n' +
    '    listingSchema.address = {\r\n' +
    '      "@type": "PostalAddress",\r\n' +
    '      addressLocality: property.location,\r\n' +
    '      addressRegion: "Federal Capital Territory",\r\n' +
    '      addressCountry: "NG",\r\n' +
    '    };\r\n' +
    '  }\r\n' +
    '\r\n' +
    '  if (numericArea) {\r\n' +
    '    listingSchema.floorSize = { "@type": "QuantitativeValue", value: numericArea, unitCode: "SQM" };\r\n' +
    '  }\r\n' +
    '\r\n' +
    '  return (\r\n' +
    '    <>\r\n' +
    '      <JsonLd data={breadcrumbListSchema} id="property-breadcrumb-jsonld" />\r\n' +
    '      <JsonLd data={listingSchema} id="property-listing-jsonld" />\r\n' +
    '      <div className="py-24 bg-gray-50 min-h-screen">';

  if (content.includes(marker)) {
    content = content.replace(marker, replacement);
    console.log('injected property detail');
  } else {
    console.log('marker not found for property detail');
  }
}

fs.writeFileSync(file, content, 'utf8');
