// components/ExportPanel/ExportPanel.tsx
import React, { useState } from 'react';
import { Color, ExportFormat } from '../../types/color';
import { exportFormats } from '../../utils/exportUtils';
import './ExportPanel.css';

interface ExportPanelProps {
  colors: Color[];
  onSave: (name: string, tags: string[]) => void;
}

const ExportPanel: React.FC<ExportPanelProps> = ({ colors, onSave }) => {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>(exportFormats[0]);
  const [paletteName, setPaletteName] = useState('');
  const [tags, setTags] = useState('');
  const [showSaveForm, setShowSaveForm] = useState(false);
  const [exportedContent, setExportedContent] = useState('');
  const [showExportPreview, setShowExportPreview] = useState(false);

  const handleExport = () => {
    const content = selectedFormat.generate(colors);
    setExportedContent(content);
    setShowExportPreview(true);
  };

  const handleDownload = () => {
    const content = selectedFormat.generate(colors);
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `palette.${selectedFormat.extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSave = () => {
    if (!paletteName.trim()) return;

    const tagArray = tags.split(',').map(tag => tag.trim()).filter(Boolean);
    onSave(paletteName.trim(), tagArray);

    setPaletteName('');
    setTags('');
    setShowSaveForm(false);
  };

  const copyExportContent = async () => {
    try {
      await navigator.clipboard.writeText(exportedContent);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="export-panel">
      <div className="export-actions">
        <button
          className="btn btn-secondary"
          onClick={() => setShowSaveForm(!showSaveForm)}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
            <polyline points="17,21 17,13 7,13 7,21" />
            <polyline points="7,3 7,8 15,8" />
          </svg>
          Save Palette
        </button>

        <div className="export-controls">
          <select
            value={selectedFormat.name}
            onChange={(e) => {
              const format = exportFormats.find(f => f.name === e.target.value);
              if (format) setSelectedFormat(format);
            }}
            className="format-select"
          >
            {exportFormats.map(format => (
              <option key={format.name} value={format.name}>
                {format.name}
              </option>
            ))}
          </select>

          <button
            className="btn btn-primary"
            onClick={handleExport}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="8,17 12,21 16,17" />
              <line x1="12" y1="12" x2="12" y2="21" />
              <path d="M20.88 18.09A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.29" />
            </svg>
            Export
          </button>
        </div>
      </div>

      {showSaveForm && (
        <div className="save-form">
          <input
            type="text"
            placeholder="Palette name"
            value={paletteName}
            onChange={(e) => setPaletteName(e.target.value)}
            className="save-input"
          />
          <input
            type="text"
            placeholder="Tags (comma separated)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="save-input"
          />
          <div className="save-actions">
            <button
              className="btn btn-secondary"
              onClick={() => setShowSaveForm(false)}
            >
              Cancel
            </button>
            <button
              className="btn btn-primary"
              onClick={handleSave}
              disabled={!paletteName.trim()}
            >
              Save
            </button>
          </div>
        </div>
      )}

      {showExportPreview && (
        <div className="export-preview">
          <div className="export-header">
            <h4>Export Preview ({selectedFormat.name})</h4>
            <div className="export-header-actions">
              <button
                className="btn-icon"
                onClick={copyExportContent}
                title="Copy to clipboard"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
              </button>
              <button
                className="btn-icon"
                onClick={handleDownload}
                title="Download file"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7,10 12,15 17,10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              </button>
              <button
                className="btn-icon"
                onClick={() => setShowExportPreview(false)}
                title="Close preview"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>
          <pre className="export-content">{exportedContent}</pre>
        </div>
      )}
    </div>
  );
};

export default ExportPanel;