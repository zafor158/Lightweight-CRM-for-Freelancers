/**
 * Navigation Hook - Easy access to navigation functionality
 * 
 * This hook provides a simple interface to the navigation context
 * with additional utility functions for common navigation patterns.
 */

import { useNavigation as useNavigationContext } from '../contexts/NavigationContext';
import { useNavigate, useLocation } from 'react-router-dom';

export const useNavigation = () => {
  const navigation = useNavigationContext();
  const navigate = useNavigate();
  const location = useLocation();

  // Enhanced navigation functions
  const goToPage = (path, options = {}) => {
    navigation.navigateWithContext(path, options);
  };

  const goBackTo = (route, options = {}) => {
    navigation.goBack(route);
  };

  const goToDashboard = () => {
    goToPage('/dashboard');
  };

  const goToClients = () => {
    goToPage('/clients');
  };

  const goToProjects = () => {
    goToPage('/projects');
  };

  const goToInvoices = () => {
    goToPage('/invoices');
  };

  const goToAnalytics = () => {
    goToPage('/analytics');
  };

  // Form navigation helpers
  const goToNewClient = (clientId = null) => {
    const path = clientId ? `/clients/new?client=${clientId}` : '/clients/new';
    goToPage(path);
  };

  const goToNewProject = (clientId = null, projectId = null) => {
    let path = '/projects/new';
    const params = new URLSearchParams();
    
    if (clientId) params.append('client', clientId);
    if (projectId) params.append('project', projectId);
    
    if (params.toString()) {
      path += `?${params.toString()}`;
    }
    
    goToPage(path);
  };

  const goToNewInvoice = (clientId = null, projectId = null) => {
    let path = '/invoices/new';
    const params = new URLSearchParams();
    
    if (clientId) params.append('client', clientId);
    if (projectId) params.append('project', projectId);
    
    if (params.toString()) {
      path += `?${params.toString()}`;
    }
    
    goToPage(path);
  };

  // Detail page navigation
  const goToClientDetail = (clientId) => {
    goToPage(`/clients/${clientId}`);
  };

  const goToProjectDetail = (projectId) => {
    goToPage(`/projects/${projectId}`);
  };

  const goToInvoiceDetail = (invoiceId) => {
    goToPage(`/invoices/${invoiceId}`);
  };

  // Edit page navigation
  const goToEditClient = (clientId) => {
    goToPage(`/clients/${clientId}/edit`);
  };

  const goToEditProject = (projectId) => {
    goToPage(`/projects/${projectId}/edit`);
  };

  const goToEditInvoice = (invoiceId) => {
    goToPage(`/invoices/${invoiceId}/edit`);
  };

  // Context preservation helpers
  const preserveScrollPosition = () => {
    const scrollY = window.scrollY;
    navigation.preserveState('scrollPosition', scrollY);
  };

  const restoreScrollPosition = () => {
    const scrollY = navigation.restoreState('scrollPosition', 0);
    if (scrollY > 0) {
      setTimeout(() => {
        window.scrollTo(0, scrollY);
      }, 100);
    }
  };

  const preserveFormState = (formData) => {
    navigation.preserveState('formData', formData);
  };

  const restoreFormState = () => {
    return navigation.restoreState('formData', {});
  };

  const clearFormState = () => {
    navigation.clearPreservedState('formData');
  };

  // Navigation state helpers
  const isCurrentPage = (path) => {
    return location.pathname === path;
  };

  const isParentPage = (path) => {
    return navigation.currentPage?.parent === path;
  };

  const getPageTitle = () => {
    return navigation.currentPage?.title || 'Unknown Page';
  };

  const getBreadcrumbs = () => {
    return navigation.breadcrumbs;
  };

  // Return enhanced navigation object
  return {
    // Core navigation
    ...navigation,
    
    // Enhanced functions
    goToPage,
    goBackTo,
    
    // Quick navigation
    goToDashboard,
    goToClients,
    goToProjects,
    goToInvoices,
    goToAnalytics,
    
    // Form navigation
    goToNewClient,
    goToNewProject,
    goToNewInvoice,
    
    // Detail navigation
    goToClientDetail,
    goToProjectDetail,
    goToInvoiceDetail,
    
    // Edit navigation
    goToEditClient,
    goToEditProject,
    goToEditInvoice,
    
    // Context preservation
    preserveScrollPosition,
    restoreScrollPosition,
    preserveFormState,
    restoreFormState,
    clearFormState,
    
    // State helpers
    isCurrentPage,
    isParentPage,
    getPageTitle,
    getBreadcrumbs,
    
    // Raw navigation
    navigate,
    location
  };
};

export default useNavigation;
