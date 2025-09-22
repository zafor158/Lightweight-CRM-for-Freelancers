import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  FolderOpen, 
  PieChart,
  Activity,
  Target,
  Award,
  CheckCircle,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  RefreshCw
} from 'lucide-react';

const Analytics = () => {
  const [analytics, setAnalytics] = useState({
    revenue: {
      total: 0,
      monthly: [],
      growth: 0
    },
    clients: {
      total: 0,
      new: 0,
      growth: 0
    },
    projects: {
      total: 0,
      completed: 0,
      active: 0,
      overdue: 0
    },
    invoices: {
      total: 0,
      paid: 0,
      pending: 0,
      overdue: 0
    }
  });
  const [timeRange, setTimeRange] = useState('6months');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const [clientsRes, projectsRes, invoicesRes] = await Promise.all([
        axios.get('/api/clients'),
        axios.get('/api/projects'),
        axios.get('/api/invoices')
      ]);

      const clients = clientsRes.data.clients || [];
      const projects = projectsRes.data.projects || [];
      const invoices = invoicesRes.data.invoices || [];

      // Calculate revenue analytics
      const totalRevenue = invoices
        .filter(inv => inv.status === 'Paid')
        .reduce((sum, inv) => sum + parseFloat(inv.amount || 0), 0);

      const monthlyRevenue = calculateMonthlyRevenue(invoices);
      const revenueGrowth = calculateGrowth(monthlyRevenue);

      // Calculate client analytics
      const newClients = clients.filter(client => {
        const createdDate = new Date(client.created_at);
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        return createdDate >= sixMonthsAgo;
      }).length;

      const clientGrowth = clients.length > 0 ? (newClients / clients.length) * 100 : 0;

      // Calculate project analytics
      const completedProjects = projects.filter(p => p.status === 'Completed').length;
      const activeProjects = projects.filter(p => p.status === 'In Progress').length;
      const overdueProjects = projects.filter(p => p.status === 'Overdue').length;

      // Calculate invoice analytics
      const paidInvoices = invoices.filter(inv => inv.status === 'Paid').length;
      const pendingInvoices = invoices.filter(inv => inv.status === 'Sent' || inv.status === 'Draft').length;
      const overdueInvoices = invoices.filter(inv => inv.status === 'Overdue').length;

      setAnalytics({
        revenue: {
          total: totalRevenue,
          monthly: monthlyRevenue,
          growth: revenueGrowth
        },
        clients: {
          total: clients.length,
          new: newClients,
          growth: clientGrowth
        },
        projects: {
          total: projects.length,
          completed: completedProjects,
          active: activeProjects,
          overdue: overdueProjects
        },
        invoices: {
          total: invoices.length,
          paid: paidInvoices,
          pending: pendingInvoices,
          overdue: overdueInvoices
        }
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to fetch analytics data');
    } finally {
      setLoading(false);
    }
  };

  const calculateMonthlyRevenue = (invoices) => {
    const monthly = {};
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    invoices
      .filter(inv => inv.status === 'Paid' && new Date(inv.created_at) >= sixMonthsAgo)
      .forEach(invoice => {
        const month = new Date(invoice.created_at).toISOString().slice(0, 7);
        monthly[month] = (monthly[month] || 0) + parseFloat(invoice.amount || 0);
      });

    return Object.entries(monthly).map(([month, amount]) => ({
      month,
      amount
    })).sort((a, b) => a.month.localeCompare(b.month));
  };

  const calculateGrowth = (monthlyData) => {
    if (monthlyData.length < 2) return 0;
    const latest = monthlyData[monthlyData.length - 1].amount;
    const previous = monthlyData[monthlyData.length - 2].amount;
    return previous > 0 ? ((latest - previous) / previous) * 100 : 0;
  };

  const StatCard = ({ title, value, change, icon: Icon, color, subtitle }) => (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-lg transition-all duration-300">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-600 mb-2">{title}</p>
          <p className="text-3xl font-bold text-slate-900 mb-1">{value}</p>
          {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
          {change !== undefined && (
            <div className={`flex items-center mt-2 text-sm ${
              change >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {change >= 0 ? (
                <ArrowUpRight className="w-4 h-4 mr-1" />
              ) : (
                <ArrowDownRight className="w-4 h-4 mr-1" />
              )}
              <span className="font-medium">{Math.abs(change).toFixed(1)}%</span>
              <span className="text-slate-500 ml-1">vs last period</span>
            </div>
          )}
        </div>
        <div className={`p-4 rounded-2xl ${color}`}>
          <Icon className="w-8 h-8 text-white" />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 -m-6 lg:-m-8 p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 -m-6 lg:-m-8 p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="space-y-2">
            <h1 className="text-4xl lg:text-5xl font-bold text-slate-900">Analytics</h1>
            <p className="text-lg text-slate-600 max-w-2xl">
              Comprehensive insights into your business performance and growth metrics.
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="3months">Last 3 Months</option>
              <option value="6months">Last 6 Months</option>
              <option value="1year">Last Year</option>
            </select>
            <button
              onClick={fetchAnalytics}
              className="p-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 transition-colors"
            >
              <RefreshCw className="w-5 h-5 text-slate-600" />
            </button>
            <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold transition-all duration-300 flex items-center">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Revenue"
            value={`$${analytics.revenue.total.toLocaleString()}`}
            change={analytics.revenue.growth}
            icon={DollarSign}
            color="bg-gradient-to-br from-green-500 to-emerald-600"
            subtitle="All time earnings"
          />
          <StatCard
            title="Total Clients"
            value={analytics.clients.total}
            change={analytics.clients.growth}
            icon={Users}
            color="bg-gradient-to-br from-blue-500 to-indigo-600"
            subtitle={`${analytics.clients.new} new this period`}
          />
          <StatCard
            title="Active Projects"
            value={analytics.projects.active}
            icon={FolderOpen}
            color="bg-gradient-to-br from-purple-500 to-violet-600"
            subtitle={`${analytics.projects.completed} completed`}
          />
          <StatCard
            title="Paid Invoices"
            value={analytics.invoices.paid}
            icon={CheckCircle}
            color="bg-gradient-to-br from-emerald-500 to-green-600"
            subtitle={`${analytics.invoices.pending} pending`}
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Revenue Chart */}
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold text-slate-900">Revenue Trend</h3>
                <p className="text-sm text-slate-600">Monthly revenue over time</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-green-100 to-emerald-200 rounded-xl">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="h-64 flex items-end justify-between space-x-2">
              {analytics.revenue.monthly.map((item, index) => {
                const maxAmount = Math.max(...analytics.revenue.monthly.map(m => m.amount));
                const height = (item.amount / maxAmount) * 100;
                return (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div
                      className="w-full bg-gradient-to-t from-green-500 to-emerald-400 rounded-t-lg transition-all duration-300 hover:from-green-600 hover:to-emerald-500"
                      style={{ height: `${height}%`, minHeight: '20px' }}
                      title={`${item.month}: $${item.amount.toLocaleString()}`}
                    ></div>
                    <span className="text-xs text-slate-500 mt-2 transform -rotate-45 origin-left">
                      {new Date(item.month).toLocaleDateString('en-US', { month: 'short' })}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Project Status Distribution */}
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold text-slate-900">Project Status</h3>
                <p className="text-sm text-slate-600">Distribution of project statuses</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-xl">
                <PieChart className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-blue-500 rounded-full mr-3"></div>
                  <span className="text-sm font-medium text-slate-700">In Progress</span>
                </div>
                <span className="text-sm font-semibold text-slate-900">{analytics.projects.active}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-sm font-medium text-slate-700">Completed</span>
                </div>
                <span className="text-sm font-semibold text-slate-900">{analytics.projects.completed}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-red-500 rounded-full mr-3"></div>
                  <span className="text-sm font-medium text-slate-700">Overdue</span>
                </div>
                <span className="text-sm font-semibold text-slate-900">{analytics.projects.overdue}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Insights */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold text-slate-900">Performance Insights</h3>
              <p className="text-sm text-slate-600">Key metrics and recommendations</p>
            </div>
            <div className="p-3 bg-gradient-to-br from-purple-100 to-violet-200 rounded-xl">
              <Activity className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-semibold text-slate-900 mb-2">Project Completion Rate</h4>
              <p className="text-2xl font-bold text-blue-600">
                {analytics.projects.total > 0 ? Math.round((analytics.projects.completed / analytics.projects.total) * 100) : 0}%
              </p>
              <p className="text-sm text-slate-600 mt-1">Projects completed successfully</p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-semibold text-slate-900 mb-2">Payment Success Rate</h4>
              <p className="text-2xl font-bold text-green-600">
                {analytics.invoices.total > 0 ? Math.round((analytics.invoices.paid / analytics.invoices.total) * 100) : 0}%
              </p>
              <p className="text-sm text-slate-600 mt-1">Invoices paid on time</p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="font-semibold text-slate-900 mb-2">Client Growth</h4>
              <p className="text-2xl font-bold text-purple-600">
                {analytics.clients.new}
              </p>
              <p className="text-sm text-slate-600 mt-1">New clients this period</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
