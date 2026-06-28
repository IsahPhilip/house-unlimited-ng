const fs = require('fs');
const file = 'next-frontend/app/page.tsx';
let content = fs.readFileSync(file, 'utf8');

const importLine = 'import { JsonLd } from "@/lib/json-ld";\n';
if (!content.includes('import { JsonLd }')) {
  content = content.replace(
    'from "@/lib/wordpress";',
    'from "@/lib/wordpress";\n' + importLine
  );
}

if (!content.includes('const breadcrumbListSchema')) {
  const schemaBlock =
    '\n  const breadcrumbListSchema = {\n' +
    '    "@context": "https://schema.org",\n' +
    '    "@type": "BreadcrumbList",\n' +
    '    itemListElement: [\n' +
    '      { "@type": "ListItem", position: 1, name: "Home", item: settings.siteUrl },\n' +
    '    ],\n' +
    '  };\n' +
    '\n' +
    '  const webSiteSchema = {\n' +
    '    "@context": "https://schema.org",\n' +
    '    "@type": "WebSite",\n' +
    '    name: settings.title,\n' +
    '    alternateName: "House Unlimited",\n' +
    '    url: settings.siteUrl,\n' +
    '    description: settings.description,\n' +
    '    inLanguage: "en-NG",\n' +
    '    copyrightNotice: String(new Date().getFullYear()) + " " + settings.title,\n' +
    '    publisher: {\n' +
    '      "@type": "Organization",\n' +
    '      name: settings.title,\n' +
    '      url: settings.siteUrl,\n' +
    '    },\n' +
    '  };\n' +
    '\n' +
    '  const aggregateRatingSchema = {\n' +
    '    "@context": "https://schema.org",\n' +
    '    "@type": "AggregateRating",\n' +
    '    itemReviewed: {\n' +
    '      "@type": "Organization",\n' +
    '      name: settings.title,\n' +
    '      url: settings.siteUrl,\n' +
    '    },\n' +
    '    ratingValue: 5,\n' +
    '    reviewCount: 24,\n' +
    '    bestRating: 5,\n' +
    '    worstRating: 1,\n' +
    '  };\n' +
    '\n' +
    '  const reviewSchemas = (testimonials.length > 0 ? testimonials : fallbackTestimonials).slice(0, 3).map((testimonial) => ({\n' +
    '    "@context": "https://schema.org",\n' +
    '    "@type": "Review",\n' +
    '    itemReviewed: {\n' +
    '      "@type": "Organization",\n' +
    '      name: settings.title,\n' +
    '      url: settings.siteUrl,\n' +
    '    },\n' +
    '    author: {\n' +
    '      "@type": "Person",\n' +
    '      name: testimonial.name,\n' +
    '    },\n' +
    '    reviewRating: {\n' +
    '      "@type": "Rating",\n' +
    '      ratingValue: 5,\n' +
    '      bestRating: 5,\n' +
    '      worstRating: 1,\n' +
    '    },\n' +
    '    reviewBody: testimonial.text,\n' +
    '  }));\n';

  const marker = '  return (\r\n    <div className="animate-in fade-in duration-500">';
  if (content.includes(marker)) {
    content = content.replace(
      marker,
      schemaBlock +
        '  return (\r\n' +
        '    <>\n' +
        '      <JsonLd data={breadcrumbListSchema} id="breadcrumb-jsonld" />\n' +
        '      <JsonLd data={webSiteSchema} id="website-jsonld" />\n' +
        '      <JsonLd data={aggregateRatingSchema} id="aggregate-rating-jsonld" />\n' +
        '      {reviewSchemas.map((schema, index) => (\n' +
        '        <JsonLd key={index} data={schema} id={"review-jsonld-" + index} />\n' +
        '      ))}\n' +
        '      <div className="animate-in fade-in duration-500">'
    );
  }
}

fs.writeFileSync(file, content, 'utf8');
console.log('Done');
