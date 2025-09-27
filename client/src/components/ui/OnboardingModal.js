import React, { useState } from 'react';
import { X, ChevronRight, ChevronLeft, Check } from 'lucide-react';
import Modal from './Modal';

const OnboardingModal = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: 'Welcome to FreelancePro CRM!',
      description: 'Let\'s get you started with managing your freelance business like a pro.',
      content: (
        <div className="text-center space-y-6">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto">
            <span className="text-3xl">👋</span>
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-gray-900">Get Started in Minutes</h3>
            <p className="text-gray-600">
              We'll walk you through the key features to help you manage clients, projects, and invoices efficiently.
            </p>
          </div>
        </div>
      )
    },
    {
      title: 'Add Your First Client',
      description: 'Start by adding your existing clients to the system.',
      content: (
        <div className="space-y-6">
          <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mx-auto">
            <span className="text-2xl">👥</span>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 text-center">Client Management</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-green-600" />
                <span>Store client contact information</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-green-600" />
                <span>Track project history</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-green-600" />
                <span>Monitor revenue per client</span>
              </li>
            </ul>
          </div>
        </div>
      )
    },
    {
      title: 'Create Projects',
      description: 'Organize your work with project tracking and time management.',
      content: (
        <div className="space-y-6">
          <div className="flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mx-auto">
            <span className="text-2xl">📁</span>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 text-center">Project Tracking</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-green-600" />
                <span>Set project deadlines and milestones</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-green-600" />
                <span>Track time and progress</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-green-600" />
                <span>Monitor project profitability</span>
              </li>
            </ul>
          </div>
        </div>
      )
    },
    {
      title: 'Generate Invoices',
      description: 'Create professional invoices and track payments seamlessly.',
      content: (
        <div className="space-y-6">
          <div className="flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mx-auto">
            <span className="text-2xl">💰</span>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 text-center">Billing & Payments</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-green-600" />
                <span>Create professional invoices</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-green-600" />
                <span>Track payment status</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-green-600" />
                <span>Generate financial reports</span>
              </li>
            </ul>
          </div>
        </div>
      )
    },
    {
      title: 'You\'re All Set!',
      description: 'Start managing your freelance business with confidence.',
      content: (
        <div className="text-center space-y-6">
          <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <Check className="w-12 h-12 text-white" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-gray-900">Ready to Go!</h3>
            <p className="text-gray-600">
              You now have everything you need to manage your freelance business efficiently. 
              Start by adding your first client or creating a new project.
            </p>
          </div>
        </div>
      )
    }
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const skipOnboarding = () => {
    localStorage.setItem('onboarding_completed', 'true');
    onClose();
  };

  const currentStepData = steps[currentStep];

  return (
    <Modal
      isOpen={isOpen}
      onClose={skipOnboarding}
      size="md"
      className="max-w-2xl"
    >
      <div className="space-y-6">
        {/* Progress bar */}
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex space-x-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 flex-1 rounded-full transition-colors ${
                    index <= currentStep ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>
          <button
            onClick={skipOnboarding}
            className="ml-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step content */}
        <div className="py-4">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">
              {currentStepData.title}
            </h2>
            <p className="text-gray-600">
              {currentStepData.description}
            </p>
          </div>
          
          <div className="mt-8">
            {currentStepData.content}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <div className="text-sm text-gray-500">
            Step {currentStep + 1} of {steps.length}
          </div>

          <button
            onClick={nextStep}
            className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <span>{currentStep === steps.length - 1 ? 'Get Started' : 'Next'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default OnboardingModal;
