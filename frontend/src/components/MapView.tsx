import React, { useRef, useEffect } from 'react';
import { Property } from '../types';

// Declare Leaflet globally to fix type errors
declare const L: any;

interface MapViewProps {
  properties: Property[];
  onNavigate: (id: string) => void;
  onWishlistToggle?: (id: string, property?: Property) => void;
}

export const MapView: React.FC<MapViewProps> = ({ properties, onNavigate }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markersRef = useRef<any>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    if (!mapInstance.current) {
      mapInstance.current = L.map(mapRef.current, {
        center: [39.8283, -98.5795],
        zoom: 4,
        zoomControl: false
      });

      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
      }).addTo(mapInstance.current);

      L.control.zoom({ position: 'bottomright' }).addTo(mapInstance.current);
      markersRef.current = L.layerGroup().addTo(mapInstance.current);
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (markersRef.current && mapInstance.current) {
      markersRef.current.clearLayers();

      properties.forEach(prop => {
        const customIcon = L.divIcon({
          className: 'custom-div-icon',
          html: `<div class="price-marker">${prop.price.split('/')[0]}</div>`,
          iconSize: [60, 30],
          iconAnchor: [30, 15]
        });

        const marker = L.marker(prop.coordinates, { icon: customIcon });
        
        const popupContent = document.createElement('div');
        popupContent.className = 'w-48 overflow-hidden rounded-xl';
        popupContent.innerHTML = `
          <img src="${prop.image}" class="w-full h-24 object-cover">
          <div class="p-3">
            <h4 class="font-bold text-gray-900 text-sm mb-1">${prop.title}</h4>
            <p class="text-teal-600 font-bold text-xs mb-2">${prop.price}</p>
            <button class="view-details-btn bg-teal-600 text-white w-full py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-teal-700 transition-colors">
              View Details
            </button>
          </div>
        `;

        marker.bindPopup(popupContent);
        
        marker.on('popupopen', () => {
          const btn = popupContent.querySelector('.view-details-btn');
          btn?.addEventListener('click', (e) => {
            e.stopPropagation();
            onNavigate(prop.id);
          });
        });

        markersRef.current?.addLayer(marker);
      });

      if (properties.length > 0) {
        const bounds = L.latLngBounds(properties.map(p => p.coordinates));
        mapInstance.current.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  }, [properties, onNavigate]);

  return <div ref={mapRef} className="w-full h-[600px] rounded-3xl shadow-inner border border-gray-100 z-0" />;
};
