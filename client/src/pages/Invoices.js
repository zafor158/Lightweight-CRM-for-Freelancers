import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../config/axios';
import toast from 'react-hot-toast';
import { 
  FileText, 
  Plus, 
  Search, 
  Eye, 
  Edit, 
  Trash2, 
  Download,
  User,
  Clock,
  CheckCircle,
  XCircle,
  ArrowUpDown,
  ChevronDown,
  Receipt
} from 'lucide-react';

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const response = await api.get('/invoices');
      setInvoices(response.data.invoices || []);
    } catch (error) {
      console.error('Error fetching invoices:', error);
      toast.error('Failed to fetch invoices');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      try {
        await api.delete(`/invoices/${id}`);
        setInvoices(invoices.filter(invoice => invoice.id !== id));
        toast.success('Invoice deleted successfully');
      } catch (error) {
        console.error('Error deleting invoice:', error);
        toast.error('Failed to delete invoice');
      }
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'Paid': { color: 'badge-success', icon: CheckCircle },
      'Sent': { color: 'badge-warning', icon: Clock },
      'Draft': { color: 'badge-gray', icon: FileText },
      'Overdue': { color: 'badge-error', icon: XCircle },
    };
    
    const config = statusConfig[status] || statusConfig['Draft'];
    const Icon = config.icon;
    
    return (
      <span className={`badge ${config.color} flex items-center`}>
        <Icon className="w-3 h-3 mr-1" />
        {status}
      </span>
    );
  };

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = 
      invoice.invoice_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.project_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  }).sort((a, b) => {
    let aValue, bValue;
    
    switch (sortBy) {
      case 'amount':
        aValue = parseFloat(a.amount);
        bValue = parseFloat(b.amount);
        break;
      case 'due_date':
        aValue = new Date(a.due_date);
        bValue = new Date(b.due_date);
        break;
      case 'created_at':
        aValue = new Date(a.created_at);
        bValue = new Date(b.created_at);
        break;
      default:
        aValue = a[sortBy] || '';
        bValue = b[sortBy] || '';
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  const SortButton = ({ column, children }) => (
    <button
      onClick={() => handleSort(column)}
      className="flex items-center space-x-1 text-left font-medium text-gray-900 hover:text-gray-700 transition-colors"
    >
      <span>{children}</span>
      <ArrowUpDown className="w-4 h-4 text-gray-400" />
    </button>
  );

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="card">
          <div className="card-body">
            <div className="animate-pulse space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Enhanced Cosmic Background with Rich Atmospheric Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-indigo-900/30 to-black/50"></div>
        
        {/* Enhanced Animated Star Field */}
        <div className="absolute inset-0 opacity-38">
          {[...Array(42)].map((_, i) => (
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
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-radial from-purple-500/13 via-blue-500/6 to-transparent rounded-full blur-3xl animate-pulse" style={{animationDuration: '8s'}}></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-radial from-cyan-500/9 via-indigo-500/4 to-transparent rounded-full blur-3xl animate-pulse" style={{animationDuration: '6s', animationDelay: '2s'}}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-radial from-pink-500/6 via-purple-500/3 to-transparent rounded-full blur-2xl animate-pulse" style={{animationDuration: '10s', animationDelay: '4s'}}></div>
        </div>
        
        {/* Floating Celestial Bodies */}
        <div className="absolute top-20 left-20 w-13 h-13 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full shadow-md shadow-blue-500/16 animate-float">
          <div className="absolute inset-1 rounded-full bg-gradient-to-br from-blue-300/24 to-transparent"></div>
        </div>
        
        <div className="absolute top-40 right-32 w-9 h-9 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full shadow-sm shadow-purple-500/16 animate-float" style={{animationDelay: '1s'}}>
          <div className="absolute inset-1 rounded-full bg-gradient-to-br from-purple-300/16 to-transparent"></div>
        </div>
        
        <div className="absolute bottom-32 left-1/3 w-6 h-6 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full shadow-sm shadow-emerald-500/16 animate-float" style={{animationDelay: '2s'}}></div>
        
        {/* Animated Meteor Streaks */}
        <div className="absolute top-1/4 right-1/3 w-1 h-13 bg-gradient-to-b from-transparent via-white to-transparent transform rotate-45 opacity-24 animate-pulse" style={{animationDelay: '3s'}}></div>
        <div className="absolute bottom-1/3 left-1/4 w-1 h-9 bg-gradient-to-b from-transparent via-cyan-200 to-transparent transform -rotate-45 opacity-16 animate-pulse" style={{animationDelay: '5s'}}></div>
        
        {/* Enhanced floating particles */}
        <div className="absolute inset-0 opacity-21">
          {[...Array(14)].map((_, i) => (
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

      <div className="max-w-7xl mx-auto p-6 space-y-6 relative">
        {/* Page Header - Golden Yellow & Orange */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/25 via-orange-300/20 to-amber-400/15 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500 animate-pulse" style={{animationDuration: '6s'}}></div>
          <div className="relative backdrop-blur-2xl bg-gradient-to-br from-stone-800/45 via-yellow-900/40 to-orange-900/35 border-2 border-yellow-400/60 rounded-2xl p-6 shadow-2xl shadow-yellow-500/30">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-black text-white drop-shadow-lg flex items-center gap-3">
                  <FileText className="w-8 h-8 text-yellow-300" />
                  Billing Station
                </h1>
                <p className="text-yellow-200/80 text-lg mt-2">Navigate your financial universe and track payment missions</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  to="/invoices/new"
                  className="relative group/btn"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/30 to-orange-400/30 rounded-xl blur-sm group-hover/btn:blur-md transition-all duration-300"></div>
                  <div className="relative bg-gradient-to-br from-yellow-500/50 to-orange-400/50 border border-yellow-300/60 rounded-xl px-6 py-3 flex items-center gap-2 hover:from-yellow-500/60 hover:to-orange-400/60 transition-all duration-300 shadow-lg">
                    <Plus className="w-5 h-5 text-yellow-200" />
                    <span className="font-semibold text-white">Create Invoice</span>
                  </div>
                </Link>
                
                <Link
                  to="/invoices/generator"
                  className="relative group/btn"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 to-pink-400/30 rounded-xl blur-sm group-hover/btn:blur-md transition-all duration-300"></div>
                  <div className="relative bg-gradient-to-br from-purple-500/50 to-pink-400/50 border border-purple-300/60 rounded-xl px-6 py-3 flex items-center gap-2 hover:from-purple-500/60 hover:to-pink-400/60 transition-all duration-300 shadow-lg">
                    <Receipt className="w-5 h-5 text-purple-200" />
                    <span className="font-semibold text-white">Invoice Generator</span>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Action Bar - Electric Blue & Neon Cyan */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 via-cyan-300/15 to-teal-400/10 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-500 animate-pulse" style={{animationDuration: '7s', animationDelay: '1s'}}></div>
          <div className="relative backdrop-blur-2xl bg-gradient-to-br from-slate-800/40 via-blue-900/35 to-cyan-900/30 border-2 border-blue-400/50 rounded-2xl p-6 shadow-2xl shadow-blue-500/25">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300" size={18} />
                  <input
                    type="text"
                    placeholder="Search invoices..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-3 w-64 bg-slate-800/50 border border-blue-400/30 rounded-xl text-white placeholder-blue-200/60 focus:outline-none focus:border-blue-300/60 focus:bg-slate-800/70 transition-all duration-300 text-sm"
                  />
                </div>
                <div className="relative">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="pr-8 pl-4 py-3 bg-slate-800/50 border border-blue-400/30 rounded-xl text-white focus:outline-none focus:border-blue-300/60 focus:bg-slate-800/70 transition-all duration-300 text-sm"
                  >
                    <option value="all">All Status</option>
                    <option value="Draft">Draft</option>
                    <option value="Sent">Sent</option>
                    <option value="Paid">Paid</option>
                    <option value="Overdue">Overdue</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-300" size={16} />
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button className="relative group/btn">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 to-cyan-400/30 rounded-lg blur-sm group-hover/btn:blur-md transition-all duration-300"></div>
                  <div className="relative bg-gradient-to-br from-blue-500/40 to-cyan-400/40 border border-blue-300/50 rounded-lg px-4 py-2 flex items-center gap-2 hover:from-blue-500/50 hover:to-cyan-400/50 transition-all duration-300 shadow-lg">
                    <Download className="w-4 h-4 text-blue-200" />
                    <span className="text-white font-medium text-sm">Export</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Invoices Table - Hot Pink & Magenta */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-pink-400/20 via-rose-300/15 to-fuchsia-400/10 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-500 animate-pulse" style={{animationDuration: '8s', animationDelay: '2s'}}></div>
          <div className="relative backdrop-blur-2xl bg-gradient-to-br from-stone-800/40 via-pink-900/35 to-rose-900/30 border-2 border-pink-400/50 rounded-2xl shadow-2xl shadow-pink-500/25">
            {filteredInvoices.length === 0 ? (
              <div className="p-12 text-center">
                <FileText className="mx-auto h-16 w-16 text-pink-300 mb-6" />
                <h3 className="text-xl font-bold text-white mb-3">No invoices found</h3>
                <p className="text-pink-200/80 text-lg mb-6">
                  {searchTerm || statusFilter !== 'all' 
                    ? 'Try adjusting your search or filter criteria.' 
                    : 'Get started by creating your first invoice.'
                  }
                </p>
                {!searchTerm && statusFilter === 'all' && (
                  <Link
                    to="/invoices/new"
                    className="relative group/btn"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-pink-500/30 to-rose-400/30 rounded-xl blur-sm group-hover/btn:blur-md transition-all duration-300"></div>
                    <div className="relative bg-gradient-to-br from-pink-500/50 to-rose-400/50 border border-pink-300/60 rounded-xl px-6 py-3 flex items-center gap-2 hover:from-pink-500/60 hover:to-rose-400/60 transition-all duration-300 shadow-lg">
                      <Plus className="w-5 h-5 text-pink-200" />
                      <span className="font-semibold text-white">Create Invoice</span>
                    </div>
                  </Link>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-pink-400/20">
                      <th className="text-sm font-bold text-pink-200 py-4 px-6 text-left">
                        <SortButton column="invoice_number">Invoice #</SortButton>
                      </th>
                      <th className="text-sm font-bold text-pink-200 py-4 px-6 text-left">
                        <SortButton column="status">Status</SortButton>
                      </th>
                      <th className="text-sm font-bold text-pink-200 py-4 px-6 text-left">
                        <SortButton column="client_name">Client</SortButton>
                      </th>
                      <th className="text-sm font-bold text-pink-200 py-4 px-6 text-left">
                        <SortButton column="project_name">Project</SortButton>
                      </th>
                      <th className="text-sm font-bold text-pink-200 py-4 px-6 text-left">
                        <SortButton column="due_date">Due Date</SortButton>
                      </th>
                      <th className="text-sm font-bold text-pink-200 py-4 px-6 text-left">
                        <SortButton column="amount">Amount</SortButton>
                      </th>
                      <th className="text-right text-sm font-bold text-pink-200 py-4 px-6">Actions</th>
                    </tr>
                  </thead>
              <tbody>
                {filteredInvoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-white/5 transition-colors border-b border-white/5">
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-md flex items-center justify-center mr-3">
                          <FileText className="w-4 h-4 text-purple-400" />
                        </div>
                        <div>
                          <div className="font-semibold space-text-primary text-sm">
                            {invoice.invoice_number}
                          </div>
                          <div className="text-xs space-text-muted">
                            {new Date(invoice.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      {getStatusBadge(invoice.status)}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        <div className="w-6 h-6 bg-white/10 rounded-full flex items-center justify-center mr-2">
                          <User className="w-3 h-3 text-gray-400" />
                        </div>
                        <div>
                          <div className="font-semibold space-text-primary text-sm">
                            {invoice.client_name}
                          </div>
                          {invoice.client_company && (
                            <div className="text-xs space-text-muted">
                              {invoice.client_company}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-semibold space-text-primary text-sm">{invoice.project_name}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="space-text-secondary text-sm">
                        {invoice.due_date ? new Date(invoice.due_date).toLocaleDateString() : '-'}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-bold space-text-primary text-sm">
                        ${parseFloat(invoice.amount).toLocaleString()}
                      </div>
                    </td>
                    <td className="text-right py-4 px-6">
                      <div className="flex items-center justify-end space-x-2">
                        <Link
                          to={`/invoices/${invoice.id}`}
                          className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          to={`/invoices/${invoice.id}/edit`}
                          className="p-2 text-gray-400 hover:text-green-400 hover:bg-green-500/20 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(invoice.id)}
                          className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
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
      
      {/* Custom CSS for Enhanced Effects */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(1deg); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .bg-gradient-radial {
          background: radial-gradient(circle, var(--tw-gradient-stops));
        }
      `}</style>
    </div>
  );
};

export default Invoices;