import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Upload, X, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export function ImageUpload({ images = [], onImagesChange, bucket = 'vehicles' }) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    
    setUploading(true);
    const uploadedUrls = [];

    for (const file of files) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file);

      if (uploadError) {
        toast.error(`Erro ao enviar ${file.name}`);
        continue;
      }

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      uploadedUrls.push(publicUrl);
    }

    onImagesChange([...images, ...uploadedUrls]);
    setUploading(false);
  };

  const removeImage = (indexToRemove) => {
    onImagesChange(images.filter((_, idx) => idx !== indexToRemove));
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-3">
        {images.map((url, idx) => (
          <div key={idx} className="relative w-24 h-24 rounded-lg overflow-hidden border border-slate-200">
            <img src={url} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => removeImage(idx)}
              className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 hover:bg-red-700 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
        <label className="flex flex-col items-center justify-center w-24 h-24 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-blue-500 bg-slate-50 transition-colors">
          {uploading ? (
            <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
          ) : (
            <>
              <Upload className="w-6 h-6 text-slate-500" />
              <span className="text-xs text-slate-500 mt-1">Upload</span>
            </>
          )}
          <input type="file" multiple accept="image/*" onChange={handleUpload} disabled={uploading} className="hidden" />
        </label>
      </div>
      {uploading && <p className="text-sm text-blue-600">Enviando imagens...</p>}
    </div>
  );
}