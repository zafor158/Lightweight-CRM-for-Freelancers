import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  Users, 
  Plus, 
  Search, 
  Eye, 
  Edit, 
  Trash2, 
  Building,
  Mail,
  Phone,
  ChevronDown,
  ArrowUpDown,
  ChevronUp
} from 'lucide-react';

const Clients = () => {
  // Sample data for demonstration
  const sampleClients = [
    {
      id: 1,
      company: 'Verde Sustainability Consulting',
      email: 'lisa.rodriguez@verdesustain.com',
      phone: '+1-555-4567',
      added: '9/19/2025',
      created_at: '2025-09-19'
    },
    {
      id: 2,
      company: 'TechFlow Innovations',
      email: 'm.chen@techflow.io',
      phone: '+1-555-7890',
      added: '9/19/2025',
      created_at: '2025-09-19'
    },
    {
      id: 3,
      company: 'Johnson Marketing Solutions',
      email: 'sarah@johnsonmarketing.com',
      phone: '+1-555-0123',
      added: '9/19/2025',
      created_at: '2025-09-19'
    },
    {
      id: 4,
      company: 'Acme Corporation',
      email: 'ann.smith@acmecorp.com',
      phone: '+1-555-123-4567',
      added: '9/19/2025',
      created_at: '2025-09-19'
    }
  ];

  const [clients, setClients] = useState(sampleClients);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('company');
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    // Simulate loading
    setLoading(false);
  }, []);


  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      try {
        await axios.delete(`/api/clients/${id}`);
        setClients(clients.filter(client => client.id !== id));
        toast.success('Client deleted successfully');
      } catch (error) {
        console.error('Error deleting client:', error);
        toast.error('Failed to delete client');
      }
    }
  };

  const filteredClients = clients.filter(client => {
    const matchesSearch = 
      client.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  }).sort((a, b) => {
    let aValue, bValue;
    
    switch (sortBy) {
      case 'company':
        aValue = a.company?.toLowerCase() || '';
        bValue = b.company?.toLowerCase() || '';
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
      {sortBy === column ? (
        sortOrder === 'asc' ? (
          <ChevronUp className="w-4 h-4 text-gray-400" />
        ) : (
          <ChevronDownIcon className="w-4 h-4 text-gray-400" />
        )
      ) : (
        <ArrowUpDown className="w-4 h-4 text-gray-400" />
      )}
    </button>
  );

  if (loading) {
    return (
      <div className="space-y-6">
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
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Clients</h1>
        </div>
        <Link
          to="/clients/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center shadow-sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Client
        </Link>
      </div>

      {/* Search and Summary */}
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-lg">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search clients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="text-sm text-gray-600 font-medium">
          {filteredClients.length} of {clients.length} clients
        </div>
      </div>

      {/* Clients Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
        {filteredClients.length === 0 ? (
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No clients found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm 
                ? 'Try adjusting your search criteria.' 
                : 'Get started by adding your first client.'
              }
            </p>
            {!searchTerm && (
              <Link
                to="/clients/new"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors inline-flex items-center shadow-sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Client
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <SortButton column="company">Company</SortButton>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <SortButton column="created_at">Added</SortButton>
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredClients.map((client) => (
                  <tr key={client.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Building className="w-4 h-4 mr-3 text-gray-400" />
                        <div className="text-sm font-medium text-gray-900">
                          {client.company}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-gray-900">
                          <Mail className="w-3 h-3 mr-2 text-gray-400" />
                          {client.email}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Phone className="w-3 h-3 mr-2 text-gray-400" />
                          {client.phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {client.added}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center space-x-3">
                        <Link
                          to={`/clients/${client.id}`}
                          className="text-gray-400 hover:text-blue-600 transition-colors p-1 rounded"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          to={`/clients/${client.id}/edit`}
                          className="text-gray-400 hover:text-green-600 transition-colors p-1 rounded"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(client.id)}
                          className="text-gray-400 hover:text-red-600 transition-colors p-1 rounded"
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

export default Clients;