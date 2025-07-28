// components/ColorPalette/ColorPalette.tsx
import React, { useState } from 'react';
import { Color } from '../../types/color';
import { getContrastColor } from '../../utils/colorUtils';
import './ColorPalette.css';

interface ColorPaletteProps {
  colors: Color[];
}

const ColorPalette: React.FC<ColorPaletteProps> = ({ colors }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyToClipboard = async (color: Color, index: number) => {
    try {
      await navigator.clipboard.writeText(color.hex);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 1000);
    } catch (err) {
      console.error('Failed to copy color:', err);
    }
  };

  const formatHsl = (hsl: [number, number, number]) => {
    return `hsl(${Math.round(hsl[0])}, ${Math.round(hsl[1])}%, ${Math.round(hsl[2])}%)`;
  };

  const formatRgb = (rgb: [number, number, number]) => {
    return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
  };

  return (
    <div className="color-palette">
      <h3>Extracted Colors</h3>
      <div className="colors-grid">
        {colors.map((color, index) => (
          <div
            key={index}
            className="color-card"
            style={{ backgroundColor: color.hex }}
            onClick={() => copyToClipboard(color, index)}
          >
            <div
              className="color-info"
              style={{ color: getContrastColor(color.hex) }}
            >
              <div className="color-hex">{color.hex.toUpperCase()}</div>
              <div className="color-formats">
                <div className="color-rgb">{formatRgb(color.rgb)}</div>
                <div className="color-hsl">{formatHsl(color.hsl)}</div>
              </div>
              {copiedIndex === index && (
                <div className="copied-indicator">Copied!</div>
              )}
            </div>
            <div className="copy-overlay">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              <span>Click to copy</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ColorPalette;