/**
 * Smart Back Button - Context-aware back navigation component
 * 
 * This component provides intelligent back navigation that:
 * - Uses browser history when available
 * - Falls back to specified route when no history
 * - Preserves user context and scroll position
 * - Provides consistent styling and behavior
 */

import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigation } from '../../contexts/NavigationContext';
import { getButtonClasses } from '../../styles/cosmic-design-system';

const SmartBackButton = ({ 
  fallbackRoute = '/dashboard',
  preserveContext = true,
  size = 'md',
  variant = 'primary',
  className = '',
  children,
  showIcon = true,
  showText = true,
  text = 'Back',
  onClick,
  ...props 
}) => {
  const { goBack, currentPage } = useNavigation();

  // Handle click with custom logic
  const handleClick = (e) => {
    if (onClick) {
      onClick(e);
    } else {
      // Preserve scroll position
      if (preserveContext) {
        const scrollY = window.scrollY;
        // Store scroll position in session storage
        sessionStorage.setItem('scrollPosition', scrollY.toString());
      }
      
      // Navigate back
      goBack(fallbackRoute);
    }
  };

  // Get button classes from design system
  const buttonClasses = getButtonClasses(variant, size);
  
  // Combine classes
  const combinedClasses = `${buttonClasses} ${className}`.trim();

  return (
    <button
      onClick={handleClick}
      className={combinedClasses}
      aria-label={`Go back to ${currentPage?.parent || 'previous page'}`}
      title={`Go back to ${currentPage?.parent || 'previous page'}`}
      {...props}
    >
      {showIcon && <ArrowLeft size={size === 'sm' ? 16 : size === 'lg' ? 20 : 18} />}
      {showText && (children || text)}
    </button>
  );
};

// Variants for different use cases
export const BackButton = {
  // Primary back button for headers
  Primary: (props) => (
    <SmartBackButton 
      variant="primary" 
      size="sm" 
      showText={false}
      {...props} 
    />
  ),
  
  // Secondary back button for forms
  Secondary: (props) => (
    <SmartBackButton 
      variant="secondary" 
      size="md" 
      text="Back"
      {...props} 
    />
  ),
  
  // Ghost back button for minimal styling
  Ghost: (props) => (
    <SmartBackButton 
      variant="ghost" 
      size="sm" 
      showText={false}
      {...props} 
    />
  ),
  
  // Large back button for prominent navigation
  Large: (props) => (
    <SmartBackButton 
      variant="primary" 
      size="lg" 
      text="Go Back"
      {...props} 
    />
  )
};

export default SmartBackButton;
