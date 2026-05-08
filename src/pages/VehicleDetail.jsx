import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { mockVehicles } from '../mocks/data';
import { ArrowLeft, Star, MapPin, Gauge, Fuel, Users, Calendar } from 'lucide-react';

export function VehicleDetail() {
  const { id } = useParams();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const found = mockVehicles.find(v => v.id === id);
    setTimeout(() => { setVehicle(found); setLoading(false); }, 400);
  }, [id]);

  if (loading) return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div>;
  if (!vehicle) return <div className="text-center py-12">Veículo não encontrado</div>;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-slate-100 p-4">
        <Link to="/" className="inline-flex items-center gap-2 text-slate-600"><ArrowLeft className="w-5 h-5" /> Voltar</Link>
      </header>
      <main className="max-w-6xl mx-auto p-4">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Imagem principal */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-md">
            <img src={vehicle.images?.[0] || '/placeholder.jpg'} alt={vehicle.title} className="w-full h-96 object-cover" />
          </div>
          {/* Informações */}
          <div>
            <h1 className="text-3xl font-bold text-slate-800">{vehicle.title}</h1>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex text-yellow-400"><Star className="w-5 h-5 fill-yellow-400" /><Star className="w-5 h-5 fill-yellow-400" /><Star className="w-5 h-5 fill-yellow-400" /><Star className="w-5 h-5 fill-yellow-400" /><Star className="w-5 h-5 fill-yellow-400" /></div>
              <span className="text-slate-500">(48 avaliações)</span>
            </div>
            <p className="text-slate-600 mt-4">{vehicle.description}</p>
            <div className="grid grid-cols-2 gap-4 mt-6 p-4 bg-slate-100 rounded-xl">
              <div className="flex items-center gap-2"><Gauge className="w-5 h-5 text-primary-600" /> <span>Automático</span></div>
              <div className="flex items-center gap-2"><Fuel className="w-5 h-5 text-primary-600" /> <span>Gasolina</span></div>
              <div className="flex items-center gap-2"><Users className="w-5 h-5 text-primary-600" /> <span>{vehicle.seats} lugares</span></div>
              <div className="flex items-center gap-2"><MapPin className="w-5 h-5 text-primary-600" /> <span>{vehicle.location_city}, {vehicle.location_state}</span></div>
            </div>
            <div className="mt-6 flex justify-between items-center border-t border-slate-200 pt-6">
              <div><span className="text-2xl font-bold text-primary-600">R$ {vehicle.price_per_day}</span><span className="text-slate-500">/dia</span></div>
              <button className="bg-primary-600 text-white px-6 py-3 rounded-xl shadow-md hover:bg-primary-700 transition">Reservar agora</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}