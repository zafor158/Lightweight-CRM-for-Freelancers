import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link, useSearchParams } from 'react-router-dom';
import api from '../config/axios';
import toast from 'react-hot-toast';
import { ArrowLeft, Save, FileText, Calendar, DollarSign } from 'lucide-react';

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
      const response = await api.get(`/invoices/${id}`);
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
      if (projectId) {
        setFormData(prev => ({ ...prev, project_id: projectId }));
      }
    }
  }, [id, searchParams, fetchInvoice]);

  const fetchProjects = async () => {
    try {
      const response = await api.get('/projects');
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
        await api.put(`/invoices/${id}`, submitData);
        toast.success('Invoice updated successfully!');
      } else {
        await api.post('/invoices', submitData);
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
        {/* Header - Electric Purple & Neon Pink */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-400/25 via-fuchsia-300/20 to-pink-400/15 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500 animate-pulse" style={{animationDuration: '6s'}}></div>
          <div className="relative backdrop-blur-2xl bg-gradient-to-br from-zinc-800/45 via-purple-900/40 to-fuchsia-900/35 border-2 border-purple-400/60 rounded-2xl p-6 shadow-2xl shadow-purple-500/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link to="/invoices" className="relative group/btn">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 to-fuchsia-400/30 rounded-xl blur-sm group-hover/btn:blur-md transition-all duration-300"></div>
                  <div className="relative bg-gradient-to-br from-purple-500/50 to-fuchsia-400/50 border border-purple-300/60 rounded-xl p-3 hover:from-purple-500/60 hover:to-fuchsia-400/60 transition-all duration-300 shadow-lg">
                    <ArrowLeft className="w-6 h-6 text-purple-200" />
                  </div>
                </Link>
                <div>
                  <h1 className="text-4xl font-black text-white drop-shadow-lg flex items-center gap-3">
                    <FileText className="w-8 h-8 text-purple-300" />
                    {isEditing ? 'Edit Invoice' : 'Create New Invoice'}
                  </h1>
                  <p className="text-purple-200/80 text-lg mt-2">
                    {isEditing ? 'Update invoice information' : 'Generate a new invoice for your project'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form - Neon Green & Electric Lime */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 via-lime-300/15 to-emerald-400/10 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-500 animate-pulse" style={{animationDuration: '7s', animationDelay: '1s'}}></div>
          <div className="relative backdrop-blur-2xl bg-gradient-to-br from-neutral-800/40 via-green-900/35 to-lime-900/30 border-2 border-green-400/50 rounded-2xl shadow-2xl shadow-green-500/25">
            <div className="p-6 border-b border-green-400/30">
              <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                <FileText className="w-6 h-6 text-green-300" />
                Invoice Information
              </h3>
            </div>
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Information */}
                <div>
                  <h4 className="text-xl font-bold text-white mb-6 flex items-center">
                    <FileText className="h-6 w-6 mr-3 text-green-300" />
                    Basic Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="project_id" className="block text-sm font-bold text-green-200">
                        Project *
                      </label>
                      <select
                        id="project_id"
                        name="project_id"
                        required
                        className={`w-full px-4 py-3 bg-slate-800/50 border rounded-xl text-white focus:outline-none focus:ring-2 transition-all duration-300 ${
                          errors.project_id 
                            ? 'border-red-400 focus:border-red-300 focus:ring-red-500/30' 
                            : 'border-green-400/30 focus:border-green-300/60 focus:ring-green-500/30'
                        }`}
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
                      {errors.project_id && <p className="text-red-300 text-sm mt-1">{errors.project_id}</p>}
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="status" className="block text-sm font-bold text-green-200">
                        Status
                      </label>
                      <select
                        id="status"
                        name="status"
                        className="w-full px-4 py-3 bg-slate-800/50 border border-green-400/30 rounded-xl text-white focus:outline-none focus:border-green-300/60 focus:ring-2 focus:ring-green-500/30 transition-all duration-300"
                        value={formData.status}
                        onChange={handleChange}
                      >
                        <option value="Draft">Draft</option>
                        <option value="Sent">Sent</option>
                        <option value="Paid">Paid</option>
                        <option value="Overdue">Overdue</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="currency" className="block text-sm font-bold text-green-200">
                        Currency
                      </label>
                      <select
                        id="currency"
                        name="currency"
                        className="w-full px-4 py-3 bg-slate-800/50 border border-green-400/30 rounded-xl text-white focus:outline-none focus:border-green-300/60 focus:ring-2 focus:ring-green-500/30 transition-all duration-300"
                        value={formData.currency}
                        onChange={handleChange}
                      >
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="GBP">GBP (£)</option>
                        <option value="CAD">CAD (C$)</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="payment_terms" className="block text-sm font-bold text-green-200">
                        Payment Terms (Days)
                      </label>
                      <select
                        id="payment_terms"
                        name="payment_terms"
                        className="w-full px-4 py-3 bg-slate-800/50 border border-green-400/30 rounded-xl text-white focus:outline-none focus:border-green-300/60 focus:ring-2 focus:ring-green-500/30 transition-all duration-300"
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
                  <h4 className="text-xl font-bold text-white mb-6 flex items-center">
                    <DollarSign className="h-6 w-6 mr-3 text-green-300" />
                    Amount Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="amount" className="block text-sm font-bold text-green-200">
                        Base Amount *
                      </label>
                      <input
                        id="amount"
                        name="amount"
                        type="number"
                        step="0.01"
                        min="0"
                        required
                        className={`w-full px-4 py-3 bg-slate-800/50 border rounded-xl text-white placeholder-green-200/60 focus:outline-none focus:ring-2 transition-all duration-300 ${
                          errors.amount 
                            ? 'border-red-400 focus:border-red-300 focus:ring-red-500/30' 
                            : 'border-green-400/30 focus:border-green-300/60 focus:ring-green-500/30'
                        }`}
                        placeholder="0.00"
                        value={formData.amount}
                        onChange={handleChange}
                      />
                      {errors.amount && <p className="text-red-300 text-sm mt-1">{errors.amount}</p>}
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="discount" className="block text-sm font-bold text-green-200">
                        Discount Amount
                      </label>
                      <input
                        id="discount"
                        name="discount"
                        type="number"
                        step="0.01"
                        min="0"
                        className={`w-full px-4 py-3 bg-slate-800/50 border rounded-xl text-white placeholder-green-200/60 focus:outline-none focus:ring-2 transition-all duration-300 ${
                          errors.discount 
                            ? 'border-red-400 focus:border-red-300 focus:ring-red-500/30' 
                            : 'border-green-400/30 focus:border-green-300/60 focus:ring-green-500/30'
                        }`}
                        placeholder="0.00"
                        value={formData.discount}
                        onChange={handleChange}
                      />
                      {errors.discount && <p className="text-red-300 text-sm mt-1">{errors.discount}</p>}
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="tax_rate" className="block text-sm font-bold text-green-200">
                        Tax Rate (%)
                      </label>
                      <input
                        id="tax_rate"
                        name="tax_rate"
                        type="number"
                        step="0.01"
                        min="0"
                        max="100"
                        className={`w-full px-4 py-3 bg-slate-800/50 border rounded-xl text-white placeholder-green-200/60 focus:outline-none focus:ring-2 transition-all duration-300 ${
                          errors.tax_rate 
                            ? 'border-red-400 focus:border-red-300 focus:ring-red-500/30' 
                            : 'border-green-400/30 focus:border-green-300/60 focus:ring-green-500/30'
                        }`}
                        placeholder="0.00"
                        value={formData.tax_rate}
                        onChange={handleChange}
                      />
                      {errors.tax_rate && <p className="text-red-300 text-sm mt-1">{errors.tax_rate}</p>}
                    </div>
                  </div>

                  {/* Amount Summary */}
                  <div className="bg-slate-800/50 border border-green-400/30 rounded-xl p-6 mt-6">
                    <h5 className="font-bold text-white mb-4 text-lg">Amount Summary</h5>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-green-200">Base Amount:</span>
                        <span className="text-white font-semibold">${parseFloat(formData.amount || 0).toFixed(2)}</span>
                      </div>
                      {parseFloat(formData.discount || 0) > 0 && (
                        <div className="flex justify-between text-red-300">
                          <span>Discount:</span>
                          <span>-${parseFloat(formData.discount || 0).toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-green-200">Subtotal:</span>
                        <span className="text-white font-semibold">${subtotal.toFixed(2)}</span>
                      </div>
                      {parseFloat(formData.tax_rate || 0) > 0 && (
                        <div className="flex justify-between">
                          <span className="text-green-200">Tax ({formData.tax_rate}%):</span>
                          <span className="text-white font-semibold">${tax.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between font-black text-xl border-t border-green-400/30 pt-3">
                        <span className="text-white">Total:</span>
                        <span className="text-green-300">${total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dates */}
                <div>
                  <h4 className="text-xl font-bold text-white mb-6 flex items-center">
                    <Calendar className="h-6 w-6 mr-3 text-green-300" />
                    Dates
                  </h4>
                  <div className="space-y-2">
                    <label htmlFor="due_date" className="block text-sm font-bold text-green-200">
                      Due Date
                    </label>
                    <input
                      id="due_date"
                      name="due_date"
                      type="date"
                      className="w-full px-4 py-3 bg-slate-800/50 border border-green-400/30 rounded-xl text-white focus:outline-none focus:border-green-300/60 focus:ring-2 focus:ring-green-500/30 transition-all duration-300"
                      value={formData.due_date}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Description and Notes */}
                <div>
                  <h4 className="text-xl font-bold text-white mb-6">Description & Notes</h4>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label htmlFor="description" className="block text-sm font-bold text-green-200">
                        Description
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        rows={3}
                        className="w-full px-4 py-3 bg-slate-800/50 border border-green-400/30 rounded-xl text-white placeholder-green-200/60 focus:outline-none focus:border-green-300/60 focus:ring-2 focus:ring-green-500/30 transition-all duration-300 resize-none"
                        placeholder="Describe the work or services provided..."
                        value={formData.description}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="notes" className="block text-sm font-bold text-green-200">
                        Additional Notes
                      </label>
                      <textarea
                        id="notes"
                        name="notes"
                        rows={3}
                        className="w-full px-4 py-3 bg-slate-800/50 border border-green-400/30 rounded-xl text-white placeholder-green-200/60 focus:outline-none focus:border-green-300/60 focus:ring-2 focus:ring-green-500/30 transition-all duration-300 resize-none"
                        placeholder="Add any additional notes for the client..."
                        value={formData.notes}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex items-center justify-end space-x-4 pt-6 border-t border-green-400/30">
                  <Link to="/invoices" className="relative group/btn">
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-500/30 to-slate-400/30 rounded-xl blur-sm group-hover/btn:blur-md transition-all duration-300"></div>
                    <div className="relative bg-gradient-to-br from-gray-500/50 to-slate-400/50 border border-gray-300/60 rounded-xl px-6 py-3 hover:from-gray-500/60 hover:to-slate-400/60 transition-all duration-300 shadow-lg">
                      <span className="font-semibold text-white">Cancel</span>
                    </div>
                  </Link>
                  <button
                    type="submit"
                    disabled={loading}
                    className="relative group/btn"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-green-500/30 to-lime-400/30 rounded-xl blur-sm group-hover/btn:blur-md transition-all duration-300"></div>
                    <div className="relative bg-gradient-to-br from-green-500/50 to-lime-400/50 border border-green-300/60 rounded-xl px-6 py-3 flex items-center gap-2 hover:from-green-500/60 hover:to-lime-400/60 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">
                      <Save className="w-5 h-5 text-green-200" />
                      <span className="font-semibold text-white">
                        {loading ? 'Saving...' : (isEditing ? 'Update Invoice' : 'Create Invoice')}
                      </span>
                    </div>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceForm;
