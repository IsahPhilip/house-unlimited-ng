"use client";

import { useState } from "react";
import Link from "next/link";
import type { MenuItem, SiteSettings } from "@/lib/wordpress";
import hunLogo from "../../../frontend/src/img/hun_logo.png";

type SiteHeaderProps = {
  menu: MenuItem[];
  settings: SiteSettings;
};

export function SiteHeader({ menu, settings }: SiteHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const defaultNavItems: MenuItem[] = [
    { label: "Home", path: "/" },
    { label: "Property", path: "/properties" },
    { label: "Blog", path: "/blog" },
    { label: "About Us", path: "/about" },
    { label: "Contact Us", path: "/contact" }
  ];

  const menuMap = new Map(menu.map((item) => [item.path, item]));
  const navItems = defaultNavItems.map((item) => menuMap.get(item.path) || item);

  function closeMenu() {
    setIsMenuOpen(false);
  }

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-20 gap-8">
          <Link className="flex items-center shrink-0" href="/" onClick={closeMenu}>
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
                className="capitalize font-medium text-gray-600 hover:text-[#005555] transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <Link
            className="hidden md:inline-flex items-center justify-center bg-[#005555] text-white px-6 py-2.5 rounded-full font-semibold hover:bg-[#004242] transition-all text-sm shadow-lg shadow-cyan-100"
            href="/contact?topic=inspection"
          >
            Book Inspection
          </Link>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 animate-in slide-in-from-top duration-300 shadow-xl overflow-hidden">
          <div className="px-4 py-6 space-y-6">
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={`${item.path}-${item.label}`}
                  href={item.path}
                  onClick={closeMenu}
                  className="text-left text-lg font-semibold py-2 px-4 rounded-xl transition-colors text-gray-600 hover:bg-gray-50 hover:text-[#005555]"
                >
                  {item.label}
                </Link>
              ))}
            </div>
            <div className="pt-6 border-t border-gray-100">
              <Link
                href="/contact?topic=inspection"
                onClick={closeMenu}
                className="block w-full py-3 px-4 text-center font-bold text-white bg-[#005555] rounded-xl shadow-lg shadow-cyan-100"
              >
                Book Inspection
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
