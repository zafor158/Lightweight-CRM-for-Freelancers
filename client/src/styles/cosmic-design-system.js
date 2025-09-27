/**
 * Cosmic Freelancer CRM - Unified Design System
 * 
 * This file defines the complete design system for the Cosmic Freelancer CRM,
 * ensuring visual consistency and professional appearance across all components.
 */

export const CosmicDesignSystem = {
  // ========================================
  // COLOR SYSTEM - SEMANTIC MEANING
  // ========================================
  
  colors: {
    // Primary Brand Colors
    primary: {
      cosmic: 'purple-500',        // Main brand color, headers, primary actions
      cosmicLight: 'purple-400',   // Hover states, lighter elements
      cosmicDark: 'purple-600',    // Active states, darker elements
      cosmicBg: 'purple-900',      // Background variations
    },
    
    // Secondary Colors
    secondary: {
      nebula: 'blue-500',          // Secondary actions, information cards
      nebulaLight: 'blue-400',     // Hover states, lighter elements
      nebulaDark: 'blue-600',      // Active states, darker elements
      nebulaBg: 'blue-900',        // Background variations
    },
    
    // Semantic Colors
    semantic: {
      success: 'green-500',        // Success states, completed actions
      successLight: 'green-400',   // Success hover states
      successDark: 'green-600',    // Success active states
      successBg: 'green-900',      // Success backgrounds
      
      warning: 'orange-500',       // Warning states, attention elements
      warningLight: 'orange-400',  // Warning hover states
      warningDark: 'orange-600',   // Warning active states
      warningBg: 'orange-900',     // Warning backgrounds
      
      error: 'red-500',            // Error states, destructive actions
      errorLight: 'red-400',       // Error hover states
      errorDark: 'red-600',        // Error active states
      errorBg: 'red-900',          // Error backgrounds
      
      info: 'cyan-500',            // Information states, neutral actions
      infoLight: 'cyan-400',       // Info hover states
      infoDark: 'cyan-600',        // Info active states
      infoBg: 'cyan-900',          // Info backgrounds
    },
    
    // Neutral Colors
    neutral: {
      void: 'black',               // Primary background, text
      stardust: 'gray-800',        // Secondary backgrounds
      moonlight: 'white',          // Primary text, highlights
      cosmicSilver: 'gray-300',    // Secondary text, borders
      cosmicGray: 'gray-600',      // Tertiary text, disabled states
    },
    
    // Accent Colors (Limited Use)
    accent: {
      aurora: 'pink-500',          // Special highlights, premium features
      auroraLight: 'pink-400',     // Aurora hover states
      auroraDark: 'pink-600',      // Aurora active states
      auroraBg: 'pink-900',        // Aurora backgrounds
      
      comet: 'yellow-500',         // Urgent notifications, high priority
      cometLight: 'yellow-400',    // Comet hover states
      cometDark: 'yellow-600',     // Comet active states
      cometBg: 'yellow-900',       // Comet backgrounds
    }
  },

  // ========================================
  // OPACITY SYSTEM - STANDARDIZED
  // ========================================
  
  opacity: {
    glow: {
      subtle: '/20',               // Subtle glow effects
      medium: '/30',               // Medium glow effects
      strong: '/40',               // Strong glow effects
    },
    background: {
      light: '/40',                // Light background overlays
      medium: '/50',               // Medium background overlays
      dark: '/60',                 // Dark background overlays
    },
    border: {
      subtle: '/30',               // Subtle border opacity
      medium: '/50',               // Medium border opacity
      strong: '/70',               // Strong border opacity
    },
    shadow: {
      light: '/20',                // Light shadow opacity
      medium: '/30',               // Medium shadow opacity
      strong: '/40',               // Strong shadow opacity
    }
  },

  // ========================================
  // COMPONENT STYLES - STANDARDIZED
  // ========================================
  
  components: {
    // Button Styles
    buttons: {
      primary: {
        base: 'bg-gradient-to-br from-purple-500 to-purple-600 border border-purple-400 text-white',
        hover: 'hover:from-purple-600 hover:to-purple-700 hover:border-purple-500',
        active: 'active:from-purple-700 active:to-purple-800',
        glow: 'shadow-lg shadow-purple-500/30',
        glowHover: 'hover:shadow-purple-500/40'
      },
      secondary: {
        base: 'bg-gradient-to-br from-blue-500 to-blue-600 border border-blue-400 text-white',
        hover: 'hover:from-blue-600 hover:to-blue-700 hover:border-blue-500',
        active: 'active:from-blue-700 active:to-blue-800',
        glow: 'shadow-lg shadow-blue-500/30',
        glowHover: 'hover:shadow-blue-500/40'
      },
      success: {
        base: 'bg-gradient-to-br from-green-500 to-green-600 border border-green-400 text-white',
        hover: 'hover:from-green-600 hover:to-green-700 hover:border-green-500',
        active: 'active:from-green-700 active:to-green-800',
        glow: 'shadow-lg shadow-green-500/30',
        glowHover: 'hover:shadow-green-500/40'
      },
      warning: {
        base: 'bg-gradient-to-br from-orange-500 to-orange-600 border border-orange-400 text-white',
        hover: 'hover:from-orange-600 hover:to-orange-700 hover:border-orange-500',
        active: 'active:from-orange-700 active:to-orange-800',
        glow: 'shadow-lg shadow-orange-500/30',
        glowHover: 'hover:shadow-orange-500/40'
      },
      danger: {
        base: 'bg-gradient-to-br from-red-500 to-red-600 border border-red-400 text-white',
        hover: 'hover:from-red-600 hover:to-red-700 hover:border-red-500',
        active: 'active:from-red-700 active:to-red-800',
        glow: 'shadow-lg shadow-red-500/30',
        glowHover: 'hover:shadow-red-500/40'
      },
      ghost: {
        base: 'bg-transparent border border-gray-300 text-gray-300',
        hover: 'hover:bg-gray-800/50 hover:border-gray-200 hover:text-white',
        active: 'active:bg-gray-700/50',
        glow: 'shadow-lg shadow-gray-500/20',
        glowHover: 'hover:shadow-gray-500/30'
      }
    },

    // Card Styles
    cards: {
      standard: {
        base: 'backdrop-blur-2xl bg-gradient-to-br from-slate-800/45 via-gray-800/40 to-black/50 border-2 border-purple-400/60 rounded-2xl shadow-2xl shadow-purple-500/30',
        hover: 'hover:border-purple-400/70 hover:shadow-purple-500/40',
        glow: 'absolute inset-0 bg-gradient-to-br from-purple-400/25 via-purple-300/20 to-purple-400/15 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500'
      },
      info: {
        base: 'backdrop-blur-2xl bg-gradient-to-br from-slate-800/45 via-blue-900/40 to-blue-900/35 border-2 border-blue-400/60 rounded-2xl shadow-2xl shadow-blue-500/30',
        hover: 'hover:border-blue-400/70 hover:shadow-blue-500/40',
        glow: 'absolute inset-0 bg-gradient-to-br from-blue-400/25 via-blue-300/20 to-blue-400/15 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500'
      },
      success: {
        base: 'backdrop-blur-2xl bg-gradient-to-br from-slate-800/45 via-green-900/40 to-green-900/35 border-2 border-green-400/60 rounded-2xl shadow-2xl shadow-green-500/30',
        hover: 'hover:border-green-400/70 hover:shadow-green-500/40',
        glow: 'absolute inset-0 bg-gradient-to-br from-green-400/25 via-green-300/20 to-green-400/15 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500'
      },
      warning: {
        base: 'backdrop-blur-2xl bg-gradient-to-br from-slate-800/45 via-orange-900/40 to-orange-900/35 border-2 border-orange-400/60 rounded-2xl shadow-2xl shadow-orange-500/30',
        hover: 'hover:border-orange-400/70 hover:shadow-orange-500/40',
        glow: 'absolute inset-0 bg-gradient-to-br from-orange-400/25 via-orange-300/20 to-orange-400/15 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500'
      },
      error: {
        base: 'backdrop-blur-2xl bg-gradient-to-br from-slate-800/45 via-red-900/40 to-red-900/35 border-2 border-red-400/60 rounded-2xl shadow-2xl shadow-red-500/30',
        hover: 'hover:border-red-400/70 hover:shadow-red-500/40',
        glow: 'absolute inset-0 bg-gradient-to-br from-red-400/25 via-red-300/20 to-red-400/15 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500'
      }
    },

    // Status Badge Styles
    badges: {
      active: {
        base: 'bg-green-500/30 text-green-300 border border-green-400/40',
        glow: 'shadow-lg shadow-green-500/20'
      },
      completed: {
        base: 'bg-green-500/30 text-green-300 border border-green-400/40',
        glow: 'shadow-lg shadow-green-500/20'
      },
      pending: {
        base: 'bg-orange-500/30 text-orange-300 border border-orange-400/40',
        glow: 'shadow-lg shadow-orange-500/20'
      },
      warning: {
        base: 'bg-orange-500/30 text-orange-300 border border-orange-400/40',
        glow: 'shadow-lg shadow-orange-500/20'
      },
      error: {
        base: 'bg-red-500/30 text-red-300 border border-red-400/40',
        glow: 'shadow-lg shadow-red-500/20'
      },
      overdue: {
        base: 'bg-red-500/30 text-red-300 border border-red-400/40',
        glow: 'shadow-lg shadow-red-500/20'
      },
      draft: {
        base: 'bg-gray-500/30 text-gray-300 border border-gray-400/40',
        glow: 'shadow-lg shadow-gray-500/20'
      },
      neutral: {
        base: 'bg-gray-500/30 text-gray-300 border border-gray-400/40',
        glow: 'shadow-lg shadow-gray-500/20'
      }
    },

    // Form Element Styles
    forms: {
      input: {
        base: 'bg-slate-800/50 border border-purple-400/30 text-white placeholder-gray-300/60 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500/30 focus:border-purple-400/50 transition-all duration-300',
        error: 'border-red-400/50 focus:ring-red-500/30 focus:border-red-400/50',
        success: 'border-green-400/50 focus:ring-green-500/30 focus:border-green-400/50'
      },
      label: {
        base: 'block text-sm font-semibold text-purple-200 mb-2',
        required: 'after:content-["*"] after:text-red-400 after:ml-1'
      },
      error: {
        base: 'text-red-400 text-xs mt-1 flex items-center gap-1',
        icon: 'w-3 h-3'
      }
    }
  },

  // ========================================
  // TYPOGRAPHY SYSTEM - STANDARDIZED
  // ========================================
  
  typography: {
    headings: {
      h1: 'text-3xl sm:text-4xl lg:text-5xl font-black text-white',
      h2: 'text-2xl sm:text-3xl lg:text-4xl font-bold text-white',
      h3: 'text-xl sm:text-2xl lg:text-3xl font-bold text-white',
      h4: 'text-lg sm:text-xl lg:text-2xl font-semibold text-white',
      h5: 'text-base sm:text-lg lg:text-xl font-semibold text-white',
      h6: 'text-sm sm:text-base lg:text-lg font-medium text-white'
    },
    body: {
      large: 'text-lg text-white',
      base: 'text-base text-white',
      small: 'text-sm text-gray-300',
      xs: 'text-xs text-gray-400'
    },
    labels: {
      primary: 'text-sm font-semibold text-purple-200',
      secondary: 'text-xs font-medium text-gray-300 uppercase tracking-wide',
      error: 'text-xs font-medium text-red-400',
      success: 'text-xs font-medium text-green-400'
    }
  },

  // ========================================
  // SPACING SYSTEM - STANDARDIZED
  // ========================================
  
  spacing: {
    padding: {
      xs: 'p-2',
      sm: 'p-3',
      md: 'p-4',
      lg: 'p-6',
      xl: 'p-8'
    },
    margin: {
      xs: 'm-2',
      sm: 'm-3',
      md: 'm-4',
      lg: 'm-6',
      xl: 'm-8'
    },
    gap: {
      xs: 'gap-2',
      sm: 'gap-3',
      md: 'gap-4',
      lg: 'gap-6',
      xl: 'gap-8'
    }
  },

  // ========================================
  // ANIMATION SYSTEM - STANDARDIZED
  // ========================================
  
  animations: {
    duration: {
      fast: 'duration-200',
      normal: 'duration-300',
      slow: 'duration-500'
    },
    easing: {
      ease: 'ease-in-out',
      easeOut: 'ease-out',
      easeIn: 'ease-in'
    },
    effects: {
      fadeIn: 'animate-fade-in',
      slideUp: 'animate-slide-up',
      scaleIn: 'animate-scale-in',
      pulse: 'animate-pulse',
      float: 'animate-float'
    }
  }
};

