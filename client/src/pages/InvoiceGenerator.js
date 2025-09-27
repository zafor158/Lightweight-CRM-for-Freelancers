import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../config/axios';
import toast from 'react-hot-toast';
import { 
  ArrowLeft, 
  Save, 
  FileText, 
  Calendar, 
  DollarSign, 
  Plus, 
  Trash2, 
  CheckCircle,
  User,
  FolderOpen,
  Calculator,
  Receipt
} from 'lucide-react';
import { getCardClasses, getButtonClasses, getGlowClasses } from '../styles/cosmic-design-system';

const InvoiceGenerator = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [billableProjects, setBillableProjects] = useState([]);
  const [selectedProjects, setSelectedProjects] = useState(new Set());
  const [lineItems, setLineItems] = useState([]);
  const [manualLineItems, setManualLineItems] = useState([]);
  const [formData, setFormData] = useState({
    due_date: '',
    tax_rate: '0',
    discount: '0',
    notes: '',
    payment_terms: '30',
    currency: 'USD'
  });
  const [totals, setTotals] = useState({
    subtotal: 0,
    tax_amount: 0,
    discount_amount: 0,
    total: 0
  });

  // Fetch clients with billable projects
  const fetchClients = useCallback(async () => {
    try {
      const response = await api.get('/invoices/generator/clients');
      setClients(response.data.clients);
    } catch (error) {
      console.error('Error fetching clients:', error);
      toast.error('Failed to fetch clients');
    }
  }, []);

  // Fetch billable projects for selected client
  const fetchBillableProjects = useCallback(async (clientId) => {
    try {
      const response = await api.get(`/invoices/generator/clients/${clientId}/projects`);
      setBillableProjects(response.data.projects);
    } catch (error) {
      console.error('Error fetching billable projects:', error);
      toast.error('Failed to fetch billable projects');
    }
  }, []);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  // Handle client selection
  const handleClientSelect = (clientId) => {
    const client = clients.find(c => c.id === parseInt(clientId));
    setSelectedClient(client);
    setSelectedProjects(new Set());
    setLineItems([]);
    setManualLineItems([]);
    
    if (clientId) {
      fetchBillableProjects(clientId);
    } else {
      setBillableProjects([]);
    }
  };

  // Handle project selection
  const handleProjectToggle = (projectId, isSelected) => {
    const newSelectedProjects = new Set(selectedProjects);
    
    if (isSelected) {
      newSelectedProjects.add(projectId);
    } else {
      newSelectedProjects.delete(projectId);
    }
    
    setSelectedProjects(newSelectedProjects);
    updateLineItems(newSelectedProjects);
  };

  // Update line items based on selected projects
  const updateLineItems = (projectIds) => {
    const projectLineItems = Array.from(projectIds).map(projectId => {
      const project = billableProjects.find(p => p.id === projectId);
      return {
        id: `project-${projectId}`,
        type: 'project',
        project_id: projectId,
        description: project.name,
        amount: project.total_amount || 0,
        editable: false
      };
    });

    setLineItems([...projectLineItems, ...manualLineItems]);
  };

  // Add manual line item
  const addManualLineItem = () => {
    const newItem = {
      id: `manual-${Date.now()}`,
      type: 'manual',
      description: '',
      amount: 0,
      editable: true
    };
    
    setManualLineItems(prev => [...prev, newItem]);
    setLineItems(prev => [...prev, newItem]);
  };

  // Update manual line item
  const updateManualLineItem = (id, field, value) => {
    const updatedItems = manualLineItems.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    );
    
    setManualLineItems(updatedItems);
    
    // Update line items
    const updatedLineItems = lineItems.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    );
    
    setLineItems(updatedLineItems);
  };

  // Remove manual line item
  const removeManualLineItem = (id) => {
    setManualLineItems(prev => prev.filter(item => item.id !== id));
    setLineItems(prev => prev.filter(item => item.id !== id));
  };

  // Calculate totals
  useEffect(() => {
    const subtotal = lineItems.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
    const taxRate = parseFloat(formData.tax_rate) || 0;
    const discount = parseFloat(formData.discount) || 0;
    const taxAmount = subtotal * taxRate / 100;
    const total = subtotal + taxAmount - discount;

    setTotals({
      subtotal,
      tax_amount: taxAmount,
      discount_amount: discount,
      total
    });
  }, [lineItems, formData.tax_rate, formData.discount]);

  // Handle form submission
  const handleSubmit = async (status = 'Draft') => {
    if (!selectedClient) {
      toast.error('Please select a client');
      return;
    }

    if (lineItems.length === 0) {
      toast.error('Please add at least one line item');
      return;
    }

    if (totals.total <= 0) {
      toast.error('Total amount must be greater than 0');
      return;
    }

    setLoading(true);
    try {
      const projectIds = Array.from(selectedProjects);
      
      const payload = {
        client_id: selectedClient.id,
        project_ids: projectIds,
        line_items: lineItems,
        due_date: formData.due_date,
        tax_rate: parseFloat(formData.tax_rate) || 0,
        discount: parseFloat(formData.discount) || 0,
        notes: formData.notes,
        payment_terms: parseInt(formData.payment_terms) || 30,
        currency: formData.currency,
        status
      };

      const response = await api.post('/invoices/generator/create', payload);
      
      toast.success(`Invoice ${status === 'Draft' ? 'saved as draft' : 'created'} successfully!`);
      navigate(`/invoices/${response.data.invoice.id}`);
      
    } catch (error) {
      console.error('Error creating invoice:', error);
      toast.error('Failed to create invoice');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Enhanced Cosmic Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-indigo-900/30 to-black/50"></div>
        
        {/* Animated Star Field */}
        <div className="absolute inset-0 opacity-30">
          {[...Array(35)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            />
          ))}
        </div>
        
        {/* Large Nebula Effects */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-radial from-purple-600/10 to-transparent rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-gradient-radial from-blue-500/8 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-gradient-radial from-magenta-500/6 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>
        
        {/* Floating Celestial Bodies */}
        <div className="absolute top-20 right-20 w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full shadow-2xl animate-float" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute top-40 left-20 w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full shadow-2xl animate-float" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute bottom-40 right-40 w-14 h-14 bg-gradient-to-br from-green-400 to-emerald-400 rounded-full shadow-2xl animate-float" style={{ animationDelay: '2.5s' }}></div>
        
        {/* Animated Meteor Streaks */}
        <div className="absolute top-1/3 left-1/4 w-32 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent transform rotate-45 opacity-60 animate-pulse" style={{ animationDelay: '0.8s' }}></div>
        <div className="absolute bottom-1/3 right-1/4 w-24 h-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent transform rotate-45 opacity-60 animate-pulse" style={{ animationDelay: '1.8s' }}></div>
        
        {/* Enhanced Floating Particles */}
        <div className="absolute inset-0">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 4}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className={`${getGlowClasses('purple', 'medium')} ${getCardClasses('standard')} p-4 sm:p-6 mb-6`}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/invoices')}
                className={`${getButtonClasses('primary', 'sm')} p-2 sm:p-3`}
              >
                <ArrowLeft size={18} />
              </button>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2">
                  <Receipt className="text-purple-400" />
                  Invoice Generator
                </h1>
                <p className="text-purple-200/80 text-sm sm:text-base">
                  Create professional invoices from multiple projects
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="xl:col-span-2 space-y-6">
            {/* Step 1: Client Selection */}
            <div className={`${getGlowClasses('orange', 'medium')} ${getCardClasses('warning')} p-4 sm:p-6`}>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-br from-orange-500/30 to-red-500/30 rounded-lg border border-orange-400/40">
                  <User className="w-5 h-5 text-orange-300" />
                </div>
                <h2 className="text-xl font-bold text-white">Step 1: Select Client</h2>
              </div>
              
              <div className="space-y-4">
                <label className="block text-sm font-bold text-orange-200">
                  Choose a client with completed projects
                </label>
                <select
                  value={selectedClient?.id || ''}
                  onChange={(e) => handleClientSelect(e.target.value)}
                  className="w-full p-3 bg-slate-800/50 border-2 border-orange-400/30 rounded-xl text-white placeholder-orange-200/60 focus:border-orange-300/60 focus:ring-2 focus:ring-orange-500/30 transition-all duration-300"
                >
                  <option value="">Select a client...</option>
                  {clients.map(client => (
                    <option key={client.id} value={client.id}>
                      {client.name} {client.company && `(${client.company})`}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Step 2: Project Selection */}
            {selectedClient && (
              <div className={`${getGlowClasses('blue', 'medium')} ${getCardClasses('info')} p-4 sm:p-6`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-gradient-to-br from-blue-500/30 to-cyan-500/30 rounded-lg border border-blue-400/40">
                    <FolderOpen className="w-5 h-5 text-blue-300" />
                  </div>
                  <h2 className="text-xl font-bold text-white">Step 2: Select Billable Projects</h2>
                </div>
                
                {billableProjects.length === 0 ? (
                  <div className="text-center py-8">
                    <FolderOpen className="w-12 h-12 text-blue-400/50 mx-auto mb-3" />
                    <p className="text-blue-200/80">No completed projects available for invoicing</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {billableProjects.map(project => (
                      <div key={project.id} className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-lg border border-blue-400/20">
                        <input
                          type="checkbox"
                          checked={selectedProjects.has(project.id)}
                          onChange={(e) => handleProjectToggle(project.id, e.target.checked)}
                          className="w-5 h-5 text-blue-500 bg-slate-700 border-blue-400/30 rounded focus:ring-blue-500/30"
                        />
                        <div className="flex-1">
                          <h3 className="text-white font-semibold">{project.name}</h3>
                          <p className="text-blue-200/80 text-sm">{project.description}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-blue-300 font-bold">${project.total_amount || 0}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Invoice Line Items */}
            {selectedClient && (
              <div className={`${getGlowClasses('green', 'medium')} ${getCardClasses('success')} p-4 sm:p-6`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-green-500/30 to-emerald-500/30 rounded-lg border border-green-400/40">
                      <Calculator className="w-5 h-5 text-green-300" />
                    </div>
                    <h2 className="text-xl font-bold text-white">Step 3: Invoice Line Items</h2>
                  </div>
                  <button
                    onClick={addManualLineItem}
                    className={`${getButtonClasses('success', 'sm')} flex items-center gap-2`}
                  >
                    <Plus size={16} />
                    Add Manual Item
                  </button>
                </div>

                {lineItems.length === 0 ? (
                  <div className="text-center py-8">
                    <Calculator className="w-12 h-12 text-green-400/50 mx-auto mb-3" />
                    <p className="text-green-200/80">Select projects above to build your invoice</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {lineItems.map(item => (
                      <div key={item.id} className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-lg border border-green-400/20">
                        <div className="flex-1">
                          {item.editable ? (
                            <input
                              type="text"
                              value={item.description}
                              onChange={(e) => updateManualLineItem(item.id, 'description', e.target.value)}
                              placeholder="Item description"
                              className="w-full p-2 bg-slate-700/50 border border-green-400/30 rounded text-white placeholder-green-200/60 focus:border-green-300/60 focus:ring-1 focus:ring-green-500/30"
                            />
                          ) : (
                            <h3 className="text-white font-semibold">{item.description}</h3>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-green-300">$</span>
                          {item.editable ? (
                            <input
                              type="number"
                              value={item.amount}
                              onChange={(e) => updateManualLineItem(item.id, 'amount', e.target.value)}
                              className="w-24 p-2 bg-slate-700/50 border border-green-400/30 rounded text-white focus:border-green-300/60 focus:ring-1 focus:ring-green-500/30"
                              step="0.01"
                              min="0"
                            />
                          ) : (
                            <span className="text-green-300 font-bold w-24 text-right">{item.amount}</span>
                          )}
                          {item.editable && (
                            <button
                              onClick={() => removeManualLineItem(item.id)}
                              className="p-1 text-red-400 hover:text-red-300 transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Invoice Summary */}
            {selectedClient && (
              <div className={`${getGlowClasses('purple', 'medium')} ${getCardClasses('standard')} p-4 sm:p-6`}>
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <FileText className="text-purple-400" />
                  Invoice Summary
                </h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-purple-200">Subtotal:</span>
                    <span className="text-white font-semibold">${totals.subtotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-purple-200">Tax ({formData.tax_rate}%):</span>
                    <span className="text-white font-semibold">${totals.tax_amount.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-purple-200">Discount:</span>
                    <span className="text-white font-semibold">-${totals.discount_amount.toFixed(2)}</span>
                  </div>
                  
                  <hr className="border-purple-400/30" />
                  
                  <div className="flex justify-between text-lg">
                    <span className="text-purple-300 font-bold">Total:</span>
                    <span className="text-white font-bold">${totals.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Invoice Settings */}
            {selectedClient && (
              <div className={`${getGlowClasses('gray', 'medium')} ${getCardClasses('secondary')} p-4 sm:p-6`}>
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Calendar className="text-gray-400" />
                  Invoice Settings
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-200 mb-2">Due Date</label>
                    <input
                      type="date"
                      value={formData.due_date}
                      onChange={(e) => setFormData(prev => ({ ...prev, due_date: e.target.value }))}
                      className="w-full p-3 bg-slate-800/50 border-2 border-gray-400/30 rounded-xl text-white focus:border-gray-300/60 focus:ring-2 focus:ring-gray-500/30 transition-all duration-300"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-gray-200 mb-2">Tax Rate (%)</label>
                    <input
                      type="number"
                      value={formData.tax_rate}
                      onChange={(e) => setFormData(prev => ({ ...prev, tax_rate: e.target.value }))}
                      className="w-full p-3 bg-slate-800/50 border-2 border-gray-400/30 rounded-xl text-white focus:border-gray-300/60 focus:ring-2 focus:ring-gray-500/30 transition-all duration-300"
                      step="0.01"
                      min="0"
                      max="100"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-gray-200 mb-2">Discount ($)</label>
                    <input
                      type="number"
                      value={formData.discount}
                      onChange={(e) => setFormData(prev => ({ ...prev, discount: e.target.value }))}
                      className="w-full p-3 bg-slate-800/50 border-2 border-gray-400/30 rounded-xl text-white focus:border-gray-300/60 focus:ring-2 focus:ring-gray-500/30 transition-all duration-300"
                      step="0.01"
                      min="0"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-gray-200 mb-2">Payment Terms (days)</label>
                    <input
                      type="number"
                      value={formData.payment_terms}
                      onChange={(e) => setFormData(prev => ({ ...prev, payment_terms: e.target.value }))}
                      className="w-full p-3 bg-slate-800/50 border-2 border-gray-400/30 rounded-xl text-white focus:border-gray-300/60 focus:ring-2 focus:ring-gray-500/30 transition-all duration-300"
                      min="1"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-gray-200 mb-2">Notes</label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                      rows={3}
                      className="w-full p-3 bg-slate-800/50 border-2 border-gray-400/30 rounded-xl text-white placeholder-gray-200/60 focus:border-gray-300/60 focus:ring-2 focus:ring-gray-500/30 transition-all duration-300"
                      placeholder="Additional notes for the invoice..."
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            {selectedClient && lineItems.length > 0 && (
              <div className={`${getGlowClasses('purple', 'medium')} ${getCardClasses('standard')} p-4 sm:p-6`}>
                <div className="space-y-3">
                  <button
                    onClick={() => handleSubmit('Draft')}
                    disabled={loading}
                    className={`${getButtonClasses('secondary', 'lg')} w-full flex items-center justify-center gap-2`}
                  >
                    <Save size={20} />
                    {loading ? 'Saving...' : 'Save as Draft'}
                  </button>
                  
                  <button
                    onClick={() => handleSubmit('Sent')}
                    disabled={loading}
                    className={`${getButtonClasses('success', 'lg')} w-full flex items-center justify-center gap-2`}
                  >
                    <CheckCircle size={20} />
                    {loading ? 'Generating...' : 'Generate Invoice'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .bg-gradient-radial {
          background: radial-gradient(circle, var(--tw-gradient-stops));
        }
      `}</style>
    </div>
  );
};

export default InvoiceGenerator;
