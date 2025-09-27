/**
 * Navigation Context - Manages navigation history and context preservation
 * 
 * This context provides a centralized way to manage navigation state,
 * history tracking, and context preservation across the application.
 */

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const NavigationContext = createContext();

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};

export const NavigationProvider = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Navigation state
  const [navigationHistory, setNavigationHistory] = useState([]);
  const [currentPage, setCurrentPage] = useState(null);
  const [breadcrumbs, setBreadcrumbs] = useState([]);
  const [preservedState, setPreservedState] = useState({});

  // Page configuration for navigation
  const pageConfig = useMemo(() => ({
    '/dashboard': { title: 'Dashboard', parent: null, icon: 'Home' },
    '/clients': { title: 'Clients', parent: '/dashboard', icon: 'Users' },
    '/clients/new': { title: 'New Client', parent: '/clients', icon: 'UserPlus' },
    '/clients/:id': { title: 'Client Details', parent: '/clients', icon: 'User' },
    '/clients/:id/edit': { title: 'Edit Client', parent: '/clients/:id', icon: 'Edit' },
    '/projects': { title: 'Projects', parent: '/dashboard', icon: 'FolderOpen' },
    '/projects/new': { title: 'New Project', parent: '/projects', icon: 'Plus' },
    '/projects/:id': { title: 'Project Details', parent: '/projects', icon: 'FolderOpen' },
    '/projects/:id/edit': { title: 'Edit Project', parent: '/projects/:id', icon: 'Edit' },
    '/invoices': { title: 'Invoices', parent: '/dashboard', icon: 'FileText' },
    '/invoices/new': { title: 'New Invoice', parent: '/invoices', icon: 'Plus' },
    '/invoices/generator': { title: 'Invoice Generator', parent: '/invoices', icon: 'Receipt' },
    '/invoices/:id': { title: 'Invoice Details', parent: '/invoices', icon: 'FileText' },
    '/invoices/:id/edit': { title: 'Edit Invoice', parent: '/invoices/:id', icon: 'Edit' },
    '/invoice/:id': { title: 'Invoice View', parent: '/invoices/:id', icon: 'Eye' },
    '/analytics': { title: 'Analytics', parent: '/dashboard', icon: 'TrendingUp' },
    '/payments': { title: 'Payments', parent: '/dashboard', icon: 'CreditCard' },
    '/profile': { title: 'Profile', parent: '/dashboard', icon: 'User' }
  }), []);

  // Get page configuration for current route
  const getPageConfig = useCallback((pathname) => {
    // Try exact match first
    if (pageConfig[pathname]) {
      return pageConfig[pathname];
    }
    
    // Try pattern matching for dynamic routes
    for (const [pattern, config] of Object.entries(pageConfig)) {
      if (pattern.includes(':')) {
        const regex = new RegExp(pattern.replace(/:[^/]+/g, '[^/]+'));
        if (regex.test(pathname)) {
          return config;
        }
      }
    }
    
    return { title: 'Unknown Page', parent: null, icon: 'File' };
  }, [pageConfig]);

  // Generate breadcrumbs for current route
  const generateBreadcrumbs = useCallback((pathname) => {
    const config = getPageConfig(pathname);
    const crumbs = [];
    
    // Add current page
    crumbs.push({
      path: pathname,
      title: config.title,
      icon: config.icon,
      current: true
    });
    
    // Add parent pages
    while (config.parent) {
      const parentConfig = getPageConfig(config.parent);
      if (parentConfig) {
        crumbs.unshift({
          path: config.parent,
          title: parentConfig.title,
          icon: parentConfig.icon,
          current: false
        });
      }
      break; // Prevent infinite loop
    }
    
    return crumbs;
  }, [getPageConfig]);

  // Smart back navigation
  const goBack = useCallback((fallbackRoute = '/dashboard') => {
    if (navigationHistory.length > 1) {
      // Go back to previous page in history
      const previousPage = navigationHistory[navigationHistory.length - 2];
      navigate(previousPage.path, { 
        state: { 
          ...previousPage.state,
          preserveScroll: true 
        } 
      });
    } else {
      // Fallback to specified route
      navigate(fallbackRoute);
    }
  }, [navigationHistory, navigate]);

  // Navigate with context preservation
  const navigateWithContext = useCallback((to, options = {}) => {
    const currentState = {
      path: location.pathname,
      state: location.state,
      timestamp: Date.now()
    };
    
    // Add to navigation history
    setNavigationHistory(prev => [...prev, currentState]);
    
    // Navigate to new page
    navigate(to, {
      ...options,
      state: {
        ...options.state,
        from: location.pathname,
        timestamp: Date.now()
      }
    });
  }, [location, navigate]);

  // Preserve state for current page
  const preserveState = useCallback((key, state) => {
    setPreservedState(prev => ({
      ...prev,
      [location.pathname]: {
        ...prev[location.pathname],
        [key]: state
      }
    }));
  }, [location.pathname]);

  // Restore state for current page
  const restoreState = useCallback((key, defaultValue = null) => {
    return preservedState[location.pathname]?.[key] || defaultValue;
  }, [preservedState, location.pathname]);

  // Clear preserved state
  const clearPreservedState = useCallback((key) => {
    if (key) {
      setPreservedState(prev => ({
        ...prev,
        [location.pathname]: {
          ...prev[location.pathname],
          [key]: undefined
        }
      }));
    } else {
      setPreservedState(prev => ({
        ...prev,
        [location.pathname]: {}
      }));
    }
  }, [location.pathname]);

  // Update navigation state when location changes
  useEffect(() => {
    const config = getPageConfig(location.pathname);
    setCurrentPage({
      path: location.pathname,
      title: config.title,
      icon: config.icon,
      parent: config.parent
    });
    
    setBreadcrumbs(generateBreadcrumbs(location.pathname));
  }, [location.pathname, getPageConfig, generateBreadcrumbs]);

  // Handle browser back/forward
  useEffect(() => {
    const handlePopState = (event) => {
      if (event.state?.preserveScroll) {
        // Restore scroll position
        setTimeout(() => {
          const scrollY = event.state.scrollY || 0;
          window.scrollTo(0, scrollY);
        }, 100);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Context value
  const value = {
    // Current page info
    currentPage,
    breadcrumbs,
    
    // Navigation functions
    goBack,
    navigateWithContext,
    
    // State preservation
    preserveState,
    restoreState,
    clearPreservedState,
    
    // History
    navigationHistory,
    
    // Utilities
    getPageConfig,
    generateBreadcrumbs
  };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
};

export default NavigationContext;
