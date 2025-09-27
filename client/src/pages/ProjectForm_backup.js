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
    <div className="min-h-screen space-y-8">
      <div className="relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <Link 
              to="/projects" 
              className="group flex items-center justify-center w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-400/30 hover:bg-purple-500/30 hover:border-purple-400/50 transition-all duration-200"
            >
              <ArrowLeft size={20} className="text-purple-400 group-hover:text-purple-300" />
            </Link>
            <div>
              <h1 className="text-4xl font-bold space-text-primary mb-2">
                {isEditing ? 'Edit Project' : 'Add New Project'}
              </h1>
              <p className="text-lg space-text-secondary">
                {isEditing ? 'Update project information and settings' : 'Create a new project for your client'}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="group flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <Save className="w-5 h-5" />
              <span>{loading ? 'Saving...' : (isEditing ? 'Update Project' : 'Create Project')}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="space-card p-8">
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-3 rounded-xl bg-purple-500/20 border border-purple-400/30">
                <FolderOpen className="w-6 h-6 text-purple-400" />
              </div>
              <h2 className="text-2xl font-bold space-text-primary">Project Information</h2>
            </div>
            <p className="space-text-secondary">Fill in the details to create your new project</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-10">
            <div className="space-y-6">
              <div className="flex items-center space-x-3 pb-4 border-b border-purple-400/20">
                <div className="p-2 rounded-lg bg-blue-500/20 border border-blue-400/30">
                  <FolderOpen className="w-5 h-5 text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold space-text-primary">Basic Information</h3>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-sm font-semibold space-text-primary">
                    Project Name *
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className={`space-input w-full ${errors.name ? 'border-red-500 focus:border-red-500' : ''}`}
                    placeholder="Enter project name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                  {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <label htmlFor="client_id" className="block text-sm font-semibold space-text-primary">
                    Client *
                  </label>
                  <select
                    id="client_id"
                    name="client_id"
                    required
                    className={`space-input w-full ${errors.client_id ? 'border-red-500 focus:border-red-500' : ''}`}
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
                  {errors.client_id && <p className="text-red-400 text-sm mt-1">{errors.client_id}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="description" className="block text-sm font-semibold space-text-primary">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  className="space-input w-full resize-none"
                  placeholder="Describe the project scope and requirements..."
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-8 border-t border-purple-400/20">
              <Link 
                to="/projects" 
                className="group flex items-center space-x-2 px-6 py-3 space-btn-secondary hover:scale-105 transition-all duration-200"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Projects</span>
              </Link>
              
              <div className="flex items-center space-x-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="group flex items-center space-x-3 px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  <Save className="w-5 h-5" />
                  <span>{loading ? 'Saving...' : (isEditing ? 'Update Project' : 'Create Project')}</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProjectForm;
