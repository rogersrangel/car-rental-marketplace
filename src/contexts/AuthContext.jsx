import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  console.log('🔵 AuthProvider renderizado, loading:', loading);

  async function fetchProfile(userId) {
    console.log('🔍 Buscando perfil para:', userId);
    
    try {
      // Usar .select() sem .single() para evitar erro se não encontrar
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId);
      
      console.log('📊 Resposta do Supabase:', { data, error });
      
      if (error) {
        console.error('❌ Erro no fetchProfile:', error.message);
        return null;
      }
      
      if (!data || data.length === 0) {
        console.warn('⚠️ Nenhum perfil encontrado para o usuário');
        return null;
      }
      
      console.log('✅ Perfil encontrado:', data[0]);
      return data[0];
    } catch (err) {
      console.error('❌ Exceção no fetchProfile:', err);
      return null;
    }
  }

  useEffect(() => {
    console.log('🟢 useEffect do AuthProvider executando...');
    
    const initializeAuth = async () => {
      try {
        console.log('📡 Buscando sessão no Supabase...');
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('❌ Erro no getSession:', sessionError);
          setLoading(false);
          return;
        }
        
        console.log('📦 Sessão obtida:', session ? 'Usuário logado' : 'Nenhum usuário');
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        
        if (currentUser) {
          const prof = await fetchProfile(currentUser.id);
          setProfile(prof);
        }
        console.log('✅ setLoading(false) será chamado agora');
      } catch (error) {
        console.error('❌ Erro crítico na inicialização:', error);
      } finally {
        setLoading(false);
        console.log('🔴 loading agora é false');
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔄 onAuthStateChange disparado:', event);
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

    return () => {
      console.log('🧹 Limpando subscription');
      subscription.unsubscribe();
    };
  }, []);

  async function signIn(email, password) {
    console.log('🔐 Tentando login:', email);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        console.error('❌ Erro no signIn:', error);
        toast.error(error.message);
        return { data: null, error };
      }
      
      console.log('✅ Login bem-sucedido:', data.user.email);
      setUser(data.user);
      const userProfile = await fetchProfile(data.user.id);
      setProfile(userProfile);
      toast.success(`Bem-vindo, ${data.user.email}`);
      return { data, error: null };
    } catch (err) {
      console.error('❌ Exceção no signIn:', err);
      toast.error('Erro inesperado no login');
      return { data: null, error: err };
    }
  }

  async function signUp(email, password, fullName) {
    console.log('📝 Tentando cadastro:', email);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } }
      });
      if (error) {
        console.error('❌ Erro no signUp:', error);
        toast.error(error.message);
        return { data: null, error };
      }
      console.log('✅ Cadastro bem-sucedido:', data.user?.email);
      toast.success('Cadastro realizado! Verifique seu email.');
      return { data, error: null };
    } catch (err) {
      console.error('❌ Exceção no signUp:', err);
      toast.error('Erro inesperado no cadastro');
      return { data: null, error: err };
    }
  }

  async function signOut() {
    console.log('🚪 Fazendo logout');
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