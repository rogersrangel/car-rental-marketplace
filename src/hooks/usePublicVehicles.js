import { useState, useEffect } from 'react';
import { mockVehicles } from '../mocks/data';

export function usePublicVehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simula um atraso de rede
    const timer = setTimeout(() => {
      setVehicles(mockVehicles);
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return { vehicles, loading, error, refetch: () => {} };
}