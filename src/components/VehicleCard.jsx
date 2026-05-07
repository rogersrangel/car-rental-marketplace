import { motion } from 'framer-motion';
import { Car, Bike, Edit3, Trash2, MapPin, Fuel, Gauge } from 'lucide-react';

export function VehicleCard({ vehicle, onEdit, onDelete }) {
  const mainImage = vehicle.images?.[0] || 'https://placehold.co/400x300/e2e8f0/64748b?text=Sem+imagem';

  const getFuelText = (fuel) => {
    const fuels = {
      gasoline: 'Gasolina',
      ethanol: 'Etanol',
      diesel: 'Diesel',
      electric: 'Elétrico',
    };
    return fuels[fuel] || fuel;
  };

  const getTransmissionText = (trans) => {
    return trans === 'automatic' ? 'Automático' : 'Manual';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg transition-all"
    >
      <div className="h-48 overflow-hidden bg-slate-100 relative">
        <img
          src={mainImage}
          alt={vehicle.title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-semibold text-slate-700">
          {vehicle.category === 'car' ? 'Carro' : 'Moto'}
        </div>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-slate-800 text-lg">{vehicle.title}</h3>
          <span className="text-blue-600 font-bold">
            R$ {Number(vehicle.price_per_day).toLocaleString('pt-BR')}
            <span className="text-xs font-normal text-slate-500">/dia</span>
          </span>
        </div>

        <div className="flex items-center gap-1 text-slate-500 text-sm mb-2">
          <MapPin className="w-3 h-3" />
          <span>{vehicle.location_city}/{vehicle.location_state}</span>
        </div>

        <div className="flex flex-wrap gap-2 mb-3">
          <span className="inline-flex items-center gap-1 text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
            <Fuel className="w-3 h-3" />
            {getFuelText(vehicle.fuel_type)}
          </span>
          <span className="inline-flex items-center gap-1 text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
            <Gauge className="w-3 h-3" />
            {getTransmissionText(vehicle.transmission)}
          </span>
          {vehicle.seats && (
            <span className="inline-flex items-center gap-1 text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
              {vehicle.seats} assentos
            </span>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
          <button
            onClick={() => onEdit(vehicle)}
            className="flex items-center gap-1 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Edit3 className="w-4 h-4" /> Editar
          </button>
          <button
            onClick={() => onDelete(vehicle)}
            className="flex items-center gap-1 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" /> Excluir
          </button>
        </div>
      </div>
    </motion.div>
  );
}