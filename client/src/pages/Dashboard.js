import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  FolderOpen,
  FileText,
  DollarSign,
  Calendar,
  Clock,
  CheckCircle,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  Plus,
  Zap,
  Star,
  Rocket
} from 'lucide-react';
import AnimatedCounter from '../components/ui/AnimatedCounter';
import StatusBadge from '../components/ui/StatusBadge';
import { getCardClasses, getButtonClasses, getGlowClasses } from '../styles/cosmic-design-system';
import OnboardingModal from '../components/ui/OnboardingModal';
import Skeleton from '../components/ui/Skeleton';

const Dashboard = () => {
  const [stats] = useState({
    activeClients: 12,
    projectsInProgress: 8,
    outstandingRevenue: 45000,
  });
  const [upcomingDeadlines] = useState([
    { id: 1, projectName: 'Website Redesign', client: 'Acme Corp', dueDate: '2024-07-20', priority: 'high', daysLeft: 5 },
    { id: 2, projectName: 'Mobile App Development', client: 'Innovate LLC', dueDate: '2024-07-25', priority: 'medium', daysLeft: 10 },
    { id: 3, projectName: 'SEO Strategy', client: 'Global Marketing', dueDate: '2024-08-01', priority: 'low', daysLeft: 17 },
  ]);
  const [recentInvoices] = useState([
    { id: 1, invoiceNumber: '#INV-001', client: 'Acme Corp', amount: 2500, status: 'paid', date: '2024-07-10' },
    { id: 2, invoiceNumber: '#INV-002', client: 'Innovate LLC', amount: 1200, status: 'sent', date: '2024-07-08' },
    { id: 3, invoiceNumber: '#INV-003', client: 'Global Marketing', amount: 800, status: 'overdue', date: '2024-06-30' },
  ]);
  const [loading, setLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      const onboardingCompleted = localStorage.getItem('onboarding_completed');
      if (!onboardingCompleted) {
        setShowOnboarding(true);
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'paid':
        return <StatusBadge status="success">Paid</StatusBadge>;
      case 'sent':
        return <StatusBadge status="info">Sent</StatusBadge>;
      case 'overdue':
        return <StatusBadge status="error">Overdue</StatusBadge>;
      default:
        return <StatusBadge status="gray">Draft</StatusBadge>;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto p-3 space-y-4">
          <div className="animate-pulse">
            <Skeleton className="h-8 w-1/4 mb-2 bg-gray-800" />
            <Skeleton className="h-4 w-1/2 bg-gray-800" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-card p-4">
                <div className="animate-pulse space-y-2">
                  <Skeleton className="h-4 w-1/2 bg-gray-800" />
                  <Skeleton className="h-8 w-3/4 bg-gray-800" />
                  <Skeleton className="h-4 w-1/3 bg-gray-800" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Enhanced Cosmic Background with Rich Atmospheric Effects */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Primary Nebula Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-indigo-900/30 to-black/50"></div>
        
        {/* Enhanced Animated Star Field */}
        <div className="absolute inset-0 opacity-40">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            />
          ))}
        </div>
        
        {/* Large Nebula Effects */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-radial from-purple-500/15 via-blue-500/8 to-transparent rounded-full blur-3xl animate-pulse" style={{animationDuration: '8s'}}></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-radial from-cyan-500/12 via-indigo-500/6 to-transparent rounded-full blur-3xl animate-pulse" style={{animationDuration: '6s', animationDelay: '2s'}}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-radial from-pink-500/8 via-purple-500/4 to-transparent rounded-full blur-2xl animate-pulse" style={{animationDuration: '10s', animationDelay: '4s'}}></div>
        </div>
        
        {/* Floating Celestial Bodies */}
        <div className="absolute top-20 left-20 w-16 h-16 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full shadow-xl shadow-blue-500/20 animate-float">
          <div className="absolute inset-1 rounded-full bg-gradient-to-br from-blue-300/30 to-transparent"></div>
        </div>
        
        <div className="absolute top-40 right-32 w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full shadow-lg shadow-purple-500/20 animate-float" style={{animationDelay: '1s'}}>
          <div className="absolute inset-1 rounded-full bg-gradient-to-br from-purple-300/20 to-transparent"></div>
        </div>
        
        <div className="absolute bottom-32 left-1/3 w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full shadow-md shadow-emerald-500/20 animate-float" style={{animationDelay: '2s'}}></div>
        
        {/* Animated Meteor Streaks */}
        <div className="absolute top-1/4 right-1/3 w-1 h-16 bg-gradient-to-b from-transparent via-white to-transparent transform rotate-45 opacity-30 animate-pulse" style={{animationDelay: '3s'}}></div>
        <div className="absolute bottom-1/3 left-1/4 w-1 h-12 bg-gradient-to-b from-transparent via-cyan-200 to-transparent transform -rotate-45 opacity-20 animate-pulse" style={{animationDelay: '5s'}}></div>
        
        {/* Enhanced floating particles */}
        <div className="absolute inset-0 opacity-25">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-cyan-400 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold space-text-primary mb-2">
              Welcome to the <span className="space-text-accent">Universe</span>
            </h1>
            <p className="space-text-secondary text-sm sm:text-base">Explore your business galaxy and discover new opportunities</p>
          </div>
          <Link
            to="/projects/new"
            className="space-btn flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base w-full sm:w-auto"
          >
            <Rocket className="w-4 h-4" />
            <span className="truncate">Launch New Project</span>
          </Link>
        </div>

        {/* Key Metrics - Vibrant & Distinct Color Schemes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Active Clients Card - Unified Info Theme */}
          <div className="relative group">
            <div className={getGlowClasses('blue', 'medium')} style={{animationDuration: '3s'}}></div>
            <div className={getCardClasses('info') + ' p-4 sm:p-6'}>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                <div className="flex-1">
                  <p className="text-blue-200 text-xs sm:text-sm mb-1 font-semibold tracking-wide">Active Clients</p>
                  <p className="text-2xl sm:text-3xl lg:text-4xl font-black text-white drop-shadow-lg">
                    <AnimatedCounter end={stats.activeClients} />
                  </p>
                  <div className="flex items-center mt-2 text-xs sm:text-sm text-green-300 font-medium">
                    <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-green-400" />
                    <span className="truncate">+12% from last month</span>
                  </div>
                </div>
                <div className="p-3 sm:p-4 bg-gradient-to-br from-blue-500/40 to-blue-400/40 rounded-2xl border border-blue-300/50 shadow-lg self-start sm:self-auto">
                  <Users className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-blue-200" />
                </div>
              </div>
            </div>
          </div>

          {/* Projects Card - Unified Primary Theme */}
          <div className="relative group">
            <div className={getGlowClasses('purple', 'medium')} style={{animationDuration: '4s', animationDelay: '0.5s'}}></div>
            <div className={getCardClasses('standard') + ' p-4 sm:p-6'}>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                <div className="flex-1">
                  <p className="text-purple-200 text-xs sm:text-sm mb-1 font-semibold tracking-wide">Projects In Progress</p>
                  <p className="text-2xl sm:text-3xl lg:text-4xl font-black text-white drop-shadow-lg">
                    <AnimatedCounter end={stats.projectsInProgress} />
                  </p>
                  <div className="flex items-center mt-2 text-xs sm:text-sm text-orange-300 font-medium">
                    <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-orange-400" />
                    <span className="truncate">8 active missions</span>
                  </div>
                </div>
                <div className="p-3 sm:p-4 bg-gradient-to-br from-purple-500/40 to-purple-400/40 rounded-2xl border border-purple-300/50 shadow-lg self-start sm:self-auto">
                  <FolderOpen className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-purple-200" />
                </div>
              </div>
            </div>
          </div>

          {/* Revenue Card - Unified Warning Theme */}
          <div className="relative group">
            <div className={getGlowClasses('orange', 'medium')} style={{animationDuration: '5s', animationDelay: '1s'}}></div>
            <div className={getCardClasses('warning') + ' p-4 sm:p-6'}>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                <div className="flex-1">
                  <p className="text-orange-200 text-xs sm:text-sm mb-1 font-semibold tracking-wide">Outstanding Revenue</p>
                  <p className="text-2xl sm:text-3xl lg:text-4xl font-black text-white drop-shadow-lg">
                    $<AnimatedCounter end={stats.outstandingRevenue} />
                  </p>
                  <div className="flex items-center mt-2 text-xs sm:text-sm text-red-300 font-medium">
                    <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-red-400" />
                    <span className="truncate">3 overdue invoices</span>
                  </div>
                </div>
                <div className="p-3 sm:p-4 bg-gradient-to-br from-orange-500/40 to-orange-400/40 rounded-2xl border border-orange-300/50 shadow-lg self-start sm:self-auto">
                  <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-orange-200" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid - Vibrant & Distinct Color Schemes */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
          {/* Mission Deadlines - Unified Primary Theme */}
          <div className="lg:col-span-2 relative group">
            <div className={getGlowClasses('purple', 'medium')} style={{animationDuration: '6s', animationDelay: '1.5s'}}></div>
            <div className={getCardClasses('standard')}>
              <div className="p-6 border-b border-purple-400/30">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Star className="w-6 h-6 text-purple-300" />
                    Mission Deadlines
                  </h2>
                  <Link
                    to="/projects"
                    className="text-sm text-purple-300 hover:text-fuchsia-300 font-semibold flex items-center gap-1 transition-colors"
                  >
                    View all
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
              <div className="p-0">
                <div className="divide-y divide-purple-400/15">
                  {upcomingDeadlines.map((deadline) => (
                    <div key={deadline.id} className="p-6 hover:bg-purple-500/10 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-bold text-white text-lg">{deadline.projectName}</h3>
                          <p className="text-purple-200/80 text-sm">{deadline.client}</p>
                          <div className="flex items-center mt-2 text-sm text-purple-300/90">
                            <Calendar className="w-4 h-4 mr-2" />
                            <span>Due {new Date(deadline.dueDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <p className={`text-sm font-semibold ${getPriorityColor(deadline.priority)}`}>
                              {deadline.daysLeft} days left
                            </p>
                            <p className="text-xs text-purple-200/70 capitalize">{deadline.priority} priority</p>
                          </div>
                          <div className={`w-3 h-3 rounded-full ${
                            deadline.priority === 'high' ? 'bg-red-500' :
                            deadline.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                          }`} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Recent Invoices - Unified Success Theme */}
          <div className="lg:col-span-1 relative group">
            <div className={getGlowClasses('green', 'medium')} style={{animationDuration: '7s', animationDelay: '2s'}}></div>
            <div className={getCardClasses('success')}>
              <div className="p-6 border-b border-green-400/30">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Zap className="w-6 h-6 text-green-300" />
                    Recent Invoices
                  </h2>
                  <Link
                    to="/invoices"
                    className="text-sm text-green-300 hover:text-lime-300 font-semibold flex items-center gap-1 transition-colors"
                  >
                    View all
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
              <div className="p-0">
                <div className="divide-y divide-green-400/15">
                  {recentInvoices.map((invoice) => (
                    <div key={invoice.id} className="p-6 hover:bg-green-500/10 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-white">{invoice.invoiceNumber}</h3>
                        {getStatusBadge(invoice.status)}
                      </div>
                      <p className="text-green-200/80 text-sm mb-3">{invoice.client}</p>
                      <div className="flex items-center justify-between">
                        <span className="font-black text-white text-lg">
                          ${invoice.amount.toLocaleString()}
                        </span>
                        <span className="text-sm text-green-200/70">
                          {new Date(invoice.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions - Vibrant & Distinct Color Schemes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Add Client - Unified Warning Theme */}
          <Link
            to="/clients/new"
            className="relative group cursor-pointer"
          >
            <div className={getGlowClasses('orange', 'medium')} style={{animationDuration: '8s', animationDelay: '2.5s'}}></div>
            <div className={getCardClasses('warning') + ' p-6'}>
              <div className="flex items-center gap-4">
                <div className="p-4 bg-gradient-to-br from-orange-500/50 to-orange-400/50 rounded-2xl border border-orange-300/60 group-hover:from-orange-500/60 group-hover:to-orange-400/60 transition-all shadow-lg">
                  <Users className="w-7 h-7 text-orange-200" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">Add New Client</h3>
                  <p className="text-orange-200/80 text-sm">Expand your network</p>
                </div>
              </div>
            </div>
          </Link>

          {/* Create Invoice - Unified Info Theme */}
          <Link
            to="/invoices/new"
            className="relative group cursor-pointer"
          >
            <div className={getGlowClasses('blue', 'medium')} style={{animationDuration: '9s', animationDelay: '3s'}}></div>
            <div className={getCardClasses('info') + ' p-6'}>
              <div className="flex items-center gap-4">
                <div className="p-4 bg-gradient-to-br from-blue-500/50 to-blue-400/50 rounded-2xl border border-blue-300/60 group-hover:from-blue-500/60 group-hover:to-blue-400/60 transition-all shadow-lg">
                  <FileText className="w-7 h-7 text-blue-200" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">Create Invoice</h3>
                  <p className="text-blue-200/80 text-sm">Generate revenue</p>
                </div>
              </div>
            </div>
          </Link>

          {/* View Analytics - Unified Success Theme */}
          <Link
            to="/analytics"
            className="relative group cursor-pointer"
          >
            <div className={getGlowClasses('green', 'medium')} style={{animationDuration: '10s', animationDelay: '3.5s'}}></div>
            <div className={getCardClasses('success') + ' p-6'}>
              <div className="flex items-center gap-4">
                <div className="p-4 bg-gradient-to-br from-green-500/50 to-green-400/50 rounded-2xl border border-green-300/60 group-hover:from-green-500/60 group-hover:to-green-400/60 transition-all shadow-lg">
                  <TrendingUp className="w-7 h-7 text-green-200" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">View Analytics</h3>
                  <p className="text-green-200/80 text-sm">Track performance</p>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Onboarding Modal */}
      <OnboardingModal
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
      />

      {/* Custom CSS for Enhanced Effects */}
      <style jsx>{`
        .bg-gradient-radial {
          background: radial-gradient(circle, var(--tw-gradient-stops));
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(1deg); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        /* Enhanced glassmorphism effects */
        .backdrop-blur-xl {
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
        }
        
        /* Subtle glow animations */
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(139, 92, 246, 0.1); }
          50% { box-shadow: 0 0 30px rgba(139, 92, 246, 0.2); }
        }
        
        .animate-glow {
          animation: glow 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;