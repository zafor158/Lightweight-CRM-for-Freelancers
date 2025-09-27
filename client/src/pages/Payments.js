import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../config/axios';
import toast from 'react-hot-toast';
import { 
  CreditCard, 
  DollarSign, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  XCircle,
  TrendingUp,
  TrendingDown,
  Calendar,
  User,
  FileText,
  Eye,
  Download,
  RefreshCw,
  Search,
  ChevronDown,
  Settings,
  Shield,
  Zap
} from 'lucide-react';

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchPaymentsData();
  }, []);

  const fetchPaymentsData = async () => {
    try {
      setLoading(true);
      const [invoicesRes] = await Promise.all([
        api.get('/invoices')
      ]);

      const invoicesData = invoicesRes.data.invoices || [];
      
      // Simulate payment data (in a real app, this would come from Stripe or your payment processor)
      const mockPayments = invoicesData
        .filter(inv => inv.status === 'Paid')
        .map(invoice => ({
          id: `pay_${invoice.id}`,
          invoice_id: invoice.id,
          invoice_number: invoice.invoice_number,
          amount: invoice.amount,
          status: 'completed',
          payment_method: 'card',
          created_at: invoice.updated_at,
          client_name: invoice.client_name || 'Unknown Client',
          description: `Payment for ${invoice.invoice_number}`
        }));

      setPayments(mockPayments);
    } catch (error) {
      console.error('Error fetching payments data:', error);
      toast.error('Failed to fetch payments data');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'completed': { class: 'bg-green-100 text-green-800', icon: CheckCircle },
      'pending': { class: 'bg-yellow-100 text-yellow-800', icon: Clock },
      'failed': { class: 'bg-red-100 text-red-800', icon: XCircle },
      'refunded': { class: 'bg-gray-100 text-gray-800', icon: AlertCircle },
    };

    const config = statusConfig[status] || statusConfig['pending'];
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${config.class}`}>
        <Icon className="w-3 h-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case 'card':
        return <CreditCard className="w-4 h-4" />;
      case 'bank_transfer':
        return <DollarSign className="w-4 h-4" />;
      default:
        return <CreditCard className="w-4 h-4" />;
    }
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.invoice_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.client_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const sortedPayments = [...filteredPayments].sort((a, b) => {
    const aValue = a.created_at;
    const bValue = b.created_at;
    return aValue < bValue ? 1 : -1;
  });

  const paymentStats = {
    total: payments.length,
    completed: payments.filter(p => p.status === 'completed').length,
    pending: payments.filter(p => p.status === 'pending').length,
    failed: payments.filter(p => p.status === 'failed').length,
    totalAmount: payments.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0),
    completedAmount: payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + parseFloat(p.amount || 0), 0)
  };

  const StatCard = ({ title, value, change, icon: Icon, color, subtitle }) => (
    <div className="space-card p-6 hover:shadow-lg transition-all duration-300">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium space-text-secondary mb-2">{title}</p>
          <p className="text-3xl font-bold space-text-primary mb-1">{value}</p>
          {subtitle && <p className="text-xs space-text-muted">{subtitle}</p>}
          {change !== undefined && (
            <div className={`flex items-center mt-2 text-sm ${
              change >= 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {change >= 0 ? (
                <TrendingUp className="w-4 h-4 mr-1" />
              ) : (
                <TrendingDown className="w-4 h-4 mr-1" />
              )}
              <span className="font-medium">{Math.abs(change).toFixed(1)}%</span>
              <span className="space-text-muted ml-1">vs last month</span>
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
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="space-y-2">
            <h1 className="text-4xl lg:text-5xl font-bold space-text-primary">Payment Center</h1>
            <p className="text-lg space-text-secondary max-w-2xl">
              Monitor and manage all payment transmissions across the galaxy.
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={fetchPaymentsData}
              className="p-2 rounded-xl space-btn-secondary"
            >
              <RefreshCw className="w-5 h-5 text-gray-300" />
            </button>
            <button className="space-btn-secondary flex items-center">
              <Settings className="w-4 h-4 mr-2" />
              Payment Settings
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Payments"
            value={paymentStats.total}
            icon={CreditCard}
            color="bg-gradient-to-br from-blue-500 to-indigo-600"
            subtitle="All time transactions"
          />
          <StatCard
            title="Completed"
            value={paymentStats.completed}
            icon={CheckCircle}
            color="bg-gradient-to-br from-green-500 to-emerald-600"
            subtitle={`${paymentStats.total > 0 ? Math.round((paymentStats.completed / paymentStats.total) * 100) : 0}% success rate`}
          />
          <StatCard
            title="Total Amount"
            value={`$${paymentStats.totalAmount.toLocaleString()}`}
            icon={DollarSign}
            color="bg-gradient-to-br from-purple-500 to-violet-600"
            subtitle="All time revenue"
          />
          <StatCard
            title="Pending"
            value={paymentStats.pending}
            icon={Clock}
            color="bg-gradient-to-br from-yellow-500 to-orange-600"
            subtitle="Awaiting processing"
          />
        </div>

        {/* Payment Methods Overview */}
        <div className="space-card p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold space-text-primary">Payment Methods</h3>
              <p className="text-sm space-text-secondary">Supported transmission options</p>
            </div>
            <div className="p-3 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-xl">
              <Shield className="w-6 h-6 text-blue-400" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center p-4 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-xl border border-white/10">
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mr-4">
                <CreditCard className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h4 className="font-semibold space-text-primary">Credit Cards</h4>
                <p className="text-sm space-text-secondary">Visa, Mastercard, Amex</p>
              </div>
            </div>
            <div className="flex items-center p-4 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl border border-white/10">
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mr-4">
                <Zap className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <h4 className="font-semibold space-text-primary">Instant Payments</h4>
                <p className="text-sm space-text-secondary">Real-time processing</p>
              </div>
            </div>
            <div className="flex items-center p-4 bg-gradient-to-br from-purple-500/10 to-violet-500/10 rounded-xl border border-white/10">
              <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mr-4">
                <Shield className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h4 className="font-semibold space-text-primary">Secure Processing</h4>
                <p className="text-sm space-text-secondary">PCI compliant</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="space-card p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search payments by invoice number or client..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="space-input w-full pl-12 pr-4 py-4 text-sm"
                />
              </div>
              <div className="relative w-full sm:w-48">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="space-input w-full appearance-none pl-4 pr-10 py-4 text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                  <option value="refunded">Refunded</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-sm space-text-secondary">
                {filteredPayments.length} of {payments.length} payments
              </span>
            </div>
          </div>
        </div>

        {/* Payments Table */}
        <div className="space-card overflow-hidden">
          {sortedPayments.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-gradient-to-br from-gray-500/20 to-gray-600/20 rounded-full flex items-center justify-center mx-auto mb-8">
                <CreditCard className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-semibold space-text-primary mb-3">No payments found</h3>
              <p className="space-text-secondary mb-10 max-w-lg mx-auto text-lg">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filter criteria to find payments.' 
                  : 'Payments will appear here once clients start paying invoices.'
                }
              </p>
              {!searchTerm && statusFilter === 'all' && (
                <Link
                  to="/invoices"
                  className="space-btn inline-flex items-center px-8 py-4 text-lg font-semibold"
                >
                  <FileText className="w-6 h-6 mr-3" />
                  View Invoices
                </Link>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-white/10">
                <thead className="bg-black/20">
                  <tr>
                    <th className="px-8 py-6 text-left text-xs font-semibold space-text-primary uppercase tracking-wider">
                      Payment Details
                    </th>
                    <th className="px-6 py-6 text-left text-xs font-semibold space-text-primary uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-6 text-left text-xs font-semibold space-text-primary uppercase tracking-wider">
                      Client
                    </th>
                    <th className="px-6 py-6 text-left text-xs font-semibold space-text-primary uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-6 text-left text-xs font-semibold space-text-primary uppercase tracking-wider">
                      Method
                    </th>
                    <th className="px-6 py-6 text-left text-xs font-semibold space-text-primary uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-8 py-6 text-right text-xs font-semibold space-text-primary uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-black/20 divide-y divide-white/10">
                  {sortedPayments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-white/5 transition-colors duration-200 group">
                      <td className="px-8 py-6 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-14 h-14 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-2xl flex items-center justify-center mr-5 group-hover:scale-105 transition-transform duration-200">
                            <CreditCard className="w-7 h-7 text-green-400" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-base font-semibold space-text-primary mb-1">
                              {payment.invoice_number}
                            </div>
                            <div className="text-sm space-text-muted truncate max-w-sm">
                              {payment.description}
                            </div>
                            <div className="flex items-center mt-2">
                              <Calendar className="w-4 h-4 text-gray-400 mr-1" />
                              <span className="text-xs space-text-muted">
                                {new Date(payment.created_at).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6 whitespace-nowrap">
                        {getStatusBadge(payment.status)}
                      </td>
                      <td className="px-6 py-6 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-gradient-to-br from-white/10 to-white/20 rounded-full flex items-center justify-center mr-4">
                            <User className="w-6 h-6 text-gray-400" />
                          </div>
                          <div>
                            <div className="text-sm font-semibold space-text-primary">
                              {payment.client_name}
                            </div>
                            <div className="text-xs space-text-muted">
                              Client
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6 whitespace-nowrap">
                        <div className="text-lg font-bold space-text-primary">
                          ${parseFloat(payment.amount || 0).toLocaleString()}
                        </div>
                        <div className="text-xs space-text-muted">
                          Payment amount
                        </div>
                      </td>
                      <td className="px-6 py-6 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="p-2 bg-white/10 rounded-lg mr-3">
                            {getPaymentMethodIcon(payment.payment_method)}
                          </div>
                          <div>
                            <div className="text-sm font-semibold space-text-primary capitalize">
                              {payment.payment_method.replace('_', ' ')}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6 whitespace-nowrap">
                        <div className="text-sm font-medium space-text-primary">
                          {new Date(payment.created_at).toLocaleDateString()}
                        </div>
                        <div className="text-xs space-text-muted">
                          {new Date(payment.created_at).toLocaleTimeString()}
                        </div>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <Link
                            to={`/invoices/${payment.invoice_id}`}
                            className="p-3 text-gray-400 hover:text-blue-400 hover:bg-blue-500/20 rounded-xl transition-all duration-200 group"
                            title="View Invoice"
                          >
                            <Eye className="w-5 h-5" />
                          </Link>
                          <button
                            className="p-3 text-gray-400 hover:text-green-400 hover:bg-green-500/20 rounded-xl transition-all duration-200 group"
                            title="Download Receipt"
                          >
                            <Download className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Payments;
