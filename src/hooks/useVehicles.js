import { useState, useEffect } from 'react';
import { mockVehicles } from '../mocks/data';
import toast from 'react-hot-toast';

export function useVehicles(ownerId) {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      const filtered = mockVehicles.filter(v => v.owner_id === ownerId);
      setVehicles(filtered);
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [ownerId]);

  const createVehicle = async (data) => {
    toast.success('Veículo simulado cadastrado!');
    return { ...data, id: `v${Date.now()}` };
  };
  const updateVehicle = async () => { toast.success('Atualizado!'); return true; };
  const deleteVehicle = async () => { toast.success('Removido!'); return true; };

  return { vehicles, loading, error, createVehicle, updateVehicle, deleteVehicle, refetch: () => {} };
}