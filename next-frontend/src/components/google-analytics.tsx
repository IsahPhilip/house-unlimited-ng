"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export function GoogleAnalytics() {
  const pathname = usePathname();

  useEffect(() => {
    if (!measurementId || typeof window.gtag !== "function") {
      return;
    }

    window.gtag("config", measurementId, {
      page_path: pathname,
      page_location: window.location.href,
      page_title: document.title
    });
  }, [pathname, measurementId]);

  return null;
}
