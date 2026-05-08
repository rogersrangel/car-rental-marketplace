import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export function usePublicVehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const { data, error } = await supabase
          .from('vehicles')
          .select('*')
          .limit(100);
        if (error) throw error;
        setVehicles(data || []);
      } catch (err) {
        console.error('Erro ao buscar veículos:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchVehicles();
  }, []);

  return { vehicles, loading, error, refetch: () => window.location.reload() };
}