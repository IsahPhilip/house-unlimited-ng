import Link from "next/link";
import type { MenuItem, SiteSettings } from "@/lib/wordpress";
import hunLogo from "../../../frontend/src/img/hun_logo.png";

type SiteHeaderProps = {
  menu: MenuItem[];
  settings: SiteSettings;
};

export function SiteHeader({ menu, settings }: SiteHeaderProps) {
  const defaultNavItems: MenuItem[] = [
    { label: "Home", path: "/" },
    { label: "Property", path: "/properties" },
    { label: "Blog", path: "/blog" },
    { label: "About Us", path: "/about" },
    { label: "Contact Us", path: "/contact" }
  ];

  const menuMap = new Map(menu.map((item) => [item.path, item]));
  const navItems = defaultNavItems.map((item) => menuMap.get(item.path) || item);

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
            {navItems.map((item) => (
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
            Book Inspection
          </Link>
        </div>
      </div>
    </header>
  );
}
