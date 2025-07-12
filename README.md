# RAG System Portal with Role-Based Access Control

A modern React application for document processing and AI chat with secure authentication and role-based access.

## 🔐 Authentication Setup

The system is configured with the following authentication methods:
- Email/Password authentication
- Google OAuth authentication

## 👤 User Roles

The application implements role-based access control:
- **Admin Users**: Have full access to all features including file upload for document processing
- **Regular Users**: Can only access the chat interface to query the knowledge base

## 🔑 Default Admin Credentials

A default admin user is created with the following credentials:
- **Email**: admin@example.com
- **Password**: Akram!1002018

## 🚀 Features

- **Secure Authentication**: Email/password and Google login options
- **Role-Based Access Control**: Admin vs regular user permissions
- **Protected Routes**: Secure access control
- **User Management**: Profile display and session handling
- **Document Upload**: File processing for RAG system (admin only)
- **AI Chat Interface**: Interactive document querying (all users)
- **Responsive Design**: Works on all devices
- **Modern UI**: Professional, clean interface

## 📦 Installation

```bash
npm install
npm run dev
```

## 🔒 Security Features

- Session persistence
- Automatic token refresh
- Secure logout
- Error handling
- Role-based authorization

## 🎨 Design Features

- Modern gradient backgrounds
- Smooth animations
- Professional UI components
- Consistent branding
- Responsive layout