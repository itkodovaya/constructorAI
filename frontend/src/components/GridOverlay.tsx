import React from 'react';

interface GridOverlayProps {
  enabled: boolean;
  size?: number;
}

export const GridOverlay: React.FC<GridOverlayProps> = ({ enabled, size = 20 }) => {
  if (!enabled) return null;

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0"
      style={{
        backgroundImage: `
          linear-gradient(to right, rgba(0, 0, 0, 0.05) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(0, 0, 0, 0.05) 1px, transparent 1px)
        `,
        backgroundSize: `${size}px ${size}px`,
      }}
    />
  );
};

