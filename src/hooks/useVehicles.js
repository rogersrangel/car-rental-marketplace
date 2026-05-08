import { useState, useEffect } from 'react';
import { mockVehicles } from '../mocks/data';
import toast from 'react-hot-toast';

export function useVehicles(ownerId) {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simula carregamento e filtra pelos veículos do proprietário
    const timer = setTimeout(() => {
      const filtered = mockVehicles.filter(v => v.owner_id === ownerId);
      setVehicles(filtered);
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [ownerId]);

  const createVehicle = async (vehicleData) => {
    toast.success('Veículo simulado cadastrado!');
    return { ...vehicleData, id: `v${Date.now()}` };
  };

  const updateVehicle = async (id, updates) => {
    toast.success('Veículo simulado atualizado!');
    return true;
  };

  const deleteVehicle = async (id) => {
    toast.success('Veículo simulado removido!');
    return true;
  };

  return { vehicles, loading, error, createVehicle, updateVehicle, deleteVehicle, refetch: () => {} };
}