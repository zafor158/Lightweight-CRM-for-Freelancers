import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import api from '../config/axios';
import toast from 'react-hot-toast';
import { getCardClasses, getButtonClasses, getBadgeClasses, getGlowClasses } from '../styles/cosmic-design-system';
import { useNavigation } from '../hooks/useNavigation';
import { BackButton } from '../components/navigation/SmartBackButton';
import Breadcrumb from '../components/navigation/Breadcrumb';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  CreditCard, 
  Calendar, 
  DollarSign, 
  FileText, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  User,
  Building,
  Mail,
  Phone,
  Zap,
  Star,
  Rocket,
  Globe,
  Shield,
  Download,
  Send,
  Eye
} from 'lucide-react';
import { format, parseISO } from 'date-fns';

const InvoiceDetail = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const navigation = useNavigation();

  const fetchInvoice = useCallback(async () => {
    try {
      const response = await api.get(`/invoices/${id}`);
      setInvoice(response.data.invoice);
    } catch (error) {
      console.error('Error fetching invoice:', error);
      toast.error('Failed to fetch invoice details');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchInvoice();
    }
  }, [id, fetchInvoice]);

  useEffect(() => {
    // Handle payment success/failure from URL params
    const paymentStatus = searchParams.get('payment');
    if (paymentStatus === 'success') {
      toast.success('Payment completed successfully!');
      // Refresh invoice data
      if (id) {
        fetchInvoice();
      }
    } else if (paymentStatus === 'cancelled') {
      toast.error('Payment was cancelled');
    }
  }, [searchParams, id, fetchInvoice]);

  const handlePayNow = async () => {
    if (!invoice) return;
    
    setPaymentLoading(true);
    try {
      const response = await api.post('/payments/create-checkout-session', {
        invoiceId: invoice.id,
        amount: parseFloat(invoice.amount)
      });

      // Redirect to Stripe Checkout
      window.location.href = response.data.url;
    } catch (error) {
      console.error('Error creating payment session:', error);
      toast.error('Failed to create payment session');
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!invoice) return;
    
    if (window.confirm('Are you sure you want to delete this invoice? This action cannot be undone.')) {
      try {
        await api.delete(`/invoices/${invoice.id}`);
        toast.success('Invoice deleted successfully');
        // Redirect to invoices list
        window.location.href = '/invoices';
      } catch (error) {
        console.error('Error deleting invoice:', error);
        toast.error('Failed to delete invoice');
      }
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'Draft': { 
        glow: 'from-yellow-400/25 via-orange-300/20 to-amber-400/15',
        bg: 'from-slate-800/45 via-yellow-900/40 to-orange-900/35',
        border: 'border-yellow-400/60',
        shadow: 'shadow-yellow-500/30',
        icon: FileText,
        iconColor: 'text-yellow-300'
      },
      'Sent': { 
        glow: 'from-blue-400/25 via-cyan-300/20 to-indigo-400/15',
        bg: 'from-slate-800/45 via-blue-900/40 to-cyan-900/35',
        border: 'border-blue-400/60',
        shadow: 'shadow-blue-500/30',
        icon: Clock,
        iconColor: 'text-blue-300'
      },
      'Paid': { 
        glow: 'from-green-400/25 via-emerald-300/20 to-teal-400/15',
        bg: 'from-slate-800/45 via-green-900/40 to-emerald-900/35',
        border: 'border-green-400/60',
        shadow: 'shadow-green-500/30',
        icon: CheckCircle,
        iconColor: 'text-green-300'
      },
      'Overdue': { 
        glow: 'from-red-400/25 via-rose-300/20 to-pink-400/15',
        bg: 'from-slate-800/45 via-red-900/40 to-rose-900/35',
        border: 'border-red-400/60',
        shadow: 'shadow-red-500/30',
        icon: AlertCircle,
        iconColor: 'text-red-300'
      }
    };

    const config = statusConfig[status] || statusConfig['Draft'];
    const { glow, bg, border, shadow, icon: Icon, iconColor } = config;

    return (
      <div className="relative group">
        <div className={`absolute inset-0 bg-gradient-to-br ${glow} rounded-lg blur-sm group-hover:blur-md transition-all duration-300`}></div>
        <div className={`relative backdrop-blur-2xl bg-gradient-to-br ${bg} border-2 ${border} rounded-lg px-3 py-1.5 shadow-lg ${shadow} flex items-center gap-1.5`}>
          <Icon size={12} className={iconColor} />
          <span className="text-xs font-semibold text-white uppercase tracking-wide">{status}</span>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        {/* Enhanced Cosmic Background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-indigo-900/30 to-black/50"></div>
          <div className="absolute inset-0 bg-gradient-radial from-purple-600/8 via-transparent to-transparent animate-pulse" style={{animationDuration: '8s'}}></div>
          <div className="absolute inset-0 bg-gradient-radial from-blue-500/6 via-transparent to-transparent animate-pulse" style={{animationDuration: '12s', animationDelay: '2s'}}></div>
          <div className="absolute inset-0 bg-gradient-radial from-magenta-500/5 via-transparent to-transparent animate-pulse" style={{animationDuration: '15s', animationDelay: '4s'}}></div>
        </div>
        <div className="max-w-7xl mx-auto p-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        {/* Enhanced Cosmic Background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-indigo-900/30 to-black/50"></div>
        </div>
        <div className="max-w-7xl mx-auto p-6">
          <div className="text-center py-12">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-red-400/25 via-orange-300/20 to-yellow-400/15 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500 animate-pulse" style={{animationDuration: '6s'}}></div>
              <div className="relative backdrop-blur-2xl bg-gradient-to-br from-stone-800/45 via-red-900/40 to-orange-900/35 border-2 border-red-400/60 rounded-2xl p-8 shadow-2xl shadow-red-500/30">
                <h3 className="text-xl font-bold text-white mb-2">Invoice not found</h3>
                <p className="text-red-200/80 mb-6">The invoice you're looking for doesn't exist.</p>
                <Link to="/invoices" className="relative group/btn">
                  <div className="absolute inset-0 bg-gradient-to-br from-red-500/30 to-orange-400/30 rounded-xl blur-sm group-hover/btn:blur-md transition-all duration-300"></div>
                  <div className="relative bg-gradient-to-br from-red-500/50 to-orange-400/50 border border-red-300/60 rounded-xl px-6 py-3 flex items-center gap-2 hover:from-red-500/60 hover:to-orange-400/60 transition-all duration-300 shadow-lg">
                    <ArrowLeft size={20} className="text-red-200" />
                    <span className="font-semibold text-white">Back to Invoices</span>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Enhanced Cosmic Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-indigo-900/30 to-black/50"></div>
        <div className="absolute inset-0 bg-gradient-radial from-purple-600/8 via-transparent to-transparent animate-pulse" style={{animationDuration: '8s'}}></div>
        <div className="absolute inset-0 bg-gradient-radial from-blue-500/6 via-transparent to-transparent animate-pulse" style={{animationDuration: '12s', animationDelay: '2s'}}></div>
        <div className="absolute inset-0 bg-gradient-radial from-magenta-500/5 via-transparent to-transparent animate-pulse" style={{animationDuration: '15s', animationDelay: '4s'}}></div>
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-cyan-400 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-purple-400 rounded-full animate-pulse" style={{animationDelay: '3s'}}></div>
        <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" style={{animationDelay: '5s'}}></div>
        <div className="absolute top-2/3 right-1/4 w-1 h-1 bg-magenta-400 rounded-full animate-pulse" style={{animationDelay: '7s'}}></div>
      </div>

      <div className="max-w-7xl mx-auto p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6 relative">
        {/* Breadcrumb Navigation */}
        <Breadcrumb />
        
        {/* Header - Unified Primary Theme */}
        <div className="relative group">
          <div className={getGlowClasses('purple', 'medium')} style={{animationDuration: '6s'}}></div>
          <div className={getCardClasses('standard') + ' p-4 sm:p-6'}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <BackButton.Primary 
                  fallbackRoute="/invoices"
                  preserveContext={true}
                />
                <div>
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white drop-shadow-lg flex items-center gap-2 sm:gap-3">
                    <FileText className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-purple-300" />
                    <span className="truncate">{invoice.invoice_number}</span>
                  </h1>
                  <p className="text-purple-200/80 text-sm sm:text-base mt-1">Invoice Details</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                {invoice.status !== 'Paid' && (
                  <>
                    <Link to={`/invoices/${id}/edit`} className={getButtonClasses('secondary', 'md')}>
                      <Edit size={16} />
                      <span>Edit</span>
                    </Link>
                    <button
                      onClick={handlePayNow}
                      disabled={paymentLoading}
                      className={getButtonClasses('success', 'md') + ' disabled:opacity-50'}
                    >
                      <CreditCard size={16} />
                      <span>{paymentLoading ? 'Processing...' : 'Pay Now'}</span>
                    </button>
                  </>
                )}
                <button
                  onClick={handleDelete}
                  className={getButtonClasses('danger', 'md')}
                >
                  <Trash2 size={16} />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
          {/* Left Column - Invoice & Client Info */}
          <div className="xl:col-span-2 space-y-4 sm:space-y-6">
            {/* Invoice Information - Electric Orange & Red */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-400/25 via-red-300/20 to-rose-400/15 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500 animate-pulse" style={{animationDuration: '6s'}}></div>
              <div className="relative backdrop-blur-2xl bg-gradient-to-br from-slate-800/45 via-orange-900/40 to-red-900/35 border-2 border-orange-400/60 rounded-2xl p-4 sm:p-6 shadow-2xl shadow-orange-500/30">
                <div className="flex items-center gap-3 mb-4 sm:mb-6">
                  <div className="p-2 sm:p-3 bg-gradient-to-br from-orange-500/30 to-red-500/30 rounded-xl border border-orange-400/40">
                    <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-orange-300" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white">Invoice Information</h3>
                </div>
                <div className="space-y-4 sm:space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="text-xs sm:text-sm font-semibold text-orange-200/80 uppercase tracking-wide">Invoice Number</label>
                      <p className="mt-1 text-sm sm:text-base text-white font-mono bg-black/20 px-3 py-2 rounded-lg border border-orange-400/30">
                        {invoice.invoice_number}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs sm:text-sm font-semibold text-orange-200/80 uppercase tracking-wide">Status</label>
                      <div className="mt-1">
                        {getStatusBadge(invoice.status)}
                      </div>
                    </div>
                    <div>
                      <label className="text-xs sm:text-sm font-semibold text-orange-200/80 uppercase tracking-wide">Amount</label>
                      <div className="mt-1 flex items-center text-lg sm:text-xl font-bold text-white bg-black/20 px-3 py-2 rounded-lg border border-orange-400/30">
                        <DollarSign size={18} className="mr-2 text-orange-300" />
                        ${parseFloat(invoice.amount).toFixed(2)}
                      </div>
                    </div>
                    <div>
                      <label className="text-xs sm:text-sm font-semibold text-orange-200/80 uppercase tracking-wide">Due Date</label>
                      <div className="mt-1 flex items-center text-sm sm:text-base text-white bg-black/20 px-3 py-2 rounded-lg border border-orange-400/30">
                        <Calendar size={16} className="mr-2 text-orange-300" />
                        {invoice.due_date ? format(parseISO(invoice.due_date), 'MMM dd, yyyy') : 'No due date set'}
                      </div>
                    </div>
                  </div>
                  {invoice.description && (
                    <div>
                      <label className="text-xs sm:text-sm font-semibold text-orange-200/80 uppercase tracking-wide">Description</label>
                      <p className="mt-1 text-sm sm:text-base text-white bg-black/20 p-3 sm:p-4 rounded-lg border border-orange-400/30">
                        {invoice.description}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Client Information - Neon Cyan & Electric Blue */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/25 via-blue-300/20 to-indigo-400/15 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500 animate-pulse" style={{animationDuration: '8s'}}></div>
              <div className="relative backdrop-blur-2xl bg-gradient-to-br from-gray-800/45 via-cyan-900/40 to-blue-900/35 border-2 border-cyan-400/60 rounded-2xl p-4 sm:p-6 shadow-2xl shadow-cyan-500/30">
                <div className="flex items-center gap-3 mb-4 sm:mb-6">
                  <div className="p-2 sm:p-3 bg-gradient-to-br from-cyan-500/30 to-blue-500/30 rounded-xl border border-cyan-400/40">
                    <User className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-300" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white">Client Information</h3>
                </div>
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <h4 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                      <Building className="w-5 h-5 text-cyan-300" />
                      {invoice.client_name}
                    </h4>
                    <div className="mt-2 space-y-2">
                      {invoice.client_email && (
                        <p className="text-sm sm:text-base text-cyan-200/80 flex items-center gap-2">
                          <Mail className="w-4 h-4 text-cyan-300" />
                          {invoice.client_email}
                        </p>
                      )}
                      {invoice.client_phone && (
                        <p className="text-sm sm:text-base text-cyan-200/80 flex items-center gap-2">
                          <Phone className="w-4 h-4 text-cyan-300" />
                          {invoice.client_phone}
                        </p>
                      )}
                      {invoice.client_company && (
                        <p className="text-sm sm:text-base text-cyan-200/80 flex items-center gap-2">
                          <Building className="w-4 h-4 text-cyan-300" />
                          {invoice.client_company}
                        </p>
                      )}
                      {invoice.client_address && (
                        <p className="text-sm sm:text-base text-cyan-200/80 mt-2 bg-black/20 p-3 rounded-lg border border-cyan-400/30">
                          {invoice.client_address}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Project Information - Hot Pink & Magenta */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-400/25 via-rose-300/20 to-fuchsia-400/15 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500 animate-pulse" style={{animationDuration: '10s'}}></div>
              <div className="relative backdrop-blur-2xl bg-gradient-to-br from-stone-800/45 via-pink-900/40 to-rose-900/35 border-2 border-pink-400/60 rounded-2xl p-4 sm:p-6 shadow-2xl shadow-pink-500/30">
                <div className="flex items-center gap-3 mb-4 sm:mb-6">
                  <div className="p-2 sm:p-3 bg-gradient-to-br from-pink-500/30 to-rose-500/30 rounded-xl border border-pink-400/40">
                    <Rocket className="w-5 h-5 sm:w-6 sm:h-6 text-pink-300" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white">Project Information</h3>
                </div>
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <h4 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                      <Star className="w-5 h-5 text-pink-300" />
                      {invoice.project_name}
                    </h4>
                    {invoice.project_description && (
                      <p className="text-sm sm:text-base text-pink-200/80 mt-2 bg-black/20 p-3 rounded-lg border border-pink-400/30">
                        {invoice.project_description}
                      </p>
                    )}
                  </div>
                  <div>
                    <Link to={`/projects/${invoice.project_id}`} className="relative group/btn">
                      <div className="absolute inset-0 bg-gradient-to-br from-pink-500/30 to-rose-400/30 rounded-xl blur-sm group-hover/btn:blur-md transition-all duration-300"></div>
                      <div className="relative bg-gradient-to-br from-pink-500/50 to-rose-400/50 border border-pink-300/60 rounded-xl px-4 py-2 flex items-center gap-2 hover:from-pink-500/60 hover:to-rose-400/60 transition-all duration-300 shadow-lg">
                        <Eye size={16} className="text-pink-200" />
                        <span className="font-semibold text-white text-sm">View Project Details</span>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-4 sm:space-y-6">
            {/* Invoice Stats - Electric Green & Lime */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-green-400/25 via-lime-300/20 to-emerald-400/15 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500 animate-pulse" style={{animationDuration: '7s'}}></div>
              <div className="relative backdrop-blur-2xl bg-gradient-to-br from-neutral-800/45 via-green-900/40 to-lime-900/35 border-2 border-green-400/60 rounded-2xl p-4 sm:p-6 shadow-2xl shadow-green-500/30">
                <div className="flex items-center gap-3 mb-4 sm:mb-6">
                  <div className="p-2 sm:p-3 bg-gradient-to-br from-green-500/30 to-lime-500/30 rounded-xl border border-green-400/40">
                    <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-green-300" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white">Invoice Stats</h3>
                </div>
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-semibold text-green-200/80 uppercase tracking-wide">Created</span>
                    <span className="text-sm sm:text-base font-medium text-white bg-black/20 px-3 py-1 rounded-lg border border-green-400/30">
                      {format(parseISO(invoice.created_at), 'MMM dd, yyyy')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-semibold text-green-200/80 uppercase tracking-wide">Last Updated</span>
                    <span className="text-sm sm:text-base font-medium text-white bg-black/20 px-3 py-1 rounded-lg border border-green-400/30">
                      {format(parseISO(invoice.updated_at), 'MMM dd, yyyy')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-semibold text-green-200/80 uppercase tracking-wide">Status</span>
                    <span className="text-sm sm:text-base font-medium text-white bg-black/20 px-3 py-1 rounded-lg border border-green-400/30">
                      {invoice.status}
                    </span>
                  </div>
                  {invoice.stripe_payment_intent_id && (
                    <div className="flex items-center justify-between">
                      <span className="text-xs sm:text-sm font-semibold text-green-200/80 uppercase tracking-wide">Payment ID</span>
                      <span className="text-xs sm:text-sm font-medium text-white font-mono bg-black/20 px-3 py-1 rounded-lg border border-green-400/30">
                        {invoice.stripe_payment_intent_id.slice(-8)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Payment Section */}
            {invoice.status !== 'Paid' ? (
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/25 via-orange-300/20 to-amber-400/15 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500 animate-pulse" style={{animationDuration: '9s'}}></div>
                <div className="relative backdrop-blur-2xl bg-gradient-to-br from-stone-800/45 via-yellow-900/40 to-orange-900/35 border-2 border-yellow-400/60 rounded-2xl p-4 sm:p-6 shadow-2xl shadow-yellow-500/30">
                  <div className="flex items-center gap-3 mb-4 sm:mb-6">
                    <div className="p-2 sm:p-3 bg-gradient-to-br from-yellow-500/30 to-orange-500/30 rounded-xl border border-yellow-400/40">
                      <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-300" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-white">Payment</h3>
                  </div>
                  <div className="space-y-4 sm:space-y-6">
                    <div className="text-center">
                      <div className="text-2xl sm:text-3xl font-black text-white flex items-center justify-center gap-2">
                        <DollarSign className="w-6 h-6 sm:w-7 sm:h-7 text-yellow-300" />
                        ${parseFloat(invoice.amount).toFixed(2)}
                      </div>
                      <p className="text-sm sm:text-base text-yellow-200/80 mt-1">Amount Due</p>
                    </div>
                    <button
                      onClick={handlePayNow}
                      disabled={paymentLoading}
                      className="relative group/btn w-full"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/30 to-orange-400/30 rounded-xl blur-sm group-hover/btn:blur-md transition-all duration-300"></div>
                      <div className="relative bg-gradient-to-br from-yellow-500/50 to-orange-400/50 border border-yellow-300/60 rounded-xl px-4 py-3 flex items-center justify-center gap-2 hover:from-yellow-500/60 hover:to-orange-400/60 transition-all duration-300 shadow-lg disabled:opacity-50">
                        <CreditCard size={18} className="text-yellow-200" />
                        <span className="font-semibold text-white text-sm sm:text-base">
                          {paymentLoading ? 'Processing...' : 'Pay with Stripe'}
                        </span>
                      </div>
                    </button>
                    <p className="text-xs sm:text-sm text-yellow-200/60 text-center flex items-center justify-center gap-1">
                      <Shield className="w-3 h-3" />
                      Secure payment powered by Stripe
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-green-400/25 via-emerald-300/20 to-teal-400/15 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500 animate-pulse" style={{animationDuration: '11s'}}></div>
                <div className="relative backdrop-blur-2xl bg-gradient-to-br from-slate-800/45 via-green-900/40 to-emerald-900/35 border-2 border-green-400/60 rounded-2xl p-4 sm:p-6 shadow-2xl shadow-green-500/30">
                  <div className="flex items-center gap-3 mb-4 sm:mb-6">
                    <div className="p-2 sm:p-3 bg-gradient-to-br from-green-500/30 to-emerald-500/30 rounded-xl border border-green-400/40">
                      <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-300" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-white">Payment Status</h3>
                  </div>
                  <div className="text-center space-y-4">
                    <CheckCircle className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-green-400 animate-pulse" />
                    <div className="text-lg sm:text-xl font-bold text-white">Payment Received</div>
                    <p className="text-sm sm:text-base text-green-200/80">
                      This invoice has been paid successfully.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetail;
