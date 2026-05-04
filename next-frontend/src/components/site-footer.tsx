import Link from "next/link";
import type { SiteSettings } from "@/lib/wordpress";
import hunLogo from "../../../frontend/src/img/hun_logo.png";
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Youtube } from "lucide-react";

export function SiteFooter({ settings }: { settings: SiteSettings }) {
  return (
    <footer className="bg-slate-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="space-y-4">
          <Link className="inline-flex items-center" href="/">
            <img
              src={hunLogo.src}
              alt={settings.title}
              className="h-8 w-auto"
            />
          </Link>
          <p className="text-gray-400 text-sm">
            {settings.description || "Empowering home seekers with expert human guidance since 1995."}
          </p>
          <div className="flex space-x-4">
            {[Facebook, Instagram, Linkedin, Youtube].map((Icon, index) => (
              <span
                key={index}
                className="w-8 h-8 rounded-full border border-gray-700 flex items-center justify-center cursor-pointer hover:bg-teal-600 transition-colors"
              >
                <Icon className="w-4 h-4" />
              </span>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-bold mb-6">Company</h4>
          <div className="space-y-3 text-gray-400 text-sm">
            <Link href="/properties" className="block hover:text-teal-400 transition-colors">Properties</Link>
            <Link href="/blog" className="block hover:text-teal-400 transition-colors">Blog</Link>
            <Link href="/about" className="block hover:text-teal-400 transition-colors">About Us</Link>
            <Link href="/contact" className="block hover:text-teal-400 transition-colors">Contact Us</Link>
          </div>
        </div>
        <div>
          <h4 className="font-bold mb-6">Contact</h4>
          <div className="space-y-3 text-gray-400 text-sm">
            <p className="flex items-center"><Phone className="w-4 h-4 mr-2 text-teal-500" /> {settings.phone}</p>
            <p className="flex items-center"><Mail className="w-4 h-4 mr-2 text-teal-500" /> {settings.email}</p>
            <p className="flex items-center"><MapPin className="w-4 h-4 mr-2 text-teal-500" /> {settings.address}</p>
          </div>
        </div>
        <div>
          <h4 className="font-bold mb-6">Get the latest information</h4>
          <div className="bg-slate-800 rounded-lg px-4 py-3 text-sm text-gray-400">
            Follow our listings, updates, and market insights through our contact channels and public pages.
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 mt-16 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between text-gray-500 text-xs text-center md:text-left gap-4">
        <div className="flex items-center justify-center md:justify-start gap-3">
          <img
            src={hunLogo.src}
            alt={settings.title}
            className="h-5 w-auto opacity-70"
          />
          <span>&copy; 2024 {settings.title}. All rights reserved.</span>
        </div>
        <div className="space-x-6">
          <Link href="/terms" className="hover:text-white transition-colors">User Terms & Conditions</Link>
          <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
        </div>
      </div>
    </footer>
  );
}
