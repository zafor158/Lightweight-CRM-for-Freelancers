import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { ArrowLeft, Edit, Trash2, CreditCard, Calendar, DollarSign, FileText, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { format, parseISO } from 'date-fns';

const InvoiceDetail = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);

  const fetchInvoice = useCallback(async () => {
    try {
      const response = await axios.get(`/api/invoices/${id}`);
      setInvoice(response.data.invoice);
    } catch (error) {
      console.error('Error fetching invoice:', error);
      toast.error('Failed to fetch invoice details');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchInvoice();
    }
  }, [id, fetchInvoice]);

  useEffect(() => {
    // Handle payment success/failure from URL params
    const paymentStatus = searchParams.get('payment');
    if (paymentStatus === 'success') {
      toast.success('Payment completed successfully!');
      // Refresh invoice data
      if (id) {
        fetchInvoice();
      }
    } else if (paymentStatus === 'cancelled') {
      toast.error('Payment was cancelled');
    }
  }, [searchParams, id, fetchInvoice]);

  const handlePayNow = async () => {
    if (!invoice) return;
    
    setPaymentLoading(true);
    try {
      const response = await axios.post('/api/payments/create-checkout-session', {
        invoiceId: invoice.id,
        amount: parseFloat(invoice.amount)
      });

      // Redirect to Stripe Checkout
      window.location.href = response.data.url;
    } catch (error) {
      console.error('Error creating payment session:', error);
      toast.error('Failed to create payment session');
    } finally {
      setPaymentLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'Draft': { class: 'badge-warning', icon: FileText },
      'Sent': { class: 'badge-info', icon: Clock },
      'Paid': { class: 'badge-success', icon: CheckCircle },
      'Overdue': { class: 'badge-danger', icon: AlertCircle },
    };

    const config = statusConfig[status] || statusConfig['Draft'];
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
        <div>Loading invoice details...</div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">Invoice not found</h3>
        <p className="mt-1 text-sm text-gray-500">The invoice you're looking for doesn't exist.</p>
        <div className="mt-6">
          <Link to="/invoices" className="btn btn-primary">
            <ArrowLeft size={20} />
            Back to Invoices
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
          <Link to="/invoices" className="text-gray-400 hover:text-gray-600">
            <ArrowLeft size={24} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{invoice.invoice_number}</h1>
            <p className="mt-1 text-sm text-gray-600">Invoice Details</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {invoice.status !== 'Paid' && (
            <>
              <Link to={`/invoices/${id}/edit`} className="btn btn-outline">
                <Edit size={20} />
                Edit
              </Link>
              <button
                onClick={handlePayNow}
                disabled={paymentLoading}
                className="btn btn-success"
              >
                <CreditCard size={20} />
                {paymentLoading ? 'Processing...' : 'Pay Now'}
              </button>
            </>
          )}
          {invoice.status !== 'Paid' && (
            <button className="btn btn-danger">
              <Trash2 size={20} />
              Delete
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Invoice Information */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-medium text-gray-900">Invoice Information</h3>
            </div>
            <div className="card-body">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-gray-900">Invoice Number</label>
                    <p className="mt-1 text-sm text-gray-600 font-mono">{invoice.invoice_number}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-900">Status</label>
                    <div className="mt-1">
                      {getStatusBadge(invoice.status)}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-900">Amount</label>
                    <div className="mt-1 flex items-center text-lg font-semibold text-gray-900">
                      <DollarSign size={20} className="mr-2" />
                      ${parseFloat(invoice.amount).toFixed(2)}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-900">Due Date</label>
                    <div className="mt-1 flex items-center text-sm text-gray-600">
                      <Calendar size={16} className="mr-2" />
                      {invoice.due_date ? format(parseISO(invoice.due_date), 'MMM dd, yyyy') : 'No due date set'}
                    </div>
                  </div>
                </div>

                {invoice.description && (
                  <div>
                    <label className="text-sm font-medium text-gray-900">Description</label>
                    <p className="mt-1 text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                      {invoice.description}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Client Information */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-medium text-gray-900">Client Information</h3>
            </div>
            <div className="card-body">
              <div className="space-y-4">
                <div>
                  <h4 className="text-lg font-medium text-gray-900">{invoice.client_name}</h4>
                  {invoice.client_email && (
                    <p className="text-sm text-gray-600">{invoice.client_email}</p>
                  )}
                  {invoice.client_phone && (
                    <p className="text-sm text-gray-600">{invoice.client_phone}</p>
                  )}
                  {invoice.client_company && (
                    <p className="text-sm text-gray-600">{invoice.client_company}</p>
                  )}
                  {invoice.client_address && (
                    <p className="text-sm text-gray-600 mt-2">{invoice.client_address}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Project Information */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-medium text-gray-900">Project Information</h3>
            </div>
            <div className="card-body">
              <div className="space-y-4">
                <div>
                  <h4 className="text-lg font-medium text-gray-900">{invoice.project_name}</h4>
                  {invoice.project_description && (
                    <p className="text-sm text-gray-600 mt-1">{invoice.project_description}</p>
                  )}
                </div>
                <div>
                  <Link to={`/projects/${invoice.project_id}`} className="btn btn-outline btn-sm">
                    View Project Details
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-medium text-gray-900">Invoice Stats</h3>
            </div>
            <div className="card-body">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Created</span>
                  <span className="text-sm font-medium text-gray-900">
                    {format(parseISO(invoice.created_at), 'MMM dd, yyyy')}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Last Updated</span>
                  <span className="text-sm font-medium text-gray-900">
                    {format(parseISO(invoice.updated_at), 'MMM dd, yyyy')}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Status</span>
                  <span className="text-sm font-medium text-gray-900">{invoice.status}</span>
                </div>
                {invoice.stripe_payment_intent_id && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Payment ID</span>
                    <span className="text-sm font-medium text-gray-900 font-mono text-xs">
                      {invoice.stripe_payment_intent_id.slice(-8)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {invoice.status !== 'Paid' && (
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-medium text-gray-900">Payment</h3>
              </div>
              <div className="card-body">
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      ${parseFloat(invoice.amount).toFixed(2)}
                    </div>
                    <p className="text-sm text-gray-600">Amount Due</p>
                  </div>
                  <button
                    onClick={handlePayNow}
                    disabled={paymentLoading}
                    className="btn btn-success w-full"
                  >
                    <CreditCard size={20} />
                    {paymentLoading ? 'Processing...' : 'Pay with Stripe'}
                  </button>
                  <p className="text-xs text-gray-500 text-center">
                    Secure payment powered by Stripe
                  </p>
                </div>
              </div>
            </div>
          )}

          {invoice.status === 'Paid' && (
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-medium text-gray-900">Payment Status</h3>
              </div>
              <div className="card-body">
                <div className="text-center">
                  <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
                  <div className="text-lg font-medium text-gray-900">Payment Received</div>
                  <p className="text-sm text-gray-600 mt-2">
                    This invoice has been paid successfully.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetail;
