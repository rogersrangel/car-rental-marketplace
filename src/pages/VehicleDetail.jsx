import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { mockVehicles } from '../mocks/data';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Heart, Share2 } from 'lucide-react';

export function VehicleDetail() {
  const { id } = useParams();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const found = mockVehicles.find(v => v.id === id);
    setTimeout(() => { setVehicle(found); setLoading(false); }, 400);
  }, [id]);

  if (loading) return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  if (!vehicle) return <div className="text-center py-12">Veículo não encontrado</div>;

  const coverImage = vehicle.images?.[0] || 'https://placehold.co/1200x600';

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      <header className="sticky top-0 z-50 bg-black/30 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 text-white/80 hover:text-white">
            <ArrowLeft className="w-5 h-5" /> Voltar
          </Link>
          <div className="flex gap-4">
            <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition" onClick={() => setIsFavorite(!isFavorite)}>
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
            </button>
            <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-10">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="rounded-2xl overflow-hidden shadow-2xl">
            <img src={coverImage} alt={vehicle.title} className="w-full h-auto object-cover" />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold">{vehicle.title}</h1>
              <p className="text-xl text-blue-400">{vehicle.subtitle || 'Edição especial'}</p>
            </div>

            <div className="flex items-center gap-2 text-slate-300">
              <MapPin className="w-5 h-5 text-blue-400" />
              <span>{vehicle.location_full || `${vehicle.location_city}, ${vehicle.location_state}`}</span>
            </div>

            <div className="grid grid-cols-2 gap-4 py-4 border-t border-b border-white/10">
              {vehicle.specs && (
                <>
                  <div><p className="text-slate-400 text-sm">Power</p><p className="text-2xl font-semibold">{vehicle.specs.power}</p></div>
                  <div><p className="text-slate-400 text-sm">Mileage</p><p className="text-2xl font-semibold">{vehicle.specs.mileage}</p></div>
                  <div><p className="text-slate-400 text-sm">Engine</p><p className="text-2xl font-semibold">{vehicle.specs.engine}</p></div>
                  <div><p className="text-slate-400 text-sm">Acceleration</p><p className="text-2xl font-semibold">{vehicle.specs.acceleration}</p></div>
                  <div><p className="text-slate-400 text-sm">Top speed</p><p className="text-2xl font-semibold">{vehicle.specs.top_speed}</p></div>
                  <div><p className="text-slate-400 text-sm">Consumption</p><p className="text-2xl font-semibold">{vehicle.specs.fuel_consumption}</p></div>
                </>
              )}
            </div>

            <div className="flex justify-between items-center pt-4">
              <div>
                <span className="text-slate-400 text-sm">a partir de</span>
                <p className="text-4xl font-bold text-blue-400">R$ {vehicle.price_per_day.toLocaleString('pt-BR')}<span className="text-lg font-normal text-slate-300">/dia</span></p>
              </div>
              <button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-full font-semibold shadow-md hover:shadow-xl transition transform hover:scale-105">
                Reservar agora
              </button>
            </div>

            {vehicle.price_per_day > 100000 && (
              <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10 text-center">
                <p className="text-sm text-slate-300">Secure your spot! <span className="text-blue-400 font-semibold">R$ 50.000</span> depósito.</p>
              </div>
            )}
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="mt-12 p-6 bg-white/5 rounded-2xl">
          <h3 className="text-xl font-semibold mb-2">Sobre o veículo</h3>
          <p className="text-slate-300 leading-relaxed">{vehicle.description}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-10">
          <h3 className="text-xl font-semibold mb-4">Características técnicas</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/5 p-4 rounded-xl text-center"><p className="text-slate-400">Potência</p><p className="text-2xl font-bold">800 hp</p></div>
            <div className="bg-white/5 p-4 rounded-xl text-center"><p className="text-slate-400">0-100 km/h</p><p className="text-2xl font-bold">3.2s</p></div>
            <div className="bg-white/5 p-4 rounded-xl text-center"><p className="text-slate-400">Vel. máxima</p><p className="text-2xl font-bold">450 km/h</p></div>
            <div className="bg-white/5 p-4 rounded-xl text-center"><p className="text-slate-400">Assentos</p><p className="text-2xl font-bold">{vehicle.seats}</p></div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}