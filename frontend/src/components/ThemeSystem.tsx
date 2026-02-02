import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Palette, Moon, Sun, Sparkles, Download, Upload } from 'lucide-react';

interface Theme {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  typography: {
    headingFont: string;
    bodyFont: string;
  };
  darkMode: boolean;
}

const presetThemes: Theme[] = [
  {
    id: 'default',
    name: 'Default',
    colors: {
      primary: '#6366f1',
      secondary: '#8b5cf6',
      accent: '#ec4899',
      background: '#ffffff',
      text: '#1e293b',
    },
    typography: {
      headingFont: 'Inter',
      bodyFont: 'Inter',
    },
    darkMode: false,
  },
  {
    id: 'dark',
    name: 'Dark Mode',
    colors: {
      primary: '#818cf8',
      secondary: '#a78bfa',
      accent: '#f472b6',
      background: '#0f172a',
      text: '#f1f5f9',
    },
    typography: {
      headingFont: 'Inter',
      bodyFont: 'Inter',
    },
    darkMode: true,
  },
  {
    id: 'ocean',
    name: 'Ocean',
    colors: {
      primary: '#06b6d4',
      secondary: '#0891b2',
      accent: '#22d3ee',
      background: '#ffffff',
      text: '#0c4a6e',
    },
    typography: {
      headingFont: 'Inter',
      bodyFont: 'Inter',
    },
    darkMode: false,
  },
  {
    id: 'forest',
    name: 'Forest',
    colors: {
      primary: '#10b981',
      secondary: '#059669',
      accent: '#34d399',
      background: '#ffffff',
      text: '#064e3b',
    },
    typography: {
      headingFont: 'Inter',
      bodyFont: 'Inter',
    },
    darkMode: false,
  },
];

interface ThemeSystemProps {
  currentTheme?: Theme;
  onThemeChange?: (theme: Theme) => void;
}

export const ThemeSystem: React.FC<ThemeSystemProps> = ({
  currentTheme,
  onThemeChange,
}) => {
  const [selectedTheme, setSelectedTheme] = useState<Theme>(currentTheme || presetThemes[0]);
  const [customTheme, setCustomTheme] = useState<Theme>({
    id: 'custom',
    name: 'Custom',
    colors: {
      primary: '#6366f1',
      secondary: '#8b5cf6',
      accent: '#ec4899',
      background: '#ffffff',
      text: '#1e293b',
    },
    typography: {
      headingFont: 'Inter',
      bodyFont: 'Inter',
    },
    darkMode: false,
  });

  const handleThemeSelect = (theme: Theme) => {
    setSelectedTheme(theme);
    onThemeChange?.(theme);
    applyTheme(theme);
  };

  const applyTheme = (theme: Theme) => {
    const root = document.documentElement;
    root.style.setProperty('--color-primary', theme.colors.primary);
    root.style.setProperty('--color-secondary', theme.colors.secondary);
    root.style.setProperty('--color-accent', theme.colors.accent);
    root.style.setProperty('--color-background', theme.colors.background);
    root.style.setProperty('--color-text', theme.colors.text);
    
    if (theme.darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  };

  const handleExportTheme = () => {
    const dataStr = JSON.stringify(selectedTheme, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedTheme.name.toLowerCase().replace(/\s+/g, '-')}-theme.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportTheme = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const theme = JSON.parse(e.target?.result as string);
        setCustomTheme(theme);
        handleThemeSelect(theme);
      } catch (error) {
        alert('Неверный файл темы');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
            <Palette className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900">Theme System</h2>
            <p className="text-sm text-slate-500">Customize your site appearance</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleExportTheme}
            className="px-4 py-2 bg-white border-2 border-slate-200 rounded-xl font-bold hover:border-indigo-300 transition-all flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
          <label className="px-4 py-2 bg-white border-2 border-slate-200 rounded-xl font-bold hover:border-indigo-300 transition-all flex items-center gap-2 cursor-pointer">
            <Upload className="w-4 h-4" />
            Import
            <input
              type="file"
              accept=".json"
              onChange={handleImportTheme}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Preset Themes */}
      <div>
        <h3 className="text-lg font-bold text-slate-900 mb-4">Preset Themes</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {presetThemes.map((theme) => (
            <motion.button
              key={theme.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleThemeSelect(theme)}
              className={`p-4 rounded-2xl border-2 transition-all ${
                selectedTheme.id === theme.id
                  ? 'border-indigo-600 ring-2 ring-indigo-200'
                  : 'border-slate-200 hover:border-indigo-300'
              }`}
            >
              <div className="flex gap-2 mb-3">
                <div
                  className="w-8 h-8 rounded-lg"
                  style={{ backgroundColor: theme.colors.primary }}
                />
                <div
                  className="w-8 h-8 rounded-lg"
                  style={{ backgroundColor: theme.colors.secondary }}
                />
                <div
                  className="w-8 h-8 rounded-lg"
                  style={{ backgroundColor: theme.colors.accent }}
                />
              </div>
              <div className="text-sm font-bold text-slate-900">{theme.name}</div>
              {theme.darkMode && (
                <Moon className="w-4 h-4 text-slate-400 mt-1" />
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Custom Theme Editor */}
      <div className="bg-white rounded-2xl p-6 border-2 border-slate-100">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Custom Theme</h3>
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(customTheme.colors).map(([key, value]) => (
            <div key={key}>
              <label className="block text-xs font-bold text-slate-700 mb-2 capitalize">
                {key}
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={value}
                  onChange={(e) => {
                    const newTheme = {
                      ...customTheme,
                      colors: { ...customTheme.colors, [key]: e.target.value },
                    };
                    setCustomTheme(newTheme);
                  }}
                  className="w-12 h-10 rounded-lg border-2 border-slate-200"
                />
                <input
                  type="text"
                  value={value}
                  onChange={(e) => {
                    const newTheme = {
                      ...customTheme,
                      colors: { ...customTheme.colors, [key]: e.target.value },
                    };
                    setCustomTheme(newTheme);
                  }}
                  className="flex-1 px-3 py-2 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm font-semibold focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={() => handleThemeSelect(customTheme)}
          className="w-full mt-4 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all"
        >
          Apply Custom Theme
        </button>
      </div>
    </div>
  );
};

