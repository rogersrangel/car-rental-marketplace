import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useBookings } from '../hooks/useBookings';
import { useRealtimeBookings } from '../hooks/useRealtimeBookings';
import { RatingModal } from '../components/RatingModal';
import { ArrowLeft } from 'lucide-react';

export function MyReservations() {
  const { user } = useAuth();
  const { fetchUserBookings, updateBookingStatus } = useBookings();
  const [bookings, setBookings] = useState([]);
  const [role, setRole] = useState('guest');
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  useRealtimeBookings(user?.id);

  useEffect(() => {
    const userRole = user?.user_metadata?.role || 'guest';
    setRole(userRole);
    if (user) {
      fetchUserBookings(user.id, userRole).then(setBookings);
    }
  }, [user, fetchUserBookings]);

  const handleStatusChange = async (bookingId, newStatus) => {
    await updateBookingStatus(bookingId, newStatus);
    const updated = await fetchUserBookings(user.id, role);
    setBookings(updated);
  };

  const handleRate = (booking) => {
    setSelectedBooking(booking);
    setShowRatingModal(true);
  };

  const handleRated = async () => {
    const updated = await fetchUserBookings(user.id, role);
    setBookings(updated);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4">
      <div className="max-w-4xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-800 mb-4">
          <ArrowLeft className="w-4 h-4" /> Voltar
        </Link>

        <h1 className="text-2xl font-bold mb-4">Minhas Reservas</h1>

        {bookings.length === 0 && (
          <p className="text-slate-500 text-center py-8">Nenhuma reserva encontrada.</p>
        )}

        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking.id} className="bg-white rounded-xl shadow p-4">
              <div className="flex justify-between items-start flex-wrap gap-3">
                <div>
                  <h3 className="font-bold text-lg">
                    {booking.vehicles?.title || 'Veículo não disponível'}
                  </h3>
                  <p className="text-sm text-slate-600">
                    Período: {new Date(booking.start_date).toLocaleString()} -{' '}
                    {new Date(booking.end_date).toLocaleString()}
                  </p>
                  <p className="text-sm">Total: R$ {booking.total_price.toFixed(2)}</p>
                  <p className="text-sm">
                    Status:{' '}
                    <span className="font-medium capitalize">{booking.status}</span>
                  </p>
                </div>

                {role === 'host' && booking.status === 'pending' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleStatusChange(booking.id, 'approved')}
                      className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
                    >
                      Aprovar
                    </button>
                    <button
                      onClick={() => handleStatusChange(booking.id, 'cancelled')}
                      className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
                    >
                      Recusar
                    </button>
                  </div>
                )}
              </div>

              {booking.contract_pdf_url && (
                <div className="mt-3">
                  <a
                    href={booking.contract_pdf_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 text-sm hover:underline"
                  >
                    Ver contrato
                  </a>
                </div>
              )}

              {booking.status === 'completed' && (
                <div className="mt-3">
                  <button
                    onClick={() => handleRate(booking)}
                    className="text-sm bg-yellow-50 text-yellow-600 px-3 py-1 rounded-lg hover:bg-yellow-100"
                  >
                    ⭐ Avaliar esta viagem
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {showRatingModal && selectedBooking && (
        <RatingModal
          booking={selectedBooking}
          onClose={() => setShowRatingModal(false)}
          onRated={handleRated}
        />
      )}
    </div>
  );
}