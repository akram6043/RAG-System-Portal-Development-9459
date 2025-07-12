import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import * as FiIcons from 'react-icons/fi';
import * as FaIcons from 'react-icons/fa';
import SafeIcon from '../common/SafeIcon';

const { FiZap, FiLoader, FiShield, FiUsers, FiMessageSquare, FiAlertTriangle, FiMail, FiLock } = FiIcons;
const { FaGoogle } = FaIcons;

const LoginPage = () => {
  const { signInWithEmail, signInWithGoogle, signUp } = useAuth();
  const [loading, setLoading] = useState({ google: false, email: false });
  const [error, setError] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailAuth = async () => {
    if (!email || !password) {
      setError('Email and password are required');
      return;
    }

    setLoading({ ...loading, email: true });
    setError('');
    
    try {
      console.log(`Attempting to ${isSignUp ? 'sign up' : 'sign in'} with email: ${email}`);
      
      let result;
      if (isSignUp) {
        result = await signUp(email, password);
      } else {
        result = await signInWithEmail(email, password);
      }

      if (result.error) {
        console.error('Email auth error:', result.error);
        setError(result.error.message || 'Authentication failed. Please try again.');
      } else {
        console.log('Authentication successful');
      }
    } catch (error) {
      console.error('Email auth error:', error);
      setError('Authentication failed. Please check your connection.');
    } finally {
      setLoading({ ...loading, email: false });
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading({ ...loading, google: true });
    setError('');
    
    try {
      console.log('Initiating Google sign in');
      const result = await signInWithGoogle();
      
      if (result.error) {
        console.error('Google sign in error:', result.error);
        setError('Failed to sign in with Google. Please try again.');
      }
    } catch (error) {
      console.error('Google sign in error:', error);
      setError('Failed to sign in with Google. Please check your connection.');
    } finally {
      setLoading({ ...loading, google: false });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mx-auto mb-4">
            <SafeIcon icon={FiZap} className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">RAG System Portal</h1>
          <p className="text-gray-600">Intelligent Document Processing & Chat</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p className="text-gray-600">
              {isSignUp ? 'Sign up to get started' : 'Sign in to access your RAG system'}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-3">
              <SafeIcon icon={FiAlertTriangle} className="w-5 h-5 text-red-600 flex-shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Email/Password Form */}
          <div className="space-y-4 mb-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SafeIcon icon={FiMail} className="text-gray-400 w-5 h-5" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="you@example.com"
                  disabled={loading.email || loading.google}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SafeIcon icon={FiLock} className="text-gray-400 w-5 h-5" />
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="••••••••"
                  disabled={loading.email || loading.google}
                />
              </div>
            </div>

            <button
              onClick={handleEmailAuth}
              disabled={loading.email || loading.google}
              className="w-full flex items-center justify-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading.email ? (
                <SafeIcon icon={FiLoader} className="w-5 h-5 text-white animate-spin" />
              ) : (
                <SafeIcon icon={isSignUp ? FiUsers : FiLock} className="w-5 h-5" />
              )}
              <span>
                {loading.email ? 'Processing...' : (isSignUp ? 'Sign Up' : 'Sign In')}
              </span>
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          {/* Social Login Button */}
          <div>
            <button
              onClick={handleGoogleSignIn}
              disabled={loading.google || loading.email}
              className="w-full flex items-center justify-center space-x-3 px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading.google ? (
                <SafeIcon icon={FiLoader} className="w-5 h-5 text-gray-600 animate-spin" />
              ) : (
                <FaGoogle className="w-5 h-5 text-red-500" />
              )}
              <span className="text-gray-700 font-medium">
                {loading.google ? 'Signing in...' : 'Continue with Google'}
              </span>
            </button>
          </div>

          {/* Security Notice */}
          <div className="mt-6 text-center">
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
              <SafeIcon icon={FiShield} className="w-4 h-4" />
              <span>Your data is secure and encrypted</span>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center">
            <SafeIcon icon={FiUsers} className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-900 text-sm">User Management</h3>
            <p className="text-xs text-gray-600 mt-1">Secure user authentication</p>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center">
            <SafeIcon icon={FiMessageSquare} className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-900 text-sm">Smart Chat</h3>
            <p className="text-xs text-gray-600 mt-1">AI-powered conversations</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;