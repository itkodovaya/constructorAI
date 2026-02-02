import React, { useState, useEffect } from 'react';
import { Palette, Type, Layout, Ruler, Image as ImageIcon, Zap } from 'lucide-react';

interface StyleInspectorProps {
  blockId: string;
  blockType: string;
  currentStyles: React.CSSProperties;
  onUpdate: (styles: React.CSSProperties) => void;
}

export const StyleInspector: React.FC<StyleInspectorProps> = ({
  blockId,
  blockType,
  currentStyles,
  onUpdate,
}) => {
  const [styles, setStyles] = useState<React.CSSProperties>(currentStyles);
  const [activeTab, setActiveTab] = useState<'layout' | 'typography' | 'background' | 'effects'>('layout');

  useEffect(() => {
    setStyles(currentStyles);
  }, [currentStyles]);

  const handleChange = (property: string, value: string | number) => {
    const newStyles = { ...styles, [property]: value };
    setStyles(newStyles);
    onUpdate(newStyles);
  };

  const renderInput = (label: string, property: string, type: string = 'text', options?: string[]) => (
    <div className="space-y-1">
      <label className="text-[10px] font-black text-slate-300 uppercase">{label}</label>
      {type === 'select' && options ? (
        <select
          className="w-full p-3 bg-white border border-slate-100 rounded-xl text-xs font-bold"
          value={styles[property as keyof React.CSSProperties] as string || ''}
          onChange={(e) => handleChange(property, e.target.value)}
        >
          {options.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          className="w-full p-3 bg-white border border-slate-100 rounded-xl text-xs font-bold"
          value={styles[property as keyof React.CSSProperties] as string || ''}
          onChange={(e) => handleChange(property, type === 'number' ? parseFloat(e.target.value) : e.target.value)}
        />
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex border-b border-slate-100 -mx-6 px-6">
        <button onClick={() => setActiveTab('layout')} className={`flex-1 py-3 text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'layout' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-400 hover:text-slate-600'}`}>Layout</button>
        <button onClick={() => setActiveTab('typography')} className={`flex-1 py-3 text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'typography' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-400 hover:text-slate-600'}`}>Text</button>
        <button onClick={() => setActiveTab('background')} className={`flex-1 py-3 text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'background' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-400 hover:text-slate-600'}`}>Background</button>
        <button onClick={() => setActiveTab('effects')} className={`flex-1 py-3 text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'effects' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-400 hover:text-slate-600'}`}>Effects</button>
      </div>

      {activeTab === 'layout' && (
        <div className="grid grid-cols-2 gap-4">
          {renderInput('Width', 'width')}
          {renderInput('Height', 'height')}
          {renderInput('Padding Top', 'paddingTop')}
          {renderInput('Padding Bottom', 'paddingBottom')}
          {renderInput('Margin Top', 'marginTop')}
          {renderInput('Margin Bottom', 'marginBottom')}
          {renderInput('Display', 'display', 'select', ['block', 'flex', 'grid', 'inline-block'])}
          {styles.display === 'flex' && renderInput('Flex Direction', 'flexDirection', 'select', ['row', 'column'])}
          {styles.display === 'flex' && renderInput('Justify Content', 'justifyContent', 'select', ['flex-start', 'center', 'flex-end', 'space-between', 'space-around'])}
          {styles.display === 'flex' && renderInput('Align Items', 'alignItems', 'select', ['flex-start', 'center', 'flex-end', 'stretch'])}
        </div>
      )}

      {activeTab === 'typography' && (
        <div className="grid grid-cols-2 gap-4">
          {renderInput('Font Size', 'fontSize')}
          {renderInput('Font Weight', 'fontWeight', 'select', ['normal', 'bold', 'bolder', 'lighter', '100', '200', '300', '400', '500', '600', '700', '800', '900'])}
          {renderInput('Color', 'color', 'color')}
          {renderInput('Text Align', 'textAlign', 'select', ['left', 'center', 'right', 'justify'])}
          {renderInput('Line Height', 'lineHeight')}
        </div>
      )}

      {activeTab === 'background' && (
        <div className="grid grid-cols-1 gap-4">
          {renderInput('Background Color', 'backgroundColor', 'color')}
          {renderInput('Background Image', 'backgroundImage')}
          {renderInput('Background Size', 'backgroundSize')}
          {renderInput('Background Position', 'backgroundPosition')}
        </div>
      )}

      {activeTab === 'effects' && (
        <div className="grid grid-cols-2 gap-4">
          {renderInput('Opacity', 'opacity', 'number')}
          {renderInput('Border Radius', 'borderRadius')}
          {renderInput('Box Shadow', 'boxShadow')}
          {renderInput('Transition', 'transition')}
        </div>
      )}
    </div>
  );
};
