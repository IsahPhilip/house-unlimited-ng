import Link from "next/link";
import type { MenuItem, SiteSettings } from "@/lib/wordpress";
import hunLogo from "../../../frontend/src/img/hun_logo.png";

type SiteHeaderProps = {
  menu: MenuItem[];
  settings: SiteSettings;
};

export function SiteHeader({ menu, settings }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-20 gap-8">
          <Link className="flex items-center shrink-0" href="/">
            <img
              src={hunLogo.src}
              alt={settings.title}
              className="h-10 w-auto"
            />
          </Link>
          <nav className="hidden md:flex items-center justify-center gap-8 flex-1" aria-label="Primary navigation">
            {menu.map((item) => (
              <Link
                key={`${item.path}-${item.label}`}
                href={item.path}
                className="capitalize font-medium text-gray-600 hover:text-teal-600 transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <Link
            className="hidden md:inline-flex items-center justify-center bg-teal-600 text-white px-6 py-2.5 rounded-full font-semibold hover:bg-teal-700 transition-all text-sm shadow-lg shadow-teal-100"
            href="/contact"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </header>
  );
}
