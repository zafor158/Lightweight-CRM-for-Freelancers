/**
 * Breadcrumb Navigation Component
 * 
 * Provides visual navigation hierarchy with:
 * - Clickable breadcrumb items
 * - Consistent styling with design system
 * - Responsive design for mobile
 * - Accessibility support
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { useNavigation } from '../../contexts/NavigationContext';
import { getCardClasses } from '../../styles/cosmic-design-system';

const Breadcrumb = ({ 
  items = null,
  separator = 'chevron',
  className = '',
  showHome = true,
  maxItems = 5,
  ...props 
}) => {
  const { breadcrumbs } = useNavigation();
  
  // Use provided items or navigation context breadcrumbs
  const breadcrumbItems = items || breadcrumbs;
  
  // Limit items for mobile
  const displayItems = breadcrumbItems.slice(-maxItems);
  
  // Render separator
  const renderSeparator = () => {
    if (separator === 'chevron') {
      return <ChevronRight size={14} className="text-gray-400" />;
    } else if (separator === 'slash') {
      return <span className="text-gray-400 mx-2">/</span>;
    } else if (separator === 'arrow') {
      return <span className="text-gray-400 mx-2">→</span>;
    }
    return <span className="text-gray-400 mx-2">{separator}</span>;
  };

  // Render breadcrumb item
  const renderItem = (item, index) => {
    const isLast = index === displayItems.length - 1;
    const isFirst = index === 0;
    
    if (isLast) {
      // Current page - not clickable
      return (
        <li key={item.path} className="flex items-center">
          {!isFirst && renderSeparator()}
          <span className="text-white font-semibold text-sm sm:text-base">
            {item.title}
          </span>
        </li>
      );
    } else {
      // Clickable breadcrumb item
      return (
        <li key={item.path} className="flex items-center">
          {!isFirst && renderSeparator()}
          <Link
            to={item.path}
            className="text-gray-300 hover:text-white transition-colors duration-200 text-sm sm:text-base hover:underline"
            aria-label={`Navigate to ${item.title}`}
          >
            {item.title}
          </Link>
        </li>
      );
    }
  };

  // Don't render if no items or only one item
  if (!breadcrumbItems || breadcrumbItems.length <= 1) {
    return null;
  }

  return (
    <nav 
      className={`${getCardClasses('standard')} p-3 sm:p-4 ${className}`}
      aria-label="Breadcrumb navigation"
      {...props}
    >
      <ol className="flex items-center space-x-1 sm:space-x-2 flex-wrap">
        {showHome && (
          <li className="flex items-center">
            <Link
              to="/dashboard"
              className="text-gray-300 hover:text-white transition-colors duration-200"
              aria-label="Go to Dashboard"
            >
              <Home size={16} className="sm:hidden" />
              <span className="hidden sm:inline text-sm sm:text-base">Dashboard</span>
            </Link>
            {displayItems.length > 0 && renderSeparator()}
          </li>
        )}
        {displayItems.map((item, index) => renderItem(item, index))}
      </ol>
    </nav>
  );
};

// Variants for different use cases
export const BreadcrumbVariants = {
  // Standard breadcrumb for most pages
  Standard: (props) => (
    <Breadcrumb 
      separator="chevron"
      showHome={true}
      maxItems={4}
      {...props} 
    />
  ),
  
  // Compact breadcrumb for mobile
  Compact: (props) => (
    <Breadcrumb 
      separator="slash"
      showHome={false}
      maxItems={3}
      className="p-2"
      {...props} 
    />
  ),
  
  // Minimal breadcrumb for forms
  Minimal: (props) => (
    <Breadcrumb 
      separator="arrow"
      showHome={false}
      maxItems={2}
      className="p-2 bg-transparent border-0 shadow-none"
      {...props} 
    />
  )
};

export default Breadcrumb;
