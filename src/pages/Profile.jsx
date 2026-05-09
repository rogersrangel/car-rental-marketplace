import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft } from 'lucide-react';

export function Profile() {
  const { user, profile, getUserRole, updatePixKey } = useAuth();
  const [pixKey, setPixKey] = useState(profile?.pix_key || '');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await updatePixKey(pixKey);
    setSaving(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 p-4">
      <div className="max-w-2xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-slate-300 hover:text-white mb-4">
          <ArrowLeft className="w-4 h-4" /> Voltar
        </Link>
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-xl border border-white/10 p-6">
          <h1 className="text-2xl font-bold text-white mb-6">Meu Perfil</h1>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300">Nome</label>
              <p className="mt-1 text-white">{profile?.full_name || user?.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300">Email</label>
              <p className="mt-1 text-white">{user?.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300">Papel</label>
              <p className="mt-1 capitalize text-white">{getUserRole()}</p>
            </div>
            {getUserRole() === 'host' && (
              <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                <div>
                  <label className="block text-sm font-medium text-slate-300">Chave Pix (para receber pagamentos)</label>
                  <div className="mt-1 flex gap-2">
                    <input
                      type="text"
                      value={pixKey}
                      onChange={e => setPixKey(e.target.value)}
                      placeholder="CPF, email, telefone ou chave aleatória"
                      className="flex-1 bg-slate-800/50 border border-white/20 rounded-xl p-2 text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:opacity-50"
                    >
                      {saving ? 'Salvando...' : 'Salvar'}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}