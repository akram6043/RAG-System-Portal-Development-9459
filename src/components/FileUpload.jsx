import React, { useState, useCallback } from 'react';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiUpload, FiFile, FiCheck, FiX, FiLoader, FiTrash2, FiFileText, FiImage } = FiIcons;

const FileUpload = ({ onFileUpload, uploadedFiles }) => {
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState({});

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    uploadFiles(files);
  }, []);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    uploadFiles(files);
  };

  const uploadFiles = async (files) => {
    setUploading(true);
    
    for (const file of files) {
      const fileId = Date.now() + Math.random();
      setUploadStatus(prev => ({
        ...prev,
        [fileId]: { status: 'uploading', progress: 0 }
      }));

      try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('https://eqp225z2.rpcld.co/webhook-test/pinecone_load', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          setUploadStatus(prev => ({
            ...prev,
            [fileId]: { status: 'success', progress: 100 }
          }));
          
          onFileUpload([{
            id: fileId,
            name: file.name,
            size: file.size,
            type: file.type,
            uploadedAt: new Date().toISOString()
          }]);
        } else {
          throw new Error('Upload failed');
        }
      } catch (error) {
        setUploadStatus(prev => ({
          ...prev,
          [fileId]: { status: 'error', progress: 0 }
        }));
        console.error('Upload error:', error);
      }
    }
    
    setUploading(false);
  };

  const getFileIcon = (type) => {
    if (type?.startsWith('image/')) return FiImage;
    return FiFileText;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Upload Documents</h2>
          <p className="text-sm text-gray-500 mt-1">
            Upload your documents to build the knowledge base for the RAG system
          </p>
        </div>
        
        <div className="p-6">
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragOver
                ? 'border-blue-400 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center space-y-4">
              <div className="flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full">
                <SafeIcon icon={FiUpload} className="w-8 h-8 text-gray-600" />
              </div>
              
              <div>
                <p className="text-lg font-medium text-gray-900">
                  Drop your files here, or{' '}
                  <label className="text-blue-600 hover:text-blue-700 cursor-pointer underline">
                    browse
                    <input
                      type="file"
                      multiple
                      className="hidden"
                      onChange={handleFileSelect}
                      accept=".pdf,.doc,.docx,.txt,.md"
                    />
                  </label>
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Supports PDF, DOC, DOCX, TXT, and MD files
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Progress */}
      {uploading && (
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-900">Uploading Files</h3>
          </div>
          <div className="p-6">
            <div className="flex items-center space-x-3">
              <SafeIcon icon={FiLoader} className="w-5 h-5 text-blue-600 animate-spin" />
              <span className="text-sm text-gray-600">Processing files...</span>
            </div>
          </div>
        </div>
      )}

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-900">Uploaded Files</h3>
            <p className="text-sm text-gray-500 mt-1">
              {uploadedFiles.length} files in knowledge base
            </p>
          </div>
          
          <div className="divide-y">
            {uploadedFiles.map((file) => (
              <div key={file.id} className="p-6 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-lg">
                    <SafeIcon icon={getFileIcon(file.type)} className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{file.name}</p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(file.size)} • Uploaded {new Date(file.uploadedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-full">
                    <SafeIcon icon={FiCheck} className="w-4 h-4 text-green-600" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;