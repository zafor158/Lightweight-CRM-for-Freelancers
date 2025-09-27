import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const StatCard = ({ 
  title, 
  value, 
  change, 
  changeType = 'neutral', 
  icon: Icon, 
  color = 'primary',
  loading = false 
}) => {
  const getChangeIcon = () => {
    switch (changeType) {
      case 'positive':
        return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'negative':
        return <TrendingDown className="w-4 h-4 text-red-400" />;
      default:
        return <Minus className="w-4 h-4 text-gray-400" />;
    }
  };

  const getChangeColor = () => {
    switch (changeType) {
      case 'positive':
        return 'text-green-400';
      case 'negative':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getIconBgColor = () => {
    switch (color) {
      case 'success':
        return 'bg-green-500/20 text-green-400';
      case 'warning':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'error':
        return 'bg-red-500/20 text-red-400';
      case 'info':
        return 'bg-blue-500/20 text-blue-400';
      default:
        return 'bg-purple-500/20 text-purple-400';
    }
  };

  if (loading) {
    return (
      <div className="space-card p-6 animate-pulse">
        <div className="flex items-center justify-between mb-4">
          <div className="h-4 bg-gray-700 rounded w-24"></div>
          <div className="h-10 w-10 bg-gray-700 rounded-lg"></div>
        </div>
        <div className="h-8 bg-gray-600 rounded w-16 mb-2"></div>
        <div className="h-3 bg-gray-700 rounded w-20"></div>
      </div>
    );
  }

  return (
    <div className="space-card p-6 hover:shadow-lg transition-all duration-200 group">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium space-text-secondary uppercase tracking-wide">
          {title}
        </h3>
        <div className={`p-3 rounded-xl ${getIconBgColor()} group-hover:scale-110 transition-transform duration-200`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="text-3xl font-bold space-text-primary">
          {value}
        </div>
        
        {change && (
          <div className={`flex items-center space-x-1 text-sm ${getChangeColor()}`}>
            {getChangeIcon()}
            <span className="font-medium">{change}</span>
            <span className="space-text-muted">vs last month</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
