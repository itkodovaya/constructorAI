import React, { useState, useEffect, useRef } from 'react';
import { Edit3, Check, X } from 'lucide-react';

interface InlineEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  tag?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  multiline?: boolean;
}

export const InlineEditor: React.FC<InlineEditorProps> = ({
  value,
  onChange,
  placeholder = 'Click to edit',
  className = '',
  tag = 'p',
  multiline = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const editorRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      if (inputRef.current instanceof HTMLInputElement || inputRef.current instanceof HTMLTextAreaElement) {
        inputRef.current.select();
      }
    }
  }, [isEditing]);

  const handleClick = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    onChange(editValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    } else if (e.key === 'Enter' && e.shiftKey && multiline) {
      // Allow Shift+Enter for new lines in multiline mode
      return;
    }
  };

  const handleBlur = () => {
    // Delay to allow save button click
    setTimeout(() => {
      if (!editorRef.current?.contains(document.activeElement)) {
        handleSave();
      }
    }, 200);
  };

  if (isEditing) {
    return (
      <div ref={editorRef} className={`inline-editor ${className}`}>
        {multiline ? (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            className="w-full p-2 border-2 border-blue-500 rounded-lg focus:outline-none font-semibold resize-none"
            rows={3}
            placeholder={placeholder}
          />
        ) : (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            className="w-full p-2 border-2 border-blue-500 rounded-lg focus:outline-none font-semibold"
            placeholder={placeholder}
          />
        )}
        <div className="flex gap-2 mt-2">
          <button
            onClick={handleSave}
            className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all flex items-center gap-1 text-sm font-bold"
          >
            <Check className="w-4 h-4" />
            Save
          </button>
          <button
            onClick={handleCancel}
            className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all flex items-center gap-1 text-sm font-bold"
          >
            <X className="w-4 h-4" />
            Cancel
          </button>
        </div>
      </div>
    );
  }

  const Tag = tag as keyof JSX.IntrinsicElements;
  return (
    <Tag
      onClick={handleClick}
      className={`inline-editor-display cursor-pointer hover:bg-blue-50 rounded px-2 py-1 transition-all group ${className}`}
      contentEditable={false}
    >
      {value || <span className="text-slate-400 italic">{placeholder}</span>}
      <Edit3 className="w-3 h-3 text-blue-500 opacity-0 group-hover:opacity-100 inline-block ml-2 transition-opacity" />
    </Tag>
  );
};

