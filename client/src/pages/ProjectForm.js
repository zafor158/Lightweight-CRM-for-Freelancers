import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useSearchParams } from 'react-router-dom';
import api from '../config/axios';
import toast from 'react-hot-toast';
import { ArrowLeft, Save, FolderOpen, Calendar, DollarSign } from 'lucide-react';

const ProjectForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [clients, setClients] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    client_id: '',
    status: 'In Progress',
    due_date: '',
    hourly_rate: '',
    total_hours: '',
    total_amount: '',
    start_date: '',
    priority: 'Medium',
    project_type: 'Development',
    budget: '',
    tags: ''
  });
  const [errors, setErrors] = useState({});

  const fetchClients = async () => {
    try {
      const response = await api.get('/clients');
      setClients(response.data.clients);
    } catch (error) {
      console.error('Error fetching clients:', error);
      toast.error('Failed to fetch clients');
    }
  };

  const fetchProject = async () => {
    try {
      const response = await api.get(`/projects/${id}`);
      if (response.data.project) {
        const project = response.data.project;
        setFormData({
          name: project.name || '',
          description: project.description || '',
          client_id: project.client_id || '',
          status: project.status || 'In Progress',
          due_date: project.due_date ? project.due_date.split('T')[0] : '',
          hourly_rate: project.hourly_rate || '',
          total_hours: project.total_hours || '',
          total_amount: project.total_amount || '',
          start_date: project.start_date ? project.start_date.split('T')[0] : '',
          priority: project.priority || 'Medium',
          project_type: project.project_type || 'Development',
          budget: project.budget || '',
          tags: project.tags || ''
        });
      }
    } catch (error) {
      console.error('Error fetching project:', error);
      toast.error('Failed to fetch project details');
    }
  };

  useEffect(() => {
    fetchClients();
    
    if (id && id !== 'new') {
      setIsEditing(true);
      fetchProject();
    } else {
      // Set default client if provided in URL params
      const clientId = searchParams.get('client');
      if (clientId) {
        setFormData(prev => ({ ...prev, client_id: clientId }));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, searchParams]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Auto-calculate total amount when hourly rate or total hours change
    if (name === 'hourly_rate' || name === 'total_hours') {
      const rate = name === 'hourly_rate' ? parseFloat(value) : parseFloat(formData.hourly_rate);
      const hours = name === 'total_hours' ? parseFloat(value) : parseFloat(formData.total_hours);
      
      if (rate && hours) {
        setFormData(prev => ({
          ...prev,
          total_amount: (rate * hours).toFixed(2)
        }));
      }
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Project name is required';
    }

    if (!formData.client_id) {
      newErrors.client_id = 'Please select a client';
    }

    if (formData.hourly_rate && isNaN(parseFloat(formData.hourly_rate))) {
      newErrors.hourly_rate = 'Please enter a valid hourly rate';
    }

    if (formData.total_hours && isNaN(parseFloat(formData.total_hours))) {
      newErrors.total_hours = 'Please enter a valid number of hours';
    }

    if (formData.budget && isNaN(parseFloat(formData.budget))) {
      newErrors.budget = 'Please enter a valid budget amount';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const submitData = {
        ...formData,
        hourly_rate: formData.hourly_rate ? parseFloat(formData.hourly_rate) : null,
        total_hours: formData.total_hours ? parseFloat(formData.total_hours) : null,
        total_amount: formData.total_amount ? parseFloat(formData.total_amount) : null,
        budget: formData.budget ? parseFloat(formData.budget) : null
      };

      if (isEditing) {
        await api.put(`/projects/${id}`, submitData);
        toast.success('Project updated successfully!');
      } else {
        await api.post('/projects', submitData);
        toast.success('Project created successfully!');
      }
      
      navigate('/projects');
    } catch (error) {
      console.error('Error saving project:', error);
      toast.error(error.response?.data?.message || 'Failed to save project');
    } finally {
      setLoading(false);
    }
  };

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

      <div className="max-w-7xl mx-auto p-6 space-y-6 relative">
        {/* Header - Electric Orange & Red */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-400/25 via-red-300/20 to-rose-400/15 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500 animate-pulse" style={{animationDuration: '6s'}}></div>
          <div className="relative backdrop-blur-2xl bg-gradient-to-br from-slate-800/45 via-orange-900/40 to-red-900/35 border-2 border-orange-400/60 rounded-2xl p-6 shadow-2xl shadow-orange-500/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link to="/projects" className="relative group/btn">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500/30 to-red-400/30 rounded-xl blur-sm group-hover/btn:blur-md transition-all duration-300"></div>
                  <div className="relative bg-gradient-to-br from-orange-500/50 to-red-400/50 border border-orange-300/60 rounded-xl p-3 hover:from-orange-500/60 hover:to-red-400/60 transition-all duration-300 shadow-lg">
                    <ArrowLeft className="w-6 h-6 text-orange-200" />
                  </div>
                </Link>
                <div>
                  <h1 className="text-4xl font-black text-white drop-shadow-lg flex items-center gap-3">
                    <FolderOpen className="w-8 h-8 text-orange-300" />
                    {isEditing ? 'Edit Project' : 'Add New Project'}
                  </h1>
                  <p className="text-orange-200/80 text-lg mt-2">
                    {isEditing ? 'Update project information and settings' : 'Create a new project for your client'}
                  </p>
                </div>
              </div>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="relative group/btn"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500/30 to-red-400/30 rounded-xl blur-sm group-hover/btn:blur-md transition-all duration-300"></div>
                  <div className="relative bg-gradient-to-br from-orange-500/50 to-red-400/50 border border-orange-300/60 rounded-xl px-6 py-3 flex items-center gap-2 hover:from-orange-500/60 hover:to-red-400/60 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">
                    <Save className="w-5 h-5 text-orange-200" />
                    <span className="font-semibold text-white">
                      {loading ? 'Saving...' : (isEditing ? 'Update Project' : 'Create Project')}
                    </span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Form - Neon Cyan & Electric Blue */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 via-blue-300/15 to-teal-400/10 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-500 animate-pulse" style={{animationDuration: '7s', animationDelay: '1s'}}></div>
          <div className="relative backdrop-blur-2xl bg-gradient-to-br from-slate-800/40 via-cyan-900/35 to-blue-900/30 border-2 border-cyan-400/50 rounded-2xl shadow-2xl shadow-cyan-500/25">
            <div className="p-6 border-b border-cyan-400/30">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-3 rounded-xl bg-cyan-500/30 border border-cyan-400/40">
                  <FolderOpen className="w-6 h-6 text-cyan-300" />
                </div>
                <h2 className="text-2xl font-bold text-white">Project Information</h2>
              </div>
              <p className="text-cyan-200/80">Fill in the details to create your new project</p>
            </div>
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-6">
                  <div className="flex items-center space-x-3 pb-4 border-b border-cyan-400/20">
                    <div className="p-2 rounded-lg bg-cyan-500/30 border border-cyan-400/40">
                      <FolderOpen className="w-5 h-5 text-cyan-300" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Basic Information</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="name" className="block text-sm font-bold text-cyan-200">
                        Project Name *
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        className={`w-full px-4 py-3 bg-slate-800/50 border rounded-xl text-white placeholder-cyan-200/60 focus:outline-none focus:ring-2 transition-all duration-300 ${
                          errors.name 
                            ? 'border-red-400 focus:border-red-300 focus:ring-red-500/30' 
                            : 'border-cyan-400/30 focus:border-cyan-300/60 focus:ring-cyan-500/30'
                        }`}
                        placeholder="Enter project name"
                        value={formData.name}
                        onChange={handleChange}
                      />
                      {errors.name && <p className="text-red-300 text-sm mt-1">{errors.name}</p>}
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="client_id" className="block text-sm font-bold text-cyan-200">
                        Client *
                      </label>
                      <select
                        id="client_id"
                        name="client_id"
                        required
                        className={`w-full px-4 py-3 bg-slate-800/50 border rounded-xl text-white focus:outline-none focus:ring-2 transition-all duration-300 ${
                          errors.client_id 
                            ? 'border-red-400 focus:border-red-300 focus:ring-red-500/30' 
                            : 'border-cyan-400/30 focus:border-cyan-300/60 focus:ring-cyan-500/30'
                        }`}
                        value={formData.client_id}
                        onChange={handleChange}
                      >
                        <option value="">Select a client</option>
                        {clients.map(client => (
                          <option key={client.id} value={client.id}>
                            {client.name} {client.company && `(${client.company})`}
                          </option>
                        ))}
                      </select>
                      {errors.client_id && <p className="text-red-300 text-sm mt-1">{errors.client_id}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="description" className="block text-sm font-bold text-cyan-200">
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      rows={4}
                      className="w-full px-4 py-3 bg-slate-800/50 border border-cyan-400/30 rounded-xl text-white placeholder-cyan-200/60 focus:outline-none focus:border-cyan-300/60 focus:ring-2 focus:ring-cyan-500/30 transition-all duration-300 resize-none"
                      placeholder="Describe the project scope and requirements..."
                      value={formData.description}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-8 border-t border-cyan-400/20">
                  <Link 
                    to="/projects" 
                    className="relative group/btn"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-500/30 to-slate-400/30 rounded-xl blur-sm group-hover/btn:blur-md transition-all duration-300"></div>
                    <div className="relative bg-gradient-to-br from-gray-500/50 to-slate-400/50 border border-gray-300/60 rounded-xl px-6 py-3 flex items-center gap-2 hover:from-gray-500/60 hover:to-slate-400/60 transition-all duration-300 shadow-lg">
                      <ArrowLeft className="w-4 h-4 text-gray-200" />
                      <span className="font-semibold text-white">Back to Projects</span>
                    </div>
                  </Link>
                  
                  <div className="flex items-center space-x-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="relative group/btn"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/30 to-blue-400/30 rounded-xl blur-sm group-hover/btn:blur-md transition-all duration-300"></div>
                      <div className="relative bg-gradient-to-br from-cyan-500/50 to-blue-400/50 border border-cyan-300/60 rounded-xl px-6 py-3 flex items-center gap-2 hover:from-cyan-500/60 hover:to-blue-400/60 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">
                        <Save className="w-5 h-5 text-cyan-200" />
                        <span className="font-semibold text-white">
                          {loading ? 'Saving...' : (isEditing ? 'Update Project' : 'Create Project')}
                        </span>
                      </div>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
  );
};

export default ProjectForm;
