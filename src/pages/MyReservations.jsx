import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useBookings } from '../hooks/useBookings';
import { mockBookings } from '../mocks/data';
import { Eye, Download, ArrowLeft } from 'lucide-react';

export function MyReservations() {
  const { user, getUserRole } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [role, setRole] = useState('guest');
  const { updateBookingStatus } = useBookings();

  useEffect(() => {
    const userRole = getUserRole();
    setRole(userRole);
    // Filtra reservas de acordo com o papel
    const filtered = mockBookings.filter(b => 
      userRole === 'guest' ? b.guest_id === user?.id : b.host_id === user?.id
    );
    setBookings(filtered);
  }, [user, getUserRole]);

  const handleStatusChange = async (bookingId, newStatus) => {
    await updateBookingStatus(bookingId, newStatus);
    // Atualiza localmente (mock)
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: newStatus } : b));
  };

  const viewContract = (url) => url && window.open(url, '_blank');

  return (
    <div className="min-h-screen bg-slate-50 p-4">
      <div className="max-w-4xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-slate-600 mb-4"><ArrowLeft className="w-4 h-4" /> Voltar</Link>
        <h1 className="text-2xl font-bold mb-4">Minhas Reservas</h1>
        {bookings.length === 0 && <p className="text-slate-500 text-center py-8">Nenhuma reserva encontrada.</p>}
        <div className="space-y-4">
          {bookings.map(booking => (
            <div key={booking.id} className="bg-white rounded-xl shadow p-4">
              <div className="flex justify-between items-start flex-wrap gap-3">
                <div>
                  <h3 className="font-bold text-lg">{booking.vehicles?.title || 'Veículo'}</h3>
                  <p className="text-sm text-slate-600">Período: {new Date(booking.start_date).toLocaleString()} - {new Date(booking.end_date).toLocaleString()}</p>
                  <p className="text-sm">Total: R$ {booking.total_price.toFixed(2)}</p>
                  <p className="text-sm">Status: <span className="font-medium capitalize">{booking.status}</span></p>
                </div>
                {role === 'host' && booking.status === 'pending' && (
                  <div className="flex gap-2">
                    <button onClick={() => handleStatusChange(booking.id, 'approved')} className="px-3 py-1 bg-green-600 text-white rounded-lg">Aprovar</button>
                    <button onClick={() => handleStatusChange(booking.id, 'cancelled')} className="px-3 py-1 bg-red-600 text-white rounded-lg">Recusar</button>
                  </div>
                )}
              </div>
              {booking.contract_pdf_url && (
                <div className="mt-3 flex gap-3">
                  <button onClick={() => viewContract(booking.contract_pdf_url)} className="flex items-center gap-1 text-blue-600 text-sm"><Eye className="w-4 h-4" /> Ver contrato</button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}