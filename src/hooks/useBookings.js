import { useState, useCallback } from 'react';
import { mockBookings } from '../mocks/data';
import toast from 'react-hot-toast';

export function useBookings() {
  const [loading, setLoading] = useState(false);

  const fetchUserBookings = useCallback(async (userId, role) => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 500));
    setLoading(false);
    if (role === 'guest') return mockBookings.filter(b => b.guest_id === userId);
    if (role === 'host') return mockBookings.filter(b => b.host_id === userId);
    return [];
  }, []);

  const updateBookingStatus = useCallback(async (id, status) => {
    toast.success(`Status simulado alterado para ${status}`);
    return true;
  }, []);

  const uploadPaymentProof = async () => { toast.success('Comprovante enviado'); return true; };
  const confirmPayment = async () => { toast.success('Pagamento confirmado'); return true; };

  return { fetchUserBookings, updateBookingStatus, uploadPaymentProof, confirmPayment, loading };
}