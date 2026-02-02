import React, { useState } from 'react';
import { Send } from 'lucide-react';

interface FormField {
  id: string;
  type: 'text' | 'email' | 'tel' | 'textarea' | 'select' | 'checkbox' | 'radio';
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: string[];
}

interface FormBuilderProps {
  title: string;
  subtitle?: string;
  fields: FormField[];
  submitText?: string;
  onSubmit?: (data: Record<string, any>) => void;
}

export const FormBuilder: React.FC<FormBuilderProps> = ({
  title,
  subtitle,
  fields = [],
  submitText = 'Отправить',
  onSubmit,
}) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (fieldId: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
    if (errors[fieldId]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldId];
        return newErrors;
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    fields.forEach(field => {
      if (field.required && !formData[field.id]) {
        newErrors[field.id] = `${field.label} is required`;
      }
      if (field.type === 'email' && formData[field.id] && !/\S+@\S+\.\S+/.test(formData[field.id])) {
        newErrors[field.id] = 'Invalid email address';
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit?.(formData);
      alert('Форма успешно отправлена!');
    }
  };

  const renderField = (field: FormField) => {
    const commonProps = {
      id: field.id,
      className: `w-full px-4 py-3 bg-white border-2 rounded-xl focus:border-blue-500 focus:outline-none font-semibold ${
        errors[field.id] ? 'border-red-500' : 'border-slate-200'
      }`,
      placeholder: field.placeholder,
      value: formData[field.id] || '',
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
        handleChange(field.id, e.target.value),
    };

    switch (field.type) {
      case 'textarea':
        return <textarea {...commonProps} rows={4} />;
      case 'select':
        return (
          <select {...commonProps}>
            <option value="">Select...</option>
            {field.options?.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        );
      case 'checkbox':
        return (
          <input
            type="checkbox"
            id={field.id}
            checked={formData[field.id] || false}
            onChange={(e) => handleChange(field.id, e.target.checked)}
            className="w-5 h-5 rounded border-2 border-slate-300"
          />
        );
      case 'radio':
        return (
          <div className="space-y-2">
            {field.options?.map(opt => (
              <label key={opt} className="flex items-center gap-2">
                <input
                  type="radio"
                  name={field.id}
                  value={opt}
                  checked={formData[field.id] === opt}
                  onChange={(e) => handleChange(field.id, e.target.value)}
                  className="w-4 h-4"
                />
                <span className="text-sm font-semibold text-slate-700">{opt}</span>
              </label>
            ))}
          </div>
        );
      default:
        return <input type={field.type} {...commonProps} />;
    }
  };

  return (
    <div className="w-full py-20 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-black text-slate-900 mb-2">{title}</h2>
          {subtitle && <p className="text-lg text-slate-600">{subtitle}</p>}
        </div>
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-2xl shadow-xl">
          {fields.map(field => (
            <div key={field.id} className="space-y-2">
              <label htmlFor={field.id} className="block text-sm font-bold text-slate-700">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              {renderField(field)}
              {errors[field.id] && (
                <p className="text-sm text-red-500">{errors[field.id]}</p>
              )}
            </div>
          ))}
          <button
            type="submit"
            className="w-full px-6 py-4 bg-blue-600 text-white font-black rounded-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
          >
            <Send className="w-5 h-5" />
            {submitText}
          </button>
        </form>
      </div>
    </div>
  );
};

