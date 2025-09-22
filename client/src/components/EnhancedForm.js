import React, { useState } from 'react';
import { Eye, EyeOff, HelpCircle, Check, X, AlertCircle } from 'lucide-react';

const EnhancedForm = ({ children, onSubmit, className = '' }) => {
  return (
    <form onSubmit={onSubmit} className={`space-y-6 ${className}`}>
      {children}
    </form>
  );
};

const FormSection = ({ title, description, children, className = '' }) => {
  return (
    <div className={`bg-gray-50 rounded-lg p-6 ${className}`}>
      <div className="mb-4">
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        {description && (
          <p className="text-sm text-gray-600 mt-1">{description}</p>
        )}
      </div>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
};

const FormField = ({ 
  label, 
  name, 
  type = 'text', 
  value, 
  onChange, 
  placeholder, 
  required = false, 
  error, 
  helpText, 
  options = [], 
  className = '',
  ...props 
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const renderInput = () => {
    switch (type) {
      case 'select':
        return (
          <select
            name={name}
            value={value}
            onChange={onChange}
            className={`block w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${
              error 
                ? 'border-red-300 bg-red-50' 
                : isFocused 
                  ? 'border-indigo-300 bg-white' 
                  : 'border-gray-300 bg-white'
            }`}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...props}
          >
            <option value="">Select {label}</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'textarea':
        return (
          <textarea
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            rows={4}
            className={`block w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors resize-none ${
              error 
                ? 'border-red-300 bg-red-50' 
                : isFocused 
                  ? 'border-indigo-300 bg-white' 
                  : 'border-gray-300 bg-white'
            }`}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...props}
          />
        );

      case 'password':
        return (
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name={name}
              value={value}
              onChange={onChange}
              placeholder={placeholder}
              className={`block w-full px-3 py-2 pr-10 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${
                error 
                  ? 'border-red-300 bg-red-50' 
                  : isFocused 
                    ? 'border-indigo-300 bg-white' 
                    : 'border-gray-300 bg-white'
              }`}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              {...props}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        );

      case 'date':
        return (
          <input
            type="date"
            name={name}
            value={value}
            onChange={onChange}
            className={`block w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${
              error 
                ? 'border-red-300 bg-red-50' 
                : isFocused 
                  ? 'border-indigo-300 bg-white' 
                  : 'border-gray-300 bg-white'
            }`}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...props}
          />
        );

      case 'number':
        return (
          <input
            type="number"
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            step="0.01"
            min="0"
            className={`block w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${
              error 
                ? 'border-red-300 bg-red-50' 
                : isFocused 
                  ? 'border-indigo-300 bg-white' 
                  : 'border-gray-300 bg-white'
            }`}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...props}
          />
        );

      default:
        return (
          <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`block w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${
              error 
                ? 'border-red-300 bg-red-50' 
                : isFocused 
                  ? 'border-indigo-300 bg-white' 
                  : 'border-gray-300 bg-white'
            }`}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...props}
          />
        );
    }
  };

  return (
    <div className={className}>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      {renderInput()}
      
      {helpText && (
        <div className="mt-1 flex items-center text-xs text-gray-500">
          <HelpCircle size={12} className="mr-1" />
          {helpText}
        </div>
      )}
      
      {error && (
        <div className="mt-1 flex items-center text-xs text-red-600">
          <AlertCircle size={12} className="mr-1" />
          {error}
        </div>
      )}
    </div>
  );
};

const FormActions = ({ children, className = '' }) => {
  return (
    <div className={`flex items-center justify-end space-x-3 pt-6 border-t border-gray-200 ${className}`}>
      {children}
    </div>
  );
};

const SubmitButton = ({ 
  children, 
  loading = false, 
  disabled = false, 
  variant = 'primary',
  className = '',
  ...props 
}) => {
  const baseStyles = "inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500",
    secondary: "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 focus:ring-indigo-500",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500"
  };

  return (
    <button
      type="submit"
      disabled={disabled || loading}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {loading && (
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
      )}
      {children}
    </button>
  );
};

const CancelButton = ({ children, onClick, className = '', ...props }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// Export all components
export {
  EnhancedForm,
  FormSection,
  FormField,
  FormActions,
  SubmitButton,
  CancelButton
};
