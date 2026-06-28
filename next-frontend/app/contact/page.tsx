import type { Metadata } from "next";
import { JsonLd } from "@/lib/json-ld";
import { ContactClient } from "./contact-client";
import { getSiteSettings } from "@/lib/wordpress";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();

  return {
    title: "Contact Us | House Unlimited Nigeria - Get in Touch",
    description: `Contact ${settings.title} for property enquiries, inspections, and investment opportunities. Reach our team in Abuja via phone, email, or our contact form.`,
    openGraph: {
      title: "Contact Us | House Unlimited Nigeria - Get in Touch",
      description: `Contact ${settings.title} for property enquiries, inspections, and investment opportunities in Abuja.`
    }
  };
}

interface ContactPageProps {
  searchParams?: Promise<{
    topic?: string;
    role?: string;
  }>;
}

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const settings = await getSiteSettings();
  const resolvedSearchParams = (await searchParams) || {};
  const topic = resolvedSearchParams.topic || "general";
  const role = resolvedSearchParams.role || "";

  const breadcrumbListSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: settings.siteUrl },
      { "@type": "ListItem", position: 2, name: "Contact", item: settings.siteUrl + "/contact" },
    ],
  };

  return (
    <>
      <JsonLd data={breadcrumbListSchema} id="contact-breadcrumb-jsonld" />
      <ContactClient settings={settings} initialTopic={topic} initialRole={role} />;
}
