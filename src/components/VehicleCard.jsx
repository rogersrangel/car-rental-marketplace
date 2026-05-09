import { motion } from 'framer-motion';
import { Edit, Trash2, Car } from 'lucide-react';

export function VehicleCard({ vehicle, onEdit, onDelete }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4 }}
      className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden hover:border-blue-500/50 transition-all"
    >
      <div className="relative h-40">
        <img src={vehicle.images?.[0] || 'https://placehold.co/400x200/1e293b/64748b?text=Sem+imagem'} alt={vehicle.title} className="w-full h-full object-cover" />
        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
          <Car className="w-3 h-3" /> {vehicle.category}
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg text-white">{vehicle.title}</h3>
        <p className="text-blue-400 font-bold text-xl mt-1">R$ {vehicle.price_per_day}<span className="text-sm text-slate-400">/dia</span></p>
        <div className="flex justify-end gap-2 mt-3">
          <button onClick={() => onEdit(vehicle)} className="p-2 text-slate-400 hover:text-blue-400 transition-colors"><Edit className="w-4 h-4" /></button>
          <button onClick={() => onDelete(vehicle)} className="p-2 text-slate-400 hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
        </div>
      </div>
    </motion.div>
  );
}