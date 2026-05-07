import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { ArrowLeft, Car, Bike, MapPin, Fuel, Gauge } from 'lucide-react';

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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
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

  const getFuelText = (fuel) => {
    const fuels = {
      gasoline: 'Gasolina',
      ethanol: 'Etanol',
      diesel: 'Diesel',
      electric: 'Elétrico',
    };
    return fuels[fuel] || fuel;
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4">
      <div className="max-w-4xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-800 mb-4">
          <ArrowLeft className="w-4 h-4" /> Voltar
        </Link>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {vehicle.images && vehicle.images[0] && (
            <div className="w-full h-96 overflow-hidden">
              <img
                src={vehicle.images[0]}
                alt={vehicle.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-2xl font-bold text-slate-800">{vehicle.title}</h1>
              <span className="text-blue-600 font-bold text-2xl">
                R$ {Number(vehicle.price_per_day).toLocaleString('pt-BR')}
                <span className="text-sm font-normal text-slate-500">/dia</span>
              </span>
            </div>

            <p className="text-slate-600 mb-6">{vehicle.description || 'Sem descrição adicional.'}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-2">
                {vehicle.category === 'car' ? <Car className="w-5 h-5 text-blue-600" /> : <Bike className="w-5 h-5 text-blue-600" />}
                <div>
                  <span className="text-xs text-slate-500">Categoria</span>
                  <p className="font-medium">{vehicle.category === 'car' ? 'Carro' : 'Moto'}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Fuel className="w-5 h-5 text-blue-600" />
                <div>
                  <span className="text-xs text-slate-500">Combustível</span>
                  <p className="font-medium">{getFuelText(vehicle.fuel_type)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Gauge className="w-5 h-5 text-blue-600" />
                <div>
                  <span className="text-xs text-slate-500">Câmbio</span>
                  <p className="font-medium">{vehicle.transmission === 'automatic' ? 'Automático' : 'Manual'}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                <div>
                  <span className="text-xs text-slate-500">Localização</span>
                  <p className="font-medium">{vehicle.location_city}/{vehicle.location_state}</p>
                </div>
              </div>
              {vehicle.seats && (
                <div className="flex items-center gap-2">
                  <div>
                    <span className="text-xs text-slate-500">Assentos</span>
                    <p className="font-medium">{vehicle.seats}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}