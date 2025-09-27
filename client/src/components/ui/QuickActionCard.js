import React from 'react';
import { Plus } from 'lucide-react';

const QuickActionCard = ({
  title,
  description,
  icon: Icon,
  onClick,
  color = 'primary',
  className = ''
}) => {
  const getColorClasses = () => {
    switch (color) {
      case 'success':
        return 'bg-success-50 border-success-200 hover:bg-success-100 text-success-700';
      case 'warning':
        return 'bg-warning-50 border-warning-200 hover:bg-warning-100 text-warning-700';
      case 'error':
        return 'bg-error-50 border-error-200 hover:bg-error-100 text-error-700';
      case 'info':
        return 'bg-primary-50 border-primary-200 hover:bg-primary-100 text-primary-700';
      default:
        return 'bg-primary-50 border-primary-200 hover:bg-primary-100 text-primary-700';
    }
  };

  const getIconColorClasses = () => {
    switch (color) {
      case 'success':
        return 'bg-success-100 text-success-600';
      case 'warning':
        return 'bg-warning-100 text-warning-600';
      case 'error':
        return 'bg-error-100 text-error-600';
      case 'info':
        return 'bg-primary-100 text-primary-600';
      default:
        return 'bg-primary-100 text-primary-600';
    }
  };

  return (
    <button
      onClick={onClick}
      className={`
        group relative w-full p-6 rounded-xl border-2 border-dashed transition-all duration-200
        hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2
        ${getColorClasses()}
        ${className}
      `}
    >
      <div className="flex flex-col items-center text-center space-y-4">
        <div className={`p-4 rounded-full ${getIconColorClasses()} group-hover:scale-110 transition-transform duration-200`}>
          {Icon ? <Icon className="w-8 h-8" /> : <Plus className="w-8 h-8" />}
        </div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">{title}</h3>
          {description && (
            <p className="text-sm opacity-80">{description}</p>
          )}
        </div>
      </div>
    </button>
  );
};

export default QuickActionCard;
