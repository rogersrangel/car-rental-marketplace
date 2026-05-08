import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    let timeoutId = setTimeout(() => {
      if (isMounted && loading) {
        console.warn('⚠️ Timeout: forçando loading = false');
        setLoading(false);
      }
    }, 2000); // Força fim do loading após 2s

    const init = async () => {
      try {
        // Tenta obter sessão
        const { data: { session } } = await supabase.auth.getSession();
        if (!isMounted) return;
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        if (currentUser) {
          // Busca perfil (se falhar, apenas loga)
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', currentUser.id)
            .maybeSingle();
          if (error) console.error('Erro ao buscar perfil:', error);
          if (isMounted) setProfile(data || null);
        }
      } catch (err) {
        console.error('Erro na inicialização:', err);
      } finally {
        if (isMounted) setLoading(false);
        clearTimeout(timeoutId);
      }
    };

    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        const { data } = await supabase.from('profiles').select('*').eq('id', currentUser.id).maybeSingle();
        if (isMounted) setProfile(data || null);
      } else {
        if (isMounted) setProfile(null);
      }
      if (isMounted) setLoading(false);
    });

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
      subscription.unsubscribe();
    };
  }, []);

  const getUserRole = () => profile?.role || 'guest';

  async function updatePixKey(newPixKey) {
    if (!profile) return false;
    const { error } = await supabase.from('profiles').update({ pix_key: newPixKey }).eq('id', profile.id);
    if (error) {
      toast.error(error.message);
      return false;
    }
    setProfile({ ...profile, pix_key: newPixKey });
    toast.success('Chave Pix atualizada');
    return true;
  }

  async function signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast.error(error.message);
      return { data: null, error };
    }
    setUser(data.user);
    const { data: prof } = await supabase.from('profiles').select('*').eq('id', data.user.id).maybeSingle();
    setProfile(prof || null);
    toast.success(`Bem-vindo, ${data.user.email}`);
    return { data, error: null };
  }

  async function signUp(email, password, fullName) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName, role: 'guest' } }
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
    updatePixKey,
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