import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Smartphone, Download, CheckCircle, Settings, Image as ImageIcon } from 'lucide-react';
import { generatePWAManifest, promptPWAInstall } from '../utils/mobile-utils';

interface PWAGeneratorProps {
  projectId?: string;
  projectName?: string;
}

export const PWAGenerator: React.FC<PWAGeneratorProps> = ({
  projectId,
  projectName = 'My App',
}) => {
  const [manifest, setManifest] = useState({
    name: projectName,
    shortName: projectName.substring(0, 12),
    description: 'Progressive Web App',
    themeColor: '#6366f1',
    backgroundColor: '#ffffff',
    icon: '',
  });
  const [isInstalled, setIsInstalled] = useState(false);

  const handleGenerateManifest = () => {
    const manifestContent = generatePWAManifest({
      name: manifest.name,
      shortName: manifest.shortName,
      description: manifest.description,
      themeColor: manifest.themeColor,
      backgroundColor: manifest.backgroundColor,
      icons: [
        {
          src: manifest.icon || '/icon-192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: manifest.icon || '/icon-512.png',
          sizes: '512x512',
          type: 'image/png',
        },
      ],
    });

    const blob = new Blob([manifestContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'manifest.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleInstallPWA = async () => {
    const installed = await promptPWAInstall();
    setIsInstalled(installed);
    if (installed) {
      alert('Установка PWA запущена!');
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
          <Smartphone className="w-6 h-6 text-indigo-600" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-900">PWA Generator</h2>
          <p className="text-sm text-slate-500">Convert your site to a Progressive Web App</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 border-2 border-slate-100 space-y-4">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">App Name</label>
          <input
            type="text"
            value={manifest.name}
            onChange={(e) => setManifest({ ...manifest, name: e.target.value })}
            className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-none font-semibold"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Short Name</label>
          <input
            type="text"
            value={manifest.shortName}
            onChange={(e) => setManifest({ ...manifest, shortName: e.target.value })}
            maxLength={12}
            className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-none font-semibold"
          />
          <div className="text-xs text-slate-500 mt-1">{manifest.shortName.length}/12 characters</div>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
          <textarea
            value={manifest.description}
            onChange={(e) => setManifest({ ...manifest, description: e.target.value })}
            rows={3}
            className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-none font-semibold"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Theme Color</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={manifest.themeColor}
                onChange={(e) => setManifest({ ...manifest, themeColor: e.target.value })}
                className="w-12 h-10 rounded-lg border-2 border-slate-200"
              />
              <input
                type="text"
                value={manifest.themeColor}
                onChange={(e) => setManifest({ ...manifest, themeColor: e.target.value })}
                className="flex-1 px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-none font-semibold"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Background Color</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={manifest.backgroundColor}
                onChange={(e) => setManifest({ ...manifest, backgroundColor: e.target.value })}
                className="w-12 h-10 rounded-lg border-2 border-slate-200"
              />
              <input
                type="text"
                value={manifest.backgroundColor}
                onChange={(e) => setManifest({ ...manifest, backgroundColor: e.target.value })}
                className="flex-1 px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-none font-semibold"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleGenerateManifest}
            className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
          >
            <Download className="w-5 h-5" />
            Generate Manifest
          </button>
          <button
            onClick={handleInstallPWA}
            disabled={isInstalled}
            className={`flex-1 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
              isInstalled
                ? 'bg-green-100 text-green-700 cursor-not-allowed'
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            {isInstalled ? (
              <>
                <CheckCircle className="w-5 h-5" />
                Installed
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                Install PWA
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

