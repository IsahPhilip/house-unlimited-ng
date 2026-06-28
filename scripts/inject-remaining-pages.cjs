const fs = require('fs');

function inject(fileName, pageName) {
  const file = 'next-frontend/app/' + fileName;
  let content = fs.readFileSync(file, 'utf8');

  if (!content.includes('import { JsonLd }')) {
    const importMatch = content.match(/import \{ .*? \} from "@\/lib\/wordpress";/);
    if (importMatch) {
      content = content.replace(
        importMatch[0],
        importMatch[0] + '\nimport { JsonLd } from "@/lib/json-ld";'
      );
    }
  }

  const marker =
    'export default async function ' + pageName + '() {\n' +
    '  const settings = await getSiteSettings();\n' +
    '\n' +
    '  return (\n';

  if (!content.includes('const breadcrumbListSchema') && content.includes(marker)) {
    const replacement =
      'export default async function ' + pageName + '() {\n' +
      '  const settings = await getSiteSettings();\n' +
      '\n' +
      '  const breadcrumbListSchema = {\n' +
      '    "@context": "https://schema.org",\n' +
      '    "@type": "BreadcrumbList",\n' +
      '    itemListElement: [\n' +
      '      { "@type": "ListItem", position: 1, name: "Home", item: settings.siteUrl },\n' +
      '      { "@type": "ListItem", position: 2, name: "' + pageName.replace('Page', '') + '", item: settings.siteUrl + "/' + pageName.replace('Page', '').toLowerCase() + '" },\n' +
      '    ],\n' +
      '  };\n' +
      '\n' +
      '  return (\n' +
      '    <>\n' +
      '      <JsonLd data={breadcrumbListSchema} id="' + pageName.toLowerCase() + '-breadcrumb-jsonld" />\n';

    content = content.replace(marker, replacement);
    fs.writeFileSync(file, content, 'utf8');
    console.log('injected ' + fileName);
  } else {
    console.log('skipped ' + fileName);
  }
}

inject('about/page.tsx', 'AboutPage');
inject('contact/page.tsx', 'ContactPage');
inject('careers/page.tsx', 'CareersPage');
inject('terms/page.tsx', 'TermsPage');
inject('privacy/page.tsx', 'PrivacyPage');
