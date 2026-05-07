import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import toast from 'react-hot-toast';

export function useVehicles(ownerId = null) {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchVehicles = useCallback(async () => {
    if (!ownerId) {
      setVehicles([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .eq('owner_id', ownerId)
      .order('created_at', { ascending: false });

    if (error) {
      setError(error.message);
      toast.error('Erro ao carregar veículos');
      console.error('Erro fetchVehicles:', error);
    } else {
      setVehicles(data || []);
    }
    setLoading(false);
  }, [ownerId]);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  const createVehicle = async (vehicleData) => {
    const { data, error } = await supabase
      .from('vehicles')
      .insert([vehicleData])
      .select();

    if (error) {
      toast.error(error.message);
      console.error('Erro createVehicle:', error);
      return null;
    }

    toast.success('Veículo cadastrado com sucesso!');
    await fetchVehicles();
    return data[0];
  };

  const updateVehicle = async (id, updates) => {
    const { error } = await supabase
      .from('vehicles')
      .update(updates)
      .eq('id', id);

    if (error) {
      toast.error(error.message);
      console.error('Erro updateVehicle:', error);
      return false;
    }

    toast.success('Veículo atualizado!');
    await fetchVehicles();
    return true;
  };

  const deleteVehicle = async (id) => {
    const { error } = await supabase
      .from('vehicles')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error(error.message);
      console.error('Erro deleteVehicle:', error);
      return false;
    }

    toast.success('Veículo removido');
    await fetchVehicles();
    return true;
  };

  return {
    vehicles,
    loading,
    error,
    createVehicle,
    updateVehicle,
    deleteVehicle,
    refetch: fetchVehicles,
  };
}