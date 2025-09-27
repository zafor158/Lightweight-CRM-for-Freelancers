import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../config/axios';
import toast from 'react-hot-toast';
import { useNavigation } from '../hooks/useNavigation';
import { BackButton } from '../components/navigation/SmartBackButton';
import Breadcrumb from '../components/navigation/Breadcrumb';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Plus, 
  Mail, 
  Phone, 
  Building, 
  MapPin, 
  FileText,
  User,
  Zap,
  Star,
  Rocket,
  Globe,
  Shield,
  Eye,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const ClientDetail = () => {
  const { id } = useParams();
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const fetchClient = useCallback(async () => {
    try {
      const response = await api.get(`/clients/${id}`);
      setClient(response.data.client);
    } catch (error) {
      console.error('Error fetching client:', error);
      toast.error('Failed to fetch client details');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchClient();
    }
  }, [id, fetchClient]);

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

  if (!client) {
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
                <h3 className="text-xl font-bold text-white mb-2">Client not found</h3>
                <p className="text-red-200/80 mb-6">The client you're looking for doesn't exist.</p>
                <Link to="/clients" className="relative group/btn">
                  <div className="absolute inset-0 bg-gradient-to-br from-red-500/30 to-orange-400/30 rounded-xl blur-sm group-hover/btn:blur-md transition-all duration-300"></div>
                  <div className="relative bg-gradient-to-br from-red-500/50 to-orange-400/50 border border-red-300/60 rounded-xl px-6 py-3 flex items-center gap-2 hover:from-red-500/60 hover:to-orange-400/60 transition-all duration-300 shadow-lg">
                    <ArrowLeft size={20} className="text-red-200" />
                    <span className="font-semibold text-white">Back to Clients</span>
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
          <div className="absolute inset-0 bg-gradient-to-br from-purple-400/25 via-purple-300/20 to-purple-400/15 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500 animate-pulse" style={{animationDuration: '6s'}}></div>
          <div className="relative backdrop-blur-2xl bg-gradient-to-br from-zinc-800/45 via-purple-900/40 to-fuchsia-900/35 border-2 border-purple-400/60 rounded-2xl p-4 sm:p-6 shadow-2xl shadow-purple-500/30">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <BackButton.Primary 
                  fallbackRoute="/clients"
                  preserveContext={true}
                />
                <div>
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white drop-shadow-lg flex items-center gap-2 sm:gap-3">
                    <User className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-purple-300" />
                    <span className="truncate">{client.name}</span>
                  </h1>
                  <p className="text-purple-200/80 text-sm sm:text-base mt-1">Client Details</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                <Link to={`/clients/${id}/edit`} className="relative group/btn">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 to-cyan-400/30 rounded-xl blur-sm group-hover/btn:blur-md transition-all duration-300"></div>
                  <div className="relative bg-gradient-to-br from-blue-500/50 to-cyan-400/50 border border-blue-300/60 rounded-xl px-3 sm:px-4 py-2 sm:py-3 flex items-center justify-center gap-2 hover:from-blue-500/60 hover:to-cyan-400/60 transition-all duration-300 shadow-lg">
                    <Edit size={16} className="text-blue-200" />
                    <span className="font-semibold text-white text-sm sm:text-base">Edit</span>
                  </div>
                </Link>
                <button className="relative group/btn">
                  <div className="absolute inset-0 bg-gradient-to-br from-red-500/30 to-rose-400/30 rounded-xl blur-sm group-hover/btn:blur-md transition-all duration-300"></div>
                  <div className="relative bg-gradient-to-br from-red-500/50 to-rose-400/50 border border-red-300/60 rounded-xl px-3 sm:px-4 py-2 sm:py-3 flex items-center justify-center gap-2 hover:from-red-500/60 hover:to-rose-400/60 transition-all duration-300 shadow-lg">
                    <Trash2 size={16} className="text-red-200" />
                    <span className="font-semibold text-white text-sm sm:text-base">Delete</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
          {/* Left Column - Contact Info & Projects */}
          <div className="xl:col-span-2 space-y-4 sm:space-y-6">
            {/* Contact Information - Electric Orange & Red */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-400/25 via-red-300/20 to-rose-400/15 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500 animate-pulse" style={{animationDuration: '6s'}}></div>
              <div className="relative backdrop-blur-2xl bg-gradient-to-br from-slate-800/45 via-orange-900/40 to-red-900/35 border-2 border-orange-400/60 rounded-2xl p-4 sm:p-6 shadow-2xl shadow-orange-500/30">
                <div className="flex items-center gap-3 mb-4 sm:mb-6">
                  <div className="p-2 sm:p-3 bg-gradient-to-br from-orange-500/30 to-red-500/30 rounded-xl border border-orange-400/40">
                    <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-orange-300" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white">Contact Information</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {client.email && (
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-gradient-to-br from-orange-500/30 to-red-500/30 rounded-lg border border-orange-400/40">
                        <Mail className="w-4 h-4 text-orange-300" />
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm font-semibold text-orange-200/80 uppercase tracking-wide">Email</p>
                        <p className="text-sm sm:text-base text-white bg-black/20 px-3 py-1 rounded-lg border border-orange-400/30 mt-1">{client.email}</p>
                      </div>
                    </div>
                  )}
                  
                  {client.phone && (
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-gradient-to-br from-orange-500/30 to-red-500/30 rounded-lg border border-orange-400/40">
                        <Phone className="w-4 h-4 text-orange-300" />
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm font-semibold text-orange-200/80 uppercase tracking-wide">Phone</p>
                        <p className="text-sm sm:text-base text-white bg-black/20 px-3 py-1 rounded-lg border border-orange-400/30 mt-1">{client.phone}</p>
                      </div>
                    </div>
                  )}
                  
                  {client.company && (
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-gradient-to-br from-orange-500/30 to-red-500/30 rounded-lg border border-orange-400/40">
                        <Building className="w-4 h-4 text-orange-300" />
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm font-semibold text-orange-200/80 uppercase tracking-wide">Company</p>
                        <p className="text-sm sm:text-base text-white bg-black/20 px-3 py-1 rounded-lg border border-orange-400/30 mt-1">{client.company}</p>
                      </div>
                    </div>
                  )}
                  
                  {client.address && (
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-gradient-to-br from-orange-500/30 to-red-500/30 rounded-lg border border-orange-400/40">
                        <MapPin className="w-4 h-4 text-orange-300" />
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm font-semibold text-orange-200/80 uppercase tracking-wide">Address</p>
                        <p className="text-sm sm:text-base text-white bg-black/20 px-3 py-1 rounded-lg border border-orange-400/30 mt-1">{client.address}</p>
                      </div>
                    </div>
                  )}
                </div>
                
                {client.notes && (
                  <div className="mt-4 sm:mt-6">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-gradient-to-br from-orange-500/30 to-red-500/30 rounded-lg border border-orange-400/40">
                        <FileText className="w-4 h-4 text-orange-300" />
                      </div>
                      <p className="text-xs sm:text-sm font-semibold text-orange-200/80 uppercase tracking-wide">Notes</p>
                    </div>
                    <p className="text-sm sm:text-base text-white bg-black/20 p-3 sm:p-4 rounded-lg border border-orange-400/30">
                      {client.notes}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Projects - Neon Cyan & Electric Blue */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/25 via-blue-300/20 to-indigo-400/15 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500 animate-pulse" style={{animationDuration: '8s'}}></div>
              <div className="relative backdrop-blur-2xl bg-gradient-to-br from-gray-800/45 via-cyan-900/40 to-blue-900/35 border-2 border-cyan-400/60 rounded-2xl p-4 sm:p-6 shadow-2xl shadow-cyan-500/30">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 sm:p-3 bg-gradient-to-br from-cyan-500/30 to-blue-500/30 rounded-xl border border-cyan-400/40">
                      <Rocket className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-300" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-white">Projects</h3>
                  </div>
                  <Link to={`/projects/new?client=${id}`} className="relative group/btn">
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/30 to-blue-400/30 rounded-xl blur-sm group-hover/btn:blur-md transition-all duration-300"></div>
                    <div className="relative bg-gradient-to-br from-cyan-500/50 to-blue-400/50 border border-cyan-300/60 rounded-xl px-3 sm:px-4 py-2 sm:py-3 flex items-center gap-2 hover:from-cyan-500/60 hover:to-blue-400/60 transition-all duration-300 shadow-lg">
                      <Plus size={16} className="text-cyan-200" />
                      <span className="font-semibold text-white text-sm sm:text-base">Add Project</span>
                    </div>
                  </Link>
                </div>
                <div>
                  {client.projects && client.projects.length > 0 ? (
                    <div className="space-y-3 sm:space-y-4">
                      {client.projects.map((project) => (
                        <div key={project.id} className="bg-black/20 border border-cyan-400/30 rounded-lg p-3 sm:p-4">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
                            <div className="flex-1">
                              <h4 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                                <Star className="w-4 h-4 text-cyan-300" />
                                {project.name}
                              </h4>
                              {project.description && (
                                <p className="text-xs sm:text-sm text-cyan-200/80 mt-1">{project.description}</p>
                              )}
                            </div>
                            <div className="flex items-center gap-2 sm:gap-3">
                              <span className={`px-2 py-1 rounded-lg text-xs font-semibold uppercase tracking-wide ${
                                project.status === 'Completed' ? 'bg-green-500/30 text-green-300 border border-green-400/40' :
                                project.status === 'In Progress' ? 'bg-blue-500/30 text-blue-300 border border-blue-400/40' :
                                project.status === 'Overdue' ? 'bg-red-500/30 text-red-300 border border-red-400/40' : 
                                'bg-yellow-500/30 text-yellow-300 border border-yellow-400/40'
                              }`}>
                                {project.status}
                              </span>
                              <Link to={`/projects/${project.id}`} className="relative group/btn">
                                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/30 to-blue-400/30 rounded-lg blur-sm group-hover/btn:blur-md transition-all duration-300"></div>
                                <div className="relative bg-gradient-to-br from-cyan-500/50 to-blue-400/50 border border-cyan-300/60 rounded-lg px-3 py-1.5 flex items-center gap-1 hover:from-cyan-500/60 hover:to-blue-400/60 transition-all duration-300 shadow-lg">
                                  <Eye size={14} className="text-cyan-200" />
                                  <span className="font-semibold text-white text-xs">View</span>
                                </div>
                              </Link>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 sm:py-8">
                      <div className="p-4 bg-black/20 border border-cyan-400/30 rounded-lg">
                        <p className="text-sm sm:text-base text-cyan-200/80 mb-4">No projects yet</p>
                        <Link to={`/projects/new?client=${id}`} className="relative group/btn">
                          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/30 to-blue-400/30 rounded-xl blur-sm group-hover/btn:blur-md transition-all duration-300"></div>
                          <div className="relative bg-gradient-to-br from-cyan-500/50 to-blue-400/50 border border-cyan-300/60 rounded-xl px-4 py-3 flex items-center gap-2 hover:from-cyan-500/60 hover:to-blue-400/60 transition-all duration-300 shadow-lg">
                            <Plus size={16} className="text-cyan-200" />
                            <span className="font-semibold text-white text-sm sm:text-base">Add First Project</span>
                          </div>
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-4 sm:space-y-6">
            {/* Quick Stats - Electric Green & Lime */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-green-400/25 via-lime-300/20 to-emerald-400/15 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500 animate-pulse" style={{animationDuration: '7s'}}></div>
              <div className="relative backdrop-blur-2xl bg-gradient-to-br from-neutral-800/45 via-green-900/40 to-lime-900/35 border-2 border-green-400/60 rounded-2xl p-4 sm:p-6 shadow-2xl shadow-green-500/30">
                <div className="flex items-center gap-3 mb-4 sm:mb-6">
                  <div className="p-2 sm:p-3 bg-gradient-to-br from-green-500/30 to-lime-500/30 rounded-xl border border-green-400/40">
                    <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-green-300" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white">Quick Stats</h3>
                </div>
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-semibold text-green-200/80 uppercase tracking-wide">Total Projects</span>
                    <span className="text-sm sm:text-base font-bold text-white bg-black/20 px-3 py-1 rounded-lg border border-green-400/30">
                      {client.projects ? client.projects.length : 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-semibold text-green-200/80 uppercase tracking-wide">Active Projects</span>
                    <span className="text-sm sm:text-base font-bold text-white bg-black/20 px-3 py-1 rounded-lg border border-green-400/30">
                      {client.projects ? client.projects.filter(p => p.status === 'In Progress').length : 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-semibold text-green-200/80 uppercase tracking-wide">Completed</span>
                    <span className="text-sm sm:text-base font-bold text-white bg-black/20 px-3 py-1 rounded-lg border border-green-400/30">
                      {client.projects ? client.projects.filter(p => p.status === 'Completed').length : 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions - Hot Pink & Magenta */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-400/25 via-rose-300/20 to-fuchsia-400/15 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500 animate-pulse" style={{animationDuration: '9s'}}></div>
              <div className="relative backdrop-blur-2xl bg-gradient-to-br from-stone-800/45 via-pink-900/40 to-rose-900/35 border-2 border-pink-400/60 rounded-2xl p-4 sm:p-6 shadow-2xl shadow-pink-500/30">
                <div className="flex items-center gap-3 mb-4 sm:mb-6">
                  <div className="p-2 sm:p-3 bg-gradient-to-br from-pink-500/30 to-rose-500/30 rounded-xl border border-pink-400/40">
                    <Rocket className="w-5 h-5 sm:w-6 sm:h-6 text-pink-300" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white">Quick Actions</h3>
                </div>
                <div className="space-y-3 sm:space-y-4">
                  <Link to={`/projects/new?client=${id}`} className="relative group/btn w-full">
                    <div className="absolute inset-0 bg-gradient-to-br from-pink-500/30 to-rose-400/30 rounded-xl blur-sm group-hover/btn:blur-md transition-all duration-300"></div>
                    <div className="relative bg-gradient-to-br from-pink-500/50 to-rose-400/50 border border-pink-300/60 rounded-xl px-4 py-3 flex items-center justify-center gap-2 hover:from-pink-500/60 hover:to-rose-400/60 transition-all duration-300 shadow-lg">
                      <Plus size={16} className="text-pink-200" />
                      <span className="font-semibold text-white text-sm sm:text-base">New Project</span>
                    </div>
                  </Link>
                  <Link to={`/invoices/new?client=${id}`} className="relative group/btn w-full">
                    <div className="absolute inset-0 bg-gradient-to-br from-pink-500/30 to-rose-400/30 rounded-xl blur-sm group-hover/btn:blur-md transition-all duration-300"></div>
                    <div className="relative bg-gradient-to-br from-pink-500/50 to-rose-400/50 border border-pink-300/60 rounded-xl px-4 py-3 flex items-center justify-center gap-2 hover:from-pink-500/60 hover:to-rose-400/60 transition-all duration-300 shadow-lg">
                      <FileText size={16} className="text-pink-200" />
                      <span className="font-semibold text-white text-sm sm:text-base">Create Invoice</span>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDetail;
