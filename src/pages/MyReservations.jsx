import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useBookings } from '../hooks/useBookings';
import { useRealtimeBookings } from '../hooks/useRealtimeBookings';
import { RatingModal } from '../components/RatingModal';
import { supabase } from '../lib/supabaseClient';
import { ArrowLeft, Eye, Download, Upload, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export function MyReservations() {
  const { user } = useAuth();
  const { fetchUserBookings, updateBookingStatus, uploadPaymentProof, confirmPayment } = useBookings();
  const [bookings, setBookings] = useState([]);
  const [role, setRole] = useState('guest');
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [uploading, setUploading] = useState(false);

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

  const handleUploadProof = async (bookingId) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*,application/pdf';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      setUploading(true);
      const fileName = `proof-${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage.from('vehicles').upload(fileName, file);
      if (uploadError) {
        toast.error('Erro ao enviar comprovante');
        setUploading(false);
        return;
      }
      const { data } = supabase.storage.from('vehicles').getPublicUrl(fileName);
      await uploadPaymentProof(bookingId, data.publicUrl);
      setUploading(false);
      const updated = await fetchUserBookings(user.id, role);
      setBookings(updated);
    };
    input.click();
  };

  const viewContract = (url) => window.open(url, '_blank');
  const downloadContract = (url, title) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `contrato_${title.replace(/\s/g, '_')}.pdf`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4">
      <div className="max-w-4xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-800 mb-4">
          <ArrowLeft className="w-4 h-4" /> Voltar
        </Link>

        <h1 className="text-2xl font-bold mb-4">Minhas Reservas</h1>

        {bookings.length === 0 && <p className="text-slate-500 text-center py-8">Nenhuma reserva encontrada.</p>}

        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking.id} className="bg-white rounded-xl shadow p-4">
              <div className="flex justify-between items-start flex-wrap gap-3">
                <div>
                  <h3 className="font-bold text-lg">{booking.vehicles?.title || 'Veículo não disponível'}</h3>
                  <p className="text-sm text-slate-600">
                    Período: {new Date(booking.start_date).toLocaleString()} -{' '}
                    {new Date(booking.end_date).toLocaleString()}
                  </p>
                  <p className="text-sm">Total: R$ {booking.total_price.toFixed(2)}</p>
                  <p className="text-sm">
                    Status: <span className="font-medium capitalize">{booking.status}</span>
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

              {/* Contrato PDF */}
              {booking.contract_pdf_url && (
                <div className="mt-3 flex gap-3">
                  <button onClick={() => viewContract(booking.contract_pdf_url)} className="flex items-center gap-1 text-blue-600 text-sm">
                    <Eye className="w-4 h-4" /> Visualizar contrato
                  </button>
                  <button onClick={() => downloadContract(booking.contract_pdf_url, booking.vehicles?.title)} className="flex items-center gap-1 text-green-600 text-sm">
                    <Download className="w-4 h-4" /> Baixar PDF
                  </button>
                </div>
              )}

              {/* Chave Pix para hóspede (reserva aprovada, pagamento ainda não confirmado) */}
              {role === 'guest' && booking.status === 'approved' && !booking.payment_confirmed && (
                <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm font-semibold text-green-800">Pagamento via Pix</p>
                  <p className="text-sm text-green-700">
                    Chave Pix do anfitrião: <strong>{booking.host_pix_key || 'Chave não cadastrada'}</strong>
                  </p>
                  <button
                    onClick={() => handleUploadProof(booking.id)}
                    disabled={uploading}
                    className="mt-2 flex items-center gap-1 bg-blue-600 text-white px-3 py-1 rounded text-sm"
                  >
                    <Upload className="w-4 h-4" /> {uploading ? 'Enviando...' : 'Enviar comprovante'}
                  </button>
                </div>
              )}

              {/* Comprovante enviado, aguardando confirmação */}
              {booking.payment_confirmed && booking.status === 'approved' && role === 'guest' && (
                <div className="mt-3 p-3 bg-yellow-50 rounded-lg">
                  <p className="text-sm">✅ Comprovante enviado. Aguardando confirmação do anfitrião.</p>
                </div>
              )}

              {/* Anfitrião: ver comprovante e confirmar pagamento */}
              {role === 'host' && booking.status === 'approved' && booking.payment_confirmed && (
                <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm font-semibold">Comprovante de pagamento:</p>
                  {booking.payment_proof_url && (
                    <a href={booking.payment_proof_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline text-sm">
                      Visualizar comprovante
                    </a>
                  )}
                  <button
                    onClick={() => confirmPayment(booking.id)}
                    className="mt-2 flex items-center gap-1 bg-green-600 text-white px-3 py-1 rounded text-sm"
                  >
                    <CheckCircle className="w-4 h-4" /> Confirmar pagamento e ativar reserva
                  </button>
                </div>
              )}

              {/* Reserva ativa (status 'active') – pode exibir instruções de retirada */}
              {booking.status === 'active' && (
                <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm">🎉 Reserva confirmada! Entre em contato com o anfitrião para combinar a retirada.</p>
                </div>
              )}

              {/* Avaliação */}
              {booking.status === 'completed' && (
                <div className="mt-3">
                  <button onClick={() => handleRate(booking)} className="text-sm bg-yellow-50 text-yellow-600 px-3 py-1 rounded-lg">
                    ⭐ Avaliar esta viagem
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {showRatingModal && selectedBooking && (
        <RatingModal booking={selectedBooking} onClose={() => setShowRatingModal(false)} onRated={handleRated} />
      )}
    </div>
  );
}