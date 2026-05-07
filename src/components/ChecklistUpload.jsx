import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Upload, X, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export function ChecklistUpload({ onUploadComplete, label }) {
  const [uploading, setUploading] = useState(false);
  const [photos, setPhotos] = useState([]);

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files);
    setUploading(true);
    const urls = [];
    for (const file of files) {
      const fileName = `checklist-${Date.now()}-${Math.random().toString(36)}.${file.name.split('.').pop()}`;
      const { error } = await supabase.storage.from('vehicles').upload(fileName, file);
      if (error) {
        toast.error(`Erro ao enviar ${file.name}`);
        continue;
      }
      const { data } = supabase.storage.from('vehicles').getPublicUrl(fileName);
      urls.push(data.publicUrl);
    }
    setPhotos([...photos, ...urls]);
    onUploadComplete(urls);
    setUploading(false);
  };

  const removePhoto = (index) => {
    const newPhotos = photos.filter((_, i) => i !== index);
    setPhotos(newPhotos);
    onUploadComplete(newPhotos);
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium">{label}</label>
      <div className="flex flex-wrap gap-2">
        {photos.map((url, i) => (
          <div key={i} className="relative w-20 h-20">
            <img src={url} className="w-full h-full object-cover rounded" />
            <button onClick={() => removePhoto(i)} className="absolute -top-2 -right-2 bg-red-600 rounded-full p-1"><X className="w-3 h-3 text-white" /></button>
          </div>
        ))}
        <label className="w-20 h-20 border-2 border-dashed rounded flex flex-col items-center justify-center cursor-pointer">
          {uploading ? <Loader2 className="animate-spin" /> : <Upload className="w-5 h-5" />}
          <input type="file" multiple accept="image/*" onChange={handleUpload} disabled={uploading} className="hidden" />
        </label>
      </div>
    </div>
  );
}