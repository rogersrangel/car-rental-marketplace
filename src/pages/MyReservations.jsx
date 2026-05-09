import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useBookings } from '../hooks/useBookings';
import { mockBookings, mockReviews } from '../mocks/data';
import { RatingModal } from '../components/RatingModal';
import { ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

export function MyReservations() {
  const { user, getUserRole } = useAuth();
  const { updateBookingStatus } = useBookings();
  const [bookings, setBookings] = useState([]);
  const role = getUserRole();
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [ratingType, setRatingType] = useState(''); // 'host', 'vehicle', 'guest'

  useEffect(() => {
    if (!user) return;
    // Buscar reservas do usuário (mock)
    let filtered = mockBookings.filter(b => 
      role === 'guest' ? b.guest_id === user.id : b.host_id === user.id
    );
    setBookings(filtered);
  }, [user, role]);

  const handleStatusChange = async (id, status) => {
    await updateBookingStatus(id, status);
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
  };

  const openRatingModal = (booking, type) => {
    setSelectedBooking(booking);
    setRatingType(type);
    setShowRatingModal(true);
  };

  const handleRatingSubmit = async (rating, comment) => {
    // Simular envio da avaliação
    await new Promise(resolve => setTimeout(resolve, 800));
    // Atualizar localmente as flags
    setBookings(prev => prev.map(b => {
      if (b.id !== selectedBooking.id) return b;
      if (ratingType === 'host') return { ...b, guest_rated_host: true };
      if (ratingType === 'vehicle') return { ...b, guest_rated_vehicle: true };
      if (ratingType === 'guest') return { ...b, host_rated_guest: true };
      return b;
    }));
    toast.success('Avaliação enviada! Obrigado pelo feedback.');
  };

  const canRateHost = role === 'guest' && (selectedBooking?.guest_rated_host === false);
  const canRateVehicle = role === 'guest' && (selectedBooking?.guest_rated_vehicle === false);
  const canRateGuest = role === 'host' && (selectedBooking?.host_rated_guest === false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 p-4">
      <div className="max-w-4xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-slate-300 hover:text-white mb-4">
          <ArrowLeft className="w-4 h-4" /> Voltar
        </Link>
        <h1 className="text-2xl font-bold text-white mb-4">Minhas Reservas</h1>
        {bookings.length === 0 && <p className="text-slate-400 text-center py-8">Nenhuma reserva encontrada.</p>}
        <div className="space-y-4">
          {bookings.map(b => (
            <div key={b.id} className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-white/10 p-4">
              <h3 className="font-bold text-white">{b.vehicles?.title || 'Veículo'}</h3>
              <p className="text-slate-300 text-sm">Período: {new Date(b.start_date).toLocaleString()} - {new Date(b.end_date).toLocaleString()}</p>
              <p className="text-slate-300">Total: R$ {b.total_price.toFixed(2)}</p>
              <p className="text-slate-300">Status: <span className="capitalize">{b.status}</span></p>

              {role === 'host' && b.status === 'pending' && (
                <div className="flex gap-2 mt-2">
                  <button onClick={() => handleStatusChange(b.id, 'approved')} className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm">Aprovar</button>
                  <button onClick={() => handleStatusChange(b.id, 'cancelled')} className="bg-red-600 text-white px-3 py-1 rounded-lg text-sm">Recusar</button>
                </div>
              )}

              {/* Botões de avaliação para hóspede (reserva concluída) */}
              {role === 'guest' && b.status === 'completed' && (
                <div className="flex gap-3 mt-3">
                  <button
                    onClick={() => openRatingModal(b, 'host')}
                    disabled={b.guest_rated_host}
                    className={`px-3 py-1 rounded-lg text-sm ${b.guest_rated_host ? 'bg-slate-600 text-slate-400 cursor-not-allowed' : 'bg-yellow-600 hover:bg-yellow-700 text-white'}`}
                  >
                    {b.guest_rated_host ? 'Anfitrião já avaliado' : '⭐ Avaliar anfitrião'}
                  </button>
                  <button
                    onClick={() => openRatingModal(b, 'vehicle')}
                    disabled={b.guest_rated_vehicle}
                    className={`px-3 py-1 rounded-lg text-sm ${b.guest_rated_vehicle ? 'bg-slate-600 text-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
                  >
                    {b.guest_rated_vehicle ? 'Veículo já avaliado' : '🚗 Avaliar veículo'}
                  </button>
                </div>
              )}

              {/* Botão de avaliação para anfitrião (reserva concluída) */}
              {role === 'host' && b.status === 'completed' && (
                <div className="mt-3">
                  <button
                    onClick={() => openRatingModal(b, 'guest')}
                    disabled={b.host_rated_guest}
                    className={`px-3 py-1 rounded-lg text-sm ${b.host_rated_guest ? 'bg-slate-600 text-slate-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 text-white'}`}
                  >
                    {b.host_rated_guest ? 'Hóspede já avaliado' : '⭐ Avaliar hóspede'}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {showRatingModal && selectedBooking && (
        <RatingModal
          title={
            ratingType === 'host' ? 'Avaliar anfitrião' :
            ratingType === 'vehicle' ? 'Avaliar veículo' : 'Avaliar hóspede'
          }
          onSubmit={handleRatingSubmit}
          onClose={() => setShowRatingModal(false)}
        />
      )}
    </div>
  );
}