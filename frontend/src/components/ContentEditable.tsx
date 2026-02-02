import React, { useState, useEffect, useRef } from 'react';

interface ContentEditableProps {
  value: string;
  onChange: (newValue: string) => void;
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';
  className?: string;
  disabled?: boolean;
}

export const ContentEditable: React.FC<ContentEditableProps> = ({
  value,
  onChange,
  tag = 'p',
  className = '',
  disabled = false,
}) => {
  const [html, setHtml] = useState(value);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    setHtml(value);
  }, [value]);

  const handleBlur = () => {
    if (ref.current) {
      onChange(ref.current.innerText);
    }
  };

  const handleInput = () => {
    if (ref.current) {
      setHtml(ref.current.innerText);
    }
  };

  return React.createElement(tag, {
    ref,
    contentEditable: !disabled,
    onBlur: handleBlur,
    onInput: handleInput,
    className: `${className} outline-none focus:ring-2 focus:ring-blue-500/20 rounded px-1 transition-all`,
    dangerouslySetInnerHTML: { __html: html },
    suppressContentEditableWarning: true,
  });
};