// ========================================
// UTILITY FUNCTIONS
// ========================================

/**
 * Get button classes based on variant
 */
export const getButtonClasses = (variant = 'primary', size = 'md') => {
  const baseClasses = 'relative group/btn inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black';
  const variantClasses = CosmicDesignSystem.components.buttons[variant];
  const sizeClasses = size === 'sm' ? 'px-3 py-1.5 text-sm' : size === 'lg' ? 'px-6 py-3 text-lg' : 'px-4 py-2 text-base';
  
  return `${baseClasses} ${variantClasses.base} ${variantClasses.hover} ${variantClasses.active} ${variantClasses.glow} ${variantClasses.glowHover} ${sizeClasses}`;
};

/**
 * Get card classes based on variant
 */
export const getCardClasses = (variant = 'standard') => {
  const card = CosmicDesignSystem.components.cards[variant];
  return `relative group ${card.base} ${card.hover}`;
};

/**
 * Get badge classes based on status
 */
export const getBadgeClasses = (status) => {
  const badge = CosmicDesignSystem.components.badges[status] || CosmicDesignSystem.components.badges.neutral;
  return `inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wide ${badge.base} ${badge.glow}`;
};

/**
 * Get form input classes
 */
export const getInputClasses = (hasError = false, hasSuccess = false) => {
  const baseClasses = CosmicDesignSystem.components.forms.input.base;
  const errorClasses = hasError ? CosmicDesignSystem.components.forms.input.error : '';
  const successClasses = hasSuccess ? CosmicDesignSystem.components.forms.input.success : '';
  
  return `${baseClasses} ${errorClasses} ${successClasses}`;
};

/**
 * Get glow effect classes
 */
export const getGlowClasses = (color, intensity = 'medium') => {
  const opacity = CosmicDesignSystem.opacity.glow[intensity];
  return `absolute inset-0 bg-gradient-to-br from-${color}-400${opacity} via-${color}-300${opacity} to-${color}-400${opacity} rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500`;
};

export default CosmicDesignSystem;
