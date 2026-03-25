import { useEffect, useRef, useMemo } from "react";
import { MapContainer, TileLayer, Circle, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { TRES_LOCATION, RADIUS_KM, producers } from "./data";

// Fix default marker icon issue with bundlers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function createPinIcon(active: boolean) {
  const size = active ? 16 : 12;
  return L.divIcon({
    className: "",
    html: `<div style="
      width:${size}px;height:${size}px;border-radius:50%;
      background:#2A1F18;
      box-shadow:0 0 ${active ? "8" : "4"}px rgba(139,115,85,${active ? "0.6" : "0.3"});
      transition:all 0.3s ease;
    "></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

const tresIcon = L.divIcon({
  className: "",
  html: `<div style="display:flex;flex-direction:column;align-items:center;">
    <div style="width:8px;height:8px;border-radius:50%;background:#2A1F18;border:2px solid #8B7355;"></div>
    <span style="font-family:'Playfair Display',serif;font-size:10px;color:#2A1F18;margin-top:2px;white-space:nowrap;font-weight:600;">Tres</span>
  </div>`,
  iconSize: [40, 28],
  iconAnchor: [20, 4],
});

function MapController({ activeIndex }: { activeIndex: number | null }) {
  const map = useMap();

  useEffect(() => {
    if (activeIndex !== null && activeIndex >= 0 && activeIndex < producers.length) {
      const p = producers[activeIndex];
      map.flyTo([p.lat, p.lng], 12, { duration: 0.4 });
    }
  }, [activeIndex, map]);

  return null;
}

interface Props {
  activeIndex: number | null;
  hoveredIndex: number | null;
  onPinClick: (index: number) => void;
  className?: string;
}

export default function ProducerMap({ activeIndex, hoveredIndex, onPinClick, className }: Props) {
  const effectiveActive = activeIndex ?? hoveredIndex;

  // Muted warm tile layer (Stadia Alidade Smooth - warm/muted)
  const tileUrl = "https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png";
  const attribution = '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="https://openstreetmap.org">OpenStreetMap</a>';

  return (
    <div
      className={className}
      style={{
        boxShadow: "inset 0 0 30px rgba(42, 31, 24, 0.08)",
        borderRadius: "4px",
        overflow: "hidden",
      }}
    >
      <MapContainer
        center={[TRES_LOCATION.lat, TRES_LOCATION.lng]}
        zoom={11}
        style={{ width: "100%", height: "100%" }}
        zoomControl={false}
        attributionControl={false}
      >
        <TileLayer url={tileUrl} attribution={attribution} />

        {/* 30km radius circle */}
        <Circle
          center={[TRES_LOCATION.lat, TRES_LOCATION.lng]}
          radius={RADIUS_KM * 1000}
          pathOptions={{
            color: "hsl(130, 20%, 33%)",
            weight: 2,
            opacity: 0.6,
            fillColor: "hsl(130, 20%, 33%)",
            fillOpacity: 0.08,
          }}
        />

        {/* Tres marker */}
        <Marker position={[TRES_LOCATION.lat, TRES_LOCATION.lng]} icon={tresIcon} />

        {/* Producer pins */}
        {producers.map((p, i) => (
          <Marker
            key={p.name}
            position={[p.lat, p.lng]}
            icon={createPinIcon(effectiveActive === i)}
            eventHandlers={{ click: () => onPinClick(i) }}
          >
            <Popup
              className="producer-popup"
              closeButton={false}
              offset={[0, -6]}
            >
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "14px", color: "#2A1F18" }}>
                {p.name}
              </div>
              <div style={{ fontFamily: "'Lora', serif", fontStyle: "italic", fontSize: "12px", color: "#8B7355", marginTop: "2px" }}>
                {p.specialty}
              </div>
            </Popup>
          </Marker>
        ))}

        <MapController activeIndex={effectiveActive} />
      </MapContainer>
    </div>
  );
}
