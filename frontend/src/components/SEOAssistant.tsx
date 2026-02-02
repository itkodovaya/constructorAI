import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, CheckCircle, AlertCircle, Info, Download, RefreshCw } from 'lucide-react';
import { analyzeSEO, generateSchemaMarkup, generateSitemap, updateMetaTags, type SEOData } from '../utils/seo-optimizer';
import { api } from '../services/api';

interface SEOAssistantProps {
  projectId?: string;
  currentSEO?: SEOData;
  pages?: Array<{ id: string; title: string; slug: string }>;
  onUpdate?: (seo: SEOData) => void;
}

export const SEOAssistant: React.FC<SEOAssistantProps> = ({
  projectId,
  currentSEO,
  pages = [],
  onUpdate,
}) => {
  const [seoData, setSeoData] = useState<SEOData>(currentSEO || {
    title: '',
    description: '',
    keywords: [],
    lang: 'ru',
  });
  const [analysis, setAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [schemaType, setSchemaType] = useState<'Organization' | 'WebSite' | 'Product' | 'Article'>('WebSite');
  const [schemaData, setSchemaData] = useState<any>({});
  const [generatedSchema, setGeneratedSchema] = useState<string>('');

  useEffect(() => {
    if (currentSEO) {
      setSeoData(currentSEO);
    }
  }, [currentSEO]);

  useEffect(() => {
    performAnalysis();
  }, [seoData]);

  const performAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      const result = analyzeSEO();
      setAnalysis(result);
      setIsAnalyzing(false);
    }, 500);
  };

  const handleGenerateSchema = () => {
    const schema = generateSchemaMarkup({
      type: schemaType,
      name: seoData.title || 'Website',
      url: window.location.origin,
      description: seoData.description,
      ...schemaData,
    });
    setGeneratedSchema(schema);
  };

  const handleGenerateSitemap = () => {
    const sitemapPages = pages.map((page) => ({
      url: `${window.location.origin}${page.slug}`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'weekly',
      priority: page.slug === '/' ? 1.0 : 0.8,
    }));

    const sitemap = generateSitemap(sitemapPages);
    const blob = new Blob([sitemap], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sitemap.xml';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleApplySEO = () => {
    updateMetaTags(seoData);
    onUpdate?.(seoData);
    if (projectId) {
      api.updateProjectSEO(projectId, seoData);
    }
  };

  const handleAIGenerate = async () => {
    if (!projectId) return;
    try {
      const result = await api.generateSEOContent(projectId, {
        currentSEO: seoData,
        pages: pages.map(p => p.title),
      });
      setSeoData(result);
    } catch (error) {
      console.error('Error generating SEO content:', error);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
            <Search className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900">SEO Assistant</h2>
            <p className="text-sm text-slate-500">Optimize your site for search engines</p>
          </div>
        </div>
        <button
          onClick={handleAIGenerate}
          className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          AI Generate
        </button>
      </div>

      {/* SEO Analysis */}
      {analysis && (
        <div className="bg-white rounded-2xl p-6 border-2 border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-900">SEO Score</h3>
            <div className={`text-3xl font-black ${analysis.score >= 80 ? 'text-green-600' : analysis.score >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
              {analysis.score}/100
            </div>
          </div>

          {analysis.issues.length > 0 && (
            <div className="space-y-2 mb-4">
              {analysis.issues.map((issue: any, index: number) => (
                <div
                  key={index}
                  className={`flex items-center gap-2 p-3 rounded-xl ${
                    issue.type === 'error' ? 'bg-red-50 text-red-700' :
                    issue.type === 'warning' ? 'bg-yellow-50 text-yellow-700' :
                    'bg-blue-50 text-blue-700'
                  }`}
                >
                  {issue.type === 'error' ? (
                    <AlertCircle className="w-5 h-5" />
                  ) : issue.type === 'warning' ? (
                    <AlertCircle className="w-5 h-5" />
                  ) : (
                    <Info className="w-5 h-5" />
                  )}
                  <span className="text-sm font-semibold">{issue.message}</span>
                </div>
              ))}
            </div>
          )}

          {analysis.suggestions.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-bold text-slate-700 mb-2">Suggestions:</h4>
              {analysis.suggestions.map((suggestion: string, index: number) => (
                <div key={index} className="flex items-center gap-2 text-sm text-slate-600">
                  <CheckCircle className="w-4 h-4 text-indigo-600" />
                  {suggestion}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SEO Form */}
      <div className="bg-white rounded-2xl p-6 border-2 border-slate-100 space-y-4">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Page Title</label>
          <input
            type="text"
            value={seoData.title}
            onChange={(e) => setSeoData({ ...seoData, title: e.target.value })}
            placeholder="Enter page title (30-60 characters)"
            className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-none font-semibold"
            maxLength={60}
          />
          <div className="text-xs text-slate-500 mt-1">{seoData.title.length}/60 characters</div>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Meta Description</label>
          <textarea
            value={seoData.description}
            onChange={(e) => setSeoData({ ...seoData, description: e.target.value })}
            placeholder="Enter meta description (120-160 characters)"
            rows={3}
            className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-none font-semibold"
            maxLength={160}
          />
          <div className="text-xs text-slate-500 mt-1">{seoData.description.length}/160 characters</div>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Keywords</label>
          <input
            type="text"
            value={seoData.keywords.join(', ')}
            onChange={(e) => setSeoData({ ...seoData, keywords: e.target.value.split(',').map(k => k.trim()).filter(Boolean) })}
            placeholder="Enter keywords separated by commas"
            className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-none font-semibold"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">OG Title</label>
            <input
              type="text"
              value={seoData.ogTitle || ''}
              onChange={(e) => setSeoData({ ...seoData, ogTitle: e.target.value })}
              placeholder="Open Graph title"
              className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-none font-semibold"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">OG Image URL</label>
            <input
              type="url"
              value={seoData.ogImage || ''}
              onChange={(e) => setSeoData({ ...seoData, ogImage: e.target.value })}
              placeholder="https://example.com/image.jpg"
              className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-none font-semibold"
            />
          </div>
        </div>

        <button
          onClick={handleApplySEO}
          className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all"
        >
          Apply SEO Settings
        </button>
      </div>

      {/* Schema Markup Generator */}
      <div className="bg-white rounded-2xl p-6 border-2 border-slate-100 space-y-4">
        <h3 className="text-lg font-bold text-slate-900">Schema Markup Generator</h3>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Schema Type</label>
          <select
            value={schemaType}
            onChange={(e) => setSchemaType(e.target.value as any)}
            className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-none font-semibold"
          >
            <option value="WebSite">WebSite</option>
            <option value="Organization">Organization</option>
            <option value="Product">Product</option>
            <option value="Article">Article</option>
          </select>
        </div>
        <button
          onClick={handleGenerateSchema}
          className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all"
        >
          Generate Schema
        </button>
        {generatedSchema && (
          <div className="mt-4">
            <label className="block text-sm font-bold text-slate-700 mb-2">Generated Schema</label>
            <pre className="p-4 bg-slate-50 rounded-xl text-xs overflow-auto max-h-48">
              {generatedSchema}
            </pre>
          </div>
        )}
      </div>

      {/* Sitemap Generator */}
      {pages.length > 0 && (
        <div className="bg-white rounded-2xl p-6 border-2 border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-900">Sitemap Generator</h3>
            <button
              onClick={handleGenerateSitemap}
              className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Generate & Download
            </button>
          </div>
          <p className="text-sm text-slate-600">
            {pages.length} page(s) will be included in the sitemap
          </p>
        </div>
      )}
    </div>
  );
};

