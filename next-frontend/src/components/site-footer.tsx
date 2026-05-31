"use client";

import { useState } from "react";
import Link from "next/link";
import type { SiteSettings } from "@/lib/wordpress";
import { SiteLogo } from "@/components/site-logo";
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Send, Youtube } from "lucide-react";

export function SiteFooter({ settings }: { settings: SiteSettings }) {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleNewsletterSignup(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setIsSubscribed(false);

    const normalizedEmail = email.trim();

    if (!normalizedEmail || !normalizedEmail.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email: normalizedEmail })
      });

      if (response.ok) {
        setIsSubscribed(true);
        setEmail("");
      } else {
        const data = await response.json().catch(() => null);
        setError(data?.message || "Failed to subscribe. Please try again.");
      }
    } catch (signupError) {
      console.error("Newsletter signup error:", signupError);
      setError("An error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <footer className="bg-slate-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="space-y-4">
          <Link className="inline-flex items-center" href="/">
            <SiteLogo
              alt={settings.title}
              variant="footer"
              className="h-8 w-auto"
            />
          </Link>
          <p className="text-gray-400 text-sm">
            {"Discover your dream home with House Unlimited Nigeria. We offer a wide range of properties across Abuja, tailored to your needs."}
          </p>
          <div className="flex space-x-4">
            {[
              { Icon: Facebook, url: settings.facebook },
              { Icon: Instagram, url: settings.instagram },
              { Icon: Linkedin, url: settings.linkedin },
              { Icon: Youtube, url: settings.youtube },
            ].map(({ Icon, url }, index) => (
              <a
                key={index}
                href={url || "#"}
                target={url ? "_blank" : undefined}
                rel={url ? "noopener noreferrer" : undefined}
                className="w-8 h-8 rounded-full border border-gray-700 flex items-center justify-center hover:bg-[#005555] transition-colors"
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-bold mb-6">Company</h4>
          <div className="space-y-3 text-gray-400 text-sm">
            <Link href="/properties" className="block hover:text-[#9fd1d1] transition-colors">Properties</Link>
            <Link href="/blog" className="block hover:text-[#9fd1d1] transition-colors">Blog</Link>
            <Link href="/about" className="block hover:text-[#9fd1d1] transition-colors">About Us</Link>
            <Link href="/contact" className="block hover:text-[#9fd1d1] transition-colors">Contact Us</Link>
          </div>
        </div>
        <div>
          <h4 className="font-bold mb-6">Contact</h4>
          <div className="space-y-3 text-gray-400 text-sm">
            <p className="flex items-center"><Phone className="w-4 h-4 mr-2 text-[#005555]" /> {settings.phone}</p>
            <p className="flex items-center"><Mail className="w-4 h-4 mr-2 text-[#005555]" /> {settings.email}</p>
            <p className="flex items-center"><MapPin className="w-4 h-4 mr-2 text-[#005555]" /> {settings.address}</p>
          </div>
        </div>
        <div>
          <h4 className="font-bold mb-6">Get the latest information</h4>
          <div className="relative">
            <form onSubmit={handleNewsletterSignup}>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                  setIsSubscribed(false);
                }}
                placeholder="Email address"
                className="w-full bg-slate-800 border-none rounded-lg px-4 py-3 pr-14 text-sm focus:ring-2 focus:ring-[#005555] outline-none"
                disabled={isLoading}
                aria-label="Email address for updates"
              />
              <button
                type="submit"
                disabled={isLoading}
                className={`absolute right-1 top-1 bottom-1 px-3 rounded-md transition-colors ${
                  isLoading
                    ? "bg-gray-600 cursor-wait"
                    : "bg-[#005555] hover:bg-[#004242]"
                }`}
                aria-label="Subscribe to updates"
              >
                {isLoading ? "..." : <Send className="w-4 h-4" />}
              </button>
            </form>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Monthly market updates, new listings, and property insights.
          </p>
          {error && (
            <p className="text-red-400 text-xs mt-2">{error}</p>
          )}
          {isSubscribed && (
            <p className="text-green-400 text-xs mt-2">Thank you for subscribing!</p>
          )}
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 mt-16 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between text-gray-500 text-xs text-center md:text-left gap-4">
        <div className="flex items-center justify-center md:justify-start gap-3">
          <SiteLogo
            alt={settings.title}
            variant="compact"
            className="h-5 w-auto opacity-70"
          />
          <span>&copy; 2026 houseunlimitednigeria.com. All rights reserved.</span>
        </div>
        <div className="space-x-6">
          <Link href="/terms" className="hover:text-white transition-colors">User Terms & Conditions</Link>
          <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
        </div>
      </div>
    </footer>
  );
}
