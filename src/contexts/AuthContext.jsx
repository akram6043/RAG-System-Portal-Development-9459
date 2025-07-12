import React, { createContext, useContext, useEffect, useState } from 'react';
import supabase from '../lib/supabase';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      if (session?.user) {
        await fetchUserRole(session.user.id);
      }
      setLoading(false);
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        setUser(session?.user ?? null);
        if (session?.user) {
          await fetchUserRole(session.user.id);
        } else {
          setUserRole(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserRole = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('user_roles_c8f4e2b19d')
        .select('role')
        .eq('user_id', userId)
        .single();

      if (data) {
        console.log('User role found:', data.role);
        setUserRole(data.role);
      } else {
        console.log('No role found, setting default role');
        setUserRole('user'); // Default role
        
        // Create default role for user if none exists
        await supabase
          .from('user_roles_c8f4e2b19d')
          .insert([{ user_id: userId, role: 'user' }]);
      }
    } catch (error) {
      console.error('Error fetching user role:', error);
      setUserRole('user');
    }
  };

  const signInWithEmail = async (email, password) => {
    try {
      console.log('Signing in with email:', email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error('Email sign in error:', error);
      } else if (data.user) {
        console.log('User signed in:', data.user.id);
      }
      
      return { data, error };
    } catch (error) {
      console.error('Unexpected error during email sign in:', error);
      return { data: null, error };
    }
  };

  const signInWithGoogle = async () => {
    try {
      console.log('Initiating Google sign in');
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/#/dashboard`
        }
      });
      
      return { data, error };
    } catch (error) {
      console.error('Error during Google sign in:', error);
      return { data: null, error: { message: error.message } };
    }
  };

  const signUp = async (email, password) => {
    try {
      console.log('Signing up with email:', email);
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      });
      
      if (data?.user) {
        console.log('User signed up:', data.user.id);
        
        // Automatically assign user role
        await supabase
          .from('user_roles_c8f4e2b19d')
          .insert([{ user_id: data.user.id, role: 'user' }]);
      }
      
      return { data, error };
    } catch (error) {
      console.error('Error during signup:', error);
      return { data: null, error };
    }
  };

  const signOut = async () => {
    console.log('Signing out');
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  const isAdmin = () => {
    return userRole === 'admin';
  };

  const value = {
    user,
    loading,
    userRole,
    isAdmin,
    signInWithEmail,
    signInWithGoogle,
    signUp,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};