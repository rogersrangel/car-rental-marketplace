import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { usePublicVehicles } from '../hooks/usePublicVehicles';
import { VehicleCardPublic } from '../components/VehicleCardPublic';
import { Search, SlidersHorizontal, Car, LogOut, LogIn } from 'lucide-react';

export function Home() {
  const { user, signOut, getUserRole } = useAuth();
  const { vehicles, loading } = usePublicVehicles();
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const filtered = vehicles.filter(v => v.title.toLowerCase().includes(searchTerm.toLowerCase()));

  if (loading) return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header transparente com blur */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl flex items-center justify-center">
              <Car className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">CarRentalBR</h1>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <span className="text-sm text-slate-600">{user?.user_metadata?.full_name || user?.email}</span>
                <Link to="/profile" className="text-sm text-slate-600 hover:text-primary-600">Perfil</Link>
                {getUserRole() === 'host' && <Link to="/dashboard/host" className="text-sm text-primary-600">Dashboard</Link>}
                <button onClick={signOut} className="text-red-500 hover:text-red-600"><LogOut className="w-4 h-4" /></button>
              </>
            ) : (
              <Link to="/login" className="flex items-center gap-1 text-primary-600"><LogIn className="w-4 h-4" /> Entrar</Link>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero section */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800">Encontre o veículo perfeito</h2>
          <p className="text-slate-500 mt-2">Milhares de carros e motos disponíveis para você</p>
        </div>

        {/* Barra de busca + filtro */}
        <div className="flex gap-3 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="text" placeholder="Buscar por modelo, marca..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-primary-500" />
          </div>
          <button onClick={() => setShowFilters(!showFilters)} className="px-4 py-3 border border-slate-200 rounded-xl bg-white shadow-sm hover:bg-slate-50"><SlidersHorizontal className="w-5 h-5 text-slate-600" /></button>
        </div>

        {/* Grid de veículos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map(vehicle => <VehicleCardPublic key={vehicle.id} vehicle={vehicle} />)}
          {filtered.length === 0 && <div className="col-span-full text-center py-12 text-slate-500">Nenhum veículo encontrado</div>}
        </div>
      </main>
    </div>
  );
}