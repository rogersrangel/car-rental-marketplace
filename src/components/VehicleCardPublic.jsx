import { motion } from 'framer-motion';
import { MapPin, Star, Fuel, Gauge } from 'lucide-react';
import { Link } from 'react-router-dom';

export function VehicleCardPublic({ vehicle }) {
  const avgRating = 4.8; // mock

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.2 }}
      className="group bg-white rounded-2xl shadow-md hover:shadow-xl border border-slate-100 overflow-hidden cursor-pointer"
    >
      <Link to={`/vehicles/${vehicle.id}`}>
        <div className="relative h-48 overflow-hidden bg-slate-200">
          <img src={vehicle.images?.[0] || '/placeholder-car.jpg'} alt={vehicle.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" /> {avgRating}
          </div>
        </div>
        <div className="p-4">
          <div className="flex justify-between items-start mb-1">
            <h3 className="font-bold text-lg text-slate-800">{vehicle.title}</h3>
            <span className="text-primary-600 font-bold text-xl">R$ {vehicle.price_per_day}<span className="text-xs">/dia</span></span>
          </div>
          <div className="flex items-center gap-1 text-slate-500 text-sm mb-2">
            <MapPin className="w-3 h-3" /> {vehicle.location_city}, {vehicle.location_state}
          </div>
          <div className="flex flex-wrap gap-1 text-xs text-slate-600 mb-3">
            <span className="bg-slate-100 px-2 py-1 rounded-full flex items-center gap-1"><Fuel className="w-3 h-3" /> Gasolina</span>
            <span className="bg-slate-100 px-2 py-1 rounded-full flex items-center gap-1"><Gauge className="w-3 h-3" /> Automático</span>
          </div>
          <div className="border-t border-slate-100 pt-3 flex justify-between items-center">
            <span className="text-slate-500 text-sm">a partir de</span>
            <span className="text-primary-600 font-semibold text-sm group-hover:underline">Ver detalhes →</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}