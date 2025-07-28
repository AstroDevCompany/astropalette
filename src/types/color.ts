// types/color.ts
export interface Color {
  hex: string;
  rgb: [number, number, number];
  hsl: [number, number, number];
  name?: string;
}

export interface Palette {
  id: string;
  name: string;
  colors: Color[];
  createdAt: Date;
  tags: string[];
  source: 'image' | 'manual' | 'generated';
}

export interface ExportFormat {
  name: string;
  extension: string;
  generate: (colors: Color[]) => string;
}