import React, { useState } from 'react';
import { hexToRgb, rgbToHsl } from '../../utils/colorUtils';
import { Color } from '../../types/color';
import './ColorPicker.css';

interface ColorPickerProps {
  onPick: (color: Color) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ onPick }) => {
  const [pickedColor, setPickedColor] = useState<Color | null>(null);
  const [error, setError] = useState<string | null>(null);
  const isMacOS = typeof navigator !== 'undefined' && /Mac/.test(navigator.platform);

  const handlePick = async () => {
    setError(null);
    if ('EyeDropper' in window) {
      try {
        // @ts-ignore
        const eyeDropper = new window.EyeDropper();
        const result = await eyeDropper.open();
        const hex = result.sRGBHex;
        // Convert hex to rgb/hsl
        // @ts-ignore
        const rgb = hexToRgb(hex) as [number, number, number];
        const hsl = rgbToHsl(rgb[0], rgb[1], rgb[2]);
        const color: Color = { hex, rgb, hsl };
        setPickedColor(color);
        onPick(color);
      } catch (e) {
        setError('Color picking cancelled or failed.');
      }
    } else {
      setError('EyeDropper API not supported in this environment.');
    }
  };

  return (
    <div className="color-picker">
      {!isMacOS && (
        <button className="btn btn-secondary" onClick={handlePick}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19.4 7.34l-2.74-2.74a2.5 2.5 0 0 0-3.54 0l-7.07 7.07a2.5 2.5 0 0 0 0 3.54l2.74 2.74a2.5 2.5 0 0 0 3.54 0l7.07-7.07a2.5 2.5 0 0 0 0-3.54z" />
          </svg>
          Pick Color from Screen
        </button>
      )}
      {isMacOS && (
        <div className="macos-warning">
          <p>On-screen color picker isn't available on macos.</p>
        </div>
      )}
      {pickedColor && (
        <div className="picked-color-info">
          <span
            className="picked-color-preview"
            style={{ backgroundColor: pickedColor.hex }}
          />
          <span>{pickedColor.hex.toUpperCase()}</span>
        </div>
      )}
      {error && <div className="color-picker-error">{error}</div>}
    </div>
  );
};

export default ColorPicker;