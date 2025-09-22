import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Command, Search, Plus, Home, Users, FolderOpen, FileText, Settings, HelpCircle } from 'lucide-react';

const KeyboardShortcuts = () => {
  const navigate = useNavigate();
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event) => {
      // Check if user is typing in an input field
      if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA' || event.target.contentEditable === 'true') {
        return;
      }

      // Check for Ctrl/Cmd + key combinations
      if (event.ctrlKey || event.metaKey) {
        switch (event.key.toLowerCase()) {
          case 'k':
            event.preventDefault();
            // Focus search
            const searchInput = document.querySelector('input[placeholder*="Search"]');
            if (searchInput) {
              searchInput.focus();
            }
            break;
          case 'n':
            event.preventDefault();
            // Quick new item based on current page
            const currentPath = window.location.pathname;
            if (currentPath.includes('/clients')) {
              navigate('/clients/new');
            } else if (currentPath.includes('/projects')) {
              navigate('/projects/new');
            } else if (currentPath.includes('/invoices')) {
              navigate('/invoices/new');
            } else {
              navigate('/clients/new');
            }
            break;
          case 'h':
            event.preventDefault();
            navigate('/dashboard');
            break;
          case 'c':
            event.preventDefault();
            navigate('/clients');
            break;
          case 'p':
            event.preventDefault();
            navigate('/projects');
            break;
          case 'i':
            event.preventDefault();
            navigate('/invoices');
            break;
          case 's':
            event.preventDefault();
            navigate('/settings');
            break;
          case '/':
            event.preventDefault();
            setShowHelp(!showHelp);
            break;
          default:
            // No action for other keys
            break;
        }
      }

      // Check for single key shortcuts (when not in input)
      if (!event.ctrlKey && !event.metaKey && !event.altKey) {
        switch (event.key.toLowerCase()) {
          case 'escape':
            setShowHelp(false);
            break;
          default:
            // No action for other keys
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [navigate, showHelp]);

  const shortcuts = [
    { keys: ['Ctrl', 'K'], description: 'Focus search', icon: Search },
    { keys: ['Ctrl', 'N'], description: 'Create new item', icon: Plus },
    { keys: ['Ctrl', 'H'], description: 'Go to dashboard', icon: Home },
    { keys: ['Ctrl', 'C'], description: 'Go to clients', icon: Users },
    { keys: ['Ctrl', 'P'], description: 'Go to projects', icon: FolderOpen },
    { keys: ['Ctrl', 'I'], description: 'Go to invoices', icon: FileText },
    { keys: ['Ctrl', 'S'], description: 'Go to settings', icon: Settings },
    { keys: ['Ctrl', '/'], description: 'Show shortcuts', icon: HelpCircle },
    { keys: ['Esc'], description: 'Close dialogs', icon: Command },
  ];

  if (!showHelp) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" onClick={() => setShowHelp(false)}>
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Keyboard Shortcuts</h3>
              <button
                onClick={() => setShowHelp(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <Command size={20} />
              </button>
            </div>
            
            <div className="space-y-3">
              {shortcuts.map((shortcut, index) => {
                const Icon = shortcut.icon;
                return (
                  <div key={index} className="flex items-center justify-between py-2">
                    <div className="flex items-center space-x-3">
                      <Icon size={16} className="text-gray-500" />
                      <span className="text-sm text-gray-700">{shortcut.description}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      {shortcut.keys.map((key, keyIndex) => (
                        <React.Fragment key={keyIndex}>
                          <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded">
                            {key}
                          </kbd>
                          {keyIndex < shortcut.keys.length - 1 && (
                            <span className="text-xs text-gray-400">+</span>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={() => setShowHelp(false)}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Got it
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KeyboardShortcuts;
