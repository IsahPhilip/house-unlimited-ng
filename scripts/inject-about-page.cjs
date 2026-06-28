const fs = require('fs');
const file = 'next-frontend/app/about/page.tsx';
let c = fs.readFileSync(file, 'utf8');

if (!c.includes('import { JsonLd }')) {
  c = c.replace(
    'import { getSiteSettings, getTeamMembers } from "@/lib/wordpress";',
    'import { getSiteSettings, getTeamMembers } from "@/lib/wordpress";\nimport { JsonLd } from "@/lib/json-ld";'
  );
}

const marker =
  '  return (\n' +
  '    <div className="animate-in fade-in duration-500">';

if (c.includes(marker) && !c.includes('const breadcrumbListSchema')) {
  const replacement =
    '  const breadcrumbListSchema = {\n' +
    '    "@context": "https://schema.org",\n' +
    '    "@type": "BreadcrumbList",\n' +
    '    itemListElement: [\n' +
    '      { "@type": "ListItem", position: 1, name: "Home", item: settings.siteUrl },\n' +
    '      { "@type": "ListItem", position: 2, name: "About", item: settings.siteUrl + "/about" },\n' +
    '    ],\n' +
    '  };\n' +
    '\n' +
    '  return (\n' +
    '    <>\n' +
    '      <JsonLd data={breadcrumbListSchema} id="about-breadcrumb-jsonld" />\n' +
    '      <div className="animate-in fade-in duration-500">';

  c = c.replace(marker, replacement);
  fs.writeFileSync(file, c, 'utf8');
  console.log('injected about');
} else {
  console.log('skipped about');
}
