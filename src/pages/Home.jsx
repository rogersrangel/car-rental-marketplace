import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { usePublicVehicles } from '../hooks/usePublicVehicles';
import { VehicleCardPublic } from '../components/VehicleCardPublic';
import { Search, Car, LogOut, LogIn } from 'lucide-react';
import { motion } from 'framer-motion';

export function Home() {
  const { user, signOut, getUserRole } = useAuth();
  const { vehicles, loading } = usePublicVehicles();
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = vehicles.filter(v =>
    v.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      <header className="sticky top-0 z-40 bg-black/30 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center">
              <Car className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
              CarRentalBR
            </span>
          </Link>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <span className="text-sm text-slate-300">
                  {user?.user_metadata?.full_name || user?.email}
                </span>
                <Link to="/profile" className="text-sm text-slate-300 hover:text-blue-400">
                  Perfil
                </Link>
                {getUserRole() === 'host' && (
                  <Link to="/dashboard/host" className="text-sm text-blue-400">
                    Dashboard
                  </Link>
                )}
                <button onClick={signOut} className="text-red-400 hover:text-red-300">
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <Link to="/login" className="flex items-center gap-1 text-blue-400">
                <LogIn className="w-4 h-4" /> Entrar
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Encontre o veículo perfeito
          </h2>
          <p className="text-slate-400 mt-2">
            Milhares de carros e motos disponíveis para você
          </p>
        </motion.div>

        <div className="max-w-md mx-auto mb-10">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Buscar por modelo, marca..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((vehicle) => (
            <VehicleCardPublic key={vehicle.id} vehicle={vehicle} />
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full text-center py-12 text-slate-400">
              Nenhum veículo encontrado
            </div>
          )}
        </div>
      </main>
    </div>
  );
}