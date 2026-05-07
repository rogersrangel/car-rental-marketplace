import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Star } from 'lucide-react';
import toast from 'react-hot-toast';

export function RatingModal({ booking, onClose, onRated }) {
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
    const { error } = await supabase.from('reviews').insert([
      {
        booking_id: booking.id,
        reviewer_id: booking.guest_id,
        reviewee_id: booking.host_id,
        rating,
        comment,
      },
    ]);
    if (error) {
      toast.error('Erro ao enviar avaliação');
      console.error(error);
    } else {
      toast.success('Avaliação enviada!');
      onRated();
      onClose();
    }
    setSubmitting(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6">
        <h2 className="text-xl font-bold mb-4">Avalie sua experiência</h2>
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
                  star <= (hoverRating || rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                }`}
              />
            </button>
          ))}
        </div>
        <textarea
          placeholder="Deixe um comentário (opcional)"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full border rounded-lg p-2 mb-4"
          rows="3"
        />
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-slate-700">
            Cancelar
          </button>
          <button onClick={handleSubmit} disabled={submitting} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50">
            {submitting ? 'Enviando...' : 'Enviar avaliação'}
          </button>
        </div>
      </div>
    </div>
  );
}