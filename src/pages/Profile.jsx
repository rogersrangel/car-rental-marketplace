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
    <div className="min-h-screen bg-slate-50 p-4">
      <div className="max-w-2xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-slate-600 mb-4">
          <ArrowLeft className="w-4 h-4" /> Voltar
        </Link>
        <div className="bg-white rounded-xl shadow-md p-6">
          <h1 className="text-2xl font-bold mb-6">Meu Perfil</h1>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Nome</label>
              <p className="mt-1 text-slate-900">{profile?.full_name || user?.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium">Email</label>
              <p className="mt-1 text-slate-900">{user?.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium">Papel</label>
              <p className="mt-1 capitalize text-slate-900">{getUserRole()}</p>
            </div>
            {getUserRole() === 'host' && (
              <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                <div>
                  <label className="block text-sm font-medium">Chave Pix (para receber pagamentos)</label>
                  <div className="mt-1 flex gap-2">
                    <input
                      type="text"
                      value={pixKey}
                      onChange={e => setPixKey(e.target.value)}
                      placeholder="CPF, email, telefone ou chave aleatória"
                      className="flex-1 border border-slate-300 rounded-lg p-2"
                    />
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
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