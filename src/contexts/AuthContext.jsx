import { createContext, useContext, useState } from 'react';
import { mockUsers } from '../mocks/data';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  const getUserRole = () => profile?.role || 'guest';

  const signIn = async (email, password) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    const found = mockUsers.find(u => u.email === email);
    if (found && password === '123456') {
      setUser({ email: found.email, user_metadata: { full_name: found.full_name }, id: found.id });
      setProfile({ role: found.role, full_name: found.full_name, pix_key: found.pix_key || '', id: found.id });
      toast.success(`Bem-vindo, ${found.full_name}`);
      setLoading(false);
      return { data: { user: found }, error: null };
    } else {
      toast.error('Credenciais inválidas');
      setLoading(false);
      return { data: null, error: new Error('Invalid credentials') };
    }
  };

  const signUp = async (email, password, fullName) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    toast.success('Cadastro simulado! Agora faça login.');
    setLoading(false);
    return { data: { user: { email } }, error: null };
  };

  const signOut = () => {
    setUser(null);
    setProfile(null);
    toast.success('Logout simulado');
  };

  const updatePixKey = async (newPixKey) => {
    if (!profile) return false;
    setProfile(prev => ({ ...prev, pix_key: newPixKey }));
    toast.success('Chave Pix simulada atualizada!');
    return true;
  };

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