import { motion } from 'framer-motion';
import { MapPin, Star, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export function VehicleCardPublic({ vehicle }) {
  const avgRating = 4.8;
  const mainImage = vehicle.images?.[0] || 'https://placehold.co/600x400/1e293b/64748b?text=Sem+imagem';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -6 }}
      className="group bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-lg border border-white/10 overflow-hidden cursor-pointer hover:border-blue-500/50 transition-all"
    >
      <Link to={`/vehicles/${vehicle.id}`}>
        <div className="relative h-48 overflow-hidden bg-slate-700">
          <img src={mainImage} alt={vehicle.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" /> {avgRating}
          </div>
          {vehicle.owner_verified && (
            <div className="absolute bottom-3 left-3 bg-blue-600/80 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Verificado
            </div>
          )}
        </div>
        <div className="p-4">
          <div className="flex justify-between items-start mb-1">
            <h3 className="font-bold text-lg text-white">{vehicle.title}</h3>
            <span className="text-blue-400 font-bold text-xl">
              R$ {vehicle.price_per_day}
              <span className="text-xs font-normal text-slate-400">/dia</span>
            </span>
          </div>
          <div className="flex items-center gap-1 text-slate-400 text-sm mb-2">
            <MapPin className="w-3 h-3" /> {vehicle.location_city}, {vehicle.location_state}
          </div>
          <div className="border-t border-white/10 pt-3 flex justify-between items-center">
            <span className="text-slate-400 text-sm">a partir de</span>
            <span className="text-blue-400 font-semibold text-sm group-hover:underline">
              Ver detalhes →
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}