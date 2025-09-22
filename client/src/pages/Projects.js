import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../config/axios';
import toast from 'react-hot-toast';
import { 
  FolderOpen, 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  Calendar,
  User,
  DollarSign,
  CheckCircle,
  ArrowUpDown,
  ChevronDown,
  Play,
  Pause,
  XCircle
} from 'lucide-react';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await api.get('/projects');
      setProjects(response.data.projects || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast.error('Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await api.delete(`/projects/${id}`);
        setProjects(projects.filter(project => project.id !== id));
        toast.success('Project deleted successfully');
      } catch (error) {
        console.error('Error deleting project:', error);
        toast.error('Failed to delete project');
      }
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'In Progress': { color: 'bg-blue-100 text-blue-800 border-blue-200', icon: Play },
      'Completed': { color: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircle },
      'On Hold': { color: 'bg-orange-100 text-orange-800 border-orange-200', icon: Pause },
      'Overdue': { color: 'bg-red-100 text-red-800 border-red-200', icon: XCircle },
    };
    
    const config = statusConfig[status] || statusConfig['In Progress'];
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${config.color}`}>
        <Icon className="w-3 h-3 mr-1.5" />
        {status}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      'High': { color: 'bg-red-100 text-red-800' },
      'Medium': { color: 'bg-yellow-100 text-yellow-800' },
      'Low': { color: 'bg-green-100 text-green-800' },
      'Urgent': { color: 'bg-purple-100 text-purple-800' },
    };
    
    const config = priorityConfig[priority] || priorityConfig['Medium'];
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {priority}
      </span>
    );
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = 
      project.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  }).sort((a, b) => {
    let aValue, bValue;
    
    switch (sortBy) {
      case 'total_amount':
        aValue = parseFloat(a.total_amount || 0);
        bValue = parseFloat(b.total_amount || 0);
        break;
      case 'due_date':
        aValue = new Date(a.due_date || 0);
        bValue = new Date(b.due_date || 0);
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
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6">
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 -m-6 lg:-m-8 p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="space-y-2">
            <h1 className="text-4xl lg:text-5xl font-bold text-slate-900">Projects</h1>
            <p className="text-lg text-slate-600 max-w-2xl">
              Track and manage your client projects and deliverables with comprehensive project management tools.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/projects/new"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 text-lg"
            >
              <Plus className="w-6 h-6 mr-3" />
              Add New Project
            </Link>
            <button className="bg-white border border-slate-300 hover:border-slate-400 text-slate-700 px-6 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center shadow-sm hover:shadow-md">
              <Filter className="w-5 h-5 mr-2" />
              Advanced Filters
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-2">Total Projects</p>
                <p className="text-3xl font-bold text-slate-900">{projects.length}</p>
                <p className="text-xs text-slate-500 mt-1">All time projects</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-2xl">
                <FolderOpen className="w-8 h-8 text-indigo-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-2">In Progress</p>
                <p className="text-3xl font-bold text-slate-900">
                  {projects.filter(p => p.status === 'In Progress').length}
                </p>
                <p className="text-xs text-slate-500 mt-1">Active projects</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl">
                <Play className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-2">Completed</p>
                <p className="text-3xl font-bold text-slate-900">
                  {projects.filter(p => p.status === 'Completed').length}
                </p>
                <p className="text-xs text-slate-500 mt-1">Finished projects</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-2xl">
                <CheckCircle className="w-8 h-8 text-emerald-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-2">Total Value</p>
                <p className="text-3xl font-bold text-slate-900">
                  ${projects.reduce((sum, p) => sum + parseFloat(p.total_amount || 0), 0).toLocaleString()}
                </p>
                <p className="text-xs text-slate-500 mt-1">Project value</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl">
                <DollarSign className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="text"
                  placeholder="Search projects by name, client, or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-50 focus:bg-white transition-colors"
                />
              </div>
              <div className="relative w-full sm:w-48">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full appearance-none pl-4 pr-10 py-4 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white transition-colors"
                >
                  <option value="all">All Status</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="On Hold">On Hold</option>
                  <option value="Overdue">Overdue</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-slate-600">
                {filteredProjects.length} of {projects.length} projects
              </span>
            </div>
          </div>
        </div>

        {/* Projects Table */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          {filteredProjects.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-8">
                <FolderOpen className="w-12 h-12 text-slate-400" />
              </div>
              <h3 className="text-2xl font-semibold text-slate-900 mb-3">No projects found</h3>
              <p className="text-slate-600 mb-10 max-w-lg mx-auto text-lg">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filter criteria to find projects.' 
                  : 'Get started by creating your first project to manage your client work.'
                }
              </p>
              {!searchTerm && statusFilter === 'all' && (
                <Link
                  to="/projects/new"
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-lg font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                >
                  <Plus className="w-6 h-6 mr-3" />
                  Create Your First Project
                </Link>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-8 py-6 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      <SortButton column="name">Project Details</SortButton>
                    </th>
                    <th className="px-6 py-6 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      <SortButton column="status">Status</SortButton>
                    </th>
                    <th className="px-6 py-6 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      <SortButton column="client_name">Client</SortButton>
                    </th>
                    <th className="px-6 py-6 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      <SortButton column="due_date">Due Date</SortButton>
                    </th>
                    <th className="px-6 py-6 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      <SortButton column="total_amount">Value</SortButton>
                    </th>
                    <th className="px-6 py-6 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Priority</th>
                    <th className="px-8 py-6 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {filteredProjects.map((project) => (
                    <tr key={project.id} className="hover:bg-slate-50 transition-colors duration-200 group">
                      <td className="px-8 py-6 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-14 h-14 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-2xl flex items-center justify-center mr-5 group-hover:scale-105 transition-transform duration-200">
                            <FolderOpen className="w-7 h-7 text-indigo-600" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-base font-semibold text-slate-900 mb-1">
                              {project.name}
                            </div>
                            <div className="text-sm text-slate-500 truncate max-w-sm">
                              {project.description || 'No description provided'}
                            </div>
                            <div className="flex items-center mt-2">
                              <Calendar className="w-4 h-4 text-slate-400 mr-1" />
                              <span className="text-xs text-slate-500">
                                Created {new Date(project.created_at).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6 whitespace-nowrap">
                        {getStatusBadge(project.status)}
                      </td>
                      <td className="px-6 py-6 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mr-4">
                            <User className="w-6 h-6 text-slate-600" />
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-slate-900">
                              {project.client_name}
                            </div>
                            <div className="text-xs text-slate-500">
                              Client
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6 whitespace-nowrap">
                        <div className="text-sm font-medium text-slate-900">
                          {project.due_date ? new Date(project.due_date).toLocaleDateString() : '-'}
                        </div>
                        {project.due_date && (
                          <div className="text-xs text-slate-500 mt-1">
                            {new Date(project.due_date) > new Date() ? 'Upcoming' : 'Overdue'}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-6 whitespace-nowrap">
                        <div className="text-lg font-bold text-slate-900">
                          ${parseFloat(project.total_amount || 0).toLocaleString()}
                        </div>
                        <div className="text-xs text-slate-500">
                          Project value
                        </div>
                      </td>
                      <td className="px-6 py-6 whitespace-nowrap">
                        {getPriorityBadge(project.priority)}
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <Link
                            to={`/projects/${project.id}`}
                            className="p-3 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 group"
                            title="View Project Details"
                          >
                            <Eye className="w-5 h-5" />
                          </Link>
                          <Link
                            to={`/projects/${project.id}/edit`}
                            className="p-3 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all duration-200 group"
                            title="Edit Project"
                          >
                            <Edit className="w-5 h-5" />
                          </Link>
                          <button
                            onClick={() => handleDelete(project.id)}
                            className="p-3 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 group"
                            title="Delete Project"
                          >
                            <Trash2 className="w-5 h-5" />
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

export default Projects;