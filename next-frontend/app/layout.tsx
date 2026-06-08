import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { GoogleAnalytics } from "@/components/google-analytics";
import { getPrimaryMenu, getSiteSettings } from "@/lib/wordpress";
import { Phone, Mail, Facebook, Instagram, Linkedin, Youtube } from "lucide-react";

const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

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
        {gaMeasurementId && (
          <>
            <Script id="google-analytics-init" strategy="beforeInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){window.dataLayer.push(arguments);}
                window.gtag = gtag;
                gtag('js', new Date());
                gtag('config', '${gaMeasurementId}', { send_page_view: false });
              `}
            </Script>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`}
              strategy="afterInteractive"
            />
          </>
        )}
        <Script
          src="https://analytics.ahrefs.com/analytics.js"
          data-key="L2G40W/T7YPLmXmydQE0lQ"
          strategy="afterInteractive"
        />
        <GoogleAnalytics />
        <div className="bg-slate-900 text-white py-2 text-[10px] uppercase tracking-widest font-bold">
          <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-2">
            <div className="flex flex-col md:flex-row md:space-x-6 items-center">
              <span className="flex items-center"><Phone className="w-4 h-4 mr-2 text-[#005555]" /> {settings.phone}</span>
              <span className="flex items-center"><Mail className="w-4 h-4 mr-2 text-[#005555]" /> {settings.email}</span>
            </div>
            <div className="flex items-center space-x-4 text-slate-300">
              {settings.facebook && (
                <a href={settings.facebook} target="_blank" rel="noreferrer" aria-label="Facebook">
                  <Facebook className="w-4 h-4 hover:text-[#5fc0c0] cursor-pointer transition-colors" />
                </a>
              )}
              {settings.instagram && (
                <a href={settings.instagram} target="_blank" rel="noreferrer" aria-label="Instagram">
                  <Instagram className="w-4 h-4 hover:text-[#5fc0c0] cursor-pointer transition-colors" />
                </a>
              )}
              {settings.linkedin && (
                <a href={settings.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
                  <Linkedin className="w-4 h-4 hover:text-[#5fc0c0] cursor-pointer transition-colors" />
                </a>
              )}
              {settings.youtube && (
                <a href={settings.youtube} target="_blank" rel="noreferrer" aria-label="YouTube">
                  <Youtube className="w-4 h-4 hover:text-[#5fc0c0] cursor-pointer transition-colors" />
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="shell">
          <SiteHeader menu={menu} settings={settings} />
          <main>{children}</main>
          <SiteFooter settings={settings} />
        </div>
      </body>
    </html>
  );
}
