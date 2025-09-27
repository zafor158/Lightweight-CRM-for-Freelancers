import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FolderOpen, 
  Plus, 
  Search, 
  Eye, 
  Edit, 
  Trash2, 
  Calendar,
  User,
  DollarSign,
  Grid3X3,
  List,
  Filter,
  SortAsc,
  SortDesc,
  Clock,
  CheckCircle,
  AlertCircle,
  MoreHorizontal
} from 'lucide-react';
import Modal from '../components/ui/Modal';

const Projects = () => {
  // Sample data for demonstration
  const sampleProjects = [
    {
      id: 1,
      name: 'Website Redesign',
      client: 'Acme Corp',
      clientId: 1,
      dueDate: '2024-01-15',
      status: 'in-progress',
      priority: 'high',
      budget: 15000,
      progress: 65,
      description: 'Complete redesign of the company website with modern UI/UX'
    },
    {
      id: 2,
      name: 'Mobile App Development',
      client: 'TechFlow Innovations',
      clientId: 2,
      dueDate: '2024-02-20',
      status: 'in-progress',
      priority: 'medium',
      budget: 25000,
      progress: 30,
      description: 'Native mobile app for iOS and Android platforms'
    },
    {
      id: 3,
      name: 'Brand Identity Package',
      client: 'StartupXYZ',
      clientId: 3,
      dueDate: '2024-01-10',
      status: 'completed',
      priority: 'low',
      budget: 8000,
      progress: 100,
      description: 'Complete brand identity including logo, colors, and guidelines'
    },
    {
      id: 4,
      name: 'E-commerce Platform',
      client: 'RetailPlus',
      clientId: 4,
      dueDate: '2023-12-30',
      status: 'overdue',
      priority: 'high',
      budget: 35000,
      progress: 80,
      description: 'Full e-commerce solution with payment integration'
    },
    {
      id: 5,
      name: 'Marketing Campaign',
      client: 'Johnson Marketing',
      clientId: 3,
      dueDate: '2024-03-15',
      status: 'todo',
      priority: 'medium',
      budget: 12000,
      progress: 0,
      description: 'Digital marketing campaign for product launch'
    },
    {
      id: 6,
      name: 'Database Migration',
      client: 'Acme Corp',
      clientId: 1,
      dueDate: '2024-02-05',
      status: 'todo',
      priority: 'low',
      budget: 18000,
      progress: 0,
      description: 'Migrate legacy database to cloud infrastructure'
    }
  ];

  const [projects, setProjects] = useState(sampleProjects);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'kanban'
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('dueDate');
  const [sortOrder, setSortOrder] = useState('asc');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    setLoading(false);
  }, []);

  const handleDelete = async (project) => {
    if (window.confirm(`Are you sure you want to delete "${project.name}"?`)) {
      try {
        // await api.delete(`/projects/${project.id}`);
        setProjects(projects.filter(p => p.id !== project.id));
        // toast.success('Project deleted successfully');
      } catch (error) {
        console.error('Error deleting project:', error);
        // toast.error('Failed to delete project');
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

  const filteredProjects = projects
    .filter(project => {
      const matchesSearch = 
        project.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.client?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    })
    .sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (sortBy === 'dueDate') {
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
      'todo': 'bg-gray-100 text-gray-700',
      'in-progress': 'bg-warning-100 text-warning-700',
      'completed': 'bg-success-100 text-success-700',
      'overdue': 'bg-error-100 text-error-700'
    };
    
    const labels = {
      'todo': 'To Do',
      'in-progress': 'In Progress',
      'completed': 'Completed',
      'overdue': 'Overdue'
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'text-error-600',
      medium: 'text-warning-600',
      low: 'text-success-600'
    };
    return colors[priority] || 'text-gray-600';
  };

  const getSortIcon = (column) => {
    if (sortBy !== column) {
      return <SortAsc className="w-4 h-4 text-gray-400" />;
    }
    return sortOrder === 'asc' ? 
      <SortAsc className="w-4 h-4 text-gray-600" /> : 
      <SortDesc className="w-4 h-4 text-gray-600" />;
  };

  const getProjectsByStatus = (status) => {
    return filteredProjects.filter(project => project.status === status);
  };

  const renderKanbanView = () => {
    const columns = [
      { id: 'todo', title: 'Mission Briefing', color: 'gray' },
      { id: 'in-progress', title: 'In Progress', color: 'warning' },
      { id: 'completed', title: 'Mission Complete', color: 'success' }
    ];

    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {columns.map((column) => (
          <div key={column.id} className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold space-text-primary text-lg">{column.title}</h3>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                column.color === 'gray' ? 'bg-gray-500/20 text-gray-300' :
                column.color === 'warning' ? 'bg-yellow-500/20 text-yellow-300' :
                'bg-green-500/20 text-green-300'
              }`}>
                {getProjectsByStatus(column.id).length}
              </span>
            </div>
            <div className="space-y-3">
              {getProjectsByStatus(column.id).map((project) => (
                <div
                  key={project.id}
                  className="space-card space-card-hover p-4 cursor-pointer group"
                  onClick={() => setSelectedProject(project)}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <h4 className="font-semibold space-text-primary group-hover:text-purple-300 transition-colors">
                        {project.name}
                      </h4>
                      <div className={`w-3 h-3 rounded-full ${
                        project.priority === 'high' ? 'bg-red-500' :
                        project.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                      }`} />
                    </div>

                    <div className="flex items-center gap-2 text-sm space-text-secondary">
                      <User className="w-4 h-4" />
                      <span>{project.client}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm space-text-secondary">
                      <Calendar className="w-4 h-4" />
                      <span>Due {new Date(project.dueDate).toLocaleDateString()}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm space-text-secondary">
                      <DollarSign className="w-4 h-4" />
                      <span>${project.budget.toLocaleString()}</span>
                    </div>

                    {project.status === 'in-progress' && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="space-text-muted">Progress</span>
                          <span className="font-semibold space-text-primary">{project.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all"
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderTableView = () => (
    <div className="space-card">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th 
                className="cursor-pointer hover:bg-white/5 transition-colors py-4 px-6 text-left"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold space-text-primary">Project Name</span>
                  {getSortIcon('name')}
                </div>
              </th>
              <th 
                className="cursor-pointer hover:bg-white/5 transition-colors py-4 px-6 text-left"
                onClick={() => handleSort('client')}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold space-text-primary">Client Name</span>
                  {getSortIcon('client')}
                </div>
              </th>
              <th 
                className="cursor-pointer hover:bg-white/5 transition-colors py-4 px-6 text-left"
                onClick={() => handleSort('dueDate')}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold space-text-primary">Due Date</span>
                  {getSortIcon('dueDate')}
                </div>
              </th>
              <th className="text-sm font-semibold space-text-primary py-4 px-6 text-left">Status</th>
              <th className="text-sm font-semibold space-text-primary py-4 px-6 text-left">Priority</th>
              <th className="text-sm font-semibold space-text-primary py-4 px-6 text-left">Budget</th>
              <th className="text-sm font-semibold space-text-primary py-4 px-6 text-left">Progress</th>
              <th className="text-right text-sm font-semibold space-text-primary py-4 px-6">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProjects.map((project) => (
              <tr key={project.id} className="hover:bg-white/5 transition-colors border-b border-white/5">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                      <FolderOpen className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold space-text-primary">{project.name}</div>
                      <div className="text-sm space-text-muted truncate max-w-48">{project.description}</div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="text-sm space-text-secondary">{project.client}</span>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm space-text-secondary">
                      {new Date(project.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-6">
                  {getStatusBadge(project.status)}
                </td>
                <td className="py-4 px-6">
                  <span className={`text-sm font-medium ${getPriorityColor(project.priority)}`}>
                    {project.priority}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4 text-gray-400" />
                    <span className="font-semibold space-text-primary">
                      ${project.budget.toLocaleString()}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                    <span className="text-sm space-text-muted">{project.progress}%</span>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => setSelectedProject(project)}
                      className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors"
                      title="View"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <Link
                      to={`/projects/${project.id}/edit`}
                      className="p-2 text-gray-400 hover:text-green-400 hover:bg-green-500/20 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(project)}
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
    </div>
  );

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
        <div className="absolute inset-0 opacity-30">
          {[...Array(35)].map((_, i) => (
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
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-radial from-purple-500/10 via-blue-500/5 to-transparent rounded-full blur-3xl animate-pulse" style={{animationDuration: '8s'}}></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-radial from-cyan-500/8 via-indigo-500/4 to-transparent rounded-full blur-3xl animate-pulse" style={{animationDuration: '6s', animationDelay: '2s'}}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-radial from-pink-500/5 via-purple-500/2 to-transparent rounded-full blur-2xl animate-pulse" style={{animationDuration: '10s', animationDelay: '4s'}}></div>
        </div>
        
        {/* Floating Celestial Bodies */}
        <div className="absolute top-20 left-20 w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full shadow-md shadow-blue-500/12 animate-float">
          <div className="absolute inset-1 rounded-full bg-gradient-to-br from-blue-300/20 to-transparent"></div>
        </div>
        
        <div className="absolute top-40 right-32 w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full shadow-sm shadow-purple-500/12 animate-float" style={{animationDelay: '1s'}}>
          <div className="absolute inset-1 rounded-full bg-gradient-to-br from-purple-300/12 to-transparent"></div>
        </div>
        
        <div className="absolute bottom-32 left-1/3 w-6 h-6 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full shadow-sm shadow-emerald-500/12 animate-float" style={{animationDelay: '2s'}}></div>
        
        {/* Animated Meteor Streaks */}
        <div className="absolute top-1/4 right-1/3 w-1 h-12 bg-gradient-to-b from-transparent via-white to-transparent transform rotate-45 opacity-20 animate-pulse" style={{animationDelay: '3s'}}></div>
        <div className="absolute bottom-1/3 left-1/4 w-1 h-8 bg-gradient-to-b from-transparent via-cyan-200 to-transparent transform -rotate-45 opacity-12 animate-pulse" style={{animationDelay: '5s'}}></div>
        
        {/* Enhanced floating particles */}
        <div className="absolute inset-0 opacity-18">
          {[...Array(10)].map((_, i) => (
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
        {/* Page Header - Electric Purple & Neon Pink */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-400/25 via-fuchsia-300/20 to-pink-400/15 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500 animate-pulse" style={{animationDuration: '6s'}}></div>
          <div className="relative backdrop-blur-2xl bg-gradient-to-br from-zinc-800/45 via-purple-900/40 to-fuchsia-900/35 border-2 border-purple-400/60 rounded-2xl p-4 sm:p-6 shadow-2xl shadow-purple-500/30">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white drop-shadow-lg flex items-center gap-2 sm:gap-3">
                  <FolderOpen className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-purple-300" />
                  <span className="truncate">Mission Control</span>
                </h1>
                <p className="text-purple-200/80 text-sm sm:text-base lg:text-lg mt-2">Navigate your project universe and track mission progress</p>
              </div>
              <button
                onClick={() => setShowAddModal(true)}
                className="relative group/btn w-full sm:w-auto"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 to-fuchsia-400/30 rounded-xl blur-sm group-hover/btn:blur-md transition-all duration-300"></div>
                <div className="relative bg-gradient-to-br from-purple-500/50 to-fuchsia-400/50 border border-purple-300/60 rounded-xl px-4 sm:px-6 py-2 sm:py-3 flex items-center justify-center gap-2 hover:from-purple-500/60 hover:to-fuchsia-400/60 transition-all duration-300 shadow-lg">
                  <Plus className="w-4 h-4 sm:w-5 sm:h-5 text-purple-200" />
                  <span className="font-semibold text-white text-sm sm:text-base">Launch New Project</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Search, Filters, and View Toggle - Neon Green & Electric Lime */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 via-lime-300/15 to-emerald-400/10 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-500 animate-pulse" style={{animationDuration: '7s', animationDelay: '1s'}}></div>
          <div className="relative backdrop-blur-2xl bg-gradient-to-br from-neutral-800/40 via-green-900/35 to-lime-900/30 border-2 border-green-400/50 rounded-2xl p-6 shadow-2xl shadow-green-500/25">
            <div className="flex items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-300" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-green-400/30 rounded-xl text-white placeholder-green-200/60 focus:outline-none focus:border-green-300/60 focus:bg-slate-800/70 transition-all duration-300"
                />
              </div>
              <div className="flex items-center gap-4">
                <button className="relative group/btn">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/30 to-lime-400/30 rounded-lg blur-sm group-hover/btn:blur-md transition-all duration-300"></div>
                  <div className="relative bg-gradient-to-br from-green-500/40 to-lime-400/40 border border-green-300/50 rounded-lg px-4 py-2 flex items-center gap-2 hover:from-green-500/50 hover:to-lime-400/50 transition-all duration-300 shadow-lg">
                    <Filter className="w-4 h-4 text-green-200" />
                    <span className="text-white font-medium">Filters</span>
                  </div>
                </button>
                <div className="flex items-center bg-slate-800/50 border border-green-400/30 rounded-xl p-1">
                  <button
                    onClick={() => setViewMode('table')}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === 'table'
                        ? 'bg-green-500/50 text-white border border-green-300/50'
                        : 'text-green-300 hover:text-green-200 hover:bg-green-500/20'
                    }`}
                    title="Table View"
                  >
                    <List className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('kanban')}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === 'kanban'
                        ? 'bg-green-500/50 text-white border border-green-300/50'
                        : 'text-green-300 hover:text-green-200 hover:bg-green-500/20'
                    }`}
                    title="Kanban View"
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-sm text-green-200/80 font-medium">
                  {filteredProjects.length} of {projects.length} projects
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Projects Content */}
        {viewMode === 'table' ? renderTableView() : renderKanbanView()}

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <FolderOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm 
                ? 'Try adjusting your search criteria.' 
                : 'Get started by creating your first project.'
              }
            </p>
            {!searchTerm && (
              <button
                onClick={() => setShowAddModal(true)}
                className="btn btn-primary"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Project
              </button>
            )}
          </div>
        )}
      </div>

      {/* Add Project Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Create New Project"
        size="lg"
      >
        <form className="space-y-4 sm:space-y-6">
          {/* Project Name and Client Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-cyan-200">
                Project Name *
              </label>
              <input
                type="text"
                required
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-slate-800/50 border border-cyan-400/30 rounded-xl text-white placeholder-cyan-200/60 focus:outline-none focus:border-cyan-300/60 focus:ring-2 focus:ring-cyan-500/30 transition-all duration-300"
                placeholder="Enter project name"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-bold text-cyan-200">
                Client *
              </label>
              <select className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-slate-800/50 border border-cyan-400/30 rounded-xl text-white focus:outline-none focus:border-cyan-300/60 focus:ring-2 focus:ring-cyan-500/30 transition-all duration-300">
                <option value="">Select a client</option>
                <option value="acme">Acme Corp</option>
                <option value="techflow">TechFlow Innovations</option>
                <option value="startup">StartupXYZ</option>
              </select>
            </div>
          </div>
          
          {/* Description */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-cyan-200">
              Description
            </label>
            <textarea
              rows={3}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-slate-800/50 border border-cyan-400/30 rounded-xl text-white placeholder-cyan-200/60 focus:outline-none focus:border-cyan-300/60 focus:ring-2 focus:ring-cyan-500/30 transition-all duration-300 resize-none"
              placeholder="Describe the project..."
            />
          </div>
          
          {/* Due Date, Priority, and Budget Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-cyan-200">
                Due Date
              </label>
              <input
                type="date"
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-slate-800/50 border border-cyan-400/30 rounded-xl text-white focus:outline-none focus:border-cyan-300/60 focus:ring-2 focus:ring-cyan-500/30 transition-all duration-300"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-bold text-cyan-200">
                Priority
              </label>
              <select className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-slate-800/50 border border-cyan-400/30 rounded-xl text-white focus:outline-none focus:border-cyan-300/60 focus:ring-2 focus:ring-cyan-500/30 transition-all duration-300">
                <option value="low">Low</option>
                <option value="medium" selected>Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-bold text-cyan-200">
                Budget
              </label>
              <input
                type="number"
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-slate-800/50 border border-cyan-400/30 rounded-xl text-white placeholder-cyan-200/60 focus:outline-none focus:border-cyan-300/60 focus:ring-2 focus:ring-cyan-500/30 transition-all duration-300"
                placeholder="0"
              />
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-4 sm:pt-6 border-t border-cyan-400/20">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="relative group/btn order-2 sm:order-1"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-gray-500/30 to-slate-400/30 rounded-xl blur-sm group-hover/btn:blur-md transition-all duration-300"></div>
              <div className="relative bg-gradient-to-br from-gray-500/50 to-slate-400/50 border border-gray-300/60 rounded-xl px-4 sm:px-6 py-2 sm:py-3 flex items-center justify-center gap-2 hover:from-gray-500/60 hover:to-slate-400/60 transition-all duration-300 shadow-lg">
                <span className="font-semibold text-white text-sm sm:text-base">Cancel</span>
              </div>
            </button>
            <button
              type="submit"
              className="relative group/btn order-1 sm:order-2"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/30 to-blue-400/30 rounded-xl blur-sm group-hover/btn:blur-md transition-all duration-300"></div>
              <div className="relative bg-gradient-to-br from-cyan-500/50 to-blue-400/50 border border-cyan-300/60 rounded-xl px-4 sm:px-6 py-2 sm:py-3 flex items-center justify-center gap-2 hover:from-cyan-500/60 hover:to-blue-400/60 transition-all duration-300 shadow-lg">
                <Plus className="w-4 h-4 text-cyan-200" />
                <span className="font-semibold text-white text-sm sm:text-base">Create Project</span>
              </div>
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

export default Projects;