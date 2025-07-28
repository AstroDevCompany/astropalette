// App.tsx
import { useEffect, useState } from 'react';
import { getVersion } from '@tauri-apps/api/app';
import ImageUpload from './components/ImageUpload/ImageUpload';
import ColorPalette from './components/ColorPalette/ColorPalette';
import ExportPanel from './components/ExportPanel/ExportPanel';
import ColorPicker from './components/ColorPicker/ColorPicker';
import ColorWheelPicker from './components/ColorWheelPicker/ColorWheelPicker';
import { Color, Palette } from './types/color';
import { generateRandomPalette } from './components/ColorPalette/RandomPalette';
import './App.css';

function App() {
  const [currentPalette, setCurrentPalette] = useState<Color[]>([]);
  const [randomPalette, setRandomPalette] = useState<Color[]>([]);
  const [savedPalettes, setSavedPalettes] = useState<Palette[]>([]);
  const [selectedPalette, setSelectedPalette] = useState<Palette | null>(null);
  const [appVersion, setAppVersion] = useState<string>('0.1.0');

  useEffect(() => {
    getVersion().then(setAppVersion);
  }, []);

  const handleColorsExtracted = (colors: Color[]) => {
    setCurrentPalette(colors);
    setSelectedPalette(null);
  };

  const handleSavePalette = (name: string, tags: string[]) => {
    if (currentPalette.length === 0) return;

    const newPalette: Palette = {
      id: Date.now().toString(),
      name,
      colors: currentPalette,
      createdAt: new Date(),
      tags,
      source: 'image'
    };

    setSavedPalettes(prev => [newPalette, ...prev]);
  };

  const handleSelectPalette = (palette: Palette) => {
    setSelectedPalette(palette);
    setCurrentPalette(palette.colors);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Color Picker</h1>
      </header>
      <div className="color-picker-section">
        <ColorPicker
          onPick={(color: Color) => setCurrentPalette([color, ...currentPalette])}
        />
        <ColorWheelPicker
          onPick={(color: Color) => setCurrentPalette([color, ...currentPalette])}
        />
      </div>



      <header className="app-header">
        <h1>Palette Extractor</h1>
      </header>

      <main className="app-main">
        <div className="upload-section">
          <ImageUpload onColorsExtracted={handleColorsExtracted} />
        </div>

        {currentPalette.length > 0 && (
          <div className="palette-section">
            <ColorPalette colors={currentPalette} />
            <ExportPanel
              colors={currentPalette}
              onSave={handleSavePalette}
            />
          </div>
        )}

        {savedPalettes.length > 0 && (
          <div className="saved-section">
            <h3>Saved Palettes</h3>
            <div className="saved-grid">
              {savedPalettes.map(palette => (
                <div
                  key={palette.id}
                  className={`saved-item ${selectedPalette?.id === palette.id ? 'selected' : ''}`}
                  onClick={() => handleSelectPalette(palette)}
                >
                  <div className="saved-colors">
                    {palette.colors.slice(0, 5).map((color, idx) => (
                      <div
                        key={idx}
                        className="saved-color"
                        style={{ backgroundColor: color.hex }}
                      />
                    ))}
                  </div>
                  <span className="saved-name">{palette.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <header className="app-header-top">
        <h1>Palette Generator</h1>
      </header>

      <div className="random-palette-section">
        <button
          className="btn btn-secondary"
          style={{ marginBottom: '1rem' }}
          onClick={() => setRandomPalette(generateRandomPalette())}
        >
          Generate Random Palette
        </button>
        {randomPalette.length > 0 && (
          <ColorPalette colors={randomPalette} />
        )}
      </div>

      <footer className="app-footer">
        <p>Developed by Luca Montanari</p>
        <p>Version {appVersion}</p>
      </footer>
    </div>
  );
}

export default App;