import React, { useState, useEffect } from 'react';
import { X, ChevronRight, ChevronLeft, CheckCircle, Users, FolderOpen, FileText, BarChart3, Zap, Star } from 'lucide-react';

const Onboarding = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has completed onboarding
    const hasCompletedOnboarding = localStorage.getItem('onboarding_completed');
    if (!hasCompletedOnboarding) {
      setIsVisible(true);
    }
  }, []);

  const steps = [
    {
      title: "Welcome to FreelancePro! 🎉",
      description: "Your professional CRM for managing clients, projects, and invoices. Let's get you started with a quick tour.",
      icon: Star,
      content: (
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Star className="w-10 h-10 text-white" />
          </div>
          <p className="text-gray-600">
            We'll show you the key features that will help you manage your freelance business more effectively.
          </p>
        </div>
      )
    },
    {
      title: "Manage Your Clients 👥",
      description: "Keep track of all your client information, contact details, and project history in one place.",
      icon: Users,
      content: (
        <div className="space-y-4">
          <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
            <Users className="w-6 h-6 text-blue-600" />
            <span className="text-sm text-gray-700">Add new clients with detailed information</span>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <span className="text-sm text-gray-700">Track client communication and preferences</span>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
            <BarChart3 className="w-6 h-6 text-purple-600" />
            <span className="text-sm text-gray-700">View client analytics and project history</span>
          </div>
        </div>
      )
    },
    {
      title: "Organize Your Projects 📁",
      description: "Create and manage projects with deadlines, budgets, and progress tracking.",
      icon: FolderOpen,
      content: (
        <div className="space-y-4">
          <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
            <FolderOpen className="w-6 h-6 text-blue-600" />
            <span className="text-sm text-gray-700">Create projects with detailed specifications</span>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <span className="text-sm text-gray-700">Set deadlines and track progress</span>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
            <BarChart3 className="w-6 h-6 text-purple-600" />
            <span className="text-sm text-gray-700">Monitor project profitability and time tracking</span>
          </div>
        </div>
      )
    },
    {
      title: "Handle Invoices & Payments 💰",
      description: "Generate professional invoices, track payments, and manage your financial records.",
      icon: FileText,
      content: (
        <div className="space-y-4">
          <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
            <FileText className="w-6 h-6 text-blue-600" />
            <span className="text-sm text-gray-700">Create professional invoices with your branding</span>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <span className="text-sm text-gray-700">Track payment status and overdue invoices</span>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
            <BarChart3 className="w-6 h-6 text-purple-600" />
            <span className="text-sm text-gray-700">Generate financial reports and analytics</span>
          </div>
        </div>
      )
    },
    {
      title: "Keyboard Shortcuts ⚡",
      description: "Work faster with these essential keyboard shortcuts.",
      icon: Zap,
      content: (
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-gray-50 rounded-lg">
            <kbd className="text-xs font-mono bg-white px-2 py-1 rounded border">Ctrl + K</kbd>
            <p className="text-xs text-gray-600 mt-1">Focus search</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <kbd className="text-xs font-mono bg-white px-2 py-1 rounded border">Ctrl + N</kbd>
            <p className="text-xs text-gray-600 mt-1">Create new item</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <kbd className="text-xs font-mono bg-white px-2 py-1 rounded border">Ctrl + C</kbd>
            <p className="text-xs text-gray-600 mt-1">Go to clients</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <kbd className="text-xs font-mono bg-white px-2 py-1 rounded border">Ctrl + /</kbd>
            <p className="text-xs text-gray-600 mt-1">Show shortcuts</p>
          </div>
        </div>
      )
    },
    {
      title: "You're All Set! 🚀",
      description: "You're ready to start managing your freelance business like a pro. Need help? Check out our help section anytime.",
      icon: CheckCircle,
      content: (
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <p className="text-gray-600 mb-4">
            Start by adding your first client or creating a new project. You can always revisit this tour from the help section.
          </p>
          <div className="flex justify-center space-x-4">
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition-colors">
              Add First Client
            </button>
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition-colors">
              Create Project
            </button>
          </div>
        </div>
      )
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    localStorage.setItem('onboarding_completed', 'true');
    setIsVisible(false);
    if (onComplete) onComplete();
  };

  const handleSkip = () => {
    handleComplete();
  };

  if (!isVisible) return null;

  const currentStepData = steps[currentStep];
  const Icon = currentStepData.icon;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <div className="bg-white px-6 pt-6 pb-4 sm:p-6 sm:pb-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <Icon className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{currentStepData.title}</h3>
                  <p className="text-sm text-gray-600">{currentStepData.description}</p>
                </div>
              </div>
              <button
                onClick={handleSkip}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Progress bar */}
            <div className="mb-6">
              <div className="flex justify-between text-xs text-gray-500 mb-2">
                <span>Step {currentStep + 1} of {steps.length}</span>
                <span>{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Content */}
            <div className="mb-6">
              {currentStepData.content}
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={handleNext}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
              <ChevronRight className="ml-2 w-4 h-4" />
            </button>
            {currentStep > 0 && (
              <button
                type="button"
                onClick={handlePrevious}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                <ChevronLeft className="mr-2 w-4 h-4" />
                Previous
              </button>
            )}
            <button
              type="button"
              onClick={handleSkip}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Skip Tour
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
