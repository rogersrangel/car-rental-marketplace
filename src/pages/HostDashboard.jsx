import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export function HostDashboard() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 p-4">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <Link to="/" className="text-slate-600 hover:text-slate-800">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-bold text-slate-800">Meus Veículos</h1>
        </div>
      </header>
      <main className="max-w-7xl mx-auto p-4">
        <p className="text-slate-600">Em breve: CRUD de veículos</p>
      </main>
    </div>
  );
}