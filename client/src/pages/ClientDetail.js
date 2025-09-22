import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { ArrowLeft, Edit, Trash2, Plus, Mail, Phone, Building, MapPin, FileText } from 'lucide-react';

const ClientDetail = () => {
  const { id } = useParams();
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchClient();
    }
  }, [id, fetchClient]);

  const fetchClient = useCallback(async () => {
    try {
      const response = await axios.get(`/api/clients/${id}`);
      setClient(response.data.client);
    } catch (error) {
      console.error('Error fetching client:', error);
      toast.error('Failed to fetch client details');
    } finally {
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return (
      <div className="loading">
        <div>Loading client details...</div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">Client not found</h3>
        <p className="mt-1 text-sm text-gray-500">The client you're looking for doesn't exist.</p>
        <div className="mt-6">
          <Link to="/clients" className="btn btn-primary">
            <ArrowLeft size={20} />
            Back to Clients
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
          <Link to="/clients" className="text-gray-400 hover:text-gray-600">
            <ArrowLeft size={24} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{client.name}</h1>
            <p className="mt-1 text-sm text-gray-600">Client Details</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Link to={`/clients/${id}/edit`} className="btn btn-outline">
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
        {/* Client Information */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-medium text-gray-900">Contact Information</h3>
            </div>
            <div className="card-body">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {client.email && (
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Email</p>
                      <p className="text-sm text-gray-600">{client.email}</p>
                    </div>
                  </div>
                )}
                
                {client.phone && (
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Phone</p>
                      <p className="text-sm text-gray-600">{client.phone}</p>
                    </div>
                  </div>
                )}
                
                {client.company && (
                  <div className="flex items-center">
                    <Building className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Company</p>
                      <p className="text-sm text-gray-600">{client.company}</p>
                    </div>
                  </div>
                )}
                
                {client.address && (
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Address</p>
                      <p className="text-sm text-gray-600">{client.address}</p>
                    </div>
                  </div>
                )}
              </div>
              
              {client.notes && (
                <div className="mt-6">
                  <div className="flex items-center mb-2">
                    <FileText className="h-5 w-5 text-gray-400 mr-3" />
                    <p className="text-sm font-medium text-gray-900">Notes</p>
                  </div>
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                    {client.notes}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Projects */}
          <div className="card">
            <div className="card-header">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Projects</h3>
                <Link to={`/projects/new?client=${id}`} className="btn btn-primary btn-sm">
                  <Plus size={16} />
                  Add Project
                </Link>
              </div>
            </div>
            <div className="card-body">
              {client.projects && client.projects.length > 0 ? (
                <div className="space-y-4">
                  {client.projects.map((project) => (
                    <div key={project.id} className="border border-gray-200 rounded-md p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">{project.name}</h4>
                          {project.description && (
                            <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`badge ${
                            project.status === 'Completed' ? 'badge-success' :
                            project.status === 'In Progress' ? 'badge-info' :
                            project.status === 'Overdue' ? 'badge-danger' : 'badge-warning'
                          }`}>
                            {project.status}
                          </span>
                          <Link to={`/projects/${project.id}`} className="text-blue-600 hover:text-blue-500">
                            View
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-sm text-gray-500">No projects yet</p>
                  <Link to={`/projects/new?client=${id}`} className="btn btn-primary btn-sm mt-4">
                    <Plus size={16} />
                    Add First Project
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-medium text-gray-900">Quick Stats</h3>
            </div>
            <div className="card-body">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Projects</span>
                  <span className="text-sm font-medium text-gray-900">
                    {client.projects ? client.projects.length : 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Active Projects</span>
                  <span className="text-sm font-medium text-gray-900">
                    {client.projects ? client.projects.filter(p => p.status === 'In Progress').length : 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Completed</span>
                  <span className="text-sm font-medium text-gray-900">
                    {client.projects ? client.projects.filter(p => p.status === 'Completed').length : 0}
                  </span>
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
                <Link to={`/projects/new?client=${id}`} className="btn btn-outline w-full justify-center">
                  <Plus size={16} />
                  New Project
                </Link>
                <Link to={`/invoices/new?client=${id}`} className="btn btn-outline w-full justify-center">
                  <FileText size={16} />
                  Create Invoice
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDetail;
