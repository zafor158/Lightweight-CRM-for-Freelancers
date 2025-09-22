import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../config/axios';
import toast from 'react-hot-toast';
import { ArrowLeft, Edit, Trash2, Plus, Calendar, DollarSign, Clock, CheckCircle, AlertCircle, Pause } from 'lucide-react';
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
      'In Progress': { class: 'badge-info', icon: Clock },
      'Completed': { class: 'badge-success', icon: CheckCircle },
      'Overdue': { class: 'badge-danger', icon: AlertCircle },
      'On Hold': { class: 'badge-warning', icon: Pause },
    };

    const config = statusConfig[status] || statusConfig['In Progress'];
    const Icon = config.icon;

    return (
      <span className={`badge ${config.class} flex items-center gap-1`}>
        <Icon size={12} />
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="loading">
        <div>Loading project details...</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">Project not found</h3>
        <p className="mt-1 text-sm text-gray-500">The project you're looking for doesn't exist.</p>
        <div className="mt-6">
          <Link to="/projects" className="btn btn-primary">
            <ArrowLeft size={20} />
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/projects" className="text-gray-400 hover:text-gray-600">
            <ArrowLeft size={24} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
            <p className="mt-1 text-sm text-gray-600">Project Details</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Link to={`/projects/${id}/edit`} className="btn btn-outline">
            <Edit size={20} />
            Edit
          </Link>
          <button className="btn btn-danger">
            <Trash2 size={20} />
            Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Project Information */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-medium text-gray-900">Project Information</h3>
            </div>
            <div className="card-body">
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium text-gray-900">Description</label>
                  <p className="mt-1 text-sm text-gray-600">
                    {project.description || 'No description provided'}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-gray-900">Status</label>
                    <div className="mt-1">
                      {getStatusBadge(project.status)}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-900">Due Date</label>
                    <div className="mt-1 flex items-center text-sm text-gray-600">
                      <Calendar size={16} className="mr-2" />
                      {project.due_date ? format(parseISO(project.due_date), 'MMM dd, yyyy') : 'No due date set'}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-900">Hourly Rate</label>
                    <div className="mt-1 flex items-center text-sm text-gray-600">
                      <DollarSign size={16} className="mr-2" />
                      {project.hourly_rate ? `$${parseFloat(project.hourly_rate).toFixed(2)}/hour` : 'Not set'}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-900">Total Hours</label>
                    <div className="mt-1 flex items-center text-sm text-gray-600">
                      <Clock size={16} className="mr-2" />
                      {project.total_hours ? `${parseFloat(project.total_hours).toFixed(1)} hours` : 'Not tracked'}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-900">Total Amount</label>
                  <div className="mt-1 flex items-center text-lg font-semibold text-gray-900">
                    <DollarSign size={20} className="mr-2" />
                    {project.total_amount ? `$${parseFloat(project.total_amount).toFixed(2)}` : 'Not calculated'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Client Information */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-medium text-gray-900">Client Information</h3>
            </div>
            <div className="card-body">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium text-lg">
                  {project.client_name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="text-lg font-medium text-gray-900">{project.client_name}</h4>
                  {project.client_email && (
                    <p className="text-sm text-gray-600">{project.client_email}</p>
                  )}
                  {project.client_phone && (
                    <p className="text-sm text-gray-600">{project.client_phone}</p>
                  )}
                  {project.client_company && (
                    <p className="text-sm text-gray-600">{project.client_company}</p>
                  )}
                </div>
              </div>
              <div className="mt-4">
                <Link to={`/clients/${project.client_id}`} className="btn btn-outline btn-sm">
                  View Client Details
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-medium text-gray-900">Project Stats</h3>
            </div>
            <div className="card-body">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Created</span>
                  <span className="text-sm font-medium text-gray-900">
                    {format(parseISO(project.created_at), 'MMM dd, yyyy')}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Last Updated</span>
                  <span className="text-sm font-medium text-gray-900">
                    {format(parseISO(project.updated_at), 'MMM dd, yyyy')}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Status</span>
                  <span className="text-sm font-medium text-gray-900">{project.status}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
            </div>
            <div className="card-body">
              <div className="space-y-3">
                <Link to={`/invoices/new?project=${id}`} className="btn btn-outline w-full justify-center">
                  <Plus size={16} />
                  Create Invoice
                </Link>
                <Link to={`/projects/${id}/edit`} className="btn btn-outline w-full justify-center">
                  <Edit size={16} />
                  Edit Project
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
