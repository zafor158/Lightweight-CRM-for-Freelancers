import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { ArrowLeft, Save, FileText, Calendar, DollarSign, User } from 'lucide-react';

const InvoiceForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState({
    project_id: '',
    amount: '',
    due_date: '',
    description: '',
    status: 'Draft',
    tax_rate: '0',
    discount: '0',
    notes: '',
    payment_terms: '30',
    currency: 'USD'
  });
  const [errors, setErrors] = useState({});

  const fetchInvoice = useCallback(async () => {
    try {
      const response = await axios.get(`/api/invoices/${id}`);
      setFormData(response.data.invoice);
    } catch (error) {
      console.error('Error fetching invoice:', error);
      toast.error('Failed to fetch invoice data');
    }
  }, [id]);

  useEffect(() => {
    fetchProjects();
    
    if (id && id !== 'new') {
      setIsEditing(true);
      fetchInvoice();
    } else {
      // Set default project if provided in URL params
      const projectId = searchParams.get('project');
      const clientId = searchParams.get('client');
      if (projectId) {
        setFormData(prev => ({ ...prev, project_id: projectId }));
      }
    }
  }, [id, searchParams, fetchInvoice]);

  const fetchProjects = async () => {
    try {
      const response = await axios.get('/api/projects');
      setProjects(response.data.projects);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast.error('Failed to fetch projects');
    }
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const calculateTotal = () => {
    const amount = parseFloat(formData.amount) || 0;
    const taxRate = parseFloat(formData.tax_rate) || 0;
    const discount = parseFloat(formData.discount) || 0;
    
    const subtotal = amount - discount;
    const tax = subtotal * (taxRate / 100);
    const total = subtotal + tax;
    
    return { subtotal, tax, total };
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.project_id) {
      newErrors.project_id = 'Please select a project';
    }

    if (!formData.amount || isNaN(parseFloat(formData.amount)) || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount greater than 0';
    }

    if (formData.tax_rate && (isNaN(parseFloat(formData.tax_rate)) || parseFloat(formData.tax_rate) < 0)) {
      newErrors.tax_rate = 'Please enter a valid tax rate';
    }

    if (formData.discount && (isNaN(parseFloat(formData.discount)) || parseFloat(formData.discount) < 0)) {
      newErrors.discount = 'Please enter a valid discount amount';
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
      const { total } = calculateTotal();
      const submitData = {
        ...formData,
        amount: total, // Use calculated total as the invoice amount
        tax_rate: parseFloat(formData.tax_rate) || 0,
        discount: parseFloat(formData.discount) || 0,
        payment_terms: parseInt(formData.payment_terms) || 30
      };

      if (isEditing) {
        await axios.put(`/api/invoices/${id}`, submitData);
        toast.success('Invoice updated successfully!');
      } else {
        await axios.post('/api/invoices', submitData);
        toast.success('Invoice created successfully!');
      }
      
      navigate('/invoices');
    } catch (error) {
      console.error('Error saving invoice:', error);
      toast.error(error.response?.data?.message || 'Failed to save invoice');
    } finally {
      setLoading(false);
    }
  };

  const { subtotal, tax, total } = calculateTotal();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/invoices" className="text-gray-400 hover:text-gray-600 transition-colors">
            <ArrowLeft size={24} />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {isEditing ? 'Edit Invoice' : 'Create New Invoice'}
            </h1>
            <p className="mt-1 text-gray-600">
              {isEditing ? 'Update invoice information' : 'Generate a new invoice for your project'}
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl">
        <div className="card">
          <div className="card-header">
            <h3 className="text-xl font-semibold text-gray-900">Invoice Information</h3>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Information */}
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-primary-600" />
                  Basic Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="form-group">
                    <label htmlFor="project_id" className="form-label">
                      Project *
                    </label>
                    <select
                      id="project_id"
                      name="project_id"
                      required
                      className={`form-select ${errors.project_id ? 'border-red-500' : ''}`}
                      value={formData.project_id}
                      onChange={handleChange}
                    >
                      <option value="">Select a project</option>
                      {projects.map(project => (
                        <option key={project.id} value={project.id}>
                          {project.name} - {project.client_name}
                        </option>
                      ))}
                    </select>
                    {errors.project_id && <p className="error">{errors.project_id}</p>}
                  </div>

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
                      <option value="Draft">Draft</option>
                      <option value="Sent">Sent</option>
                      <option value="Paid">Paid</option>
                      <option value="Overdue">Overdue</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="currency" className="form-label">
                      Currency
                    </label>
                    <select
                      id="currency"
                      name="currency"
                      className="form-select"
                      value={formData.currency}
                      onChange={handleChange}
                    >
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="CAD">CAD (C$)</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="payment_terms" className="form-label">
                      Payment Terms (Days)
                    </label>
                    <select
                      id="payment_terms"
                      name="payment_terms"
                      className="form-select"
                      value={formData.payment_terms}
                      onChange={handleChange}
                    >
                      <option value="0">Due on receipt</option>
                      <option value="7">7 days</option>
                      <option value="15">15 days</option>
                      <option value="30">30 days</option>
                      <option value="45">45 days</option>
                      <option value="60">60 days</option>
                      <option value="90">90 days</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Amount Information */}
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <DollarSign className="h-5 w-5 mr-2 text-primary-600" />
                  Amount Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="form-group">
                    <label htmlFor="amount" className="form-label">
                      Base Amount *
                    </label>
                    <input
                      id="amount"
                      name="amount"
                      type="number"
                      step="0.01"
                      min="0"
                      required
                      className={`form-input ${errors.amount ? 'border-red-500' : ''}`}
                      placeholder="0.00"
                      value={formData.amount}
                      onChange={handleChange}
                    />
                    {errors.amount && <p className="error">{errors.amount}</p>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="discount" className="form-label">
                      Discount Amount
                    </label>
                    <input
                      id="discount"
                      name="discount"
                      type="number"
                      step="0.01"
                      min="0"
                      className={`form-input ${errors.discount ? 'border-red-500' : ''}`}
                      placeholder="0.00"
                      value={formData.discount}
                      onChange={handleChange}
                    />
                    {errors.discount && <p className="error">{errors.discount}</p>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="tax_rate" className="form-label">
                      Tax Rate (%)
                    </label>
                    <input
                      id="tax_rate"
                      name="tax_rate"
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      className={`form-input ${errors.tax_rate ? 'border-red-500' : ''}`}
                      placeholder="0.00"
                      value={formData.tax_rate}
                      onChange={handleChange}
                    />
                    {errors.tax_rate && <p className="error">{errors.tax_rate}</p>}
                  </div>
                </div>

                {/* Amount Summary */}
                <div className="bg-gray-50 rounded-lg p-4 mt-4">
                  <h5 className="font-medium text-gray-900 mb-3">Amount Summary</h5>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Base Amount:</span>
                      <span>${parseFloat(formData.amount || 0).toFixed(2)}</span>
                    </div>
                    {parseFloat(formData.discount || 0) > 0 && (
                      <div className="flex justify-between text-red-600">
                        <span>Discount:</span>
                        <span>-${parseFloat(formData.discount || 0).toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal:</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    {parseFloat(formData.tax_rate || 0) > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tax ({formData.tax_rate}%):</span>
                        <span>${tax.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-semibold text-lg border-t pt-2">
                      <span>Total:</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dates */}
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-primary-600" />
                  Dates
                </h4>
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

              {/* Description and Notes */}
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">Description & Notes</h4>
                <div className="space-y-4">
                  <div className="form-group">
                    <label htmlFor="description" className="form-label">
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      rows={3}
                      className="form-input form-textarea"
                      placeholder="Describe the work or services provided..."
                      value={formData.description}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="notes" className="form-label">
                      Additional Notes
                    </label>
                    <textarea
                      id="notes"
                      name="notes"
                      rows={3}
                      className="form-input form-textarea"
                      placeholder="Add any additional notes for the client..."
                      value={formData.notes}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                <Link to="/invoices" className="btn btn-outline">
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary"
                >
                  <Save size={20} />
                  {loading ? 'Saving...' : (isEditing ? 'Update Invoice' : 'Create Invoice')}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceForm;
