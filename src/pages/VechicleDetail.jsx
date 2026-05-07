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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Carregando detalhes...</p>
        </div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 text-center">
        <p className="text-slate-600">Veículo não encontrado.</p>
        <Link to="/" className="text-blue-600 hover:underline mt-2 inline-block">
          Voltar para a página inicial
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4">
      <Link to="/" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-800 mb-4">
        <ArrowLeft className="w-4 h-4" /> Voltar
      </Link>
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        {vehicle.images && vehicle.images[0] && (
          <img 
            src={vehicle.images[0]} 
            alt={vehicle.title} 
            className="w-full h-96 object-cover"
          />
        )}
        <div className="p-6">
          <h1 className="text-2xl font-bold text-slate-800 mb-2">{vehicle.title}</h1>
          <p className="text-slate-600 mb-4">{vehicle.description}</p>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <span className="text-sm text-slate-500">Categoria</span>
              <p className="font-medium">{vehicle.category === 'car' ? 'Carro' : 'Moto'}</p>
            </div>
            <div>
              <span className="text-sm text-slate-500">Combustível</span>
              <p className="font-medium capitalize">{vehicle.fuel_type}</p>
            </div>
            <div>
              <span className="text-sm text-slate-500">Câmbio</span>
              <p className="font-medium capitalize">{vehicle.transmission}</p>
            </div>
            <div>
              <span className="text-sm text-slate-500">Localização</span>
              <p className="font-medium">{vehicle.location_city}/{vehicle.location_state}</p>
            </div>
          </div>
          <div className="border-t pt-4">
            <p className="text-2xl text-blue-600 font-bold">
              R$ {Number(vehicle.price_per_day).toLocaleString('pt-BR')}
              <span className="text-sm font-normal text-slate-500">/dia</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}