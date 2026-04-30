"use client";

import { useEffect, useRef } from "react";
import { ALBANIA_CENTER, coordsForCity } from "@/lib/cityCoords";

const LEAFLET_CSS = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
const LEAFLET_JS = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";

type MaybeLeaflet = {
  map: (el: HTMLElement, opts?: unknown) => LeafletMap;
  tileLayer: (url: string, opts?: unknown) => { addTo: (m: LeafletMap) => unknown };
  marker: (latlng: [number, number], opts?: unknown) => LeafletMarker;
  divIcon: (opts: unknown) => unknown;
  latLngBounds: (corners: [number, number][]) => LeafletBounds;
};

type LeafletMap = {
  setView: (latlng: [number, number], zoom: number) => LeafletMap;
  removeLayer: (layer: unknown) => void;
  fitBounds: (bounds: LeafletBounds, opts?: unknown) => void;
  remove: () => void;
};

type LeafletMarker = {
  addTo: (m: LeafletMap) => LeafletMarker;
  bindPopup: (html: string) => LeafletMarker;
};

type LeafletBounds = unknown;

declare global {
  interface Window {
    L?: MaybeLeaflet;
  }
}

let leafletPromise: Promise<MaybeLeaflet> | null = null;

function loadLeaflet(): Promise<MaybeLeaflet> {
  if (typeof window === "undefined") return Promise.reject("no window");
  if (window.L) return Promise.resolve(window.L);
  if (leafletPromise) return leafletPromise;

  leafletPromise = new Promise<MaybeLeaflet>((resolve, reject) => {
    if (!document.querySelector(`link[href="${LEAFLET_CSS}"]`)) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = LEAFLET_CSS;
      document.head.appendChild(link);
    }
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${LEAFLET_JS}"]`,
    );
    if (existing) {
      existing.addEventListener("load", () => {
        if (window.L) resolve(window.L);
        else reject(new Error("Leaflet failed to load"));
      });
      return;
    }
    const script = document.createElement("script");
    script.src = LEAFLET_JS;
    script.async = true;
    script.onload = () => {
      if (window.L) resolve(window.L);
      else reject(new Error("Leaflet failed to load"));
    };
    script.onerror = () => reject(new Error("Leaflet network error"));
    document.head.appendChild(script);
  });
  return leafletPromise;
}

export interface MapPin {
  id: number | string;
  name: string;
  subtitle?: string;
  city?: string;
  lat?: number;
  lng?: number;
}

interface MapViewProps {
  pins: MapPin[];
  userCoords?: { lat: number; lng: number } | null;
  height?: number;
  className?: string;
}

export function MapView({ pins, userCoords, height = 360, className }: MapViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markersRef = useRef<LeafletMarker[]>([]);

  useEffect(() => {
    let cancelled = false;
    loadLeaflet()
      .then((L) => {
        if (cancelled || !containerRef.current) return;
        if (!mapRef.current) {
          mapRef.current = L.map(containerRef.current, {
            scrollWheelZoom: false,
          }).setView(ALBANIA_CENTER, 7);
          L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            maxZoom: 19,
            attribution: "© OpenStreetMap",
          }).addTo(mapRef.current);
        }
        const map = mapRef.current;

        for (const m of markersRef.current) {
          map.removeLayer(m);
        }
        markersRef.current = [];

        const bounds: [number, number][] = [];

        if (userCoords) {
          const youIcon = L.divIcon({
            className: "",
            html:
              '<div style="width:14px;height:14px;border-radius:50%;background:#1F4D3A;border:3px solid white;box-shadow:0 0 0 2px rgba(31,77,58,0.3)"></div>',
            iconSize: [14, 14],
            iconAnchor: [7, 7],
          });
          const youMarker = L.marker([userCoords.lat, userCoords.lng], {
            icon: youIcon,
          })
            .addTo(map)
            .bindPopup("<strong>Vendndodhja juaj</strong>");
          markersRef.current.push(youMarker);
          bounds.push([userCoords.lat, userCoords.lng]);
        }

        for (const pin of pins) {
          let coords: [number, number] | null = null;
          if (typeof pin.lat === "number" && typeof pin.lng === "number") {
            coords = [pin.lat, pin.lng];
          } else if (pin.city) {
            coords = coordsForCity(pin.city);
          }
          if (!coords) continue;

          const marker = L.marker(coords)
            .addTo(map)
            .bindPopup(
              `<strong>${escapeHtml(pin.name)}</strong>${
                pin.subtitle ? `<br/><span style="color:#666;font-size:12px">${escapeHtml(pin.subtitle)}</span>` : ""
              }${
                pin.city ? `<br/><span style="color:#999;font-size:11px">${escapeHtml(pin.city)}</span>` : ""
              }`,
            );
          markersRef.current.push(marker);
          bounds.push(coords);
        }

        if (bounds.length > 1) {
          map.fitBounds(L.latLngBounds(bounds), {
            padding: [40, 40],
            maxZoom: 12,
          });
        } else if (bounds.length === 1) {
          map.setView(bounds[0], 11);
        } else {
          map.setView(ALBANIA_CENTER, 7);
        }
      })
      .catch(() => {
        /* leaflet didn't load; nothing to do */
      });

    return () => {
      cancelled = true;
    };
  }, [pins, userCoords]);

  useEffect(() => {
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markersRef.current = [];
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`rounded-xl border border-line overflow-hidden ${className ?? ""}`}
      style={{ height }}
    />
  );
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
