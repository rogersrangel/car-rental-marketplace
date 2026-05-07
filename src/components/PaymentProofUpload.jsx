import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Upload, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export function PaymentProofUpload({ onUpload }) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const fileName = `proof-${Date.now()}.${file.name.split('.').pop()}`;
    const { error } = await supabase.storage.from('vehicles').upload(fileName, file);
    if (error) {
      toast.error('Erro ao enviar comprovante');
      setUploading(false);
      return;
    }
    const { data } = supabase.storage.from('vehicles').getPublicUrl(fileName);
    onUpload(data.publicUrl);
    toast.success('Comprovante enviado!');
    setUploading(false);
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-1">Comprovante de pagamento (PIX/Cartão)</label>
      <div className="flex items-center gap-3">
        <label className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-lg cursor-pointer">
          {uploading ? 'Enviando...' : <><Upload className="w-4 h-4" /> Anexar comprovante</>}
          <input type="file" accept="image/*,application/pdf" onChange={handleUpload} disabled={uploading} className="hidden" />
        </label>
      </div>
    </div>
  );
}