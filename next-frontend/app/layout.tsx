import type { Metadata } from "next";
import "./globals.css";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getPrimaryMenu, getSiteSettings } from "@/lib/wordpress";
import { Phone, Mail } from "lucide-react";

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
      <body className="font-['Inter'] text-gray-900 bg-white antialiased">
        {/* Top Bar */}
        <div className="bg-slate-900 text-white py-2 text-[10px] uppercase tracking-widest font-bold">
          <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
            <div className="flex space-x-6">
              <span className="flex items-center"><Phone className="w-4 h-4 mr-2 text-teal-500" /> {settings.phone}</span>
              <span className="flex items-center"><Mail className="w-4 h-4 mr-2 text-teal-500" /> {settings.email}</span>
            </div>
            <div className="flex space-x-4">
              <span className="w-4 h-4 hover:text-teal-500 cursor-pointer transition-colors">f</span>
              <span className="w-4 h-4 hover:text-teal-500 cursor-pointer transition-colors">t</span>
              <span className="w-4 h-4 hover:text-teal-500 cursor-pointer transition-colors">i</span>
              <span className="w-4 h-4 hover:text-teal-500 cursor-pointer transition-colors">l</span>
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
