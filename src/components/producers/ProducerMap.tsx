import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { TRES_LOCATION, RADIUS_KM } from "./data";
import type { Producer } from "./types";

interface Props {
  producers: Producer[];
  activeIndex: number | null;
  hoveredIndex: number | null;
  onPinClick: (index: number) => void;
  className?: string;
  style?: React.CSSProperties;
}

export default function ProducerMap({ producers, activeIndex, hoveredIndex, onPinClick, className, style }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.CircleMarker[]>([]);
  const popupsRef = useRef<L.Popup[]>([]);
  const onPinClickRef = useRef(onPinClick);
  const invalidateTimerRef = useRef<number | null>(null);

  useEffect(() => {
    onPinClickRef.current = onPinClick;
  }, [onPinClick]);

  // Initialize map + Tres marker once
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      zoomControl: false,
      attributionControl: false,
    }).setView([TRES_LOCATION.lat, TRES_LOCATION.lng], 9);

    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
    }).addTo(map);

    L.circle([TRES_LOCATION.lat, TRES_LOCATION.lng], {
      radius: RADIUS_KM * 1000,
      color: "#8B7355",
      weight: 1.5,
      opacity: 0.6,
      fillColor: "#8B7355",
      fillOpacity: 0.08,
    }).addTo(map);

    invalidateTimerRef.current = window.setTimeout(() => {
      if (!containerRef.current || mapRef.current !== map) return;
      try {
        map.invalidateSize(false);
      } catch (_) {
        return;
      }
    }, 100);

    const tresIcon = L.divIcon({
      className: "",
      html: `<div style="display:flex;flex-direction:column;align-items:center;">
        <div style="width:8px;height:8px;border-radius:50%;background:#2A1F18;border:2px solid #8B7355;"></div>
        <span style="font-family:'Playfair Display',serif;font-size:10px;color:#2A1F18;margin-top:2px;white-space:nowrap;font-weight:600;">Tres</span>
      </div>`,
      iconSize: [40, 28],
      iconAnchor: [20, 4],
    });
    L.marker([TRES_LOCATION.lat, TRES_LOCATION.lng], { icon: tresIcon }).addTo(map);

    mapRef.current = map;

    return () => {
      if (invalidateTimerRef.current !== null) {
        window.clearTimeout(invalidateTimerRef.current);
        invalidateTimerRef.current = null;
      }
      map.remove();
      mapRef.current = null;
      markersRef.current = [];
      popupsRef.current = [];
    };
  }, []);

  // Sync producer markers whenever the list changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];
    popupsRef.current = [];

    producers.forEach((p, i) => {
      const lat = Number(p.lat);
      const lng = Number(p.lng);
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;

      const marker = L.circleMarker([lat, lng], {
        radius: 6,
        fillColor: "#2A1F18",
        fillOpacity: 1,
        color: "rgba(139,115,85,0.3)",
        weight: 4,
      }).addTo(map);

      const popup = L.popup({ closeButton: false, offset: [0, -6], className: "producer-popup" })
        .setLatLng([lat, lng])
        .setContent(`
          <div style="font-family:'Playfair Display',serif;font-size:14px;color:#2A1F18;">${p.name}</div>
          <div style="font-family:'Lora',serif;font-style:italic;font-size:12px;color:#8B7355;margin-top:2px;">${p.specialty}</div>
        `);

      marker.on("click", () => onPinClickRef.current(i));
      marker.bindPopup(popup);

      markersRef.current.push(marker);
      popupsRef.current.push(popup);
    });
  }, [producers]);

  // Marker styling reacts to either active (clicked) or hovered card so the
  // user still gets visual feedback while moving the cursor over the list.
  useEffect(() => {
    if (!mapRef.current) return;
    const effectiveActive = activeIndex ?? hoveredIndex;

    markersRef.current.forEach((marker, i) => {
      const isActive = effectiveActive === i;
      marker.setRadius(isActive ? 8 : 6);
      marker.setStyle({
        color: isActive ? "rgba(139,115,85,0.6)" : "rgba(139,115,85,0.3)",
        weight: isActive ? 6 : 4,
      });
    });
  }, [activeIndex, hoveredIndex, producers]);

  // Camera ONLY reacts to clicks (activeIndex). Hovering a card no longer
  // moves the map. When nothing is active, fly back to the full 30km view.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (activeIndex !== null && activeIndex >= 0 && activeIndex < producers.length) {
      const p = producers[activeIndex];
      const lat = Number(p.lat);
      const lng = Number(p.lng);
      if (Number.isFinite(lat) && Number.isFinite(lng)) {
        try {
          map.flyTo([lat, lng], 12, { duration: 0.6 });
        } catch (_) { /* map not ready */ }
      }
      markersRef.current[activeIndex]?.openPopup();
    } else {
      try {
        map.flyTo([TRES_LOCATION.lat, TRES_LOCATION.lng], 9, { duration: 0.6 });
      } catch (_) { /* map not ready */ }
      markersRef.current.forEach((marker) => marker.closePopup());
    }
  }, [activeIndex, producers]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        boxShadow: "inset 0 0 30px rgba(42, 31, 24, 0.08)",
        borderRadius: "4px",
        overflow: "hidden",
        filter: "saturate(0.3) sepia(0.15)",
        ...style,
      }}
    />
  );
}
