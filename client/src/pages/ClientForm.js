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
    job_title: '',
    industry: '',
    website: '',
    linkedin: '',
    street_address: '',
    city: '',
    state_province: '',
    zip_postal: '',
    country: '',
    company_size: '',
    annual_revenue: '',
    tax_id: '',
    payment_terms: '30',
    preferred_contact_method: 'email',
    best_time_to_contact: '',
    notes: '',
    tags: ''
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
            className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold space-text-primary">
              {isEditing ? 'Edit Client' : 'Add New Client'}
            </h1>
            <p className="text-sm space-text-secondary">
              {isEditing ? 'Update client information' : 'Enter client details to get started'}
            </p>
          </div>
        </div>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="space-btn"
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
            <div className="space-card p-6">
              <div className="mb-4">
                <h3 className="text-lg font-semibold space-text-primary flex items-center border-b border-white/10 pb-2">
                  <User className="w-5 h-5 mr-2 text-blue-400" />
                  Basic Information
                </h3>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold space-text-primary mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="space-input w-full"
                    placeholder="Enter client's full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold space-text-primary mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="space-input w-full"
                    placeholder="client@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold space-text-primary mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="space-input w-full"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold space-text-primary mb-2">
                    Company
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="space-input w-full"
                    placeholder="Company name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold space-text-primary mb-2">
                    Job Title
                  </label>
                  <input
                    type="text"
                    name="job_title"
                    value={formData.job_title}
                    onChange={handleChange}
                    className="space-input w-full"
                    placeholder="e.g., CEO, Marketing Director"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold space-text-primary mb-2">
                    Industry
                  </label>
                  <select
                    name="industry"
                    value={formData.industry}
                    onChange={handleChange}
                    className="space-input w-full"
                  >
                    <option value="">Select industry</option>
                    <option value="technology">Technology</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="finance">Finance</option>
                    <option value="retail">Retail</option>
                    <option value="education">Education</option>
                    <option value="manufacturing">Manufacturing</option>
                    <option value="consulting">Consulting</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-card p-6">
              <div className="mb-4">
                <h3 className="text-lg font-semibold space-text-primary flex items-center border-b border-white/10 pb-2">
                  <MapPin className="w-5 h-5 mr-2 text-green-400" />
                  Contact Information
                </h3>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold space-text-primary mb-2">
                    Website
                  </label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    className="space-input w-full"
                    placeholder="https://company.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold space-text-primary mb-2">
                    LinkedIn
                  </label>
                  <input
                    type="url"
                    name="linkedin"
                    value={formData.linkedin}
                    onChange={handleChange}
                    className="space-input w-full"
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold space-text-primary mb-2">
                    Street Address
                  </label>
                  <input
                    type="text"
                    name="street_address"
                    value={formData.street_address}
                    onChange={handleChange}
                    className="space-input w-full"
                    placeholder="Enter street address"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold space-text-primary mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="space-input w-full"
                      placeholder="Enter city"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold space-text-primary mb-2">
                      State/Province
                    </label>
                    <input
                      type="text"
                      name="state_province"
                      value={formData.state_province}
                      onChange={handleChange}
                      className="space-input w-full"
                      placeholder="Enter state/province"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold space-text-primary mb-2">
                      ZIP/Postal Code
                    </label>
                    <input
                      type="text"
                      name="zip_postal"
                      value={formData.zip_postal}
                      onChange={handleChange}
                      className="space-input w-full"
                      placeholder="Enter ZIP/postal code"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold space-text-primary mb-2">
                    Country
                  </label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="space-input w-full"
                  >
                    <option value="">Select country</option>
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                    <option value="UK">United Kingdom</option>
                    <option value="AU">Australia</option>
                    <option value="DE">Germany</option>
                    <option value="FR">France</option>
                    <option value="JP">Japan</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Business Information */}
            <div className="space-card p-6">
              <div className="mb-4">
                <h3 className="text-lg font-semibold space-text-primary flex items-center border-b border-white/10 pb-2">
                  <Building className="w-5 h-5 mr-2 text-purple-400" />
                  Business Information
                </h3>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold space-text-primary mb-2">
                    Company Size
                  </label>
                  <select
                    name="company_size"
                    value={formData.company_size}
                    onChange={handleChange}
                    className="space-input w-full"
                  >
                    <option value="">Select company size</option>
                    <option value="1-10">1-10 employees</option>
                    <option value="11-50">11-50 employees</option>
                    <option value="51-200">51-200 employees</option>
                    <option value="201-500">201-500 employees</option>
                    <option value="501-1000">501-1000 employees</option>
                    <option value="1000+">1000+ employees</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold space-text-primary mb-2">
                    Annual Revenue
                  </label>
                  <select
                    name="annual_revenue"
                    value={formData.annual_revenue}
                    onChange={handleChange}
                    className="space-input w-full"
                  >
                    <option value="">Select revenue range</option>
                    <option value="0-100k">$0 - $100K</option>
                    <option value="100k-500k">$100K - $500K</option>
                    <option value="500k-1m">$500K - $1M</option>
                    <option value="1m-5m">$1M - $5M</option>
                    <option value="5m-10m">$5M - $10M</option>
                    <option value="10m+">$10M+</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold space-text-primary mb-2">
                    Tax ID
                  </label>
                  <input
                    type="text"
                    name="tax_id"
                    value={formData.tax_id}
                    onChange={handleChange}
                    className="space-input w-full"
                    placeholder="Enter tax ID or EIN"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold space-text-primary mb-2">
                    Payment Terms
                  </label>
                  <select
                    name="payment_terms"
                    value={formData.payment_terms}
                    onChange={handleChange}
                    className="space-input w-full"
                  >
                    <option value="15">Net 15</option>
                    <option value="30">Net 30</option>
                    <option value="45">Net 45</option>
                    <option value="60">Net 60</option>
                    <option value="90">Net 90</option>
                    <option value="due_on_receipt">Due on Receipt</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Preferences */}
            <div className="space-card p-6">
              <div className="mb-4">
                <h3 className="text-lg font-semibold space-text-primary flex items-center border-b border-white/10 pb-2">
                  <MessageSquare className="w-5 h-5 mr-2 text-yellow-400" />
                  Preferences
                </h3>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold space-text-primary mb-2">
                    Preferred Contact Method
                  </label>
                  <select
                    name="preferred_contact_method"
                    value={formData.preferred_contact_method}
                    onChange={handleChange}
                    className="space-input w-full"
                  >
                    <option value="email">Email</option>
                    <option value="phone">Phone</option>
                    <option value="text">Text Message</option>
                    <option value="linkedin">LinkedIn</option>
                    <option value="in_person">In Person</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold space-text-primary mb-2">
                    Best Time to Contact
                  </label>
                  <select
                    name="best_time_to_contact"
                    value={formData.best_time_to_contact}
                    onChange={handleChange}
                    className="space-input w-full"
                  >
                    <option value="">Select best time</option>
                    <option value="morning">Morning (9 AM - 12 PM)</option>
                    <option value="afternoon">Afternoon (12 PM - 5 PM)</option>
                    <option value="evening">Evening (5 PM - 8 PM)</option>
                    <option value="flexible">Flexible</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold space-text-primary mb-2">
                    Notes
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={4}
                    className="space-input w-full resize-none"
                    placeholder="Add any additional notes about the client..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold space-text-primary mb-2">
                    Tags
                  </label>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleChange}
                    className="space-input w-full"
                    placeholder="Enter tags separated by commas (e.g., VIP, Enterprise, Startup)"
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