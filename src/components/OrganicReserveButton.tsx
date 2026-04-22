import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface OrganicReserveButtonProps {
  label?: string;
  href?: string;
  accentColor?: string;
}

const OrganicReserveButton: React.FC<OrganicReserveButtonProps> = ({
  label = 'RESERVE',
  href = 'https://www.exploretock.com/tresrotterdam',
  accentColor = '#F5EFE6',
}) => {
  const pathRef = useRef<SVGPathElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const defaultPath = `M100 18
             C 130 16, 158 28, 172 50
             C 188 74, 190 98, 184 122
             C 178 148, 160 168, 138 178
             C 116 188, 92 190, 72 182
             C 48 172, 28 154, 20 130
             C 12 106, 14 80, 24 58
             C 36 34, 62 20, 100 18
             Z`;
  const hoverPath = `M100 16
             C 132 14, 160 26, 174 48
             C 190 72, 192 100, 186 124
             C 180 150, 158 170, 136 180
             C 114 190, 90 192, 70 184
             C 46 174, 26 156, 18 132
             C 10 108, 12 78, 22 56
             C 34 32, 64 18, 100 16
             Z`;

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;
    const length = path.getTotalLength();
    path.style.strokeDasharray = `${length}`;
    path.style.strokeDashoffset = `${length}`;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            path.style.transition = 'stroke-dashoffset 1.8s cubic-bezier(0.45, 0, 0.15, 1)';
            path.style.strokeDashoffset = '0';
          }
        });
      },
      { threshold: 0.5 }
    );

    const parent = path.closest('a');
    if (parent) observer.observe(parent);

    return () => observer.disconnect();
  }, []);

    return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        width: 'min(100%, 320px)',
        aspectRatio: '1 / 1',
        textDecoration: 'none',
        cursor: 'pointer',
      }}
    >
      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
        }}
      >
        <motion.path
          ref={pathRef}
          d={defaultPath}
          animate={{ d: isHovered ? hoverPath : defaultPath, strokeWidth: isHovered ? 1.4 : 1 }}
          transition={{ duration: 0.6, ease: [0.45, 0, 0.15, 1] }}
          stroke={accentColor}
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span
        style={{
          position: 'relative',
          zIndex: 1,
          fontFamily: 'Abel, sans-serif',
          fontSize: '14px',
          letterSpacing: isHovered ? '0.24em' : '0.18em',
          color: accentColor,
          transition: 'color 0.3s ease, letter-spacing 0.4s ease',
        }}
      >
        {label}
      </span>
    </a>
  );
};

export default OrganicReserveButton;
