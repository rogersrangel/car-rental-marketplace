import { useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import toast from 'react-hot-toast';

export function useRealtimeBookings(userId) {
  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel('bookings-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'bookings',
          filter: `guest_id=eq.${userId}`,
        },
        (payload) => {
          const newStatus = payload.new.status;
          const oldStatus = payload.old.status;
          if (newStatus !== oldStatus) {
            toast(`Sua reserva #${payload.new.id.slice(0,8)} está ${newStatus}`, {
              icon: newStatus === 'approved' ? '✅' : newStatus === 'cancelled' ? '❌' : 'ℹ️',
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);
}