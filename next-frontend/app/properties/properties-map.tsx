"use client";

import { useEffect, useRef } from "react";
import type { PropertyPreview } from "@/lib/wordpress";

// Abuja district → approximate lat/lng lookup
const ABUJA_COORDS: Record<string, [number, number]> = {
  "maitama":          [9.0820, 7.4891],
  "maitama 2":        [9.0950, 7.5100],
  "asokoro":          [9.0490, 7.5320],
  "wuse":             [9.0700, 7.4780],
  "wuse 2":           [9.0750, 7.4900],
  "garki":            [9.0580, 7.4720],
  "garki 2":          [9.0540, 7.4800],
  "guzape":           [9.0300, 7.5000],
  "katampe":          [9.1000, 7.4600],
  "katampe extension":[9.1050, 7.4550],
  "jabi":             [9.0850, 7.4650],
  "life camp":        [9.1100, 7.4400],
  "lifecamp":         [9.1100, 7.4400],
  "lugbe":            [8.9900, 7.4200],
  "lokogoma":         [8.9700, 7.4500],
  "nbora":            [9.0200, 7.5600],
  "kuje":             [8.8800, 7.2300],
  "bwari":            [9.2800, 7.3800],
  "gwagwalada":       [8.9400, 7.0800],
  "kubwa":            [9.1600, 7.3100],
  "abuja":            [9.0579, 7.4951],
};

function geocode(location: string | undefined): [number, number] {
  if (!location) return [9.0579, 7.4951];
  const key = location.toLowerCase().trim();
  for (const [district, coords] of Object.entries(ABUJA_COORDS)) {
    if (key.includes(district)) return coords;
  }
  return [9.0579, 7.4951];
}

// Jitter pins that share the same coordinate so they don't stack
function jitter(coords: [number, number], index: number): [number, number] {
  const angle = (index * 137.5 * Math.PI) / 180;
  const radius = 0.003 * Math.ceil(index / 6);
  return [coords[0] + radius * Math.sin(angle), coords[1] + radius * Math.cos(angle)];
}

export function PropertiesMap({ properties }: { properties: PropertyPreview[] }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let map: import("leaflet").Map;

    (async () => {
      const L = (await import("leaflet")).default;
      await import("leaflet/dist/leaflet.css");

      // Fix default marker icon paths broken by webpack
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      map = L.map(containerRef.current!).setView([9.0579, 7.4951], 12);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      // Custom teal pin icon
      const pinIcon = L.divIcon({
        className: "",
        html: `<div style="width:32px;height:32px;background:#005555;border:3px solid white;border-radius:50% 50% 50% 0;transform:rotate(-45deg);box-shadow:0 2px 8px rgba(0,0,0,0.3)"></div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -36],
      });

      const coordCount = new Map<string, number>();

      properties.forEach((property) => {
        const base = geocode(property.location);
        const key = base.join(",");
        const count = coordCount.get(key) ?? 0;
        coordCount.set(key, count + 1);
        const coords = jitter(base, count);

        const popup = `
          <div style="font-family:Arial,sans-serif;min-width:200px">
            ${property.image ? `<img src="${property.image}" alt="${property.title}" style="width:100%;height:120px;object-fit:cover;border-radius:8px;margin-bottom:10px">` : ""}
            <p style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:#005555;margin:0 0 4px">${property.type || "Property"}</p>
            <p style="font-size:14px;font-weight:700;color:#111827;margin:0 0 4px;line-height:1.3">${property.title}</p>
            ${property.price ? `<p style="font-size:15px;font-weight:800;color:#005555;margin:0 0 6px">${property.price}</p>` : ""}
            ${property.location ? `<p style="font-size:12px;color:#6b7280;margin:0 0 10px">📍 ${property.location}</p>` : ""}
            <a href="/properties/${property.slug}" style="display:block;background:#005555;color:white;text-align:center;padding:8px 12px;border-radius:8px;font-size:12px;font-weight:700;text-decoration:none">View Property</a>
          </div>`;

        L.marker(coords, { icon: pinIcon }).addTo(map).bindPopup(popup, { maxWidth: 240 });
      });
    })();

    return () => {
      map?.remove();
    };
  }, [properties]);

  return <div ref={containerRef} className="w-full h-full rounded-3xl overflow-hidden" />;
}
