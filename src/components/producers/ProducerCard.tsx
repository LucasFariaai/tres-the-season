import { useState } from "react";
import type { Producer } from "./types";

interface Props {
  producer: Producer;
  index: number;
  isActive: boolean;
  onHover: (index: number | null) => void;
  onClick: (index: number) => void;
}

export default function ProducerCard({ producer, index, isActive, onHover, onClick }: Props) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="relative cursor-pointer transition-all duration-300"
      style={{
        borderBottom: "1px solid #E8DCC8",
        backgroundColor: isActive ? "rgba(232, 220, 200, 0.3)" : "transparent",
        borderLeft: isActive ? "3px solid hsl(var(--season-dark))" : "3px solid transparent",
      }}
      onMouseEnter={() => onHover(index)}
      onMouseLeave={() => onHover(null)}
      onClick={() => {
        onClick(index);
        setExpanded((v) => !v);
      }}
    >
      <div className="flex gap-4 p-4">
        {/* Thumbnail */}
        <img
          src={producer.image}
          alt={producer.name}
          className="w-[100px] h-[100px] object-cover flex-shrink-0"
          style={{ borderRadius: "6px" }}
          loading="lazy"
          width={200}
          height={200}
        />
        {/* Details */}
        <div className="flex flex-col justify-center min-w-0">
          <h3 className="font-display text-lg" style={{ color: "#2A1F18" }}>
            {producer.name}
          </h3>
          <p className="font-accent text-sm mt-0.5" style={{ color: "#8B7355" }}>
            {producer.specialty}
          </p>
          <span className="font-body text-xs mt-1.5" style={{ color: "#B8B0A3" }}>
            {producer.distance} from Tres
          </span>
        </div>
      </div>

      {/* Expandable quote */}
      <div
        className="overflow-hidden transition-all duration-300"
        style={{
          maxHeight: expanded && isActive ? "80px" : "0",
          opacity: expanded && isActive ? 1 : 0,
        }}
      >
        <p
          className="font-accent text-[13px] px-4 pb-4"
          style={{ color: "#8B7355" }}
        >
          {producer.quote}
        </p>
      </div>
    </div>
  );
}
