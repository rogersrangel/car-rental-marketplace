import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Car, LogOut } from 'lucide-react';

export function Home() {
  const { user, signOut, getUserRole } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Car className="w-6 h-6 text-blue-600" />
            <h1 className="text-xl font-bold text-slate-800">CarRentalBR</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-600">
              {user?.user_metadata?.full_name || user?.email} ({getUserRole()})
            </span>
            {getUserRole() === 'host' && (
              <Link 
                to="/dashboard/host" 
                className="text-sm text-blue-600 hover:underline"
              >
                Meus Veículos
              </Link>
            )}
            <button 
              onClick={signOut} 
              className="flex items-center gap-1 text-red-600 hover:text-red-700"
            >
              <LogOut className="w-4 h-4" /> Sair
            </button>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto p-4 text-center py-12">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Bem-vindo ao CarRentalBR</h2>
        <p className="text-slate-600">
          Marketplace peer‑to‑peer para aluguel de carros e motos.
        </p>
        <p className="text-sm text-slate-500 mt-4">
          {getUserRole() === 'host' 
            ? 'Você é um anfitrião. Gerencie seus veículos no menu acima.'
            : 'Você é um hóspede. Em breve poderá pesquisar e reservar veículos.'}
        </p>
      </main>
    </div>
  );
}