import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';

interface OrganicReserveButtonProps {
  label?: string;
  href?: string;
  strokeColor?: string;
  textColor?: string;
  size?: number;
}

const OrganicReserveButton: React.FC<OrganicReserveButtonProps> = ({
  label = 'RESERVE',
  href = 'https://www.exploretock.com/tresrotterdam',
  strokeColor = '#F5EFE6',
  textColor = '#F5EFE6',
  size = 200,
}) => {
  const blobRef = useRef<HTMLSpanElement>(null);
  const linkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const blob = blobRef.current;
    const link = linkRef.current;
    if (!blob || !link) return;

    function getRandomBorderRadius(): string {
      const r = () => gsap.utils.random(40, 80, 1) + '%';
      return `${r()} ${r()} ${r()} ${r()} / ${r()} ${r()} ${r()} ${r()}`;
    }

    let activeMorphTween: gsap.core.Tween | null = null;

    function animateRandomMorph(target: HTMLElement) {
      const randomRadius = getRandomBorderRadius();
      activeMorphTween = gsap.to(target, {
        borderRadius: randomRadius,
        duration: gsap.utils.random(1, 2),
        ease: 'power1.inOut',
        onComplete: () => animateRandomMorph(target),
      });
    }

    function createRotationTween(target: HTMLElement) {
      return gsap.to(target, {
        rotation: '+=360',
        duration: 10,
        repeat: -1,
        ease: 'none',
      });
    }

    animateRandomMorph(blob);
    let activeRotationTween = createRotationTween(blob);

    let pausedState = { borderRadius: null as string | null, rotation: null as number | null };
    let hoverTween: gsap.core.Tween | null = null;
    let leaveTween: gsap.core.Tween | null = null;

    const handleMouseEnter = () => {
      pausedState.borderRadius = gsap.getProperty(blob, 'borderRadius') as string;
      pausedState.rotation = gsap.getProperty(blob, 'rotation') as number;

      if (activeMorphTween) activeMorphTween.pause();
      activeRotationTween.pause();
      if (leaveTween) leaveTween.kill();
      if (hoverTween) hoverTween.kill();

      hoverTween = gsap.to(blob, {
        duration: 0.5,
        scale: 0.9,
        borderRadius: '50%',
        ease: 'power3.out',
        overwrite: true,
      });
    };

    const handleMouseLeave = () => {
      if (hoverTween) hoverTween.kill();
      if (leaveTween) leaveTween.kill();

      leaveTween = gsap.to(blob, {
        scale: 1,
        duration: 0.5,
        borderRadius: pausedState.borderRadius || '40% 60% 70% 30% / 40% 40% 60% 50%',
        rotation: pausedState.rotation || 0,
        ease: 'power3.in',
        overwrite: true,
        onStart: () => {
          activeRotationTween.kill();
          if (activeMorphTween) activeMorphTween.kill();
          animateRandomMorph(blob);
          activeRotationTween = createRotationTween(blob);
          activeRotationTween.play();
          leaveTween = null;
        },
      });
    };

    link.addEventListener('mouseenter', handleMouseEnter);
    link.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      link.removeEventListener('mouseenter', handleMouseEnter);
      link.removeEventListener('mouseleave', handleMouseLeave);
      if (activeMorphTween) activeMorphTween.kill();
      if (activeRotationTween) activeRotationTween.kill();
      if (hoverTween) hoverTween.kill();
      if (leaveTween) leaveTween.kill();
    };
  }, []);

  return (
    <a
      ref={linkRef}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        textDecoration: 'none',
        color: textColor,
        fontFamily: "'Abel', sans-serif",
      }}
    >
      <span
        ref={blobRef}
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          border: `1px solid ${strokeColor}`,
          borderRadius: '40% 60% 70% 30% / 40% 40% 60% 50%',
          inset: 0,
          transformOrigin: 'center center',
        }}
      />
      <span
        style={{
          position: 'relative',
          zIndex: 1,
          fontSize: '14px',
          letterSpacing: '0.18em',
        }}
      >
        {label}
      </span>
    </a>
  );
};

export default OrganicReserveButton;
