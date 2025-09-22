import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../config/axios';
import toast from 'react-hot-toast';
import { 
  User, 
  Building, 
  MapPin, 
  MessageSquare,
  Save,
  ArrowLeft
} from 'lucide-react';

const ClientForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    address: '',
    website: '',
    tax_id: '',
    payment_terms: '30',
    preferred_contact_method: 'email',
    notes: ''
  });

  const isEditing = id && id !== 'new';

  const fetchClient = useCallback(async () => {
    try {
      const response = await api.get(`/clients/${id}`);
      setFormData(response.data.client);
    } catch (error) {
      console.error('Error fetching client:', error);
      toast.error('Failed to fetch client data');
    }
  }, [id]);

  useEffect(() => {
    if (isEditing) {
      fetchClient();
    }
  }, [id, isEditing, fetchClient]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEditing) {
        await api.put(`/clients/${id}`, formData);
        toast.success('Client updated successfully');
      } else {
        await api.post('/clients', formData);
        toast.success('Client created successfully');
      }
      navigate('/clients');
    } catch (error) {
      console.error('Error saving client:', error);
      toast.error('Failed to save client');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/clients')}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isEditing ? 'Edit Client' : 'Add New Client'}
            </h1>
            <p className="text-sm text-gray-600">
              {isEditing ? 'Update client information' : 'Enter client details to get started'}
            </p>
          </div>
        </div>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="btn btn-primary"
        >
          <Save className="w-4 h-4 mr-2" />
          {loading ? 'Saving...' : (isEditing ? 'Update Client' : 'Create Client')}
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <User className="w-5 h-5 mr-2 text-blue-600" />
                  Basic Information
                </h3>
              </div>
              <div className="card-body space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="form-input"
                    placeholder="Enter client's full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="form-input"
                    placeholder="client@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Company name"
                  />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-green-600" />
                  Contact Information
                </h3>
              </div>
              <div className="card-body space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows={3}
                    className="form-input"
                    placeholder="Enter full address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Website
                  </label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="https://example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Contact Method
                  </label>
                  <select
                    name="preferred_contact_method"
                    value={formData.preferred_contact_method}
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value="email">Email</option>
                    <option value="phone">Phone</option>
                    <option value="sms">SMS</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Business Information */}
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Building className="w-5 h-5 mr-2 text-purple-600" />
                  Business Information
                </h3>
              </div>
              <div className="card-body space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tax ID
                  </label>
                  <input
                    type="text"
                    name="tax_id"
                    value={formData.tax_id}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Tax identification number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Terms
                  </label>
                  <select
                    name="payment_terms"
                    value={formData.payment_terms}
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value="15">15 days</option>
                    <option value="30">30 days</option>
                    <option value="45">45 days</option>
                    <option value="60">60 days</option>
                    <option value="90">90 days</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <MessageSquare className="w-5 h-5 mr-2 text-orange-600" />
                  Additional Information
                </h3>
              </div>
              <div className="card-body">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={6}
                    className="form-input"
                    placeholder="Add any additional notes about this client..."
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ClientForm;