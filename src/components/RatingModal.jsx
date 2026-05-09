// src/components/RatingModal.jsx
import { useState } from 'react';
import { Star } from 'lucide-react';
import { supabase } from '../lib/supabaseClient'; // não usado em mock, mas mantemos estrutura
import toast from 'react-hot-toast';

export function RatingModal({ title, onSubmit, onClose }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error('Selecione uma nota');
      return;
    }
    setSubmitting(true);
    await onSubmit(rating, comment);
    setSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-2xl max-w-md w-full p-6 border border-white/10">
        <h2 className="text-xl font-bold text-white mb-4">{title}</h2>
        <div className="flex justify-center gap-2 mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setRating(star)}
            >
              <Star
                className={`w-8 h-8 ${
                  star <= (hoverRating || rating) ? 'fill-yellow-400 text-yellow-400' : 'text-slate-600'
                }`}
              />
            </button>
          ))}
        </div>
        <textarea
          placeholder="Deixe um comentário (opcional)"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full bg-slate-800 border border-white/20 rounded-xl p-2 text-white mb-4"
          rows="3"
        />
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 px-4 py-2 border border-white/20 rounded-xl text-white hover:bg-slate-700">
            Cancelar
          </button>
          <button onClick={handleSubmit} disabled={submitting} className="flex-1 bg-blue-600 text-white py-2 rounded-xl disabled:opacity-50">
            {submitting ? 'Enviando...' : 'Enviar avaliação'}
          </button>
        </div>
      </div>
    </div>
  );
}