const fs = require('fs');

function injectAbout() {
  const file = 'next-frontend/app/about/page.tsx';
  let c = fs.readFileSync(file, 'utf8');

  if (!c.includes('import { JsonLd }')) {
    c = c.replace(
      'import { getSiteSettings, getTeamMembers } from "@/lib/wordpress";',
      'import { getSiteSettings, getTeamMembers } from "@/lib/wordpress";\nimport { JsonLd } from "@/lib/json-ld";'
    );
  }

  const marker =
    'export default async function AboutPage() {\n' +
    '  const [settings, teamMembers] = await Promise.all([\n' +
    '    getSiteSettings(),\n' +
    '    getTeamMembers(8)\n' +
    '  ]);\n' +
    '\n' +
    '  return (\n' +
    '    <div className="animate-in fade-in duration-500">';

  if (c.includes(marker) && !c.includes('const breadcrumbListSchema')) {
    const replacement =
      'export default async function AboutPage() {\n' +
      '  const [settings, teamMembers] = await Promise.all([\n' +
      '    getSiteSettings(),\n' +
      '    getTeamMembers(8)\n' +
      '  ]);\n' +
      '\n' +
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
}

function injectContact() {
  const file = 'next-frontend/app/contact/page.tsx';
  let c = fs.readFileSync(file, 'utf8');

  if (!c.includes('import { JsonLd }')) {
    c = c.replace(
      'import { ContactClient } from "./contact-client";',
      'import { JsonLd } from "@/lib/json-ld";\nimport { ContactClient } from "./contact-client";'
    );
  }

  const marker =
    'export default async function ContactPage({ searchParams }: ContactPageProps) {\n' +
    '  const settings = await getSiteSettings();\n' +
    '  const resolvedSearchParams = (await searchParams) || {};\n' +
    '  const topic = resolvedSearchParams.topic || "general";\n' +
    '  const role = resolvedSearchParams.role || "";\n' +
    '\n' +
    '  return <ContactClient';

  if (c.includes(marker) && !c.includes('const breadcrumbListSchema')) {
    const replacement =
      'export default async function ContactPage({ searchParams }: ContactPageProps) {\n' +
      '  const settings = await getSiteSettings();\n' +
      '  const resolvedSearchParams = (await searchParams) || {};\n' +
      '  const topic = resolvedSearchParams.topic || "general";\n' +
      '  const role = resolvedSearchParams.role || "";\n' +
      '\n' +
      '  const breadcrumbListSchema = {\n' +
      '    "@context": "https://schema.org",\n' +
      '    "@type": "BreadcrumbList",\n' +
      '    itemListElement: [\n' +
      '      { "@type": "ListItem", position: 1, name: "Home", item: settings.siteUrl },\n' +
      '      { "@type": "ListItem", position: 2, name: "Contact", item: settings.siteUrl + "/contact" },\n' +
      '    ],\n' +
      '  };\n' +
      '\n' +
      '  return (\n' +
      '    <>\n' +
      '      <JsonLd data={breadcrumbListSchema} id="contact-breadcrumb-jsonld" />\n' +
      '      <ContactClient';

    c = c.replace(marker, replacement);
    fs.writeFileSync(file, c, 'utf8');
    console.log('injected contact');
  } else {
    console.log('skipped contact');
  }
}

function injectCareers() {
  const file = 'next-frontend/app/careers/page.tsx';
  let c = fs.readFileSync(file, 'utf8');

  if (!c.includes('import { JsonLd }')) {
    c = c.replace(
      'import { getJobRoles, getSiteSettings } from "@/lib/wordpress";',
      'import { getJobRoles, getSiteSettings } from "@/lib/wordpress";\nimport { JsonLd } from "@/lib/json-ld";'
    );
  }

  const marker =
    'export default async function CareersPage() {\n' +
    '  const [settings, openRoles] = await Promise.all([getSiteSettings(), getJobRoles(12)]);\n' +
    '\n' +
    '  return (\n' +
    '    <div className="animate-in fade-in duration-500 bg-white">';

  if (c.includes(marker) && !c.includes('const breadcrumbListSchema')) {
    const replacement =
      'export default async function CareersPage() {\n' +
      '  const [settings, openRoles] = await Promise.all([getSiteSettings(), getJobRoles(12)]);\n' +
      '\n' +
      '  const breadcrumbListSchema = {\n' +
      '    "@context": "https://schema.org",\n' +
      '    "@type": "BreadcrumbList",\n' +
      '    itemListElement: [\n' +
      '      { "@type": "ListItem", position: 1, name: "Home", item: settings.siteUrl },\n' +
      '      { "@type": "ListItem", position: 2, name: "Careers", item: settings.siteUrl + "/careers" },\n' +
      '    ],\n' +
      '  };\n' +
      '\n' +
      '  return (\n' +
      '    <>\n' +
      '      <JsonLd data={breadcrumbListSchema} id="careers-breadcrumb-jsonld" />\n' +
      '      <div className="animate-in fade-in duration-500 bg-white">';

    c = c.replace(marker, replacement);
    fs.writeFileSync(file, c, 'utf8');
    console.log('injected careers');
  } else {
    console.log('skipped careers');
  }
}

injectAbout();
injectContact();
injectCareers();
