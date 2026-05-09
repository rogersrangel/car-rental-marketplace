import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { mockVehicles, mockReviews, mockUsers } from '../mocks/data';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Heart, Share2, Star, ShieldCheck } from 'lucide-react';

export function VehicleDetail() {
  const { id } = useParams();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [owner, setOwner] = useState(null);

  useEffect(() => {
    const found = mockVehicles.find(v => v.id === id);
    setTimeout(() => {
      setVehicle(found);
      if (found) {
        const ownerData = mockUsers.find(u => u.id === found.owner_id);
        setOwner(ownerData);
      }
      setLoading(false);
    }, 400);
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-b from-slate-900 to-slate-800">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  if (!vehicle) return <div className="text-center py-12 text-white">Veículo não encontrado</div>;

  // Filtra avaliações do veículo
  const vehicleReviews = mockReviews.filter(r => r.reviewee_id === vehicle.id && r.type === 'vehicle');

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
          {/* Galeria */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="rounded-2xl overflow-hidden shadow-2xl">
            <img src={vehicle.images?.[0] || 'https://placehold.co/1200x600/1e293b/64748b?text=Sem+imagem'} alt={vehicle.title} className="w-full h-auto object-cover" />
          </motion.div>

          {/* Informações do veículo */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-4xl font-bold">{vehicle.title}</h1>
                {owner?.is_verified && (
                  <div className="bg-blue-600/20 text-blue-400 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Verificado
                  </div>
                )}
              </div>
              <p className="text-xl text-blue-400">{vehicle.subtitle || 'Edição especial'}</p>
            </div>

            {/* Avaliação do veículo */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="text-xl font-bold">{vehicle.avg_rating || 0}</span>
              </div>
              <span className="text-slate-400">({vehicle.total_reviews || 0} avaliações)</span>
            </div>

            {/* Localização */}
            <div className="flex items-center gap-2 text-slate-300">
              <MapPin className="w-5 h-5 text-blue-400" />
              <span>{vehicle.location_full || `${vehicle.location_city}, ${vehicle.location_state}`}</span>
            </div>

            {/* Especificações */}
            <div className="grid grid-cols-2 gap-4 py-4 border-t border-b border-white/10">
              {vehicle.specs && (
                <>
                  <div><p className="text-slate-400 text-sm">Potência</p><p className="text-2xl font-semibold">{vehicle.specs.power}</p></div>
                  <div><p className="text-slate-400 text-sm">Quilometragem</p><p className="text-2xl font-semibold">{vehicle.specs.mileage}</p></div>
                  <div><p className="text-slate-400 text-sm">Motor</p><p className="text-2xl font-semibold">{vehicle.specs.engine}</p></div>
                  <div><p className="text-slate-400 text-sm">Aceleração</p><p className="text-2xl font-semibold">{vehicle.specs.acceleration}</p></div>
                  <div><p className="text-slate-400 text-sm">Vel. máxima</p><p className="text-2xl font-semibold">{vehicle.specs.top_speed}</p></div>
                  <div><p className="text-slate-400 text-sm">Consumo</p><p className="text-2xl font-semibold">{vehicle.specs.fuel_consumption}</p></div>
                </>
              )}
            </div>

            {/* Preço e reserva */}
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

        {/* Descrição completa */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="mt-12 p-6 bg-white/5 rounded-2xl">
          <h3 className="text-xl font-semibold mb-2">Sobre o veículo</h3>
          <p className="text-slate-300 leading-relaxed">{vehicle.description}</p>
        </motion.div>

        {/* Seção de avaliações do veículo */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="mt-10">
          <h3 className="text-xl font-semibold text-white mb-4">⭐ Avaliações do veículo</h3>
          <div className="bg-slate-800/30 rounded-xl p-4">
            {vehicleReviews.length === 0 ? (
              <p className="text-slate-400 text-center py-4">Ainda não há avaliações para este veículo.</p>
            ) : (
              vehicleReviews.map(review => {
                const reviewer = mockUsers.find(u => u.id === review.reviewer_id);
                return (
                  <div key={review.id} className="border-t border-white/10 py-3 first:border-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex text-yellow-400">
                          {Array.from({ length: review.rating }).map((_, i) => <Star key={i} className="w-4 h-4 fill-yellow-400" />)}
                        </div>
                        <span className="text-sm text-slate-400">{reviewer?.full_name || 'Usuário'}</span>
                      </div>
                      <span className="text-xs text-slate-500">{new Date(review.created_at).toLocaleDateString()}</span>
                    </div>
                    <p className="text-slate-300 mt-1">{review.comment}</p>
                  </div>
                );
              })
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
}