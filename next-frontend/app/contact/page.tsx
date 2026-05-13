import type { Metadata } from "next";
import { ContactClient } from "./contact-client";
import { getSiteSettings } from "@/lib/wordpress";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();

  return {
    title: "Contact",
    description: `Contact ${settings.title} through our headless frontend.`
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

  return <ContactClient settings={settings} initialTopic={topic} initialRole={role} />;
}
