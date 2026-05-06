import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export function HostDashboard() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="p-4">
        <Link to="/" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-800 mb-4">
          <ArrowLeft className="w-4 h-4" /> Voltar
        </Link>
        <h1 className="text-2xl font-bold text-slate-800">Meus Veículos</h1>
        <p className="text-slate-600 mt-2">Em breve: CRUD de veículos para anfitriões.</p>
      </div>
    </div>
  );
}