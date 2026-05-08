import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { usePublicVehicles } from '../hooks/usePublicVehicles';
import { Car, LogOut, LogIn } from 'lucide-react';

export function Home() {
  const { user, signOut, getUserRole } = useAuth();
  const { vehicles, loading, error } = usePublicVehicles();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong>Erro ao carregar veículos:</strong> {error}
        </div>
      </div>
    );
  }

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
                <Link to="/profile" className="text-sm text-slate-600 hover:text-slate-800">Perfil</Link>
                {getUserRole() === 'host' && (
                  <Link to="/dashboard/host" className="text-sm text-blue-600 hover:underline">Meus Veículos</Link>
                )}
                {getUserRole() === 'admin' && (
                  <Link to="/admin" className="text-sm text-purple-600 hover:underline">Admin</Link>
                )}
                <Link to="/reservations" className="text-sm text-blue-600 hover:underline">Minhas Reservas</Link>
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
        <h2 className="text-2xl font-bold mb-4">Veículos disponíveis</h2>
        {vehicles.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
            <p className="text-slate-500">Nenhum veículo cadastrado ainda.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {vehicles.map((vehicle) => (
              <div key={vehicle.id} className="bg-white rounded-xl shadow p-4">
                <h3 className="font-bold text-lg">{vehicle.title}</h3>
                <p className="text-blue-600 font-bold text-xl mt-2">R$ {vehicle.price_per_day}<span className="text-sm">/dia</span></p>
                <Link to={`/vehicles/${vehicle.id}`} className="inline-block mt-3 text-blue-600 hover:underline">Ver detalhes</Link>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}