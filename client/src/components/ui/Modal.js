import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true,
  className = ''
}) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'max-w-md';
      case 'lg':
        return 'max-w-4xl';
      case 'xl':
        return 'max-w-6xl';
      case 'full':
        return 'max-w-full mx-4';
      default:
        return 'max-w-2xl';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Enhanced Cosmic Overlay */}
      <div
        className="fixed inset-0 bg-gradient-to-br from-purple-900/80 via-indigo-900/80 to-black/80 backdrop-blur-xl transition-opacity"
        onClick={closeOnOverlayClick ? onClose : undefined}
      >
        {/* Animated background elements */}
        <div className="absolute inset-0 bg-gradient-radial from-purple-600/10 via-transparent to-transparent animate-pulse" style={{animationDuration: '8s'}}></div>
        <div className="absolute inset-0 bg-gradient-radial from-blue-500/8 via-transparent to-transparent animate-pulse" style={{animationDuration: '12s', animationDelay: '2s'}}></div>
        <div className="absolute inset-0 bg-gradient-radial from-magenta-500/6 via-transparent to-transparent animate-pulse" style={{animationDuration: '15s', animationDelay: '4s'}}></div>
      </div>

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-3 sm:p-4">
        <div
          className={`
            relative w-full ${getSizeClasses()} transform overflow-hidden rounded-2xl 
            transition-all duration-300 ease-out
            ${className}
          `}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Enhanced Glassmorphism Container */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-400/25 via-fuchsia-300/20 to-pink-400/15 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500 animate-pulse" style={{animationDuration: '6s'}}></div>
            <div className="relative backdrop-blur-2xl bg-gradient-to-br from-zinc-800/45 via-purple-900/40 to-fuchsia-900/35 border-2 border-purple-400/60 rounded-2xl shadow-2xl shadow-purple-500/30">
              {/* Header */}
              {title && (
                <div className="flex items-center justify-between border-b border-purple-400/30 px-4 sm:px-6 py-3 sm:py-4">
                  <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                    <div className="p-1.5 sm:p-2 bg-gradient-to-br from-purple-500/30 to-fuchsia-500/30 rounded-lg border border-purple-400/40">
                      <div className="w-4 h-4 sm:w-5 sm:h-5 bg-gradient-to-br from-purple-300 to-fuchsia-300 rounded"></div>
                    </div>
                    {title}
                  </h2>
                  {showCloseButton && (
                    <button
                      onClick={onClose}
                      className="relative group/btn p-1.5 sm:p-2 rounded-lg transition-all duration-300"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-red-500/30 to-rose-400/30 rounded-lg blur-sm group-hover/btn:blur-md transition-all duration-300"></div>
                      <div className="relative bg-gradient-to-br from-red-500/50 to-rose-400/50 border border-red-300/60 rounded-lg p-1.5 sm:p-2 hover:from-red-500/60 hover:to-rose-400/60 transition-all duration-300">
                        <X className="w-4 h-4 sm:w-5 sm:h-5 text-red-200" />
                      </div>
                    </button>
                  )}
                </div>
              )}

              {/* Content */}
              <div className="p-4 sm:p-6">
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
