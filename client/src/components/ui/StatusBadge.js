import React from 'react';

const StatusBadge = ({ 
  status, 
  variant = 'default', 
  size = 'md',
  className = '' 
}) => {
  const getStatusConfig = () => {
    switch (status.toLowerCase()) {
      case 'active':
      case 'completed':
      case 'paid':
      case 'published':
        return {
          color: 'success',
          text: 'Active',
          icon: '✓'
        };
      case 'pending':
      case 'draft':
      case 'in progress':
        return {
          color: 'warning',
          text: 'Pending',
          icon: '⏳'
        };
      case 'inactive':
      case 'cancelled':
      case 'overdue':
      case 'failed':
        return {
          color: 'error',
          text: 'Inactive',
          icon: '✗'
        };
      case 'on hold':
      case 'paused':
        return {
          color: 'info',
          text: 'On Hold',
          icon: '⏸'
        };
      default:
        return {
          color: 'gray',
          text: status,
          icon: '•'
        };
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-2 py-1 text-xs';
      case 'lg':
        return 'px-4 py-2 text-sm';
      default:
        return 'px-3 py-1.5 text-xs';
    }
  };

  const getColorClasses = () => {
    const config = getStatusConfig();
    switch (config.color) {
      case 'success':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'warning':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'error':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'info':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const config = getStatusConfig();

  return (
    <span
      className={`
        inline-flex items-center space-x-1.5 font-medium rounded-full border
        ${getSizeClasses()}
        ${getColorClasses()}
        ${className}
      `}
    >
      <span className="text-xs">{config.icon}</span>
      <span>{config.text}</span>
    </span>
  );
};

export default StatusBadge;
