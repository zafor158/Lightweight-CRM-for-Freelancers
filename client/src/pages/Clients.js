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
  SortDesc,
  Grid3X3,
  List,
  Globe
} from 'lucide-react';
import Modal from '../components/ui/Modal';

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [hasAnyProjects, setHasAnyProjects] = useState(true);
  const [hasAnyRevenue, setHasAnyRevenue] = useState(true);
  const [selectedClient, setSelectedClient] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'
  const [addingClient, setAddingClient] = useState(false);
  const [newClientData, setNewClientData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    address: '',
    notes: '',
    website: '',
    tax_id: '',
    payment_terms: 30,
    preferred_contact_method: 'email',
    country: ''
  });

  useEffect(() => {
    fetchClients();
  }, []);

  // Auto-refresh client aggregates after payments/invoices/projects update
  useEffect(() => {
    const refresh = () => fetchClients();
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') fetchClients();
    };
    window.addEventListener('paymentCompleted', refresh);
    window.addEventListener('paymentsUpdated', refresh);
    window.addEventListener('invoiceUpdated', refresh);
    window.addEventListener('invoiceDeleted', refresh);
    window.addEventListener('focus', refresh);
    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      window.removeEventListener('paymentCompleted', refresh);
      window.removeEventListener('paymentsUpdated', refresh);
      window.removeEventListener('invoiceUpdated', refresh);
      window.removeEventListener('invoiceDeleted', refresh);
      window.removeEventListener('focus', refresh);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  // Load stats for selected client (from server /clients/:id/stats)
  useEffect(() => {
    const loadStats = async () => {
      if (!selectedClient) return;
      try {
        setStatsLoading(true);
        const res = await api.get(`/clients/${selectedClient.id}/stats`);
        if (res.data) {
          setSelectedClient(prev => prev ? ({
            ...prev,
            totalProjects: res.data.projectCount,
            activeProjects: res.data.activeProjects,
            totalRevenue: res.data.totalRevenue
          }) : prev);
        }
      } catch (e) {
        // silent fail – keep UI responsive
      } finally {
        setStatsLoading(false);
      }
    };
    loadStats();
  }, [selectedClient?.id]);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const response = await api.get('/clients');
      const list = response.data.clients || [];
      // Normalize/derive helpful fields
      const normalized = list.map(c => ({
        ...c,
        // total projects we received from backend aggregation
        totalProjects: Number(c.projectCount || c.activeProjects || 0),
        activeProjects: Number(c.activeProjects || 0),
        totalRevenue: typeof c.totalRevenue === 'number' ? c.totalRevenue : parseFloat(c.totalRevenue || 0),
        // Fallback status derivation if missing
        status: c.status || (Number(c.activeProjects || 0) > 0 ? 'active' : (Number(c.projectCount || 0) > 0 ? 'inactive' : 'new'))
      }));
      setClients(normalized);
      // Keep selection in sync
      if (selectedClient) {
        const updated = normalized.find(c => c.id === selectedClient.id);
        if (updated) setSelectedClient(updated);
      }
      // Always show the columns (explicit request to show exact values)
      setHasAnyProjects(true);
      setHasAnyRevenue(true);
    } catch (error) {
      console.error('Error fetching clients:', error);
      toast.error('Failed to load clients');
    } finally {
      setLoading(false);
    }
  };

  const handleNewClientChange = (e) => {
    const { name, value } = e.target;
    setNewClientData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddClient = async (e) => {
    e.preventDefault();
    setAddingClient(true);

    try {
      await api.post('/clients', newClientData);
      toast.success('Client added successfully');
      setShowAddModal(false);
      setNewClientData({
        name: '',
        email: '',
        phone: '',
        company: '',
        address: '',
        notes: '',
        website: '',
        tax_id: '',
        payment_terms: 30,
        preferred_contact_method: 'email',
        country: ''
      });
      fetchClients(); // Refresh the clients list
    } catch (error) {
      console.error('Error adding client:', error);
      toast.error('Failed to add client');
    } finally {
      setAddingClient(false);
    }
  };

  const handleDelete = async (client) => {
    if (window.confirm(`Are you sure you want to delete ${client.name}?`)) {
      try {
        await api.delete(`/clients/${client.id}`);
        toast.success('Client deleted successfully');
        fetchClients();
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
    .filter(client => 
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (client.company && client.company.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (client.email && client.email.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      if (sortBy === 'name' || sortBy === 'company' || sortBy === 'email') {
        aValue = aValue?.toLowerCase() || '';
        bValue = bValue?.toLowerCase() || '';
      }

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  // Status display removed by request

  const renderGridView = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
      {filteredClients.map((client) => (
        <div key={client.id} className="relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-pink-400/10 via-rose-300/5 to-fuchsia-400/5 rounded-xl blur-sm group-hover:blur-md transition-all duration-300"></div>
          <div className="relative backdrop-blur-sm bg-gradient-to-br from-stone-800/60 via-pink-900/40 to-rose-900/30 border border-pink-400/30 rounded-xl p-4 sm:p-6 hover:border-pink-400/50 transition-all duration-300">
            {/* Client Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white truncate">{client.name}</h3>
                {client.company && (
                  <p className="text-pink-200/80 text-sm truncate flex items-center gap-1">
                    <Building className="w-3 h-3" />
                    {client.company}
                  </p>
                )}
              </div>
              {/* Status badge removed by request */}
            </div>

            {/* Contact Info */}
            <div className="space-y-2 mb-4">
              {client.email && (
                <div className="flex items-center gap-2 text-pink-200/80 text-sm">
                  <Mail className="w-3 h-3" />
                  <span className="truncate">{client.email}</span>
                </div>
              )}
              {client.phone && (
                <div className="flex items-center gap-2 text-pink-200/80 text-sm">
                  <Phone className="w-3 h-3" />
                  <span>{client.phone}</span>
                </div>
              )}
              {client.country && (
                <div className="flex items-center gap-2 text-pink-200/80 text-sm">
                  <Globe className="w-3 h-3" />
                  <span>{client.country}</span>
                </div>
              )}
            </div>

            {/* Stats removed by request */}

            {/* Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-pink-400/20">
              <div className="flex items-center gap-2">
                <Link
                  to={`/clients/${client.id}`}
                  className="p-2 text-pink-300 hover:text-cyan-300 hover:bg-cyan-500/20 rounded-lg transition-colors"
                  title="View"
                >
                  <Eye className="w-4 h-4" />
                </Link>
                <Link
                  to={`/clients/${client.id}/edit`}
                  className="p-2 text-pink-300 hover:text-yellow-300 hover:bg-yellow-500/20 rounded-lg transition-colors"
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
              <div className="text-xs text-pink-200/60">
                {client.lastContact ? new Date(client.lastContact).toLocaleDateString() : 'N/A'}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderTableView = () => (
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
                <th
                  className="cursor-pointer hover:bg-pink-500/10 transition-colors py-3 sm:py-4 px-3 sm:px-6 text-left hidden lg:table-cell"
                  onClick={() => handleSort('country')}
                >
                  <div className="flex items-center gap-1 sm:gap-2">
                    <span className="text-xs sm:text-sm font-bold text-pink-200">Country</span>
                    {getSortIcon('country')}
                  </div>
                </th>
                <th className="text-xs sm:text-sm font-bold text-pink-200 py-3 sm:py-4 px-3 sm:px-6 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.map((client) => (
                <tr
                  key={client.id}
                  className={`border-b border-pink-400/10 hover:bg-pink-500/5 transition-colors cursor-pointer ${selectedClient?.id === client.id ? 'bg-pink-500/10' : ''}`}
                  onClick={() => setSelectedClient(client)}
                  title="Click to view insights"
                >
                  <td className="py-3 sm:py-4 px-3 sm:px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base">
                        {client.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold text-white text-sm sm:text-base">{client.name}</div>
                        {client.email && (
                          <div className="text-pink-200/70 text-xs sm:text-sm hidden sm:block">{client.email}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 sm:py-4 px-3 sm:px-6 hidden sm:table-cell">
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4 text-pink-300" />
                      <span className="text-pink-200 text-sm">{client.company || 'N/A'}</span>
                    </div>
                  </td>
                  <td className="py-3 sm:py-4 px-3 sm:px-6 hidden md:table-cell">
                    <div className="space-y-1">
                      {client.email && (
                        <div className="flex items-center gap-2 text-pink-200/80 text-sm">
                          <Mail className="w-3 h-3" />
                          <span className="truncate">{client.email}</span>
                        </div>
                      )}
                      {client.phone && (
                        <div className="flex items-center gap-2 text-pink-200/80 text-sm">
                          <Phone className="w-3 h-3" />
                          <span>{client.phone}</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-3 sm:py-4 px-3 sm:px-6 hidden lg:table-cell">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-pink-300" />
                      <span className="text-pink-200 text-sm">{countryCodeToName(client.country) || 'N/A'}</span>
                    </div>
                  </td>
                  <td className="py-3 sm:py-4 px-3 sm:px-6">
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/clients/${client.id}`}
                        className="p-2 text-pink-300 hover:text-cyan-300 hover:bg-cyan-500/20 rounded-lg transition-colors"
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link
                        to={`/clients/${client.id}/edit`}
                        className="p-2 text-pink-300 hover:text-yellow-300 hover:bg-yellow-500/20 rounded-lg transition-colors"
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

        {/* Inline Client Insights removed by request */}

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
                  <span className="font-semibold text-white">Add Your First Client</span>
                </div>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );

  function countryCodeToName(code) {
    if (!code) return '';
    const map = {
      US: 'United States', CA: 'Canada', UK: 'United Kingdom', GB: 'United Kingdom', AU: 'Australia',
      DE: 'Germany', FR: 'France', JP: 'Japan', IN: 'India', BR: 'Brazil', MX: 'Mexico', ES: 'Spain', IT: 'Italy',
      NL: 'Netherlands', SE: 'Sweden', NO: 'Norway', DK: 'Denmark', FI: 'Finland', CH: 'Switzerland', AT: 'Austria',
      BE: 'Belgium', IE: 'Ireland', PT: 'Portugal', PL: 'Poland', CZ: 'Czech Republic', HU: 'Hungary', RO: 'Romania',
      BG: 'Bulgaria', HR: 'Croatia', SI: 'Slovenia', SK: 'Slovakia', LT: 'Lithuania', LV: 'Latvia', EE: 'Estonia',
      GR: 'Greece', CY: 'Cyprus', MT: 'Malta', LU: 'Luxembourg', IS: 'Iceland', LI: 'Liechtenstein', MC: 'Monaco',
      SM: 'San Marino', VA: 'Vatican City', AD: 'Andorra', JP: 'Japan', CN: 'China', KR: 'South Korea'
    };
    const up = String(code).toUpperCase();
    return map[up] || code;
  }

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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="max-w-7xl mx-auto p-3 sm:p-4 lg:p-6">
          <div className="animate-pulse space-y-4">
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
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
                {/* View Toggle Buttons */}
                <div className="flex items-center bg-slate-800/50 border border-cyan-400/30 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('table')}
                    className={`p-2 rounded-md transition-all duration-300 ${
                      viewMode === 'table'
                        ? 'bg-cyan-500/50 text-cyan-200 shadow-lg'
                        : 'text-cyan-300/70 hover:text-cyan-200 hover:bg-cyan-500/20'
                    }`}
                    title="Table View"
                  >
                    <List className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-md transition-all duration-300 ${
                      viewMode === 'grid'
                        ? 'bg-cyan-500/50 text-cyan-200 shadow-lg'
                        : 'text-cyan-300/70 hover:text-cyan-200 hover:bg-cyan-500/20'
                    }`}
                    title="Grid View"
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                </div>
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

        {/* Clients Content - Conditional Rendering */}
        {viewMode === 'table' ? renderTableView() : renderGridView()}
      </div>

      {/* Add Client Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setNewClientData({
            name: '',
            email: '',
            phone: '',
            company: '',
            address: '',
            notes: '',
            website: '',
            tax_id: '',
            payment_terms: 30,
            preferred_contact_method: 'email',
            country: ''
          });
        }}
        title="Add New Client"
        size="lg"
      >
        <form onSubmit={handleAddClient} className="space-y-6">
          {/* Basic Information Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold space-text-primary border-b border-white/10 pb-2">Basic Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold space-text-primary mb-2">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={newClientData.name}
                  onChange={handleNewClientChange}
                  className="space-input w-full"
                  placeholder="Enter client's full name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold space-text-primary mb-2">Company</label>
                <input
                  type="text"
                  name="company"
                  value={newClientData.company}
                  onChange={handleNewClientChange}
                  className="space-input w-full"
                  placeholder="Enter company name"
                />
              </div>
            </div>
          </div>

          {/* Contact Information Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold space-text-primary border-b border-white/10 pb-2">Contact Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold space-text-primary mb-2">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={newClientData.email}
                  onChange={handleNewClientChange}
                  className="space-input w-full"
                  placeholder="Enter email address"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold space-text-primary mb-2">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={newClientData.phone}
                  onChange={handleNewClientChange}
                  className="space-input w-full"
                  placeholder="Enter phone number"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold space-text-primary mb-2">Website</label>
                <input
                  type="url"
                  name="website"
                  value={newClientData.website}
                  onChange={handleNewClientChange}
                  className="space-input w-full"
                  placeholder="https://example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold space-text-primary mb-2">Country</label>
                <select
                  name="country"
                  value={newClientData.country}
                  onChange={handleNewClientChange}
                  className="space-input w-full"
                >
                  <option value="">Select country</option>
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="UK">United Kingdom</option>
                  <option value="AU">Australia</option>
                  <option value="DE">Germany</option>
                  <option value="FR">France</option>
                  <option value="JP">Japan</option>
                  <option value="IN">India</option>
                  <option value="BR">Brazil</option>
                  <option value="MX">Mexico</option>
                  <option value="ES">Spain</option>
                  <option value="IT">Italy</option>
                  <option value="NL">Netherlands</option>
                  <option value="SE">Sweden</option>
                  <option value="NO">Norway</option>
                  <option value="DK">Denmark</option>
                  <option value="FI">Finland</option>
                  <option value="CH">Switzerland</option>
                  <option value="AT">Austria</option>
                  <option value="BE">Belgium</option>
                  <option value="IE">Ireland</option>
                  <option value="PT">Portugal</option>
                  <option value="PL">Poland</option>
                  <option value="CZ">Czech Republic</option>
                  <option value="HU">Hungary</option>
                  <option value="RO">Romania</option>
                  <option value="BG">Bulgaria</option>
                  <option value="HR">Croatia</option>
                  <option value="SI">Slovenia</option>
                  <option value="SK">Slovakia</option>
                  <option value="LT">Lithuania</option>
                  <option value="LV">Latvia</option>
                  <option value="EE">Estonia</option>
                  <option value="GR">Greece</option>
                  <option value="CY">Cyprus</option>
                  <option value="MT">Malta</option>
                  <option value="LU">Luxembourg</option>
                  <option value="IS">Iceland</option>
                  <option value="LI">Liechtenstein</option>
                  <option value="MC">Monaco</option>
                  <option value="SM">San Marino</option>
                  <option value="VA">Vatican City</option>
                  <option value="AD">Andorra</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Address Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold space-text-primary border-b border-white/10 pb-2">Address</h3>
            <div>
              <label className="block text-sm font-semibold space-text-primary mb-2">Address</label>
              <textarea
                name="address"
                value={newClientData.address}
                onChange={handleNewClientChange}
                className="space-input w-full"
                placeholder="Enter full address"
                rows={3}
              />
            </div>
          </div>

          {/* Business Information Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold space-text-primary border-b border-white/10 pb-2">Business Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold space-text-primary mb-2">Tax ID</label>
                <input
                  type="text"
                  name="tax_id"
                  value={newClientData.tax_id}
                  onChange={handleNewClientChange}
                  className="space-input w-full"
                  placeholder="Enter tax identification number"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold space-text-primary mb-2">Payment Terms (days)</label>
                <input
                  type="number"
                  name="payment_terms"
                  value={newClientData.payment_terms}
                  onChange={handleNewClientChange}
                  className="space-input w-full"
                  placeholder="30"
                  min="1"
                  max="365"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold space-text-primary mb-2">Preferred Contact Method</label>
              <select
                name="preferred_contact_method"
                value={newClientData.preferred_contact_method}
                onChange={handleNewClientChange}
                className="space-input w-full"
              >
                <option value="email">Email</option>
                <option value="phone">Phone</option>
                <option value="sms">SMS</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="slack">Slack</option>
                <option value="teams">Microsoft Teams</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          {/* Notes Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold space-text-primary border-b border-white/10 pb-2">Additional Information</h3>
            <div>
              <label className="block text-sm font-semibold space-text-primary mb-2">Notes</label>
              <textarea
                name="notes"
                value={newClientData.notes}
                onChange={handleNewClientChange}
                className="space-input w-full"
                placeholder="Enter any additional notes about this client"
                rows={4}
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={() => {
                setShowAddModal(false);
                setNewClientData({
                  name: '',
                  email: '',
                  phone: '',
                  company: '',
                  address: '',
                  notes: '',
                  website: '',
                  tax_id: '',
                  payment_terms: 30,
                  preferred_contact_method: 'email',
                  country: ''
                });
              }}
              className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={addingClient}
              className="space-btn flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              {addingClient ? 'Adding...' : 'Add Client'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Clients;
