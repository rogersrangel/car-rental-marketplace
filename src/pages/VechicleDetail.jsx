import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { ArrowLeft } from 'lucide-react';

export function VehicleDetail() {
  const { id } = useParams();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVehicle = async () => {
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .eq('id', id)
        .single();
      if (!error) setVehicle(data);
      setLoading(false);
    };
    fetchVehicle();
  }, [id]);

  if (loading) return <div className="p-8 text-center">Carregando detalhes...</div>;
  if (!vehicle) return <div className="p-8 text-center">Veículo não encontrado.</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-4">
      <Link to="/" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-800 mb-4">
        <ArrowLeft className="w-4 h-4" /> Voltar
      </Link>
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold mb-2">{vehicle.title}</h1>
        <p className="text-slate-600 mb-4">{vehicle.description}</p>
        <p className="text-2xl text-blue-600 font-bold">
          R$ {Number(vehicle.price_per_day).toLocaleString('pt-BR')}
        </p>
      </div>
    </div>
  );
}