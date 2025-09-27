import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Download, 
  Mail, 
  Calendar,
  MapPin,
  Phone,
  CreditCard,
  Shield,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';

const InvoiceView = () => {
  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sample invoice data
  const sampleInvoice = {
    id: id || 'INV-001',
    invoiceNumber: 'INV-001',
    issueDate: '2024-01-10',
    dueDate: '2024-02-09',
    status: 'sent', // 'draft', 'sent', 'paid', 'overdue'
    company: {
      name: 'FreelancePro CRM',
      address: '123 Business Street',
      city: 'San Francisco, CA 94105',
      email: 'billing@freelancepro.com',
      phone: '+1 (555) 123-4567'
    },
    client: {
      name: 'Acme Corporation',
      address: '456 Client Avenue',
      city: 'New York, NY 10001',
      email: 'billing@acmecorp.com',
      phone: '+1 (555) 987-6543'
    },
    lineItems: [
      {
        id: 1,
        description: 'Website Redesign - Homepage',
        quantity: 1,
        rate: 5000,
        total: 5000
      },
      {
        id: 2,
        description: 'Mobile Responsive Design',
        quantity: 1,
        rate: 2500,
        total: 2500
      },
      {
        id: 3,
        description: 'Content Management System',
        quantity: 1,
        rate: 3000,
        total: 3000
      },
      {
        id: 4,
        description: 'SEO Optimization',
        quantity: 1,
        rate: 1500,
        total: 1500
      }
    ],
    subtotal: 12000,
    taxRate: 8.5,
    taxAmount: 1020,
    total: 13020,
    notes: 'Thank you for your business! Payment is due within 30 days of invoice date.',
    paymentTerms: 'Net 30'
  };

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setInvoice(sampleInvoice);
      setLoading(false);
    }, 1000);
  }, [id]);

  const getStatusBadge = (status) => {
    const styles = {
      draft: 'bg-gray-100 text-gray-700',
      sent: 'bg-warning-100 text-warning-700',
      paid: 'bg-success-100 text-success-700',
      overdue: 'bg-error-100 text-error-700'
    };
    
    const icons = {
      draft: <Clock className="w-4 h-4" />,
      sent: <Mail className="w-4 h-4" />,
      paid: <CheckCircle className="w-4 h-4" />,
      overdue: <AlertCircle className="w-4 h-4" />
    };
    
    const labels = {
      draft: 'Draft',
      sent: 'Sent',
      paid: 'Paid',
      overdue: 'Overdue'
    };

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${styles[status]}`}>
        {icons[status]}
        {labels[status]}
      </span>
    );
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Implement PDF download functionality
    console.log('Downloading PDF...');
  };

  const handleEmail = () => {
    // Implement email functionality
    console.log('Sending email...');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading invoice...</p>
        </div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Invoice Not Found</h2>
          <p className="text-gray-600">The requested invoice could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Print Styles */}
      <style jsx>{`
        @media print {
          .no-print { display: none !important; }
          .print-break { page-break-before: always; }
          body { background: white !important; }
          .invoice-container { box-shadow: none !important; }
        }
      `}</style>

      <div className="max-w-4xl mx-auto p-3">
        {/* Header Actions - Hidden in Print */}
        <div className="no-print mb-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => window.history.back()}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              ← Back to Invoices
            </button>
            <div className="h-6 w-px bg-gray-300"></div>
            <span className="text-sm text-gray-600">Invoice {invoice.invoiceNumber}</span>
            {getStatusBadge(invoice.status)}
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handleEmail}
              className="btn btn-secondary flex items-center gap-2"
            >
              <Mail className="w-4 h-4" />
              Email
            </button>
            <button
              onClick={handleDownload}
              className="btn btn-secondary flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
            <button
              onClick={handlePrint}
              className="btn btn-primary flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Print
            </button>
          </div>
        </div>

        {/* Invoice Container */}
        <div className="invoice-container bg-white rounded-2xl shadow-large overflow-hidden">
          {/* Invoice Header */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold mb-2">{invoice.company.name}</h1>
                <div className="space-y-1 text-primary-100 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3 h-3" />
                    <span>{invoice.company.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>{invoice.company.city}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3 h-3" />
                    <span>{invoice.company.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3 h-3" />
                    <span>{invoice.company.phone}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <h2 className="text-3xl font-bold mb-3">INVOICE</h2>
                <div className="space-y-1 text-primary-100 text-sm">
                  <div>
                    <span className="font-medium">Invoice #:</span> {invoice.invoiceNumber}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3 h-3" />
                    <span>Issue Date: {new Date(invoice.issueDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3 h-3" />
                    <span>Due Date: {new Date(invoice.dueDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Billing Information */}
          <div className="p-6 border-b border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-base font-semibold text-gray-900 mb-3">Billed To</h3>
                <div className="space-y-1 text-gray-700 text-sm">
                  <div className="font-medium">{invoice.client.name}</div>
                  <div>{invoice.client.address}</div>
                  <div>{invoice.client.city}</div>
                  <div className="flex items-center gap-2 mt-2">
                    <Mail className="w-3 h-3 text-gray-400" />
                    <span>{invoice.client.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3 h-3 text-gray-400" />
                    <span>{invoice.client.phone}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-base font-semibold text-gray-900 mb-3">Payment Terms</h3>
                <div className="space-y-2 text-gray-700 text-sm">
                  <div>
                    <span className="font-medium">Terms:</span> {invoice.paymentTerms}
                  </div>
                  <div>
                    <span className="font-medium">Status:</span> {getStatusBadge(invoice.status)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 px-3 font-semibold text-gray-900 text-sm">Description</th>
                    <th className="text-center py-2 px-3 font-semibold text-gray-900 text-sm">Qty</th>
                    <th className="text-right py-2 px-3 font-semibold text-gray-900 text-sm">Rate</th>
                    <th className="text-right py-2 px-3 font-semibold text-gray-900 text-sm">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.lineItems.map((item) => (
                    <tr key={item.id} className="border-b border-gray-100">
                      <td className="py-3 px-3 text-gray-900 text-sm">{item.description}</td>
                      <td className="py-3 px-3 text-center text-gray-600 text-sm">{item.quantity}</td>
                      <td className="py-3 px-3 text-right text-gray-600 text-sm">
                        ${item.rate.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 text-right font-semibold text-gray-900 text-sm">
                        ${item.total.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="mt-6 flex justify-end">
              <div className="w-72 space-y-2">
                <div className="flex justify-between text-gray-600 text-sm">
                  <span>Subtotal:</span>
                  <span>${invoice.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600 text-sm">
                  <span>Tax ({invoice.taxRate}%):</span>
                  <span>${invoice.taxAmount.toLocaleString()}</span>
                </div>
                <div className="border-t border-gray-200 pt-2">
                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>Total:</span>
                    <span>${invoice.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          {invoice.notes && (
            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <h3 className="text-base font-semibold text-gray-900 mb-2">Notes</h3>
              <p className="text-gray-700 text-sm">{invoice.notes}</p>
            </div>
          )}

          {/* Payment Section - Only show if not paid */}
          {invoice.status !== 'paid' && (
            <div className="p-6 border-t border-gray-200 bg-primary-50">
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Total Amount Due: ${invoice.total.toLocaleString()}
                </h3>
                
                <button className="btn btn-primary btn-lg flex items-center gap-2 mx-auto mb-3">
                  <CreditCard className="w-5 h-5" />
                  Pay Invoice Now
                </button>
                
                <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                  <Shield className="w-4 h-4" />
                  <span>Secure Payment via Stripe</span>
                </div>
                
                <div className="mt-3">
                  <img 
                    src="https://js.stripe.com/v3/fingerprinted/img/stripe-logo-4x.png" 
                    alt="Stripe" 
                    className="h-5 mx-auto opacity-60"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="no-print mt-6 text-center text-sm text-gray-500">
          <p>This invoice was generated by FreelancePro CRM</p>
          <p>For support, contact billing@freelancepro.com</p>
        </div>
      </div>
    </div>
  );
};

export default InvoiceView;
