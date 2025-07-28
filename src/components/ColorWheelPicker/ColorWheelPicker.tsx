import React, { useState } from 'react';
import { HexColorPicker } from "react-colorful";
import { hexToRgb, rgbToHsl } from '../../utils/colorUtils';
import { Color } from '../../types/color';

interface ColorWheelPickerProps {
  onPick: (color: Color) => void;
}

const ColorWheelPicker: React.FC<ColorWheelPickerProps> = ({ onPick }) => {
  const [hex, setHex] = useState("#6366f1");

  const handleChange = (newHex: string) => {
    setHex(newHex);
    const rgb = hexToRgb(newHex) as [number, number, number];
    const hsl = rgbToHsl(rgb[0], rgb[1], rgb[2]);
    onPick({ hex: newHex, rgb, hsl });
  };

  return (
    <div style={{ margin: "2rem auto", maxWidth: 260 }}>
      <HexColorPicker color={hex} onChange={handleChange} />
      <div style={{ marginTop: "1rem", textAlign: "center" }}>
        <span
          style={{
            display: "inline-block",
            width: 32,
            height: 32,
            borderRadius: 6,
            background: hex,
            border: "1px solid #333",
            marginRight: 8,
            verticalAlign: "middle"
          }}
        />
        <span style={{ fontWeight: 500 }}>{hex.toUpperCase()}</span>
      </div>
    </div>
  );
};

export default ColorWheelPicker;