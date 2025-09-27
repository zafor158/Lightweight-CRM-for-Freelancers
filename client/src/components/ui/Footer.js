import React from 'react';
import { Heart, Zap } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-black/40 backdrop-blur-xl border-t border-white/10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2 space-text-secondary">
            <Zap className="w-5 h-5 text-purple-400" />
            <span className="font-semibold">FreelancePro CRM</span>
            <span className="space-text-muted">•</span>
            <span className="text-sm">Professional Client Management</span>
          </div>
          
          <div className="flex items-center space-x-4 text-sm space-text-muted">
            <span>© 2024 FreelancePro. All rights reserved.</span>
            <span className="hidden md:inline">•</span>
            <div className="flex items-center space-x-1">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-400" />
              <span>for freelancers</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
