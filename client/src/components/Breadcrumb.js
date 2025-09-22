import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const Breadcrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);

  const getBreadcrumbName = (pathname) => {
    const nameMap = {
      'dashboard': 'Dashboard',
      'clients': 'Clients',
      'projects': 'Projects',
      'invoices': 'Invoices',
      'profile': 'Profile',
      'new': 'New',
      'edit': 'Edit'
    };
    return nameMap[pathname] || pathname.charAt(0).toUpperCase() + pathname.slice(1);
  };

  const getBreadcrumbIcon = (pathname) => {
    const iconMap = {
      'dashboard': '📊',
      'clients': '👥',
      'projects': '📁',
      'invoices': '📄',
      'profile': '👤'
    };
    return iconMap[pathname] || '📋';
  };

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6" aria-label="Breadcrumb">
      <Link 
        to="/dashboard" 
        className="flex items-center text-gray-500 hover:text-gray-700 transition-colors"
        aria-label="Home"
      >
        <Home size={16} className="mr-1" />
        Home
      </Link>
      
      {pathnames.map((pathname, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        
        return (
          <React.Fragment key={pathname}>
            <ChevronRight size={16} className="text-gray-400" />
            {isLast ? (
              <span className="flex items-center text-gray-900 font-medium">
                <span className="mr-1">{getBreadcrumbIcon(pathname)}</span>
                {getBreadcrumbName(pathname)}
              </span>
            ) : (
              <Link 
                to={routeTo} 
                className="flex items-center text-gray-500 hover:text-gray-700 transition-colors"
              >
                <span className="mr-1">{getBreadcrumbIcon(pathname)}</span>
                {getBreadcrumbName(pathname)}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default Breadcrumb;
