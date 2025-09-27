import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../config/axios';
import toast from 'react-hot-toast';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Plus, 
  Calendar, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Pause,
  FolderOpen,
  User,
  Building,
  Mail,
  Phone,
  FileText,
  Zap,
  Star,
  Rocket,
  Globe,
  Shield,
  Eye
} from 'lucide-react';
import { format, parseISO } from 'date-fns';

const ProjectDetail = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProject = useCallback(async () => {
    try {
      const response = await api.get(`/projects/${id}`);
      setProject(response.data.project);
    } catch (error) {
      console.error('Error fetching project:', error);
      toast.error('Failed to fetch project details');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchProject();
    }
  }, [id, fetchProject]);

  const getStatusBadge = (status) => {
    const statusConfig = {
      'In Progress': { 
        glow: 'from-blue-400/25 via-cyan-300/20 to-indigo-400/15',
        bg: 'from-slate-800/45 via-blue-900/40 to-cyan-900/35',
        border: 'border-blue-400/60',
        shadow: 'shadow-blue-500/30',
        icon: Clock,
        iconColor: 'text-blue-300'
      },
      'Completed': { 
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
      },
      'On Hold': { 
        glow: 'from-yellow-400/25 via-orange-300/20 to-amber-400/15',
        bg: 'from-slate-800/45 via-yellow-900/40 to-orange-900/35',
        border: 'border-yellow-400/60',
        shadow: 'shadow-yellow-500/30',
        icon: Pause,
        iconColor: 'text-yellow-300'
      }
    };

    const config = statusConfig[status] || statusConfig['In Progress'];
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

  if (!project) {
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
                <h3 className="text-xl font-bold text-white mb-2">Project not found</h3>
                <p className="text-red-200/80 mb-6">The project you're looking for doesn't exist.</p>
                <Link to="/projects" className="relative group/btn">
                  <div className="absolute inset-0 bg-gradient-to-br from-red-500/30 to-orange-400/30 rounded-xl blur-sm group-hover/btn:blur-md transition-all duration-300"></div>
                  <div className="relative bg-gradient-to-br from-red-500/50 to-orange-400/50 border border-red-300/60 rounded-xl px-6 py-3 flex items-center gap-2 hover:from-red-500/60 hover:to-orange-400/60 transition-all duration-300 shadow-lg">
                    <ArrowLeft size={20} className="text-red-200" />
                    <span className="font-semibold text-white">Back to Projects</span>
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
        {/* Header - Electric Purple & Neon Pink */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-400/25 via-fuchsia-300/20 to-pink-400/15 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500 animate-pulse" style={{animationDuration: '6s'}}></div>
          <div className="relative backdrop-blur-2xl bg-gradient-to-br from-zinc-800/45 via-purple-900/40 to-fuchsia-900/35 border-2 border-purple-400/60 rounded-2xl p-4 sm:p-6 shadow-2xl shadow-purple-500/30">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <Link to="/projects" className="relative group/btn">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 to-fuchsia-400/30 rounded-xl blur-sm group-hover/btn:blur-md transition-all duration-300"></div>
                  <div className="relative bg-gradient-to-br from-purple-500/50 to-fuchsia-400/50 border border-purple-300/60 rounded-xl p-2 sm:p-3 hover:from-purple-500/60 hover:to-fuchsia-400/60 transition-all duration-300 shadow-lg">
                    <ArrowLeft size={18} className="text-purple-200" />
                  </div>
                </Link>
                <div>
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white drop-shadow-lg flex items-center gap-2 sm:gap-3">
                    <FolderOpen className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-purple-300" />
                    <span className="truncate">{project.name}</span>
                  </h1>
                  <p className="text-purple-200/80 text-sm sm:text-base mt-1">Project Details</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                <Link to={`/projects/${id}/edit`} className="relative group/btn">
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
          {/* Left Column - Project & Client Info */}
          <div className="xl:col-span-2 space-y-4 sm:space-y-6">
            {/* Project Information - Electric Orange & Red */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-400/25 via-red-300/20 to-rose-400/15 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500 animate-pulse" style={{animationDuration: '6s'}}></div>
              <div className="relative backdrop-blur-2xl bg-gradient-to-br from-slate-800/45 via-orange-900/40 to-red-900/35 border-2 border-orange-400/60 rounded-2xl p-4 sm:p-6 shadow-2xl shadow-orange-500/30">
                <div className="flex items-center gap-3 mb-4 sm:mb-6">
                  <div className="p-2 sm:p-3 bg-gradient-to-br from-orange-500/30 to-red-500/30 rounded-xl border border-orange-400/40">
                    <FolderOpen className="w-5 h-5 sm:w-6 sm:h-6 text-orange-300" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white">Project Information</h3>
                </div>
                <div className="space-y-4 sm:space-y-6">
                  <div>
                    <label className="text-xs sm:text-sm font-semibold text-orange-200/80 uppercase tracking-wide">Description</label>
                    <p className="mt-1 text-sm sm:text-base text-white bg-black/20 p-3 sm:p-4 rounded-lg border border-orange-400/30">
                      {project.description || 'No description provided'}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="text-xs sm:text-sm font-semibold text-orange-200/80 uppercase tracking-wide">Status</label>
                      <div className="mt-1">
                        {getStatusBadge(project.status)}
                      </div>
                    </div>

                    <div>
                      <label className="text-xs sm:text-sm font-semibold text-orange-200/80 uppercase tracking-wide">Due Date</label>
                      <div className="mt-1 flex items-center text-sm sm:text-base text-white bg-black/20 px-3 py-2 rounded-lg border border-orange-400/30">
                        <Calendar size={16} className="mr-2 text-orange-300" />
                        {project.due_date ? format(parseISO(project.due_date), 'MMM dd, yyyy') : 'No due date set'}
                      </div>
                    </div>

                    <div>
                      <label className="text-xs sm:text-sm font-semibold text-orange-200/80 uppercase tracking-wide">Hourly Rate</label>
                      <div className="mt-1 flex items-center text-sm sm:text-base text-white bg-black/20 px-3 py-2 rounded-lg border border-orange-400/30">
                        <DollarSign size={16} className="mr-2 text-orange-300" />
                        {project.hourly_rate ? `$${parseFloat(project.hourly_rate).toFixed(2)}/hour` : 'Not set'}
                      </div>
                    </div>

                    <div>
                      <label className="text-xs sm:text-sm font-semibold text-orange-200/80 uppercase tracking-wide">Total Hours</label>
                      <div className="mt-1 flex items-center text-sm sm:text-base text-white bg-black/20 px-3 py-2 rounded-lg border border-orange-400/30">
                        <Clock size={16} className="mr-2 text-orange-300" />
                        {project.total_hours ? `${parseFloat(project.total_hours).toFixed(1)} hours` : 'Not tracked'}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs sm:text-sm font-semibold text-orange-200/80 uppercase tracking-wide">Total Amount</label>
                    <div className="mt-1 flex items-center text-lg sm:text-xl font-bold text-white bg-black/20 px-3 py-2 rounded-lg border border-orange-400/30">
                      <DollarSign size={18} className="mr-2 text-orange-300" />
                      {project.total_amount ? `$${parseFloat(project.total_amount).toFixed(2)}` : 'Not calculated'}
                    </div>
                  </div>
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
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg sm:text-xl shadow-lg">
                      {project.client_name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                        <Building className="w-5 h-5 text-cyan-300" />
                        {project.client_name}
                      </h4>
                      <div className="mt-1 space-y-1">
                        {project.client_email && (
                          <p className="text-sm sm:text-base text-cyan-200/80 flex items-center gap-2">
                            <Mail className="w-4 h-4 text-cyan-300" />
                            {project.client_email}
                          </p>
                        )}
                        {project.client_phone && (
                          <p className="text-sm sm:text-base text-cyan-200/80 flex items-center gap-2">
                            <Phone className="w-4 h-4 text-cyan-300" />
                            {project.client_phone}
                          </p>
                        )}
                        {project.client_company && (
                          <p className="text-sm sm:text-base text-cyan-200/80 flex items-center gap-2">
                            <Building className="w-4 h-4 text-cyan-300" />
                            {project.client_company}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div>
                    <Link to={`/clients/${project.client_id}`} className="relative group/btn">
                      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/30 to-blue-400/30 rounded-xl blur-sm group-hover/btn:blur-md transition-all duration-300"></div>
                      <div className="relative bg-gradient-to-br from-cyan-500/50 to-blue-400/50 border border-cyan-300/60 rounded-xl px-4 py-2 flex items-center gap-2 hover:from-cyan-500/60 hover:to-blue-400/60 transition-all duration-300 shadow-lg">
                        <Eye size={16} className="text-cyan-200" />
                        <span className="font-semibold text-white text-sm">View Client Details</span>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-4 sm:space-y-6">
            {/* Project Stats - Electric Green & Lime */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-green-400/25 via-lime-300/20 to-emerald-400/15 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500 animate-pulse" style={{animationDuration: '7s'}}></div>
              <div className="relative backdrop-blur-2xl bg-gradient-to-br from-neutral-800/45 via-green-900/40 to-lime-900/35 border-2 border-green-400/60 rounded-2xl p-4 sm:p-6 shadow-2xl shadow-green-500/30">
                <div className="flex items-center gap-3 mb-4 sm:mb-6">
                  <div className="p-2 sm:p-3 bg-gradient-to-br from-green-500/30 to-lime-500/30 rounded-xl border border-green-400/40">
                    <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-green-300" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white">Project Stats</h3>
                </div>
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-semibold text-green-200/80 uppercase tracking-wide">Created</span>
                    <span className="text-sm sm:text-base font-medium text-white bg-black/20 px-3 py-1 rounded-lg border border-green-400/30">
                      {format(parseISO(project.created_at), 'MMM dd, yyyy')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-semibold text-green-200/80 uppercase tracking-wide">Last Updated</span>
                    <span className="text-sm sm:text-base font-medium text-white bg-black/20 px-3 py-1 rounded-lg border border-green-400/30">
                      {format(parseISO(project.updated_at), 'MMM dd, yyyy')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-semibold text-green-200/80 uppercase tracking-wide">Status</span>
                    <span className="text-sm sm:text-base font-medium text-white bg-black/20 px-3 py-1 rounded-lg border border-green-400/30">
                      {project.status}
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
                  <Link to={`/invoices/new?project=${id}`} className="relative group/btn w-full">
                    <div className="absolute inset-0 bg-gradient-to-br from-pink-500/30 to-rose-400/30 rounded-xl blur-sm group-hover/btn:blur-md transition-all duration-300"></div>
                    <div className="relative bg-gradient-to-br from-pink-500/50 to-rose-400/50 border border-pink-300/60 rounded-xl px-4 py-3 flex items-center justify-center gap-2 hover:from-pink-500/60 hover:to-rose-400/60 transition-all duration-300 shadow-lg">
                      <Plus size={16} className="text-pink-200" />
                      <span className="font-semibold text-white text-sm sm:text-base">Create Invoice</span>
                    </div>
                  </Link>
                  <Link to={`/projects/${id}/edit`} className="relative group/btn w-full">
                    <div className="absolute inset-0 bg-gradient-to-br from-pink-500/30 to-rose-400/30 rounded-xl blur-sm group-hover/btn:blur-md transition-all duration-300"></div>
                    <div className="relative bg-gradient-to-br from-pink-500/50 to-rose-400/50 border border-pink-300/60 rounded-xl px-4 py-3 flex items-center justify-center gap-2 hover:from-pink-500/60 hover:to-rose-400/60 transition-all duration-300 shadow-lg">
                      <Edit size={16} className="text-pink-200" />
                      <span className="font-semibold text-white text-sm sm:text-base">Edit Project</span>
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

export default ProjectDetail;
