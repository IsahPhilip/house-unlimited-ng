import Link from "next/link";
import type { MenuItem, SiteSettings } from "@/lib/wordpress";

type SiteHeaderProps = {
  menu: MenuItem[];
  settings: SiteSettings;
};

export function SiteHeader({ menu, settings }: SiteHeaderProps) {
  return (
    <header className="header">
      <div className="container header-inner">
        <Link className="brand" href="/">
          {settings.title}
        </Link>
        <nav className="nav" aria-label="Primary navigation">
          {menu.map((item) => (
            <Link key={`${item.path}-${item.label}`} href={item.path}>
              {item.label}
            </Link>
          ))}
        </nav>
        <Link className="button button-primary" href="/contact">
          Contact Team
        </Link>
      </div>
    </header>
  );
}
