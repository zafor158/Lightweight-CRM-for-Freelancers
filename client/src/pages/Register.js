import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Mail, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  Zap, 
  ArrowRight, 
  Shield, 
  CheckCircle, 
  Star, 
  Rocket, 
  Globe, 
  Sparkles,
  Users,
  TrendingUp,
  Award,
  ShieldCheck,
  Clock,
  Target,
  Crown,
  Gem,
  Sparkle,
  UserPlus,
  Shield as ShieldIcon,
  CheckCircle2
} from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [focusedField, setFocusedField] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  // Animation trigger on component mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: '',
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    const result = await register(formData.name, formData.email, formData.password);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setErrors({ general: result.message || 'Registration failed' });
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Enhanced Cosmic Background */}
      <div className="absolute inset-0">
        {/* Animated Star Field */}
        <div className="absolute inset-0 opacity-60">
          {[...Array(120)].map((_, i) => (
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
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-radial from-purple-500/20 via-blue-500/10 to-transparent rounded-full blur-3xl animate-pulse" style={{animationDuration: '8s'}}></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-radial from-cyan-500/15 via-indigo-500/8 to-transparent rounded-full blur-3xl animate-pulse" style={{animationDuration: '6s', animationDelay: '2s'}}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-radial from-pink-500/10 via-purple-500/5 to-transparent rounded-full blur-2xl animate-pulse" style={{animationDuration: '10s', animationDelay: '4s'}}></div>
        </div>

        {/* Floating Celestial Bodies */}
        <div className="absolute top-20 left-20 w-24 h-24 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full shadow-2xl shadow-blue-500/30 animate-float">
          <div className="absolute inset-2 rounded-full bg-gradient-to-br from-blue-300/50 to-transparent"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-blue-300/20 rounded-full"></div>
        </div>

        <div className="absolute top-40 right-32 w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full shadow-xl shadow-purple-500/40 animate-float" style={{animationDelay: '1s'}}>
          <div className="absolute inset-1 rounded-full bg-gradient-to-br from-purple-300/30 to-transparent"></div>
        </div>

        <div className="absolute bottom-32 left-1/3 w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full shadow-lg shadow-emerald-500/30 animate-float" style={{animationDelay: '2s'}}></div>

        {/* Animated Meteor Streaks */}
        <div className="absolute top-1/4 right-1/3 w-1 h-20 bg-gradient-to-b from-transparent via-white to-transparent transform rotate-45 opacity-60 animate-pulse" style={{animationDelay: '3s'}}></div>
        <div className="absolute bottom-1/3 left-1/4 w-1 h-16 bg-gradient-to-b from-transparent via-cyan-200 to-transparent transform -rotate-45 opacity-40 animate-pulse" style={{animationDelay: '5s'}}></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Side - Hero Section */}
          <div className={`text-center lg:text-left space-y-8 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
            
            {/* Animated Brand Logo */}
            <div className={`flex items-center justify-center lg:justify-start space-x-4 mb-8 transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-300"></div>
                <div className="relative w-16 h-16 bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-2xl">
                  <UserPlus className="w-8 h-8 text-white animate-pulse" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-black text-white">FreelancePro</h1>
                <p className="text-sm text-gray-400 font-medium">Lightweight CRM</p>
              </div>
            </div>

            {/* Animated Main Heading */}
            <div className={`space-y-6 transition-all duration-1000 delay-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
              <h1 className="text-6xl lg:text-7xl font-black text-white leading-tight">
                <span className="block">START YOUR</span>
                <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-pulse">
                  JOURNEY!
                </span>
                <span className="block bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                  TO SUCCESS
                </span>
              </h1>
              
              <p className="text-xl lg:text-2xl text-gray-300 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                Join thousands of professionals who have already launched their interstellar journey towards business success.
              </p>
            </div>

            {/* Animated Feature Highlights */}
            <div className={`space-y-4 pt-8 transition-all duration-1000 delay-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3 text-gray-300 group">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                    <ShieldCheck className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-medium">Enterprise Security</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-300 group">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                    <Users className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-medium">24/7 Support</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-300 group">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                    <TrendingUp className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-medium">Advanced Analytics</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-300 group">
                  <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                    <Award className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-medium">Award Winning</span>
                </div>
              </div>
            </div>

            {/* Animated Stats */}
            <div className={`flex items-center justify-center lg:justify-start space-x-8 pt-8 transition-all duration-1000 delay-900 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">10K+</div>
                <div className="text-sm text-gray-400">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">99.9%</div>
                <div className="text-sm text-gray-400">Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">4.9★</div>
                <div className="text-sm text-gray-400">Rating</div>
              </div>
            </div>
          </div>

          {/* Right Side - Enhanced Register Form */}
          <div className={`w-full max-w-lg mx-auto transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
            
            {/* Enhanced Form Card */}
            <div className="relative group">
              {/* Glowing Border Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-blue-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              
              {/* Main Form Container */}
              <div className="relative backdrop-blur-2xl bg-gradient-to-br from-slate-800/60 via-purple-900/40 to-slate-800/60 rounded-3xl p-8 border border-white/10 shadow-2xl">
                
                {/* Form Header */}
                <div className="text-center mb-8">
                  <div className="flex items-center justify-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                      <UserPlus className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">Join the Adventure</h2>
                  <p className="text-gray-400">Create your account and start your journey</p>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit}>

                  {/* General Error */}
                  {errors.general && (
                    <div className="bg-red-900/50 border border-red-500/50 rounded-xl p-4 backdrop-blur-sm">
                      <p className="text-sm text-red-300">{errors.general}</p>
                    </div>
                  )}

                  {/* Enhanced Name Field */}
                  <div className="space-y-2">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                      Full Name
                    </label>
                    <div className="relative group/input">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-xl blur-sm group-hover/input:blur-md transition-all duration-300"></div>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                          <User className={`h-5 w-5 transition-colors duration-200 ${
                            focusedField === 'name' ? 'text-purple-400' : 'text-gray-400'
                          }`} />
                        </div>
                        <input
                          id="name"
                          name="name"
                          type="text"
                          autoComplete="name"
                          required
                          className={`w-full pl-12 pr-4 py-4 bg-slate-800/50 border-2 rounded-xl text-white placeholder-gray-400 transition-all duration-200 focus:outline-none focus:ring-0 backdrop-blur-sm ${
                            errors.name 
                              ? 'border-red-500 bg-red-900/20 shadow-lg shadow-red-500/20' 
                              : focusedField === 'name' 
                                ? 'border-purple-500 bg-slate-800/70 shadow-lg shadow-purple-500/20' 
                                : 'border-gray-600 hover:border-gray-500 focus:border-purple-500'
                          }`}
                          placeholder="Enter your full name"
                          value={formData.name}
                          onChange={handleChange}
                          onFocus={() => setFocusedField('name')}
                          onBlur={() => setFocusedField(null)}
                        />
                      </div>
                    </div>
                    {errors.name && (
                      <p className="text-sm text-red-300 mt-1 flex items-center gap-1">
                        <span className="w-1 h-1 bg-red-400 rounded-full"></span>
                        {errors.name}
                      </p>
                    )}
                  </div>

                  {/* Enhanced Email Field */}
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                      Email Address
                    </label>
                    <div className="relative group/input">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-xl blur-sm group-hover/input:blur-md transition-all duration-300"></div>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                          <Mail className={`h-5 w-5 transition-colors duration-200 ${
                            focusedField === 'email' ? 'text-purple-400' : 'text-gray-400'
                          }`} />
                        </div>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          required
                          className={`w-full pl-12 pr-4 py-4 bg-slate-800/50 border-2 rounded-xl text-white placeholder-gray-400 transition-all duration-200 focus:outline-none focus:ring-0 backdrop-blur-sm ${
                            errors.email 
                              ? 'border-red-500 bg-red-900/20 shadow-lg shadow-red-500/20' 
                              : focusedField === 'email' 
                                ? 'border-purple-500 bg-slate-800/70 shadow-lg shadow-purple-500/20' 
                                : 'border-gray-600 hover:border-gray-500 focus:border-purple-500'
                          }`}
                          placeholder="yourname@example.com"
                          value={formData.email}
                          onChange={handleChange}
                          onFocus={() => setFocusedField('email')}
                          onBlur={() => setFocusedField(null)}
                        />
                      </div>
                    </div>
                    {errors.email && (
                      <p className="text-sm text-red-300 mt-1 flex items-center gap-1">
                        <span className="w-1 h-1 bg-red-400 rounded-full"></span>
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Enhanced Password Field */}
                  <div className="space-y-2">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                      Password
                    </label>
                    <div className="relative group/input">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-xl blur-sm group-hover/input:blur-md transition-all duration-300"></div>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                          <Lock className={`h-5 w-5 transition-colors duration-200 ${
                            focusedField === 'password' ? 'text-purple-400' : 'text-gray-400'
                          }`} />
                        </div>
                        <input
                          id="password"
                          name="password"
                          type={showPassword ? 'text' : 'password'}
                          autoComplete="new-password"
                          required
                          className={`w-full pl-12 pr-12 py-4 bg-slate-800/50 border-2 rounded-xl text-white placeholder-gray-400 transition-all duration-200 focus:outline-none focus:ring-0 backdrop-blur-sm ${
                            errors.password 
                              ? 'border-red-500 bg-red-900/20 shadow-lg shadow-red-500/20' 
                              : focusedField === 'password' 
                                ? 'border-purple-500 bg-slate-800/70 shadow-lg shadow-purple-500/20' 
                                : 'border-gray-600 hover:border-gray-500 focus:border-purple-500'
                          }`}
                          placeholder="Create a strong password"
                          value={formData.password}
                          onChange={handleChange}
                          onFocus={() => setFocusedField('password')}
                          onBlur={() => setFocusedField(null)}
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-4 flex items-center z-10 text-gray-400 hover:text-gray-300 transition-colors duration-200"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </div>
                    {errors.password && (
                      <p className="text-sm text-red-300 mt-1 flex items-center gap-1">
                        <span className="w-1 h-1 bg-red-400 rounded-full"></span>
                        {errors.password}
                      </p>
                    )}
                  </div>

                  {/* Enhanced Confirm Password Field */}
                  <div className="space-y-2">
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">
                      Confirm Password
                    </label>
                    <div className="relative group/input">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-xl blur-sm group-hover/input:blur-md transition-all duration-300"></div>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                          <Lock className={`h-5 w-5 transition-colors duration-200 ${
                            focusedField === 'confirmPassword' ? 'text-purple-400' : 'text-gray-400'
                          }`} />
                        </div>
                        <input
                          id="confirmPassword"
                          name="confirmPassword"
                          type={showConfirmPassword ? 'text' : 'password'}
                          autoComplete="new-password"
                          required
                          className={`w-full pl-12 pr-12 py-4 bg-slate-800/50 border-2 rounded-xl text-white placeholder-gray-400 transition-all duration-200 focus:outline-none focus:ring-0 backdrop-blur-sm ${
                            errors.confirmPassword 
                              ? 'border-red-500 bg-red-900/20 shadow-lg shadow-red-500/20' 
                              : focusedField === 'confirmPassword' 
                                ? 'border-purple-500 bg-slate-800/70 shadow-lg shadow-purple-500/20' 
                                : 'border-gray-600 hover:border-gray-500 focus:border-purple-500'
                          }`}
                          placeholder="Confirm your password"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          onFocus={() => setFocusedField('confirmPassword')}
                          onBlur={() => setFocusedField(null)}
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-4 flex items-center z-10 text-gray-400 hover:text-gray-300 transition-colors duration-200"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-sm text-red-300 mt-1 flex items-center gap-1">
                        <span className="w-1 h-1 bg-red-400 rounded-full"></span>
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>

                  {/* Enhanced Sign Up Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full relative group/btn overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-xl blur-sm group-hover/btn:blur-md transition-all duration-300"></div>
                    <div className="relative flex items-center justify-center px-6 py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white font-semibold text-lg rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-purple-500/20 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none">
                      {loading ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span>Launching Your Journey...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <Rocket className="w-5 h-5" />
                          <span>Start Your Adventure</span>
                        </div>
                      )}
                    </div>
                  </button>

                  {/* Enhanced Separator */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-600"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-slate-800/50 text-gray-400 backdrop-blur-sm rounded-full">Or continue with</span>
                    </div>
                  </div>

                  {/* Enhanced Social Login Buttons */}
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      className="flex items-center justify-center px-4 py-3 bg-slate-800/50 border border-gray-600 text-white font-medium rounded-xl hover:bg-slate-700/50 hover:border-gray-500 transition-all duration-200 backdrop-blur-sm"
                    >
                      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      Google
                    </button>
                    <button
                      type="button"
                      className="flex items-center justify-center px-4 py-3 bg-slate-800/50 border border-gray-600 text-white font-medium rounded-xl hover:bg-slate-700/50 hover:border-gray-500 transition-all duration-200 backdrop-blur-sm"
                    >
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                      Facebook
                    </button>
                  </div>

                  {/* Enhanced Terms */}
                  <p className="text-xs text-gray-400 text-center">
                    By registering you agree to our{' '}
                    <Link to="/terms" className="text-purple-400 hover:text-purple-300 underline transition-colors duration-200">
                      Terms and Conditions
                    </Link>
                    {' '}and{' '}
                    <Link to="/privacy" className="text-purple-400 hover:text-purple-300 underline transition-colors duration-200">
                      Privacy Policy
                    </Link>
                  </p>

                  {/* Enhanced Login Link */}
                  <div className="text-center pt-4">
                    <p className="text-gray-400">
                      Already have an account?{' '}
                      <Link
                        to="/login"
                        className="text-purple-400 hover:text-purple-300 font-semibold transition-colors duration-200 hover:underline"
                      >
                        Sign in here
                      </Link>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Custom CSS */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(1deg); }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .bg-gradient-radial {
          background: radial-gradient(circle, var(--tw-gradient-stops));
        }
        
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
};

export default Register;