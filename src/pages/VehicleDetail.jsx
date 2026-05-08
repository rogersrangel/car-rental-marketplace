import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { mockVehicles } from '../mocks/data';
import { ArrowLeft, Car, Bike, MapPin, Fuel, Gauge } from 'lucide-react';

export function VehicleDetail() {
  const { id } = useParams();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const found = mockVehicles.find(v => v.id === id);
    setTimeout(() => {
      setVehicle(found || null);
      setLoading(false);
    }, 500);
  }, [id]);

  if (loading) return <div className="p-8 text-center">Carregando detalhes...</div>;
  if (!vehicle) return <div className="p-8 text-center">Veículo não encontrado.</div>;

  const getFuelText = (fuel) => ({
    gasoline: 'Gasolina', ethanol: 'Etanol', diesel: 'Diesel', electric: 'Elétrico'
  }[fuel] || fuel);

  return (
    <div className="min-h-screen bg-slate-50 p-4">
      <div className="max-w-4xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-slate-600 mb-4"><ArrowLeft className="w-4 h-4" /> Voltar</Link>
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {vehicle.images?.[0] && <img src={vehicle.images[0]} alt={vehicle.title} className="w-full h-96 object-cover" />}
          <div className="p-6">
            <h1 className="text-2xl font-bold">{vehicle.title}</h1>
            <p className="text-slate-600 mt-2">{vehicle.description}</p>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="flex gap-2"><Car className="w-5 h-5" /> {vehicle.category === 'car' ? 'Carro' : 'Moto'}</div>
              <div className="flex gap-2"><Fuel className="w-5 h-5" /> {getFuelText(vehicle.fuel_type)}</div>
              <div className="flex gap-2"><Gauge className="w-5 h-5" /> {vehicle.transmission === 'automatic' ? 'Automático' : 'Manual'}</div>
              <div className="flex gap-2"><MapPin className="w-5 h-5" /> {vehicle.location_city}/{vehicle.location_state}</div>
            </div>
            <div className="mt-6 border-t pt-4 flex justify-between items-center">
              <span className="text-3xl font-bold text-blue-600">R$ {vehicle.price_per_day}<span className="text-sm">/dia</span></span>
              {/* Botão de reserva fictício */}
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">Reservar (simulação)</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}