import { motion } from 'framer-motion';
import { Car, Bike, MapPin, Fuel, Gauge } from 'lucide-react';
import { Link } from 'react-router-dom';

export function VehicleCardPublic({ vehicle }) {
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg transition-all"
    >
      <Link to={`/vehicles/${vehicle.id}`}>
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
      </Link>

      <div className="p-4">
        <Link to={`/vehicles/${vehicle.id}`}>
          <h3 className="font-bold text-slate-800 text-lg mb-1 hover:text-blue-600 transition-colors">
            {vehicle.title}
          </h3>
        </Link>

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
            {vehicle.transmission === 'automatic' ? 'Automático' : 'Manual'}
          </span>
          {vehicle.seats && (
            <span className="inline-flex items-center gap-1 text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
              {vehicle.seats} assentos
            </span>
          )}
        </div>

        <div className="flex justify-between items-center pt-2 border-t border-slate-100">
          <span className="text-blue-600 font-bold text-xl">
            R$ {Number(vehicle.price_per_day).toLocaleString('pt-BR')}
            <span className="text-xs font-normal text-slate-500">/dia</span>
          </span>
          <Link
            to={`/vehicles/${vehicle.id}`}
            className="px-4 py-1.5 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
          >
            Ver detalhes
          </Link>
        </div>
      </div>
    </motion.div>
  );
}