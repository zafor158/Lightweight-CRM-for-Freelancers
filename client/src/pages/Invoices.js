import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Eye, 
  Edit, 
  Trash2, 
  Download,
  Calendar,
  DollarSign,
  User,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  ArrowUpDown,
  ChevronDown,
  ChevronRight
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
      const response = await axios.get('/api/invoices');
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
        await axios.delete(`/api/invoices/${id}`);
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
    <div className="space-y-4">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Invoices</h1>
          <p className="text-sm text-gray-600">
            Create and manage invoices for your projects.
          </p>
        </div>
        <Link
          to="/invoices/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Invoice
        </Link>
      </div>

      {/* Action Bar */}
      <div className="card compact-card">
        <div className="card-body compact-spacing">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Search invoices..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-input pl-9 pr-3 w-48 text-sm"
                />
              </div>
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="form-select pr-8 text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="Draft">Draft</option>
                  <option value="Sent">Sent</option>
                  <option value="Paid">Paid</option>
                  <option value="Overdue">Overdue</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button className="btn btn-secondary btn-sm">
                <Download className="w-4 h-4 mr-1" />
                Export
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="card compact-card">
        {filteredInvoices.length === 0 ? (
          <div className="card-body text-center py-8">
            <FileText className="mx-auto h-10 w-10 text-gray-400 mb-3" />
            <h3 className="text-base font-medium text-gray-900 mb-2">No invoices found</h3>
            <p className="text-sm text-gray-600 mb-4">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria.' 
                : 'Get started by creating your first invoice.'
              }
            </p>
            {!searchTerm && statusFilter === 'all' && (
              <Link
                to="/invoices/new"
                className="btn btn-primary btn-sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Invoice
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table table-compact">
              <thead>
                <tr>
                  <th>
                    <SortButton column="invoice_number">Invoice #</SortButton>
                  </th>
                  <th>
                    <SortButton column="status">Status</SortButton>
                  </th>
                  <th>
                    <SortButton column="client_name">Client</SortButton>
                  </th>
                  <th>
                    <SortButton column="project_name">Project</SortButton>
                  </th>
                  <th>
                    <SortButton column="due_date">Due Date</SortButton>
                  </th>
                  <th>
                    <SortButton column="amount">Amount</SortButton>
                  </th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.map((invoice) => (
                  <tr key={invoice.id}>
                    <td>
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-primary-100 rounded-md flex items-center justify-center mr-2">
                          <FileText className="w-4 h-4 text-primary-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 text-sm">
                            {invoice.invoice_number}
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(invoice.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      {getStatusBadge(invoice.status)}
                    </td>
                    <td>
                      <div className="flex items-center">
                        <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center mr-2">
                          <User className="w-3 h-3 text-gray-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 text-sm">
                            {invoice.client_name}
                          </div>
                          {invoice.client_company && (
                            <div className="text-xs text-gray-500">
                              {invoice.client_company}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="font-medium text-gray-900 text-sm">{invoice.project_name}</div>
                    </td>
                    <td>
                      <div className="text-gray-900 text-sm">
                        {invoice.due_date ? new Date(invoice.due_date).toLocaleDateString() : '-'}
                      </div>
                    </td>
                    <td>
                      <div className="font-medium text-gray-900 text-sm">
                        ${parseFloat(invoice.amount).toLocaleString()}
                      </div>
                    </td>
                    <td className="text-right">
                      <div className="flex items-center justify-end space-x-1">
                        <Link
                          to={`/invoices/${invoice.id}`}
                          className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-md transition-colors"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          to={`/invoices/${invoice.id}/edit`}
                          className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(invoice.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
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
  );
};

export default Invoices;