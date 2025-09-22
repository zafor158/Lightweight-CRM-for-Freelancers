import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  Users, 
  FolderOpen, 
  FileText, 
  DollarSign, 
  Calendar,
  Clock,
  CheckCircle,
  ArrowUpRight,
  ArrowDownRight,
  Target
} from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalClients: 4,
    totalProjects: 8,
    totalInvoices: 12,
    totalRevenue: 45000,
    paidInvoices: 8,
    pendingInvoices: 3,
    overdueInvoices: 1,
    activeProjects: 5,
    completedProjects: 3
  });
  const [recentActivity, setRecentActivity] = useState([
    { id: 1, type: 'invoice', action: 'Invoice #INV-001 was paid', time: '2 hours ago', icon: CheckCircle, color: 'text-green-600' },
    { id: 2, type: 'project', action: 'Project "Website Redesign" was completed', time: '4 hours ago', icon: Target, color: 'text-blue-600' },
    { id: 3, type: 'client', action: 'New client "Acme Corp" was added', time: '1 day ago', icon: Users, color: 'text-purple-600' },
    { id: 4, type: 'invoice', action: 'Invoice #INV-002 was sent', time: '2 days ago', icon: FileText, color: 'text-orange-600' }
  ]);
  const [upcomingDeadlines, setUpcomingDeadlines] = useState([
    { id: 1, title: 'Project: Mobile App Design', deadline: '2024-01-15', type: 'project', priority: 'high' },
    { id: 2, title: 'Invoice: #INV-003 Payment Due', deadline: '2024-01-18', type: 'invoice', priority: 'medium' },
    { id: 3, title: 'Client Meeting: Acme Corp', deadline: '2024-01-20', type: 'meeting', priority: 'low' }
  ]);
  const [recentClients, setRecentClients] = useState([
    { id: 1, name: 'Lisa Rodriguez', company: 'Verde Sustainability Consulting' },
    { id: 2, name: 'Michael Chen', company: 'TechFlow Innovations' },
    { id: 3, name: 'Sarah Johnson', company: 'Johnson Marketing Solutions' },
    { id: 4, name: 'Ann Smith', company: 'Acme Corporation' }
  ]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Simulate loading
    setLoading(false);
  }, []);

  const StatCard = ({ title, value, change, changeType, icon: Icon, color, trend }) => (
    <div className="group bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 hover:-translate-y-1">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-600 mb-2">{title}</p>
          <p className="text-3xl font-bold text-slate-900 mb-3">{value}</p>
          {change && (
            <div className={`flex items-center text-sm font-medium ${
              changeType === 'increase' ? 'text-emerald-600' : 'text-red-500'
            }`}>
              <div className={`p-1 rounded-full mr-2 ${
                changeType === 'increase' ? 'bg-emerald-100' : 'bg-red-100'
              }`}>
                {changeType === 'increase' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
              </div>
              <span>{change}</span>
            </div>
          )}
        </div>
        <div className={`p-4 rounded-2xl ${color} group-hover:scale-110 transition-transform duration-300`}>
          <Icon size={24} className="text-white" />
        </div>
      </div>
    </div>
  );

  const ProgressCircle = ({ percentage, size = 120, strokeWidth = 8, color = "indigo" }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    const colorClasses = {
      indigo: "stroke-indigo-600",
      green: "stroke-green-600",
      blue: "stroke-blue-600",
      purple: "stroke-purple-600"
    };

    return (
      <div className="relative inline-flex items-center justify-center">
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            className="text-gray-200"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            className={`${colorClasses[color]} transition-all duration-1000 ease-in-out`}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-gray-900">{percentage}%</span>
        </div>
      </div>
    );
  };

  const MiniChart = ({ data, color = "indigo" }) => {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min;
    
    const colorClasses = {
      indigo: "stroke-indigo-600 fill-indigo-50",
      green: "stroke-green-600 fill-green-50",
      blue: "stroke-blue-600 fill-blue-50",
      purple: "stroke-purple-600 fill-purple-50"
    };

    return (
      <div className="w-full h-16">
        <svg viewBox="0 0 100 40" className="w-full h-full">
          <polyline
            points={data.map((value, index) => 
              `${(index / (data.length - 1)) * 100},${40 - ((value - min) / range) * 30}`
            ).join(' ')}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className={colorClasses[color]}
          />
        </svg>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 rounded-2xl p-8 text-white shadow-2xl">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">Welcome back! 👋</h1>
              <p className="text-blue-100 text-lg">Here's what's happening with your business today.</p>
              <div className="flex items-center space-x-4 mt-4">
                <div className="flex items-center space-x-2 bg-white/20 rounded-lg px-3 py-2">
                  <Calendar size={16} />
                  <span className="text-sm">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/20 rounded-lg px-3 py-2">
                  <Clock size={16} />
                  <span className="text-sm">{new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                  <div className="text-2xl font-bold">{stats.totalClients}</div>
                  <div className="text-blue-200 text-sm">Active Clients</div>
                </div>
                <div className="text-center bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                  <div className="text-2xl font-bold">{stats.activeProjects}</div>
                  <div className="text-blue-200 text-sm">Active Projects</div>
                </div>
                <div className="text-center bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                  <div className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</div>
                  <div className="text-blue-200 text-sm">Total Revenue</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Clients"
          value={stats.totalClients}
          change="+12%"
          changeType="increase"
          icon={Users}
          color="bg-gradient-to-br from-blue-500 to-blue-600"
        />
        <StatCard
          title="Active Projects"
          value={stats.activeProjects}
          change="+8%"
          changeType="increase"
          icon={FolderOpen}
          color="bg-gradient-to-br from-purple-500 to-purple-600"
        />
        <StatCard
          title="Total Revenue"
          value={`$${stats.totalRevenue.toLocaleString()}`}
          change="+23%"
          changeType="increase"
          icon={DollarSign}
          color="bg-gradient-to-br from-emerald-500 to-emerald-600"
        />
        <StatCard
          title="Paid Invoices"
          value={stats.paidInvoices}
          change="+5%"
          changeType="increase"
          icon={CheckCircle}
          color="bg-gradient-to-br from-orange-500 to-orange-600"
        />
      </div>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">Revenue Overview</h3>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-slate-600">Monthly Revenue</span>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="h-48">
              <MiniChart 
                data={[12000, 15000, 18000, 22000, 19000, 25000, 28000]} 
                color="indigo" 
              />
            </div>
            <div className="mt-4 grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-slate-900">$28K</div>
                <div className="text-sm text-slate-600">This Month</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">$22K</div>
                <div className="text-sm text-slate-600">Last Month</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-emerald-600">+27%</div>
                <div className="text-sm text-slate-600">Growth</div>
              </div>
            </div>
          </div>
        </div>

        {/* Project Progress */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="p-6 border-b border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900">Project Progress</h3>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              <div className="text-center">
                <ProgressCircle percentage={75} color="indigo" size={120} />
                <p className="text-sm text-slate-600 mt-3 font-medium">Overall Completion</p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <span className="text-sm font-medium text-slate-700">Active Projects</span>
                  <span className="text-lg font-bold text-slate-900">{stats.activeProjects}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <span className="text-sm font-medium text-slate-700">Completed</span>
                  <span className="text-lg font-bold text-slate-900">{stats.completedProjects}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
                  <span className="text-sm font-medium text-slate-700">Success Rate</span>
                  <span className="text-lg font-bold text-emerald-600">92%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="p-6 border-b border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900">Recent Activity</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 p-3 hover:bg-slate-50 rounded-lg transition-colors duration-200">
                  <div className={`p-2 rounded-lg ${activity.color.replace('text-', 'bg-').replace('-600', '-100')}`}>
                    <activity.icon size={16} className={activity.color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900">{activity.action}</p>
                    <p className="text-xs text-slate-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Upcoming Deadlines */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="p-6 border-b border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900">Upcoming Deadlines</h3>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {upcomingDeadlines.map((deadline) => (
                <div key={deadline.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors duration-200">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-900">{deadline.title}</p>
                    <p className="text-xs text-slate-500 mt-1">{new Date(deadline.deadline).toLocaleDateString()}</p>
                  </div>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                    deadline.priority === 'high' ? 'bg-red-100 text-red-700' :
                    deadline.priority === 'medium' ? 'bg-amber-100 text-amber-700' :
                    'bg-emerald-100 text-emerald-700'
                  }`}>
                    {deadline.priority}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Clients */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="p-6 border-b border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900">Recent Clients</h3>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {recentClients.map((client) => (
                <div key={client.id} className="flex items-center space-x-3 p-3 hover:bg-slate-50 rounded-lg transition-colors duration-200">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-white">
                      {client.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900">{client.name}</p>
                    <p className="text-xs text-slate-500">{client.company}</p>
                  </div>
                  <Link
                    to={`/clients/${client.id}`}
                    className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                  >
                    <Eye size={16} />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">Quick Actions</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              to="/clients/new"
              className="group flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-300 rounded-2xl hover:border-emerald-500 hover:bg-emerald-50 transition-all duration-300 hover:scale-105"
            >
              <div className="p-4 bg-emerald-100 rounded-2xl mb-4 group-hover:bg-emerald-200 transition-colors duration-300">
                <Users size={28} className="text-emerald-600" />
              </div>
              <p className="text-sm font-semibold text-slate-700 group-hover:text-emerald-700">Add New Client</p>
              <p className="text-xs text-slate-500 mt-1">Manage your client relationships</p>
            </Link>
            <Link
              to="/projects/new"
              className="group flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-300 rounded-2xl hover:border-purple-500 hover:bg-purple-50 transition-all duration-300 hover:scale-105"
            >
              <div className="p-4 bg-purple-100 rounded-2xl mb-4 group-hover:bg-purple-200 transition-colors duration-300">
                <FolderOpen size={28} className="text-purple-600" />
              </div>
              <p className="text-sm font-semibold text-slate-700 group-hover:text-purple-700">Create Project</p>
              <p className="text-xs text-slate-500 mt-1">Start a new project</p>
            </Link>
            <Link
              to="/invoices/new"
              className="group flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-300 rounded-2xl hover:border-orange-500 hover:bg-orange-50 transition-all duration-300 hover:scale-105"
            >
              <div className="p-4 bg-orange-100 rounded-2xl mb-4 group-hover:bg-orange-200 transition-colors duration-300">
                <FileText size={28} className="text-orange-600" />
              </div>
              <p className="text-sm font-semibold text-slate-700 group-hover:text-orange-700">Generate Invoice</p>
              <p className="text-xs text-slate-500 mt-1">Create and send invoices</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;