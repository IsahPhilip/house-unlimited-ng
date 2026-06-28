const fs = require("fs");
const file = "next-frontend/app/properties/page.tsx";
let content = fs.readFileSync(file, "utf8");

if (!content.includes("import { JsonLd }")) {
  content = content.replace(
    'import { Search } from "lucide-react";',
    'import { JsonLd } from "@/lib/json-ld";\nimport { Search } from "lucide-react";'
  );
}

if (!content.includes("const breadcrumbListSchema")) {
  const marker =
    "export default async function PropertiesPage() {\r\n" +
    "  const properties = await getFeaturedProperties(12);\r\n" +
    "\r\n" +
    "  return (\r\n" +
    '    <div className="py-16 bg-gray-50 min-h-screen">';

  const replacement =
    "export default async function PropertiesPage() {\r\n" +
    "  const settings = await getSiteSettings();\r\n" +
    "  const properties = await getFeaturedProperties(12);\r\n" +
    "\r\n" +
    "  const breadcrumbListSchema = {\r\n" +
    '    "@context": "https://schema.org",\r\n' +
    '    "@type": "BreadcrumbList",\r\n' +
    "    itemListElement: [\r\n" +
    '      { "@type": "ListItem", position: 1, name: "Home", item: settings.siteUrl },\r\n' +
    "      {\r\n" +
    '        "@type": "ListItem",\r\n' +
    "        position: 2,\r\n" +
    '        name: "Properties",\r\n' +
    '        item: settings.siteUrl + "/properties",\r\n' +
    "      },\r\n" +
    "    ],\r\n" +
    "  };\r\n" +
    "\r\n" +
    "  const collectionPageSchema = {\r\n" +
    '    "@context": "https://schema.org",\r\n' +
    '    "@type": "CollectionPage",\r\n' +
    '    name: settings.title + " - Properties",\r\n' +
    '    description: "Browse verified properties for sale in Abuja.",\r\n' +
    '    url: settings.siteUrl + "/properties",\r\n' +
    "    isPartOf: {\r\n" +
    '      "@type": "WebSite",\r\n' +
    "      name: settings.title,\r\n" +
    "      url: settings.siteUrl,\r\n" +
    "    },\r\n" +
    "  };\r\n" +
    "\r\n" +
    "  return (\r\n" +
    "    <>\r\n" +
    "      <JsonLd\r\n" +
    "        data={breadcrumbListSchema}\r\n" +
    '        id="properties-breadcrumb-jsonld"\r\n' +
    "      />\r\n" +
    "      <JsonLd\r\n" +
    "        data={collectionPageSchema}\r\n" +
    '        id="properties-collection-jsonld"\r\n' +
    "      />\r\n" +
    '      <div className="py-16 bg-gray-50 min-h-screen">';

  if (content.includes(marker)) {
    content = content.replace(marker, replacement);
    console.log("injected");
  } else {
    console.log("marker not found");
  }
}

fs.writeFileSync(file, content, "utf8");
