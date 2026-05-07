import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import toast from 'react-hot-toast';

export function useBookings() {
  const [loading, setLoading] = useState(false);

  const createBooking = useCallback(async (bookingData) => {
    setLoading(true);
    const { data, error } = await supabase
      .from('bookings')
      .insert([bookingData])
      .select();
    if (error) {
      toast.error(error.message);
      return null;
    }
    toast.success('Solicitação de reserva enviada!');
    setLoading(false);
    return data[0];
  }, []);

 const fetchUserBookings = useCallback(async (userId, role = 'guest') => {
  setLoading(true);
  const field = role === 'guest' ? 'guest_id' : 'host_id';
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq(field, userId)
    .order('created_at', { ascending: false });
  
  if (error) {
    toast.error(error.message);
    return [];
  }

  // Buscar os veículos separadamente
  const bookingsWithVehicles = await Promise.all(
    data.map(async (booking) => {
      const { data: vehicle } = await supabase
        .from('vehicles')
        .select('*')
        .eq('id', booking.vehicle_id)
        .single();
      return { ...booking, vehicles: vehicle };
    })
  );
  
  setLoading(false);
  return bookingsWithVehicles;
}, []);

  const updateBookingStatus = useCallback(async (bookingId, status) => {
    setLoading(true);
    const { error } = await supabase
      .from('bookings')
      .update({ status })
      .eq('id', bookingId);
    if (error) {
      toast.error(error.message);
      return false;
    }
    toast.success(`Status alterado para ${status}`);
    setLoading(false);
    return true;
  }, []);

  const uploadContract = useCallback(async (bookingId, pdfUrl) => {
    const { error } = await supabase
      .from('bookings')
      .update({ contract_pdf_url: pdfUrl })
      .eq('id', bookingId);
    if (error) toast.error(error.message);
    else toast.success('Contrato anexado!');
    return !error;
  }, []);

  return { createBooking, fetchUserBookings, updateBookingStatus, uploadContract, loading };
}