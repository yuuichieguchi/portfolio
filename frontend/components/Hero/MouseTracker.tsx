'use client';

import { useMousePosition } from '@/hooks/useMousePosition';
import { useRef, useEffect, useState } from 'react';

interface MouseTrackerProps {
  children: React.ReactNode;
  offset?: number;
}

export function MouseTracker({ children, offset = 10 }: MouseTrackerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mousePosition = useMousePosition();
  const [transform, setTransform] = useState('translate(0, 0)');

  useEffect(() => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const distX = (mousePosition.x - centerX) / rect.width;
    const distY = (mousePosition.y - centerY) / rect.height;

    const translateX = distX * offset;
    const translateY = distY * offset;

    setTransform(`translate(${translateX}px, ${translateY}px)`);
  }, [mousePosition, offset]);

  return (
    <div
      ref={containerRef}
      style={{
        transform,
        transition: 'transform 0.1s ease-out',
        willChange: 'transform',
      }}
    >
      {children}
    </div>
  );
}
