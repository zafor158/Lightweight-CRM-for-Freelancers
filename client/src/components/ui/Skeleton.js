import React from 'react';

const Skeleton = ({ 
  className = '', 
  width, 
  height, 
  variant = 'rectangular',
  animation = 'pulse'
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'circular':
        return 'rounded-full';
      case 'text':
        return 'rounded';
      case 'rectangular':
      default:
        return 'rounded-lg';
    }
  };

  const getAnimationClasses = () => {
    switch (animation) {
      case 'wave':
        return 'animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite]';
      case 'pulse':
      default:
        return 'animate-pulse bg-gray-200';
    }
  };

  const style = {
    ...(width && { width }),
    ...(height && { height })
  };

  return (
    <div
      className={`
        ${getVariantClasses()}
        ${getAnimationClasses()}
        ${className}
      `}
      style={style}
    />
  );
};

// Predefined skeleton components
export const SkeletonCard = () => (
  <div className="card p-6 space-y-4">
    <div className="flex items-center justify-between">
      <Skeleton width="40%" height="20px" />
      <Skeleton width="60px" height="60px" variant="circular" />
    </div>
    <Skeleton width="80%" height="32px" />
    <Skeleton width="60%" height="16px" />
  </div>
);

export const SkeletonTable = ({ rows = 5 }) => (
  <div className="card">
    <div className="card-header">
      <div className="flex items-center justify-between">
        <Skeleton width="200px" height="24px" />
        <Skeleton width="100px" height="36px" />
      </div>
    </div>
    <div className="card-body">
      <div className="space-y-4">
        {/* Table header */}
        <div className="grid grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} width="100%" height="16px" />
          ))}
        </div>
        {/* Table rows */}
        {[...Array(rows)].map((_, i) => (
          <div key={i} className="grid grid-cols-4 gap-4 py-2">
            {[...Array(4)].map((_, j) => (
              <Skeleton key={j} width="100%" height="20px" />
            ))}
          </div>
        ))}
      </div>
    </div>
  </div>
);

export const SkeletonList = ({ items = 3 }) => (
  <div className="space-y-4">
    {[...Array(items)].map((_, i) => (
      <div key={i} className="flex items-center space-x-4 p-4 space-card">
        <Skeleton width="48px" height="48px" variant="circular" />
        <div className="flex-1 space-y-2">
          <Skeleton width="60%" height="16px" />
          <Skeleton width="40%" height="14px" />
        </div>
        <Skeleton width="80px" height="32px" />
      </div>
    ))}
  </div>
);

export default Skeleton;
