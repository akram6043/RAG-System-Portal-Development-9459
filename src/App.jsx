import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import RAGPortal from './components/RAGPortal';
import supabase from './lib/supabase';
import './App.css';

function App() {
  // Create admin users on app load
  useEffect(() => {
    const setupAdminUsers = async () => {
      try {
        console.log('Setting up admin users...');
        
        // First, ensure the roles table exists
        const { error: tableError } = await supabase.from('user_roles_c8f4e2b19d')
          .select('id')
          .limit(1);
          
        if (tableError && tableError.code === '42P01') {
          console.error('Table does not exist, please run the setup SQL first');
          return;
        }

        const adminUsers = [
          { email: 'admin@example.com', password: 'Akram!1002018', fullName: 'Admin User' },
          { email: 'ishtiaq6041@gmail.com', password: 'r1002018', fullName: 'Ishtiaq Admin' }
        ];

        for (const admin of adminUsers) {
          try {
            console.log(`Setting up admin user: ${admin.email}`);
            
            // First try to sign up the user (will fail if already exists)
            const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
              email: admin.email,
              password: admin.password,
              options: {
                data: {
                  full_name: admin.fullName
                }
              }
            });

            if (signUpError) {
              console.log(`User ${admin.email} already exists or error:`, signUpError.message);
              
              // Try to sign in
              const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
                email: admin.email,
                password: admin.password
              });

              if (signInError) {
                console.error(`Cannot sign in as ${admin.email}:`, signInError.message);
                continue;
              }
              
              if (signInData?.user) {
                console.log(`Successfully signed in as ${admin.email}`);
                
                // Check if user has admin role
                const { data: roleData } = await supabase
                  .from('user_roles_c8f4e2b19d')
                  .select('*')
                  .eq('user_id', signInData.user.id)
                  .single();

                if (!roleData) {
                  // Add admin role
                  const { error: insertError } = await supabase
                    .from('user_roles_c8f4e2b19d')
                    .insert([{ 
                      user_id: signInData.user.id,
                      role: 'admin'
                    }]);
                    
                  if (insertError) {
                    console.error(`Error assigning admin role to ${admin.email}:`, insertError);
                  } else {
                    console.log(`Admin role assigned to: ${admin.email}`);
                  }
                } else if (roleData.role !== 'admin') {
                  // Update to admin role
                  const { error: updateError } = await supabase
                    .from('user_roles_c8f4e2b19d')
                    .update({ role: 'admin' })
                    .eq('user_id', signInData.user.id);
                    
                  if (updateError) {
                    console.error(`Error updating role for ${admin.email}:`, updateError);
                  } else {
                    console.log(`Updated role to admin for: ${admin.email}`);
                  }
                } else {
                  console.log(`User ${admin.email} already has admin role`);
                }
              }
            } else if (signUpData?.user) {
              console.log(`New admin user created: ${admin.email}`);
              
              // Add admin role for new user
              const { error: roleError } = await supabase
                .from('user_roles_c8f4e2b19d')
                .insert([{ 
                  user_id: signUpData.user.id,
                  role: 'admin'
                }]);
                
              if (roleError) {
                console.error(`Error assigning admin role to new user ${admin.email}:`, roleError);
              } else {
                console.log(`Admin role assigned to new user: ${admin.email}`);
              }
            }

            // Sign out after setup
            await supabase.auth.signOut();
            
          } catch (error) {
            console.error(`Error setting up admin user ${admin.email}:`, error);
          }
        }
        
        console.log('Admin setup complete');
      } catch (error) {
        console.error('Error in admin setup process:', error);
      }
    };

    setupAdminUsers();
  }, []);

  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <RAGPortal />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <RAGPortal />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;