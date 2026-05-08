import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';

export function usePublicVehicles(filters = {}, page = 1, limit = 12) {
  const [vehicles, setVehicles] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchVehicles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let query = supabase.from('vehicles').select('*', { count: 'exact' });

      if (filters.search) query = query.ilike('title', `%${filters.search}%`);
      if (filters.category && filters.category !== 'all') query = query.eq('category', filters.category);
      if (filters.city) query = query.ilike('location_city', `%${filters.city}%`);
      if (filters.fuel_type && filters.fuel_type !== 'all') query = query.eq('fuel_type', filters.fuel_type);
      if (filters.transmission && filters.transmission !== 'all') query = query.eq('transmission', filters.transmission);
      if (filters.min_price) query = query.gte('price_per_day', parseFloat(filters.min_price));
      if (filters.max_price) query = query.lte('price_per_day', parseFloat(filters.max_price));
      if (filters.seats) query = query.gte('seats', parseInt(filters.seats));

      const orderBy = filters.orderBy || 'created_at';
      const orderDir = filters.orderDir === 'asc';
      query = query.order(orderBy, { ascending: orderDir });

      const from = (page - 1) * limit;
      query = query.range(from, from + limit - 1);

      // Timeout de 5 segundos para evitar loading infinito
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Timeout ao carregar veículos')), 5000)
      );

      const result = await Promise.race([query, timeoutPromise]);
      const { data, error, count } = result;

      if (error) throw error;
      setVehicles(data || []);
      setTotal(count || 0);
    } catch (err) {
      console.error('Erro fetchPublicVehicles:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters, page, limit]);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  return { vehicles, total, loading, error, refetch: fetchVehicles };
}