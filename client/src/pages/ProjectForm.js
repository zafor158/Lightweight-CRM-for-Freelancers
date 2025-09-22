import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { ArrowLeft, Save, FolderOpen, Calendar, DollarSign, Clock, User } from 'lucide-react';

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
  }, [id, searchParams]);

  const fetchClients = async () => {
    try {
      const response = await axios.get('/api/clients');
      setClients(response.data.clients);
    } catch (error) {
      console.error('Error fetching clients:', error);
      toast.error('Failed to fetch clients');
    }
  };

  const fetchProject = async () => {
    try {
      const response = await axios.get(`/api/projects/${id}`);
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
        await axios.put(`/api/projects/${id}`, submitData);
        toast.success('Project updated successfully!');
      } else {
        await axios.post('/api/projects', submitData);
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/projects" className="text-gray-400 hover:text-gray-600 transition-colors">
            <ArrowLeft size={24} />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {isEditing ? 'Edit Project' : 'Add New Project'}
            </h1>
            <p className="mt-1 text-gray-600">
              {isEditing ? 'Update project information' : 'Create a new project for your client'}
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl">
        <div className="card">
          <div className="card-header">
            <h3 className="text-xl font-semibold text-gray-900">Project Information</h3>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Information */}
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <FolderOpen className="h-5 w-5 mr-2 text-primary-600" />
                  Basic Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="form-group">
                    <label htmlFor="name" className="form-label">
                      Project Name *
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      className={`form-input ${errors.name ? 'border-red-500' : ''}`}
                      placeholder="Enter project name"
                      value={formData.name}
                      onChange={handleChange}
                    />
                    {errors.name && <p className="error">{errors.name}</p>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="client_id" className="form-label">
                      Client *
                    </label>
                    <select
                      id="client_id"
                      name="client_id"
                      required
                      className={`form-select ${errors.client_id ? 'border-red-500' : ''}`}
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
                    {errors.client_id && <p className="error">{errors.client_id}</p>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="project_type" className="form-label">
                      Project Type
                    </label>
                    <select
                      id="project_type"
                      name="project_type"
                      className="form-select"
                      value={formData.project_type}
                      onChange={handleChange}
                    >
                      <option value="Development">Development</option>
                      <option value="Design">Design</option>
                      <option value="Consulting">Consulting</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Writing">Writing</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="priority" className="form-label">
                      Priority
                    </label>
                    <select
                      id="priority"
                      name="priority"
                      className="form-select"
                      value={formData.priority}
                      onChange={handleChange}
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Urgent">Urgent</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="description" className="form-label">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    className="form-input form-textarea"
                    placeholder="Describe the project scope and requirements..."
                    value={formData.description}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Timeline */}
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-primary-600" />
                  Timeline
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="form-group">
                    <label htmlFor="start_date" className="form-label">
                      Start Date
                    </label>
                    <input
                      id="start_date"
                      name="start_date"
                      type="date"
                      className="form-input"
                      value={formData.start_date}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="due_date" className="form-label">
                      Due Date
                    </label>
                    <input
                      id="due_date"
                      name="due_date"
                      type="date"
                      className="form-input"
                      value={formData.due_date}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              {/* Financial Information */}
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <DollarSign className="h-5 w-5 mr-2 text-primary-600" />
                  Financial Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="form-group">
                    <label htmlFor="hourly_rate" className="form-label">
                      Hourly Rate ($)
                    </label>
                    <input
                      id="hourly_rate"
                      name="hourly_rate"
                      type="number"
                      step="0.01"
                      min="0"
                      className={`form-input ${errors.hourly_rate ? 'border-red-500' : ''}`}
                      placeholder="0.00"
                      value={formData.hourly_rate}
                      onChange={handleChange}
                    />
                    {errors.hourly_rate && <p className="error">{errors.hourly_rate}</p>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="total_hours" className="form-label">
                      Total Hours
                    </label>
                    <input
                      id="total_hours"
                      name="total_hours"
                      type="number"
                      step="0.1"
                      min="0"
                      className={`form-input ${errors.total_hours ? 'border-red-500' : ''}`}
                      placeholder="0.0"
                      value={formData.total_hours}
                      onChange={handleChange}
                    />
                    {errors.total_hours && <p className="error">{errors.total_hours}</p>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="total_amount" className="form-label">
                      Total Amount ($)
                    </label>
                    <input
                      id="total_amount"
                      name="total_amount"
                      type="number"
                      step="0.01"
                      min="0"
                      className="form-input"
                      placeholder="0.00"
                      value={formData.total_amount}
                      onChange={handleChange}
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Auto-calculated from hourly rate × total hours
                    </p>
                  </div>

                  <div className="form-group">
                    <label htmlFor="budget" className="form-label">
                      Project Budget ($)
                    </label>
                    <input
                      id="budget"
                      name="budget"
                      type="number"
                      step="0.01"
                      min="0"
                      className={`form-input ${errors.budget ? 'border-red-500' : ''}`}
                      placeholder="0.00"
                      value={formData.budget}
                      onChange={handleChange}
                    />
                    {errors.budget && <p className="error">{errors.budget}</p>}
                  </div>
                </div>
              </div>

              {/* Project Status */}
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">Project Status</h4>
                <div className="form-group">
                  <label htmlFor="status" className="form-label">
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    className="form-select"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="On Hold">On Hold</option>
                    <option value="Overdue">Overdue</option>
                  </select>
                </div>
              </div>

              {/* Additional Information */}
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">Additional Information</h4>
                <div className="form-group">
                  <label htmlFor="tags" className="form-label">
                    Tags
                  </label>
                  <input
                    id="tags"
                    name="tags"
                    type="text"
                    className="form-input"
                    placeholder="Enter tags separated by commas (e.g., web, react, urgent)"
                    value={formData.tags}
                    onChange={handleChange}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Use tags to categorize and filter your projects
                  </p>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                <Link to="/projects" className="btn btn-outline">
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary"
                >
                  <Save size={20} />
                  {loading ? 'Saving...' : (isEditing ? 'Update Project' : 'Create Project')}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectForm;
