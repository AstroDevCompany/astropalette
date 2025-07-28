// components/ImageUpload/ImageUpload.tsx
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import ColorThief from 'colorthief';
import { Color } from '../../types/color';
import { rgbToHex, rgbToHsl, calculateDeltaE } from '../../utils/colorUtils';
import './ImageUpload.css';

interface ImageUploadProps {
  onColorsExtracted: (colors: Color[]) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onColorsExtracted }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const extractColors = useCallback(async (file: File) => {
    setIsProcessing(true);

    try {
      const img = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);

        const colorThief = new ColorThief();

        // Get more colors initially to have options for filtering
        const palette = colorThief.getPalette(img, 15, 10); // More colors, higher quality

        if (!palette || palette.length === 0) {
          console.error('No colors extracted from image');
          setIsProcessing(false);
          return;
        }

        // Convert to our Color format and remove duplicates
        const allColors = palette.map(rgb => ({
          hex: rgbToHex(rgb[0], rgb[1], rgb[2]),
          rgb: rgb as [number, number, number],
          hsl: rgbToHsl(rgb[0], rgb[1], rgb[2])
        }));

        // Remove duplicates and very similar colors
        const uniqueColors = removeSimilarColors(allColors);

        // Sort by visual importance (saturation and lightness)
        const sortedColors = uniqueColors.sort((a, b) => {
          const aScore = a.hsl[1] * 0.7 + (50 - Math.abs(a.hsl[2] - 50)) * 0.3;
          const bScore = b.hsl[1] * 0.7 + (50 - Math.abs(b.hsl[2] - 50)) * 0.3;
          return bScore - aScore;
        });

        // Take the best 6 colors
        const finalColors = sortedColors.slice(0, 6);

        onColorsExtracted(finalColors);
        setIsProcessing(false);
      };

      img.crossOrigin = 'anonymous'; // Handle CORS issues
      img.src = URL.createObjectURL(file);
      setPreviewImage(img.src);
    } catch (error) {
      console.error('Error extracting colors:', error);
      setIsProcessing(false);
    }
  }, [onColorsExtracted]);

  // Helper function to remove similar colors using better Delta E calculation
  const removeSimilarColors = (colors: Color[], threshold = 15): Color[] => {
    const uniqueColors: Color[] = [];

    for (const color of colors) {
      const isSimilar = uniqueColors.some(existingColor => {
        const deltaE = calculateDeltaE(color.rgb, existingColor.rgb);
        return deltaE < threshold;
      });

      if (!isSimilar) {
        uniqueColors.push(color);
      }
    }

    return uniqueColors;
  };

  // Remove the old calculateColorDistance function since we're using Delta E now

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file && file.type.startsWith('image/')) {
      extractColors(file);
    }
  }, [extractColors]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.webp']
    },
    multiple: false
  });

  return (
    <div className="image-upload">
      <div
        {...getRootProps()}
        className={`dropzone ${isDragActive ? 'active' : ''} ${isProcessing ? 'processing' : ''}`}
      >
        <input {...getInputProps()} />

        {previewImage ? (
          <div className="preview-container">
            <img src={previewImage} alt="Preview" className="preview-image" />
            <div className="preview-overlay">
              <p>Drop a new image to extract colors</p>
            </div>
          </div>
        ) : (
          <div className="upload-content">
            <div className="upload-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21,15 16,10 5,21" />
              </svg>
            </div>
            <h3>Drop an image here</h3>
            <p>or click to select from your computer</p>
            <span className="file-types">PNG, JPG, GIF up to 10MB</span>
          </div>
        )}

        {isProcessing && (
          <div className="processing-overlay">
            <div className="spinner"></div>
            <p>Extracting colors...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;