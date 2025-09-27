import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../config/axios';
import toast from 'react-hot-toast';
import { 
  Users, 
  Plus, 
  Search, 
  Eye, 
  Edit, 
  Trash2, 
  Mail,
  Phone,
  Building,
  MoreHorizontal,
  Filter,
  SortAsc,
  SortDesc
} from 'lucide-react';
import Modal from '../components/ui/Modal';

const Clients = () => {
  // Sample data for demonstration
  const sampleClients = [
    {
      id: 1,
      name: 'Lisa Rodriguez',
      company: 'Verde Sustainability Consulting',
      email: 'lisa.rodriguez@verdesustain.com',
      phone: '+1-555-4567',
      status: 'active',
      activeProjects: 3,
      totalRevenue: 15000,
      lastContact: '2024-01-10',
      created_at: '2023-09-19'
    },
    {
      id: 2,
      name: 'Michael Chen',
      company: 'TechFlow Innovations',
      email: 'm.chen@techflow.io',
      phone: '+1-555-7890',
      status: 'active',
      activeProjects: 2,
      totalRevenue: 12000,
      lastContact: '2024-01-08',
      created_at: '2023-09-19'
    },
    {
      id: 3,
      name: 'Sarah Johnson',
      company: 'Johnson Marketing Solutions',
      email: 'sarah@johnsonmarketing.com',
      phone: '+1-555-0123',
      status: 'pending',
      activeProjects: 1,
      totalRevenue: 8000,
      lastContact: '2024-01-05',
      created_at: '2023-09-19'
    },
    {
      id: 4,
      name: 'Ann Smith',
      company: 'Acme Corporation',
      email: 'ann.smith@acmecorp.com',
      phone: '+1-555-123-4567',
      status: 'active',
      activeProjects: 4,
      totalRevenue: 25000,
      lastContact: '2024-01-12',
      created_at: '2023-09-19'
    }
  ];

  const [clients, setClients] = useState(sampleClients);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);

  useEffect(() => {
    setLoading(false);
  }, []);

  const handleDelete = async (client) => {
    if (window.confirm(`Are you sure you want to delete ${client.name}?`)) {
      try {
        await api.delete(`/clients/${client.id}`);
        setClients(clients.filter(c => c.id !== client.id));
        toast.success('Client deleted successfully');
      } catch (error) {
        console.error('Error deleting client:', error);
        toast.error('Failed to delete client');
      }
    }
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const filteredClients = clients
    .filter(client => {
      const matchesSearch = 
        client.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    })
    .sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (sortBy === 'created_at' || sortBy === 'lastContact') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const getStatusBadge = (status) => {
    const styles = {
      active: 'bg-success-100 text-success-700',
      pending: 'bg-warning-100 text-warning-700',
      inactive: 'bg-gray-100 text-gray-700'
    };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}>
        {status}
      </span>
    );
  };

  const getSortIcon = (column) => {
    if (sortBy !== column) {
      return <SortAsc className="w-4 h-4 text-gray-400" />;
    }
    return sortOrder === 'asc' ? 
      <SortAsc className="w-4 h-4 text-gray-600" /> : 
      <SortDesc className="w-4 h-4 text-gray-600" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
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
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Enhanced Cosmic Background with Rich Atmospheric Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-indigo-900/30 to-black/50"></div>
        
        {/* Enhanced Animated Star Field */}
        <div className="absolute inset-0 opacity-35">
          {[...Array(40)].map((_, i) => (
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
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-radial from-purple-500/12 via-blue-500/6 to-transparent rounded-full blur-3xl animate-pulse" style={{animationDuration: '8s'}}></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-radial from-cyan-500/10 via-indigo-500/5 to-transparent rounded-full blur-3xl animate-pulse" style={{animationDuration: '6s', animationDelay: '2s'}}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-radial from-pink-500/6 via-purple-500/3 to-transparent rounded-full blur-2xl animate-pulse" style={{animationDuration: '10s', animationDelay: '4s'}}></div>
        </div>
        
        {/* Floating Celestial Bodies */}
        <div className="absolute top-20 left-20 w-14 h-14 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full shadow-lg shadow-blue-500/15 animate-float">
          <div className="absolute inset-1 rounded-full bg-gradient-to-br from-blue-300/25 to-transparent"></div>
        </div>
        
        <div className="absolute top-40 right-32 w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full shadow-md shadow-purple-500/15 animate-float" style={{animationDelay: '1s'}}>
          <div className="absolute inset-1 rounded-full bg-gradient-to-br from-purple-300/15 to-transparent"></div>
        </div>
        
        <div className="absolute bottom-32 left-1/3 w-6 h-6 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full shadow-sm shadow-emerald-500/15 animate-float" style={{animationDelay: '2s'}}></div>
        
        {/* Animated Meteor Streaks */}
        <div className="absolute top-1/4 right-1/3 w-1 h-14 bg-gradient-to-b from-transparent via-white to-transparent transform rotate-45 opacity-25 animate-pulse" style={{animationDelay: '3s'}}></div>
        <div className="absolute bottom-1/3 left-1/4 w-1 h-10 bg-gradient-to-b from-transparent via-cyan-200 to-transparent transform -rotate-45 opacity-15 animate-pulse" style={{animationDelay: '5s'}}></div>
        
        {/* Enhanced floating particles */}
        <div className="absolute inset-0 opacity-20">
          {[...Array(12)].map((_, i) => (
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

      <div className="max-w-7xl mx-auto p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6 relative">
        {/* Page Header - Electric Orange & Red */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-400/25 via-red-300/20 to-rose-400/15 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500 animate-pulse" style={{animationDuration: '6s'}}></div>
          <div className="relative backdrop-blur-2xl bg-gradient-to-br from-slate-800/45 via-orange-900/40 to-red-900/35 border-2 border-orange-400/60 rounded-2xl p-4 sm:p-6 shadow-2xl shadow-orange-500/30">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white drop-shadow-lg flex items-center gap-2 sm:gap-3">
                  <Users className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-orange-300" />
                  <span className="truncate">Client Galaxy</span>
                </h1>
                <p className="text-orange-200/80 text-sm sm:text-base lg:text-lg mt-2">Navigate your network of professional relationships</p>
              </div>
              <button
                onClick={() => setShowAddModal(true)}
                className="relative group/btn w-full sm:w-auto"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/30 to-red-400/30 rounded-xl blur-sm group-hover/btn:blur-md transition-all duration-300"></div>
                <div className="relative bg-gradient-to-br from-orange-500/50 to-red-400/50 border border-orange-300/60 rounded-xl px-4 sm:px-6 py-2 sm:py-3 flex items-center justify-center gap-2 hover:from-orange-500/60 hover:to-red-400/60 transition-all duration-300 shadow-lg">
                  <Plus className="w-4 h-4 sm:w-5 sm:h-5 text-orange-200" />
                  <span className="font-semibold text-white text-sm sm:text-base">Add New Client</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Search and Filters - Neon Cyan & Electric Blue */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 via-blue-300/15 to-indigo-400/10 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-500 animate-pulse" style={{animationDuration: '7s', animationDelay: '1s'}}></div>
          <div className="relative backdrop-blur-2xl bg-gradient-to-br from-gray-800/40 via-cyan-900/35 to-blue-900/30 border-2 border-cyan-400/50 rounded-2xl p-4 sm:p-6 shadow-2xl shadow-cyan-500/25">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-cyan-300" />
                <input
                  type="text"
                  placeholder="Search clients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-cyan-400/30 rounded-xl text-white placeholder-cyan-200/60 focus:outline-none focus:border-cyan-300/60 focus:bg-slate-800/70 transition-all duration-300"
                />
              </div>
              <div className="flex items-center gap-4">
                <button className="relative group/btn">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/30 to-blue-400/30 rounded-lg blur-sm group-hover/btn:blur-md transition-all duration-300"></div>
                  <div className="relative bg-gradient-to-br from-cyan-500/40 to-blue-400/40 border border-cyan-300/50 rounded-lg px-4 py-2 flex items-center gap-2 hover:from-cyan-500/50 hover:to-blue-400/50 transition-all duration-300 shadow-lg">
                    <Filter className="w-4 h-4 text-cyan-200" />
                    <span className="text-white font-medium">Filters</span>
                  </div>
                </button>
                <div className="text-sm text-cyan-200/80 font-medium">
                  {filteredClients.length} of {clients.length} clients
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Clients Table - Hot Pink & Magenta */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-pink-400/20 via-rose-300/15 to-fuchsia-400/10 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-500 animate-pulse" style={{animationDuration: '8s', animationDelay: '2s'}}></div>
          <div className="relative backdrop-blur-2xl bg-gradient-to-br from-stone-800/40 via-pink-900/35 to-rose-900/30 border-2 border-pink-400/50 rounded-2xl shadow-2xl shadow-pink-500/25">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr className="border-b border-pink-400/20">
                    <th
                      className="cursor-pointer hover:bg-pink-500/10 transition-colors py-3 sm:py-4 px-3 sm:px-6 text-left"
                      onClick={() => handleSort('name')}
                    >
                      <div className="flex items-center gap-1 sm:gap-2">
                        <span className="text-xs sm:text-sm font-bold text-pink-200">Client</span>
                        {getSortIcon('name')}
                      </div>
                    </th>
                    <th
                      className="cursor-pointer hover:bg-pink-500/10 transition-colors py-3 sm:py-4 px-3 sm:px-6 text-left hidden sm:table-cell"
                      onClick={() => handleSort('company')}
                    >
                      <div className="flex items-center gap-1 sm:gap-2">
                        <span className="text-xs sm:text-sm font-bold text-pink-200">Company</span>
                        {getSortIcon('company')}
                      </div>
                    </th>
                    <th className="text-xs sm:text-sm font-bold text-pink-200 py-3 sm:py-4 px-3 sm:px-6 text-left hidden md:table-cell">Contact</th>
                    <th className="text-xs sm:text-sm font-bold text-pink-200 py-3 sm:py-4 px-3 sm:px-6 text-left">Status</th>
                    <th
                      className="cursor-pointer hover:bg-pink-500/10 transition-colors py-3 sm:py-4 px-3 sm:px-6 text-left hidden lg:table-cell"
                      onClick={() => handleSort('activeProjects')}
                    >
                      <div className="flex items-center gap-1 sm:gap-2">
                        <span className="text-xs sm:text-sm font-bold text-pink-200">Projects</span>
                        {getSortIcon('activeProjects')}
                      </div>
                    </th>
                    <th
                      className="cursor-pointer hover:bg-pink-500/10 transition-colors py-3 sm:py-4 px-3 sm:px-6 text-left hidden xl:table-cell"
                      onClick={() => handleSort('totalRevenue')}
                    >
                      <div className="flex items-center gap-1 sm:gap-2">
                        <span className="text-xs sm:text-sm font-bold text-pink-200">Revenue</span>
                        {getSortIcon('totalRevenue')}
                      </div>
                    </th>
                    <th
                      className="cursor-pointer hover:bg-pink-500/10 transition-colors py-3 sm:py-4 px-3 sm:px-6 text-left hidden lg:table-cell"
                      onClick={() => handleSort('lastContact')}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-pink-200">Last Contact</span>
                        {getSortIcon('lastContact')}
                      </div>
                    </th>
                    <th className="text-right text-sm font-bold text-pink-200 py-4 px-6">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredClients.map((client) => (
                    <tr key={client.id} className="hover:bg-pink-500/10 transition-colors border-b border-pink-400/10">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-pink-500/60 to-rose-400/60 rounded-full flex items-center justify-center border border-pink-300/40 shadow-lg">
                            <span className="text-lg font-bold text-white">
                              {client.name?.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="font-bold text-white text-lg">{client.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <Building className="w-4 h-4 text-pink-300" />
                          <span className="text-sm text-pink-200/80">{client.company}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm text-pink-200/80">
                            <Mail className="w-3 h-3 text-pink-300" />
                            <span className="truncate max-w-32">{client.email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-pink-200/60">
                            <Phone className="w-3 h-3 text-pink-300" />
                            <span>{client.phone}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        {getStatusBadge(client.status)}
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-center">
                          <span className="text-xl font-black text-white">{client.activeProjects}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-right">
                          <span className="font-black text-white text-xl">
                            ${client.totalRevenue.toLocaleString()}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-sm text-pink-200/70">
                          {new Date(client.lastContact).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedClient(client)}
                            className="p-2 text-pink-300 hover:text-cyan-300 hover:bg-cyan-500/20 rounded-lg transition-colors"
                            title="View"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <Link
                            to={`/clients/${client.id}/edit`}
                            className="p-2 text-pink-300 hover:text-green-300 hover:bg-green-500/20 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(client)}
                            className="p-2 text-pink-300 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-colors"
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

            {/* Empty State */}
            {filteredClients.length === 0 && (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-pink-300 mx-auto mb-6" />
                <h3 className="text-xl font-bold text-white mb-3">No clients found</h3>
                <p className="text-pink-200/80 mb-8 text-lg">
                  {searchTerm 
                    ? 'Try adjusting your search criteria.' 
                    : 'Get started by adding your first client.'
                  }
                </p>
                {!searchTerm && (
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="relative group/btn"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-pink-500/30 to-rose-400/30 rounded-xl blur-sm group-hover/btn:blur-md transition-all duration-300"></div>
                    <div className="relative bg-gradient-to-br from-pink-500/50 to-rose-400/50 border border-pink-300/60 rounded-xl px-6 py-3 flex items-center gap-2 hover:from-pink-500/60 hover:to-rose-400/60 transition-all duration-300 shadow-lg">
                      <Plus className="w-5 h-5 text-pink-200" />
                      <span className="font-semibold text-white">Add Client</span>
                    </div>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Client Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Client"
        size="lg"
      >
        <form className="space-y-6">
          {/* Basic Information Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold space-text-primary border-b border-white/10 pb-2">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold space-text-primary mb-2">Full Name *</label>
                <input
                  type="text"
                  className="space-input w-full"
                  placeholder="Enter client's full name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold space-text-primary mb-2">Company</label>
                <input
                  type="text"
                  className="space-input w-full"
                  placeholder="Enter company name"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold space-text-primary mb-2">Job Title</label>
                <input
                  type="text"
                  className="space-input w-full"
                  placeholder="e.g., CEO, Marketing Director"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold space-text-primary mb-2">Industry</label>
                <select className="space-input w-full">
                  <option value="">Select industry</option>
                  <option value="technology">Technology</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="finance">Finance</option>
                  <option value="retail">Retail</option>
                  <option value="education">Education</option>
                  <option value="manufacturing">Manufacturing</option>
                  <option value="consulting">Consulting</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Contact Information Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold space-text-primary border-b border-white/10 pb-2">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold space-text-primary mb-2">Email *</label>
                <input
                  type="email"
                  className="space-input w-full"
                  placeholder="Enter email address"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold space-text-primary mb-2">Phone</label>
                <input
                  type="tel"
                  className="space-input w-full"
                  placeholder="Enter phone number"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold space-text-primary mb-2">Website</label>
                <input
                  type="url"
                  className="space-input w-full"
                  placeholder="https://company.com"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold space-text-primary mb-2">LinkedIn</label>
                <input
                  type="url"
                  className="space-input w-full"
                  placeholder="https://linkedin.com/in/username"
                />
              </div>
            </div>
          </div>

          {/* Address Information Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold space-text-primary border-b border-white/10 pb-2">Address Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold space-text-primary mb-2">Street Address</label>
                <input
                  type="text"
                  className="space-input w-full"
                  placeholder="Enter street address"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold space-text-primary mb-2">City</label>
                  <input
                    type="text"
                    className="space-input w-full"
                    placeholder="Enter city"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold space-text-primary mb-2">State/Province</label>
                  <input
                    type="text"
                    className="space-input w-full"
                    placeholder="Enter state/province"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold space-text-primary mb-2">ZIP/Postal Code</label>
                  <input
                    type="text"
                    className="space-input w-full"
                    placeholder="Enter ZIP/postal code"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold space-text-primary mb-2">Country</label>
                <select className="space-input w-full">
                  <option value="">Select country</option>
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="UK">United Kingdom</option>
                  <option value="AU">Australia</option>
                  <option value="DE">Germany</option>
                  <option value="FR">France</option>
                  <option value="JP">Japan</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Business Information Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold space-text-primary border-b border-white/10 pb-2">Business Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold space-text-primary mb-2">Company Size</label>
                <select className="space-input w-full">
                  <option value="">Select company size</option>
                  <option value="1-10">1-10 employees</option>
                  <option value="11-50">11-50 employees</option>
                  <option value="51-200">51-200 employees</option>
                  <option value="201-500">201-500 employees</option>
                  <option value="501-1000">501-1000 employees</option>
                  <option value="1000+">1000+ employees</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold space-text-primary mb-2">Annual Revenue</label>
                <select className="space-input w-full">
                  <option value="">Select revenue range</option>
                  <option value="0-100k">$0 - $100K</option>
                  <option value="100k-500k">$100K - $500K</option>
                  <option value="500k-1m">$500K - $1M</option>
                  <option value="1m-5m">$1M - $5M</option>
                  <option value="5m-10m">$5M - $10M</option>
                  <option value="10m+">$10M+</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold space-text-primary mb-2">Tax ID</label>
                <input
                  type="text"
                  className="space-input w-full"
                  placeholder="Enter tax ID or EIN"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold space-text-primary mb-2">Payment Terms</label>
                <select className="space-input w-full">
                  <option value="15">Net 15</option>
                  <option value="30" selected>Net 30</option>
                  <option value="45">Net 45</option>
                  <option value="60">Net 60</option>
                  <option value="90">Net 90</option>
                  <option value="due_on_receipt">Due on Receipt</option>
                </select>
              </div>
            </div>
          </div>

          {/* Preferences Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold space-text-primary border-b border-white/10 pb-2">Preferences</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold space-text-primary mb-2">Preferred Contact Method</label>
                <select className="space-input w-full">
                  <option value="email" selected>Email</option>
                  <option value="phone">Phone</option>
                  <option value="text">Text Message</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="in_person">In Person</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold space-text-primary mb-2">Best Time to Contact</label>
                <select className="space-input w-full">
                  <option value="">Select best time</option>
                  <option value="morning">Morning (9 AM - 12 PM)</option>
                  <option value="afternoon">Afternoon (12 PM - 5 PM)</option>
                  <option value="evening">Evening (5 PM - 8 PM)</option>
                  <option value="flexible">Flexible</option>
                </select>
              </div>
            </div>
          </div>

          {/* Notes Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold space-text-primary border-b border-white/10 pb-2">Additional Notes</h3>
            <div>
              <label className="block text-sm font-semibold space-text-primary mb-2">Notes</label>
              <textarea
                className="space-input w-full h-24 resize-none"
                placeholder="Add any additional notes about the client..."
              ></textarea>
            </div>
            <div>
              <label className="block text-sm font-semibold space-text-primary mb-2">Tags</label>
              <input
                type="text"
                className="space-input w-full"
                placeholder="Enter tags separated by commas (e.g., VIP, Enterprise, Startup)"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-white/10">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="space-btn-secondary px-6 py-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="space-btn px-6 py-2"
            >
              Add Client
            </button>
          </div>
        </form>
      </Modal>
      
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

export default Clients;