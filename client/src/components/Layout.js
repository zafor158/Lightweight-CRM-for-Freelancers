import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Home, 
  Users, 
  FolderOpen, 
  FileText, 
  User, 
  Menu, 
  X,
  LogOut,
  Settings,
  ChevronDown,
  Bell
} from 'lucide-react';

const Layout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { 
      name: 'Dashboard', 
      href: '/dashboard', 
      icon: Home,
      description: 'Overview & Analytics'
    },
    { 
      name: 'Clients', 
      href: '/clients', 
      icon: Users,
      description: 'Client Management',
      subItems: [
        { name: 'All Clients', href: '/clients' },
        { name: 'Add Client', href: '/clients/new' }
      ]
    },
    { 
      name: 'Projects', 
      href: '/projects', 
      icon: FolderOpen,
      description: 'Project Tracking'
    },
    { 
      name: 'Invoices', 
      href: '/invoices', 
      icon: FileText,
      description: 'Billing & Payments',
      subItems: [
        { name: 'All Invoices', href: '/invoices' },
        { name: 'Create Invoice', href: '/invoices/new' }
      ]
    },
    { 
      name: 'Analytics', 
      href: '/analytics', 
      icon: BarChart3,
      description: 'Reports & Insights'
    },
    { 
      name: 'Payments', 
      href: '/payments', 
      icon: CreditCard,
      description: 'Payment Processing'
    }
  ];

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 backdrop-blur-sm lg:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Fixed Left Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 transform transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full bg-white shadow-2xl border-r border-slate-200">
          {/* Logo Section */}
          <div className="flex items-center justify-between h-20 px-6 border-b border-slate-200 bg-gradient-to-r from-blue-600 to-indigo-600">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
                <div className="w-6 h-6 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Zap className="w-4 h-4 text-white" />
                </div>
              </div>
              <div>
                <span className="text-xl font-bold text-white">FreelancePro</span>
                <p className="text-xs text-blue-100">Professional CRM</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-lg text-blue-100 hover:text-white hover:bg-blue-700 transition-all duration-200"
            >
              <X size={18} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              const hasSubItems = item.subItems && item.subItems.length > 0;
              
              return (
                <div key={item.name} className="space-y-1">
                  <Link
                    to={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 ${
                      active
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <div className={`p-2 rounded-lg mr-3 transition-all duration-300 ${
                      active 
                        ? 'bg-white/20' 
                        : 'bg-slate-100 group-hover:bg-slate-200'
                    }`}>
                      <Icon size={18} className={active ? 'text-white' : 'text-slate-600'} />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold">{item.name}</div>
                      <div className={`text-xs ${
                        active ? 'text-blue-100' : 'text-slate-400'
                      }`}>
                        {item.description}
                      </div>
                    </div>
                    {hasSubItems && (
                      <ChevronDown size={16} className={`transition-transform duration-200 ${
                        active ? 'text-white' : 'text-slate-400'
                      }`} />
                    )}
                  </Link>
                  
                  {/* Sub-navigation items */}
                  {hasSubItems && (
                    <div className="ml-6 mt-1 space-y-1">
                      {item.subItems.map((subItem) => {
                        const subActive = isActive(subItem.href);
                        return (
                          <Link
                            key={subItem.name}
                            to={subItem.href}
                            onClick={() => setSidebarOpen(false)}
                            className={`flex items-center px-4 py-2 text-xs font-medium rounded-lg transition-all duration-200 ${
                              subActive
                                ? 'bg-blue-50 text-blue-700 border-l-2 border-blue-600'
                                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                            }`}
                          >
                            <div className="w-1.5 h-1.5 bg-slate-300 rounded-full mr-3"></div>
                            {subItem.name}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* User Profile & Sign Out Section */}
          <div className="border-t border-slate-200 p-4 bg-slate-50">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                <User size={20} className="text-white" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-slate-900">
                  {user?.name || 'User'}
                </div>
                <div className="text-xs text-slate-500">
                  {user?.email || 'user@example.com'}
                </div>
              </div>
            </div>
            <button
              onClick={logout}
              className="flex items-center w-full px-4 py-3 text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all duration-200 group"
            >
              <div className="p-1.5 rounded-lg mr-3 bg-slate-100 group-hover:bg-red-100 transition-colors">
                <LogOut size={16} className="text-slate-600 group-hover:text-red-600" />
              </div>
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-72">
        {/* Top Header Bar */}
        <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Mobile menu button */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              >
                <Menu size={20} />
              </button>
              
              {/* Breadcrumb */}
              <div className="flex items-center space-x-2 text-sm text-slate-600">
                <Home size={16} />
                <span>/</span>
                <span className="font-medium text-slate-900">
                  {navigation.find(item => isActive(item.href))?.name || 'Dashboard'}
                </span>
              </div>
            </div>
            
            {/* Header Actions */}
            <div className="flex items-center space-x-3">
              <button className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors">
                <Bell size={20} />
              </button>
              <button className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors">
                <Settings size={20} />
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1">
          <div className="p-6 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;