import { useState, useCallback } from 'react';
import { mockBookings } from '../mocks/data';
import toast from 'react-hot-toast';

export function useBookings() {
  const [loading, setLoading] = useState(false);

  const fetchUserBookings = useCallback(async (userId, role) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setLoading(false);
    if (role === 'guest') return mockBookings.filter(b => b.guest_id === userId);
    if (role === 'host') return mockBookings.filter(b => b.host_id === userId);
    return [];
  }, []);

  const updateBookingStatus = useCallback(async (bookingId, status) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    toast.success(`Status simulado alterado para ${status}`);
    setLoading(false);
    return true;
  }, []);

  const uploadPaymentProof = useCallback(async (bookingId, fileUrl) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    toast.success('Comprovante simulado enviado');
    setLoading(false);
    return true;
  }, []);

  const confirmPayment = useCallback(async (bookingId) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    toast.success('Pagamento simulado confirmado, reserva ativada');
    setLoading(false);
    return true;
  }, []);

  return {
    fetchUserBookings,
    updateBookingStatus,
    uploadPaymentProof,
    confirmPayment,
    loading,
  };
}