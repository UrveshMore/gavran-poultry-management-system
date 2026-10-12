import React from 'react';

type TextareaProps = {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  error?: string;
  className?: string;
  rows?: number;
  required?: boolean;
};

const Textarea: React.FC<TextareaProps> = ({
  label,
  placeholder,
  value,
  onChange,
  error,
  className = '',
  rows = 3,
  required = false,
}) => {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        rows={rows}
        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
          error 
            ? 'border-red-500 focus:ring-red-500' 
            : 'border-gray-300 focus:border-green-500 focus:ring-green-500'
        } ${className}`}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default Textarea;