import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft, Camera, ShieldCheck, Shield, Star } from 'lucide-react';

export function Profile() {
  const { profile, getUserRole, updateProfile, requestVerification } = useAuth();
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    cpf: profile?.cpf || '',
    cnh: profile?.cnh || '',
    bio: profile?.bio || '',
    avatar_url: profile?.avatar_url || '',
  });
  const [saving, setSaving] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await updateProfile(formData);
    setSaving(false);
  };

  const handleVerify = async () => {
    setVerifying(true);
    await requestVerification();
    setVerifying(false);
  };

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 p-4">
      <div className="max-w-2xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-slate-300 hover:text-white mb-4">
          <ArrowLeft className="w-4 h-4" /> Voltar
        </Link>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-xl border border-white/10 p-6">
          {/* Avatar e selo verificado */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative">
              <img
                src={formData.avatar_url || 'https://placehold.co/100x100/1e293b/64748b?text=Avatar'}
                alt="Avatar"
                className="w-20 h-20 rounded-full object-cover border-2 border-blue-500"
              />
              <label className="absolute bottom-0 right-0 p-1 bg-slate-700 rounded-full cursor-pointer hover:bg-slate-600">
                <Camera className="w-4 h-4 text-white" />
                <input type="file" accept="image/*" className="hidden" onChange={() => alert('Upload simulado')} />
              </label>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">{profile.full_name}</h1>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${profile.is_verified ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                  {profile.is_verified ? '✓ Verificado' : 'Não verificado'}
                </span>
                <span className="text-xs bg-slate-700 px-2 py-0.5 rounded-full">{getUserRole()}</span>
              </div>
              {/* Médias de avaliação */}
              <div className="flex flex-wrap gap-3 mt-2">
                {profile.role === 'host' && profile.avg_rating_as_host > 0 && (
                  <div className="flex items-center gap-1 text-yellow-400 text-sm">
                    <Star className="w-4 h-4 fill-yellow-400" />
                    <span>{profile.avg_rating_as_host.toFixed(1)}</span>
                    <span className="text-xs text-slate-400">(como anfitrião)</span>
                  </div>
                )}
                {profile.role === 'guest' && profile.avg_rating_as_guest > 0 && (
                  <div className="flex items-center gap-1 text-yellow-400 text-sm">
                    <Star className="w-4 h-4 fill-yellow-400" />
                    <span>{profile.avg_rating_as_guest.toFixed(1)}</span>
                    <span className="text-xs text-slate-400">(como hóspede)</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Formulário de edição */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300">Nome completo</label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                className="w-full mt-1 bg-slate-800/50 border border-white/20 rounded-xl p-2 text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300">CPF</label>
              <input
                type="text"
                name="cpf"
                value={formData.cpf}
                onChange={handleChange}
                className="w-full mt-1 bg-slate-800/50 border border-white/20 rounded-xl p-2 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300">CNH</label>
              <input
                type="text"
                name="cnh"
                value={formData.cnh}
                onChange={handleChange}
                className="w-full mt-1 bg-slate-800/50 border border-white/20 rounded-xl p-2 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300">Biografia</label>
              <textarea
                name="bio"
                rows="3"
                value={formData.bio}
                onChange={handleChange}
                className="w-full mt-1 bg-slate-800/50 border border-white/20 rounded-xl p-2 text-white"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2 rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:opacity-50"
              >
                {saving ? 'Salvando...' : 'Salvar alterações'}
              </button>
              <Link
                to="/"
                className="flex-1 border border-white/20 text-center py-2 rounded-xl hover:bg-slate-700 transition"
              >
                Cancelar
              </Link>
            </div>
          </form>

          {/* Seção de verificação (se ainda não for verificado) */}
          {!profile.is_verified && (
            <div className="mt-6 p-4 bg-slate-800/30 rounded-xl border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-2">🔒 Torne-se um membro verificado</h3>
              <p className="text-slate-400 text-sm mb-3">
                Envie seus documentos (RG, CNH) para garantir mais confiança aos hóspedes.
              </p>
              <button
                onClick={handleVerify}
                disabled={verifying}
                className="w-full bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-xl transition disabled:opacity-50"
              >
                {verifying ? 'Enviando documentos...' : 'Solicitar verificação'}
              </button>
            </div>
          )}

          {/* Exibição da chave Pix para anfitrião (se houver) */}
          {getUserRole() === 'host' && profile.pix_key && (
            <div className="mt-4 p-3 bg-slate-800/30 rounded-xl border border-white/10">
              <p className="text-xs text-slate-400">📱 Chave Pix cadastrada</p>
              <p className="text-sm font-mono text-white break-all">{profile.pix_key}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}