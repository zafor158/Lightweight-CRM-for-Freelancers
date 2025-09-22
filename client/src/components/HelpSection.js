import React, { useState } from 'react';
import { X, Search, HelpCircle, BookOpen, MessageCircle, Mail, Phone, ExternalLink, ChevronRight } from 'lucide-react';

const HelpSection = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('getting-started');

  const categories = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: BookOpen,
      articles: [
        { title: 'Welcome to FreelancePro', content: 'Learn the basics of using FreelancePro to manage your freelance business.' },
        { title: 'Setting up your profile', content: 'Configure your profile and business information.' },
        { title: 'Adding your first client', content: 'Step-by-step guide to adding and managing clients.' },
        { title: 'Creating your first project', content: 'How to create and track projects effectively.' },
        { title: 'Generating invoices', content: 'Create professional invoices and track payments.' }
      ]
    },
    {
      id: 'clients',
      title: 'Client Management',
      icon: HelpCircle,
      articles: [
        { title: 'Client dashboard overview', content: 'Understanding the client management interface.' },
        { title: 'Adding client information', content: 'What information to collect and store for clients.' },
        { title: 'Client communication', content: 'Best practices for client communication and follow-ups.' },
        { title: 'Client project history', content: 'Tracking project history and client relationships.' }
      ]
    },
    {
      id: 'projects',
      title: 'Project Management',
      icon: BookOpen,
      articles: [
        { title: 'Project lifecycle', content: 'Understanding the complete project management workflow.' },
        { title: 'Setting project deadlines', content: 'How to set and manage project timelines effectively.' },
        { title: 'Project status tracking', content: 'Monitoring project progress and status updates.' },
        { title: 'Time tracking', content: 'Tracking time spent on projects for accurate billing.' }
      ]
    },
    {
      id: 'invoices',
      title: 'Invoicing & Payments',
      icon: MessageCircle,
      articles: [
        { title: 'Invoice templates', content: 'Customizing invoice templates for your brand.' },
        { title: 'Payment tracking', content: 'Monitoring invoice payments and overdue accounts.' },
        { title: 'Tax management', content: 'Handling taxes and financial reporting.' },
        { title: 'Payment methods', content: 'Setting up and managing payment options.' }
      ]
    }
  ];

  const faqs = [
    {
      question: 'How do I add a new client?',
      answer: 'Click on "Clients" in the sidebar, then click the "Add Client" button. Fill in the client information form and save.'
    },
    {
      question: 'Can I customize invoice templates?',
      answer: 'Yes, you can customize invoice templates with your logo, colors, and business information in the settings.'
    },
    {
      question: 'How do I track project progress?',
      answer: 'Update project status regularly, set milestones, and use the project dashboard to monitor progress.'
    },
    {
      question: 'What payment methods are supported?',
      answer: 'FreelancePro integrates with Stripe for secure payment processing, supporting major credit cards and digital wallets.'
    },
    {
      question: 'How do I export my data?',
      answer: 'You can export client, project, and invoice data in CSV format from the respective sections.'
    }
  ];

  const filteredArticles = categories
    .find(cat => cat.id === selectedCategory)
    ?.articles.filter(article => 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.content.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" onClick={onClose}>
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <div className="bg-white">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <HelpCircle className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Help & Support</h3>
                  <p className="text-sm text-gray-600">Find answers and get help with FreelancePro</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex">
              {/* Sidebar */}
              <div className="w-64 bg-gray-50 border-r border-gray-200">
                <div className="p-4">
                  <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="text"
                      placeholder="Search help..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  
                  <nav className="space-y-1">
                    {categories.map((category) => {
                      const Icon = category.icon;
                      return (
                        <button
                          key={category.id}
                          onClick={() => setSelectedCategory(category.id)}
                          className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                            selectedCategory === category.id
                              ? 'bg-indigo-100 text-indigo-700'
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          <Icon size={16} className="mr-3" />
                          {category.title}
                        </button>
                      );
                    })}
                  </nav>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 p-6">
                {searchQuery ? (
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-4">
                      Search Results for "{searchQuery}"
                    </h4>
                    <div className="space-y-3">
                      {filteredArticles.map((article, index) => (
                        <div key={index} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                          <h5 className="font-medium text-gray-900 mb-1">{article.title}</h5>
                          <p className="text-sm text-gray-600">{article.content}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-4">
                      {categories.find(cat => cat.id === selectedCategory)?.title}
                    </h4>
                    <div className="space-y-3">
                      {filteredArticles.map((article, index) => (
                        <div key={index} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                          <div className="flex items-center justify-between">
                            <div>
                              <h5 className="font-medium text-gray-900 mb-1">{article.title}</h5>
                              <p className="text-sm text-gray-600">{article.content}</p>
                            </div>
                            <ChevronRight size={16} className="text-gray-400" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* FAQs Section */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Frequently Asked Questions</h4>
                  <div className="space-y-4">
                    {faqs.map((faq, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg">
                        <button className="w-full p-4 text-left hover:bg-gray-50 transition-colors">
                          <div className="flex items-center justify-between">
                            <h5 className="font-medium text-gray-900">{faq.question}</h5>
                            <ChevronRight size={16} className="text-gray-400" />
                          </div>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Contact Support */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Still need help?</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <MessageCircle className="w-5 h-5 text-indigo-600 mr-3" />
                      <div className="text-left">
                        <div className="font-medium text-gray-900">Live Chat</div>
                        <div className="text-sm text-gray-600">Get instant help</div>
                      </div>
                    </button>
                    <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <Mail className="w-5 h-5 text-indigo-600 mr-3" />
                      <div className="text-left">
                        <div className="font-medium text-gray-900">Email Support</div>
                        <div className="text-sm text-gray-600">support@freelancepro.com</div>
                      </div>
                    </button>
                    <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <ExternalLink className="w-5 h-5 text-indigo-600 mr-3" />
                      <div className="text-left">
                        <div className="font-medium text-gray-900">Documentation</div>
                        <div className="text-sm text-gray-600">Full user guide</div>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpSection;
