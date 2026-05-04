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

export default async function ContactPage() {
  const settings = await getSiteSettings();

  return <ContactClient settings={settings} />;
}
