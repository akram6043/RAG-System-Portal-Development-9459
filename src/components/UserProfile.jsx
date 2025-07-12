import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiUser, FiLogOut, FiChevronDown, FiSettings, FiHelpCircle, FiShield } = FiIcons;

const UserProfile = () => {
  const { user, signOut, isAdmin } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  if (!user) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
          {user.user_metadata?.avatar_url ? (
            <img
              src={user.user_metadata.avatar_url}
              alt="Profile"
              className="w-8 h-8 rounded-full"
            />
          ) : (
            <SafeIcon icon={FiUser} className="w-4 h-4 text-white" />
          )}
        </div>
        <div className="hidden sm:block text-left">
          <div className="flex items-center">
            <p className="text-sm font-medium text-gray-900">
              {user.user_metadata?.full_name || user.email}
            </p>
            {isAdmin() && (
              <span className="ml-2 px-1.5 py-0.5 text-xs bg-blue-100 text-blue-800 rounded">
                Admin
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500">{user.email}</p>
        </div>
        <SafeIcon icon={FiChevronDown} className="w-4 h-4 text-gray-400" />
      </button>

      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border z-50">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-900">
                {user.user_metadata?.full_name || 'User'}
              </p>
              {isAdmin() && (
                <span className="px-1.5 py-0.5 text-xs bg-blue-100 text-blue-800 rounded flex items-center">
                  <SafeIcon icon={FiShield} className="w-3 h-3 mr-1" />
                  Admin
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>
          <div className="py-2">
            <button className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
              <SafeIcon icon={FiSettings} className="w-4 h-4" />
              <span>Settings</span>
            </button>
            <button className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
              <SafeIcon icon={FiHelpCircle} className="w-4 h-4" />
              <span>Help & Support</span>
            </button>
            <hr className="my-2" />
            <button
              onClick={handleSignOut}
              className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <SafeIcon icon={FiLogOut} className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;