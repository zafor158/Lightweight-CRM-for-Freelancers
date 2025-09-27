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
  Bell,
  BarChart3,
  CreditCard,
  Zap
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
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-black flex">
      {/* Space Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Stars */}
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: `radial-gradient(1px 1px at 20px 30px, #eee, transparent),
                           radial-gradient(1px 1px at 40px 70px, rgba(255,255,255,0.8), transparent),
                           radial-gradient(1px 1px at 90px 40px, #fff, transparent),
                           radial-gradient(1px 1px at 130px 80px, rgba(255,255,255,0.6), transparent)`,
          backgroundRepeat: 'repeat',
          backgroundSize: '200px 100px'
        }}></div>
        
        {/* Nebula Effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-radial from-purple-500/5 via-transparent to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-radial from-blue-500/5 via-transparent to-transparent rounded-full blur-3xl"></div>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-70 backdrop-blur-sm lg:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Fixed Left Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 sm:w-72 transform transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full bg-black/40 backdrop-blur-xl border-r border-white/10 lg:rounded-l-none lg:rounded-r-2xl shadow-2xl">
          {/* Logo Section */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-white/10 bg-gradient-to-r from-purple-600 to-blue-600">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center shadow-lg">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-lg font-bold text-white">FreelancePro</span>
                <p className="text-xs text-white/80">Professional CRM</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200"
            >
              <X size={18} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              const hasSubItems = item.subItems && item.subItems.length > 0;
              
              return (
                <div key={item.name} className="space-y-1">
                      <Link
                        to={item.href}
                        onClick={() => setSidebarOpen(false)}
                        className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                          active
                            ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/25'
                            : 'text-gray-300 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        <div className={`p-1.5 rounded-md mr-2 transition-all duration-300 ${
                          active
                            ? 'bg-white/20'
                            : 'bg-white/5 group-hover:bg-white/10'
                        }`}>
                          <Icon size={16} className={active ? 'text-white' : 'text-gray-300'} />
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-sm">{item.name}</div>
                          <div className={`text-xs ${
                            active ? 'text-white/80' : 'text-gray-400'
                          }`}>
                            {item.description}
                          </div>
                        </div>
                        {hasSubItems && (
                          <ChevronDown size={14} className={`transition-transform duration-200 ${
                            active ? 'text-white' : 'text-gray-400'
                          }`} />
                        )}
                      </Link>
                  
                  {/* Sub-navigation items */}
                  {hasSubItems && (
                    <div className="ml-5 mt-1 space-y-1">
                      {item.subItems.map((subItem) => {
                        const subActive = isActive(subItem.href);
                        return (
                              <Link
                                key={subItem.name}
                                to={subItem.href}
                                onClick={() => setSidebarOpen(false)}
                                className={`flex items-center px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 ${
                                  subActive
                                    ? 'bg-purple-500/20 text-purple-300 border-l-2 border-purple-500'
                                    : 'text-gray-400 hover:bg-white/5 hover:text-gray-300'
                                }`}
                              >
                                <div className="w-1 h-1 bg-gray-400 rounded-full mr-2"></div>
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
              <div className="border-t border-white/10 p-2 bg-black/20">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                    <User size={16} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-semibold text-white">
                      {user?.name || 'User'}
                    </div>
                    <div className="text-xs text-gray-400">
                      {user?.email || 'user@example.com'}
                    </div>
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="flex items-center w-full px-3 py-2 text-xs font-medium text-gray-300 hover:bg-red-500/20 hover:text-red-400 rounded-lg transition-all duration-200 group"
                >
                  <div className="p-1 rounded-md mr-2 bg-white/5 group-hover:bg-red-500/20 transition-colors">
                    <LogOut size={14} className="text-gray-400 group-hover:text-red-400" />
                  </div>
                  Sign Out
                </button>
              </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-0 lg:main-content-width">
          {/* Top Header Bar */}
          <header className="bg-black/40 backdrop-blur-xl border-b border-white/10 px-3 py-2 sm:px-4 lg:pl-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 sm:space-x-3">
                {/* Mobile menu button */}
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-1.5 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <Menu size={18} />
                </button>

                {/* Breadcrumb */}
                <div className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm text-gray-300">
                  <Home size={12} className="sm:w-3.5 sm:h-3.5" />
                  <span className="hidden sm:inline">/</span>
                  <span className="font-medium text-white text-xs sm:text-sm truncate">
                    {navigation.find(item => isActive(item.href))?.name || 'Dashboard'}
                  </span>
                </div>
              </div>

              {/* Header Actions */}
              <div className="flex items-center space-x-1 sm:space-x-2">
                <button className="p-1.5 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors">
                  <Bell size={16} className="sm:w-4.5 sm:h-4.5" />
                </button>
                <button className="p-1.5 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors">
                  <Settings size={16} className="sm:w-4.5 sm:h-4.5" />
                </button>
              </div>
            </div>
          </header>

        {/* Page content */}
        <main className="flex-1 overflow-x-hidden">
          <div className="p-2 sm:p-3 lg:p-4 lg:pl-4">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;