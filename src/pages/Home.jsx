import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { usePublicVehicles } from '../hooks/usePublicVehicles';
import { useRealtimeBookings } from '../hooks/useRealtimeBookings';
import { SearchFilters } from '../components/SearchFilters';
import { VehicleCardPublic } from '../components/VehicleCardPublic';
import { Search, Car, LogOut, LogIn } from 'lucide-react';

export function Home() {
  const { user, signOut, getUserRole } = useAuth();
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    city: '',
    fuel_type: 'all',
    transmission: 'all',
    min_price: '',
    max_price: '',
    seats: '',
    orderBy: 'created_at',
    orderDir: 'desc',
  });
  const [page] = useState(1);
  const { vehicles, total, loading } = usePublicVehicles(filters, page, 12);

  useRealtimeBookings(user?.id);

  const handleSearch = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    setFilters(prev => ({ ...prev, search: formData.get('search') || '' }));
  };

  const handleFilterApply = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 p-4 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <Car className="w-6 h-6 text-blue-600" />
            <h1 className="text-xl font-bold text-slate-800">CarRentalBR</h1>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <span className="text-sm text-slate-600">
                  {user?.user_metadata?.full_name || user?.email} ({getUserRole()})
                </span>
                {getUserRole() === 'host' && (
                  <Link to="/dashboard/host" className="text-sm text-blue-600 hover:underline">
                    Meus Veículos
                  </Link>
                )}
                {getUserRole() === 'admin' && (
                  <Link to="/admin" className="text-sm text-purple-600 hover:underline">
                    Admin
                  </Link>
                )}
                <Link to="/reservations" className="text-sm text-blue-600 hover:underline">
                  Minhas Reservas
                </Link>
                <button onClick={signOut} className="flex items-center gap-1 text-red-600 hover:text-red-700">
                  <LogOut className="w-4 h-4" /> Sair
                </button>
              </>
            ) : (
              <Link to="/login" className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium">
                <LogIn className="w-4 h-4" /> Entrar
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4">
        <div className="mb-6 flex flex-wrap gap-3 items-center justify-between">
          <form onSubmit={handleSearch} className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                name="search"
                defaultValue={filters.search}
                placeholder="Buscar veículos por nome..."
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </form>
          <SearchFilters filters={filters} onApply={handleFilterApply} />
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            <div className="mb-4 text-slate-600">
              {total} veículo{total !== 1 ? 's' : ''} encontrado{total !== 1 ? 's' : ''}
            </div>
            {vehicles.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
                <p className="text-slate-500">Nenhum veículo encontrado com os filtros atuais.</p>
                <button
                  onClick={() => handleFilterApply({
                    search: '',
                    category: 'all',
                    city: '',
                    fuel_type: 'all',
                    transmission: 'all',
                    min_price: '',
                    max_price: '',
                    seats: '',
                    orderBy: 'created_at',
                    orderDir: 'desc',
                  })}
                  className="mt-3 text-blue-600 hover:underline"
                >
                  Limpar filtros
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {vehicles.map(vehicle => (
                  <VehicleCardPublic key={vehicle.id} vehicle={vehicle} />
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}