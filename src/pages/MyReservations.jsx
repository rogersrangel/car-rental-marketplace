import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useBookings } from '../hooks/useBookings';
import { mockBookings } from '../mocks/data';
import { ArrowLeft } from 'lucide-react';

export function MyReservations() {
  const { user, getUserRole } = useAuth();
  const [bookings, setBookings] = useState([]);
  const role = getUserRole();
  const { updateBookingStatus } = useBookings();

  useEffect(() => {
    if (!user) return;
    const filtered = mockBookings.filter(b => 
      role === 'guest' ? b.guest_id === user.id : b.host_id === user.id
    );
    setBookings(filtered);
  }, [user, role]);

  const handleStatusChange = async (id, status) => {
    await updateBookingStatus(id, status);
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
  };

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
                  <button onClick={() => handleStatusChange(b.id, 'approved')} className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-green-700">Aprovar</button>
                  <button onClick={() => handleStatusChange(b.id, 'cancelled')} className="bg-red-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-700">Recusar</button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}