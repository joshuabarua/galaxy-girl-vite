import React, { useRef, useEffect, useCallback, useState } from 'react';
import './SplatterEffect.css';

const SPLATTER_COLORS = [
  'rgba(138, 43, 226, 0.6)',   // Blue violet
  'rgba(148, 0, 211, 0.55)',   // Dark violet
  'rgba(186, 85, 211, 0.5)',   // Medium orchid
  'rgba(128, 0, 128, 0.6)',    // Purple
  'rgba(75, 0, 130, 0.65)',    // Indigo
  'rgba(218, 112, 214, 0.45)', // Orchid
  'rgba(153, 50, 204, 0.55)',  // Dark orchid
];

// Generate random splatter SVG path
const generateSplatterPath = (size) => {
  const points = [];
  const numPoints = 8 + Math.floor(Math.random() * 6);
  const centerX = size / 2;
  const centerY = size / 2;
  
  for (let i = 0; i < numPoints; i++) {
    const angle = (i / numPoints) * Math.PI * 2;
    const variance = 0.3 + Math.random() * 0.7;
    const radius = (size / 2) * variance;
    const x = centerX + Math.cos(angle) * radius;
    const y = centerY + Math.sin(angle) * radius;
    points.push({ x, y });
  }
  
  // Create smooth path
  let path = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const next = points[(i + 1) % points.length];
    
    const cp1x = prev.x + (curr.x - points[(i - 2 + points.length) % points.length].x) * 0.2;
    const cp1y = prev.y + (curr.y - points[(i - 2 + points.length) % points.length].y) * 0.2;
    const cp2x = curr.x - (next.x - prev.x) * 0.2;
    const cp2y = curr.y - (next.y - prev.y) * 0.2;
    
    path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`;
  }
  path += ' Z';
  
  return path;
};

const Splatter = ({ x, y, size, color, id, onComplete }) => {
  const [path] = useState(() => generateSplatterPath(size));
  
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete?.(id);
    }, 10000); // Remove after 10 seconds
    
    return () => clearTimeout(timer);
  }, [id, onComplete]);
  
  return (
    <svg
      className="splatter"
      style={{
        position: 'absolute',
        left: x - size / 2,
        top: y - size / 2,
        width: size,
        height: size,
      }}
      viewBox={`0 0 ${size} ${size}`}
    >
      <path
        d={path}
        fill={color}
        className="splatter-path"
      />
    </svg>
  );
};

const SplatterEffect = ({ enabled = true, minInterval = 1500, maxInterval = 3000, maxSplatters = 15 }) => {
  const containerRef = useRef(null);
  const [splatters, setSplatters] = useState([]);
  const timeoutRef = useRef(null);
  
  const addRandomSplatter = useCallback(() => {
    if (!enabled) return;
    
    const container = containerRef.current;
    if (!container) return;
    
    const rect = container.getBoundingClientRect();
    
    // Random position within container, with padding from edges
    const padding = 50;
    const x = padding + Math.random() * (rect.width - padding * 2);
    const y = padding + Math.random() * (rect.height - padding * 2);
    const size = 25 + Math.random() * 45;
    const color = SPLATTER_COLORS[Math.floor(Math.random() * SPLATTER_COLORS.length)];
    
    const newSplatter = {
      id: `splatter-${Date.now()}-${Math.random()}`,
      x,
      y,
      size,
      color,
    };
    
    setSplatters((prev) => {
      // Limit max splatters to prevent performance issues
      const updated = [...prev, newSplatter];
      if (updated.length > maxSplatters) {
        return updated.slice(-maxSplatters);
      }
      return updated;
    });
  }, [enabled, maxSplatters]);
  
  const removeSplatter = useCallback((id) => {
    setSplatters((prev) => prev.filter((s) => s.id !== id));
  }, []);
  
  // Auto-generate splatters at random intervals
  useEffect(() => {
    if (!enabled) return;
    
    const scheduleNext = () => {
      const randomDelay = minInterval + Math.random() * (maxInterval - minInterval);
      timeoutRef.current = setTimeout(() => {
        addRandomSplatter();
        scheduleNext();
      }, randomDelay);
    };
    
    // Initial splatter after short delay
    const initialTimer = setTimeout(() => {
      addRandomSplatter();
      scheduleNext();
    }, 300);
    
    return () => {
      clearTimeout(initialTimer);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [addRandomSplatter, enabled, minInterval, maxInterval]);
  
  if (!enabled) return null;
  
  return (
    <div ref={containerRef} className="splatter-container">
      {splatters.map((splatter) => (
        <Splatter
          key={splatter.id}
          {...splatter}
          onComplete={removeSplatter}
        />
      ))}
    </div>
  );
};

export default SplatterEffect;
