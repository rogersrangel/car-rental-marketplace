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
        console.error('Erro no fetchProfile:', error);
        return null;
      }
      return data;
    } catch (err) {
      console.error('Exceção no fetchProfile:', err);
      return null;
    }
  }

  useEffect(() => {
    let isMounted = true;

    const initialize = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!isMounted) return;
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        if (currentUser) {
          const prof = await fetchProfile(currentUser.id);
          if (isMounted) setProfile(prof);
        }
      } catch (err) {
        console.error('Erro ao carregar sessão:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    initialize();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        const prof = await fetchProfile(currentUser.id);
        if (isMounted) setProfile(prof);
      } else {
        if (isMounted) setProfile(null);
      }
      if (isMounted) setLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const getUserRole = () => profile?.role || 'guest';

  async function signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast.error(error.message);
      return { data: null, error };
    }
    setUser(data.user);
    const prof = await fetchProfile(data.user.id);
    setProfile(prof);
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
    setProfile(null);
    toast.success('Logout realizado');
  }

  const value = {
    user,
    profile,
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