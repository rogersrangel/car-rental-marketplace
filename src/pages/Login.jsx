import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { z } from 'zod';
import { Mail, Lock, User } from 'lucide-react';
import toast from 'react-hot-toast';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
});

const registerSchema = loginSchema.extend({
  fullName: z.string().min(3, 'Nome completo obrigatório'),
  confirmPassword: z.string().min(6),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Senhas não conferem',
  path: ['confirmPassword'],
});

export function Login() {
  const navigate = useNavigate();
  const { user, signIn, signUp } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ email: '', password: '', fullName: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) navigate('/');
  }, [user, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const schema = isRegister ? registerSchema : loginSchema;
    const result = schema.safeParse(form);
    if (!result.success) {
      const fieldErrors = {};
      result.error.errors.forEach(err => { fieldErrors[err.path[0]] = err.message; });
      setErrors(fieldErrors);
      return;
    }
    setLoading(true);
    if (isRegister) {
      const { error } = await signUp(form.email, form.password, form.fullName);
      if (!error) {
        toast.success('Cadastro realizado! Agora faça login.');
        setIsRegister(false);
        setForm({ ...form, password: '', confirmPassword: '' });
      }
    } else {
      await signIn(form.email, form.password);
    }
    setLoading(false);
  };

  // (o JSX permanece o mesmo, sem alterações)
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-md p-8 w-full max-w-md border border-slate-200"
      >
        <h2 className="text-3xl font-bold text-center text-slate-800 mb-6">
          {isRegister ? 'Criar Conta' : 'Entrar'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <div className="relative">
                <User className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
                <input name="fullName" placeholder="Nome completo" value={form.fullName} onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
              </div>
              {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
            </div>
          )}
          <div>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
              <input name="email" type="email" placeholder="E-mail" value={form.email} onChange={handleChange}
                className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>
          <div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
              <input name="password" type="password" placeholder="Senha" value={form.password} onChange={handleChange}
                className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg" />
            </div>
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>
          {isRegister && (
            <div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
                <input name="confirmPassword" type="password" placeholder="Confirmar senha" value={form.confirmPassword} onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg" />
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
            </div>
          )}
          <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition disabled:opacity-50">
            {loading ? 'Aguarde...' : (isRegister ? 'Cadastrar' : 'Entrar')}
          </button>
        </form>
        <p className="text-center text-slate-600 mt-4">
          {isRegister ? 'Já tem conta?' : 'Não tem conta?'}{' '}
          <button onClick={() => setIsRegister(!isRegister)} className="text-blue-600 hover:underline">
            {isRegister ? 'Faça login' : 'Cadastre-se'}
          </button>
        </p>
      </motion.div>
    </div>
  );
}