import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getPrimaryMenu, getSiteSettings } from "@/lib/wordpress";
import { Phone, Mail, Facebook, Instagram, Linkedin, Youtube } from "lucide-react";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body"
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();

  return {
    title: {
      default: settings.title,
      template: `%s | ${settings.title}`
    },
    description: settings.description,
    metadataBase: new URL(settings.siteUrl),
    openGraph: {
      title: settings.title,
      description: settings.description,
      url: settings.siteUrl,
      siteName: settings.title,
      type: "website"
    }
  };
}

export default async function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  const [menu, settings] = await Promise.all([getPrimaryMenu(), getSiteSettings()]);

  return (
    <html lang="en">
      <body className={`${inter.variable} text-gray-900 bg-white antialiased`}>
        <div className="bg-slate-900 text-white py-2 text-[10px] uppercase tracking-widest font-bold">
          <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-2">
            <div className="flex flex-col md:flex-row md:space-x-6 items-center">
              <span className="flex items-center"><Phone className="w-4 h-4 mr-2 text-[#005555]" /> {settings.phone}</span>
              <span className="flex items-center"><Mail className="w-4 h-4 mr-2 text-[#005555]" /> {settings.email}</span>
            </div>
            <div className="flex items-center space-x-4 text-slate-300">
              <Facebook className="w-4 h-4 hover:text-[#5fc0c0] cursor-pointer transition-colors" />
              <Instagram className="w-4 h-4 hover:text-[#5fc0c0] cursor-pointer transition-colors" />
              <Linkedin className="w-4 h-4 hover:text-[#5fc0c0] cursor-pointer transition-colors" />
              <Youtube className="w-4 h-4 hover:text-[#5fc0c0] cursor-pointer transition-colors" />
            </div>
          </div>
        </div>

        <div className="shell">
          <SiteHeader menu={menu} settings={settings} />
          {children}
          <SiteFooter settings={settings} />
        </div>
      </body>
    </html>
  );
}
