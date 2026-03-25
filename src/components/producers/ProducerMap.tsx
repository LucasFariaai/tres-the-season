import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { TRES_LOCATION, RADIUS_KM, producers } from "./data";

interface Props {
  activeIndex: number | null;
  hoveredIndex: number | null;
  onPinClick: (index: number) => void;
  className?: string;
  style?: React.CSSProperties;
}

export default function ProducerMap({ activeIndex, hoveredIndex, onPinClick, className, style }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.CircleMarker[]>([]);
  const popupsRef = useRef<L.Popup[]>([]);

  // Initialize map once
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      zoomControl: false,
      attributionControl: false,
    }).setView([TRES_LOCATION.lat, TRES_LOCATION.lng], 11);

    L.tileLayer("https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; Stadia Maps, &copy; OpenMapTiles &copy; OpenStreetMap',
    }).addTo(map);

    // 30km radius
    L.circle([TRES_LOCATION.lat, TRES_LOCATION.lng], {
      radius: RADIUS_KM * 1000,
      color: "hsl(130, 20%, 33%)",
      weight: 2,
      opacity: 0.6,
      fillColor: "hsl(130, 20%, 33%)",
      fillOpacity: 0.08,
    }).addTo(map);

    // Tres marker
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

    // Producer pins
    producers.forEach((p, i) => {
      const marker = L.circleMarker([p.lat, p.lng], {
        radius: 6,
        fillColor: "#2A1F18",
        fillOpacity: 1,
        color: "rgba(139,115,85,0.3)",
        weight: 4,
      }).addTo(map);

      const popup = L.popup({ closeButton: false, offset: [0, -6], className: "producer-popup" })
        .setLatLng([p.lat, p.lng])
        .setContent(`
          <div style="font-family:'Playfair Display',serif;font-size:14px;color:#2A1F18;">${p.name}</div>
          <div style="font-family:'Lora',serif;font-style:italic;font-size:12px;color:#8B7355;margin-top:2px;">${p.specialty}</div>
        `);

      marker.on("click", () => onPinClick(i));
      marker.bindPopup(popup);

      markersRef.current.push(marker);
      popupsRef.current.push(popup);
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
      markersRef.current = [];
      popupsRef.current = [];
    };
  }, [onPinClick]);

  // React to active/hovered index changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const effectiveActive = activeIndex ?? hoveredIndex;

    markersRef.current.forEach((marker, i) => {
      const isActive = effectiveActive === i;
      marker.setRadius(isActive ? 8 : 6);
      marker.setStyle({
        color: isActive ? "rgba(139,115,85,0.6)" : "rgba(139,115,85,0.3)",
        weight: isActive ? 6 : 4,
      });
    });

    if (effectiveActive !== null && effectiveActive >= 0 && effectiveActive < producers.length) {
      const p = producers[effectiveActive];
      map.flyTo([p.lat, p.lng], 12, { duration: 0.4 });
      markersRef.current[effectiveActive]?.openPopup();
    }
  }, [activeIndex, hoveredIndex]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        boxShadow: "inset 0 0 30px rgba(42, 31, 24, 0.08)",
        borderRadius: "4px",
        overflow: "hidden",
        ...style,
      }}
    />
  );
}
