import { Color } from '../../types/color';
import { rgbToHex, rgbToHsl } from '../../utils/colorUtils';

export function generateRandomPalette(size: number = 5): Color[] {
  return Array.from({ length: size }, () => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    const hex = rgbToHex(r, g, b);
    const hsl = rgbToHsl(r, g, b);
    return { hex, rgb: [r, g, b], hsl };
  });
}