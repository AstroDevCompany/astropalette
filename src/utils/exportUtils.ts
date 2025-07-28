// utils/exportUtils.ts
import { Color, ExportFormat } from '../types/color';

const generateCSS = (colors: Color[]): string => {
  const cssVars = colors.map((color, index) => 
    `  --color-${index + 1}: ${color.hex};`
  ).join('\n');
  
  return `:root {\n${cssVars}\n}`;
};

const generateSCSS = (colors: Color[]): string => {
  const scssVars = colors.map((color, index) => 
    `$color-${index + 1}: ${color.hex};`
  ).join('\n');
  
  return `// Color Palette Variables\n${scssVars}`;
};

const generateJSON = (colors: Color[]): string => {
  const palette = {
    name: "Extracted Palette",
    colors: colors.map((color, index) => ({
      name: `color-${index + 1}`,
      hex: color.hex,
      rgb: {
        r: color.rgb[0],
        g: color.rgb[1],
        b: color.rgb[2]
      },
      hsl: {
        h: Math.round(color.hsl[0]),
        s: Math.round(color.hsl[1]),
        l: Math.round(color.hsl[2])
      }
    }))
  };
  
  return JSON.stringify(palette, null, 2);
};

const generateTailwind = (colors: Color[]): string => {
  const tailwindColors = colors.map((color, index) => 
    `        'palette-${index + 1}': '${color.hex}',`
  ).join('\n');
  
  return `// Add to your tailwind.config.js\nmodule.exports = {\n  theme: {\n    extend: {\n      colors: {\n${tailwindColors}\n      }\n    }\n  }\n}`;
};

const generateSwift = (colors: Color[]): string => {
  const swiftColors = colors.map((color, index) => {
    const [r, g, b] = color.rgb;
    return `    static let color${index + 1} = Color(red: ${(r/255).toFixed(3)}, green: ${(g/255).toFixed(3)}, blue: ${(b/255).toFixed(3)})`;
  }).join('\n');
  
  return `// Swift Color Extensions\nimport SwiftUI\n\nextension Color {\n${swiftColors}\n}`;
};

const generateASE = (colors: Color[]): string => {
  // Simplified ASE format representation (not actual binary)
  const aseColors = colors.map((color, index) => {
    const [r, g, b] = color.rgb;
    return `Color ${index + 1}: RGB(${r}, ${g}, ${b}) HEX(${color.hex})`;
  }).join('\n');
  
  return `Adobe Swatch Exchange Format\nPalette: Extracted Colors\n\n${aseColors}`;
};

export const exportFormats: ExportFormat[] = [
  {
    name: 'CSS Variables',
    extension: 'css',
    generate: generateCSS
  },
  {
    name: 'SCSS Variables',
    extension: 'scss',
    generate: generateSCSS
  },
  {
    name: 'JSON',
    extension: 'json',
    generate: generateJSON
  },
  {
    name: 'Tailwind Config',
    extension: 'js',
    generate: generateTailwind
  },
  {
    name: 'Swift Colors',
    extension: 'swift',
    generate: generateSwift
  },
  {
    name: 'Adobe ASE',
    extension: 'ase',
    generate: generateASE
  }
];