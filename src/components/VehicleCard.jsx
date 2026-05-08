import { motion } from 'framer-motion';
import { Edit, Trash2, Car } from 'lucide-react';

export function VehicleCard({ vehicle, onEdit, onDelete }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4 }}
      className="bg-white rounded-xl shadow-md overflow-hidden border border-slate-100"
    >
      <div className="relative h-40">
        <img src={vehicle.images?.[0] || 'https://placehold.co/400x200'} alt={vehicle.title} className="w-full h-full object-cover" />
        <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
          <Car className="w-3 h-3" /> {vehicle.category}
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg text-slate-800">{vehicle.title}</h3>
        <p className="text-blue-600 font-bold text-xl mt-1">R$ {vehicle.price_per_day}<span className="text-sm">/dia</span></p>
        <div className="flex justify-end gap-2 mt-3">
          <button onClick={() => onEdit(vehicle)} className="p-2 text-slate-500 hover:text-blue-600 transition-colors"><Edit className="w-4 h-4" /></button>
          <button onClick={() => onDelete(vehicle)} className="p-2 text-slate-500 hover:text-red-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
        </div>
      </div>
    </motion.div>
  );
}