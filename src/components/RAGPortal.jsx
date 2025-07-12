import React, { useState, useEffect } from 'react';
import FileUpload from './FileUpload';
import ChatWindow from './ChatWindow';
import UserProfile from './UserProfile';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useAuth } from '../contexts/AuthContext';

const { FiDatabase, FiMessageSquare, FiZap, FiAlertTriangle } = FiIcons;

const RAGPortal = () => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [activeTab, setActiveTab] = useState('chat');
  const { isAdmin } = useAuth();

  const handleFileUpload = (files) => {
    setUploadedFiles(prev => [...prev, ...files]);
  };

  // Set default tab based on user role
  useEffect(() => {
    if (isAdmin()) {
      setActiveTab('upload');
    } else {
      setActiveTab('chat');
    }
  }, [isAdmin]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg">
                <SafeIcon icon={FiZap} className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">RAG System Portal</h1>
                <p className="text-sm text-gray-500">Intelligent Document Processing & Chat</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                {uploadedFiles.length} files uploaded
              </div>
              <UserProfile />
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {isAdmin() && (
              <button
                onClick={() => setActiveTab('upload')}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'upload'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <SafeIcon icon={FiDatabase} className="w-4 h-4" />
                <span>File Upload</span>
              </button>
            )}
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'chat'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <SafeIcon icon={FiMessageSquare} className="w-4 h-4" />
              <span>Chat Interface</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'upload' && isAdmin() ? (
          <FileUpload onFileUpload={handleFileUpload} uploadedFiles={uploadedFiles} />
        ) : activeTab === 'upload' && !isAdmin() ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-full mx-auto mb-4">
              <SafeIcon icon={FiAlertTriangle} className="w-6 h-6 text-yellow-600" />
            </div>
            <h3 className="text-lg font-medium text-yellow-800 mb-2">Admin Access Required</h3>
            <p className="text-sm text-yellow-700">
              The file upload section is restricted to administrators only. Please contact an administrator if you need to upload documents.
            </p>
          </div>
        ) : (
          <ChatWindow />
        )}
      </div>
    </div>
  );
};

export default RAGPortal;