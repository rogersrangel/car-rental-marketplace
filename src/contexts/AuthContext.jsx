import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  async function fetchProfile(userId) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
      if (error) {
        console.error('Erro ao buscar perfil:', error);
        return null;
      }
      return data;
    } catch (err) {
      console.error('Exceção fetchProfile:', err);
      return null;
    }
  }

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        
        if (currentUser) {
          const prof = await fetchProfile(currentUser.id);
          setProfile(prof);
        }
      } catch (error) {
        console.error('Erro na inicialização da autenticação:', error);
        toast.error('Erro ao conectar com o servidor');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      
      if (currentUser) {
        const prof = await fetchProfile(currentUser.id);
        setProfile(prof);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function signIn(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        toast.error(error.message);
        return { data: null, error };
      }
      
      setUser(data.user);
      const userProfile = await fetchProfile(data.user.id);
      setProfile(userProfile);
      toast.success(`Bem-vindo, ${data.user.email}`);
      return { data, error: null };
    } catch (err) {
      toast.error('Erro inesperado no login');
      return { data: null, error: err };
    }
  }

  async function signUp(email, password, fullName) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } }
      });
      if (error) {
        toast.error(error.message);
        return { data: null, error };
      }
      toast.success('Cadastro realizado! Verifique seu email.');
      return { data, error: null };
    } catch (err) {
      toast.error('Erro inesperado no cadastro');
      return { data: null, error: err };
    }
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      toast.success('Logout realizado');
      setUser(null);
      setProfile(null);
    }
  }

  const value = {
    user,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    isGuest: profile?.role === 'guest',
    isHost: profile?.role === 'host',
    isAdmin: profile?.role === 'admin',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}