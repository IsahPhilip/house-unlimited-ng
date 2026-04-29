import Link from "next/link";
import type { SiteSettings } from "@/lib/wordpress";

export function SiteFooter({ settings }: { settings: SiteSettings }) {
  return (
    <footer className="bg-slate-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-2">
          <div className="brand text-white text-xl mb-4">
            {settings.title}
          </div>
          <p className="text-slate-400 mb-6 max-w-md">{settings.description}</p>
          <div className="flex space-x-4">
            <span className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-teal-700 transition-colors">f</span>
            <span className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-teal-700 transition-colors">t</span>
            <span className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-teal-700 transition-colors">i</span>
            <span className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-teal-700 transition-colors">l</span>
          </div>
        </div>
        <div>
          <h4 className="text-white font-bold mb-4">Quick Links</h4>
          <div className="space-y-2">
            <Link href="/" className="block text-slate-400 hover:text-teal-400 transition-colors">Home</Link>
            <Link href="/properties" className="block text-slate-400 hover:text-teal-400 transition-colors">Properties</Link>
            <Link href="/blog" className="block text-slate-400 hover:text-teal-400 transition-colors">Blog</Link>
            <Link href="/about" className="block text-slate-400 hover:text-teal-400 transition-colors">About</Link>
            <Link href="/contact" className="block text-slate-400 hover:text-teal-400 transition-colors">Contact</Link>
          </div>
        </div>
        <div>
          <h4 className="text-white font-bold mb-4">Contact Info</h4>
          <div className="space-y-2 text-slate-400">
            <p>{settings.phone}</p>
            <p>{settings.email}</p>
            <p>{settings.address}</p>
          </div>
        </div>
      </div>
      <div className="border-t border-slate-800 mt-12 pt-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-400">
          <p>&copy; 2024 {settings.title}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
