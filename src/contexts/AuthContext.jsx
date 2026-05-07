import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Obtém a role diretamente dos metadados do usuário
  const getUserRole = () => {
    return user?.user_metadata?.role || 'guest';
  };

  async function signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast.error(error.message);
      return { data: null, error };
    }
    setUser(data.user);
    toast.success(`Bem-vindo, ${data.user.email}`);
    return { data, error: null };
  }

  async function signUp(email, password, fullName) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: 'guest',
        },
      },
    });
    if (error) {
      toast.error(error.message);
      return { data: null, error };
    }
    toast.success('Cadastro realizado! Verifique seu email.');
    return { data, error: null };
  }

  async function signOut() {
    await supabase.auth.signOut();
    setUser(null);
    toast.success('Logout realizado');
  }

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    getUserRole,
    isGuest: getUserRole() === 'guest',
    isHost: getUserRole() === 'host',
    isAdmin: getUserRole() === 'admin',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}