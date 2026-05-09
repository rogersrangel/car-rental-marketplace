import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useVehicles } from '../hooks/useVehicles';
import { useBookings } from '../hooks/useBookings';
import { VehicleCard } from '../components/VehicleCard';
import { VehicleForm } from '../components/VehicleForm';
import { Plus, ArrowLeft, DollarSign, Calendar, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

export function HostDashboard() {
  const { user } = useAuth();
  const { vehicles, loading, createVehicle, updateVehicle, deleteVehicle } = useVehicles(user?.id);
  const { fetchUserBookings } = useBookings();
  const [showForm, setShowForm] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [earnings, setEarnings] = useState(0);
  const [completedBookings, setCompletedBookings] = useState(0);
  const [occupancyRate, setOccupancyRate] = useState(0);

  useState(() => {
    if (user) {
      fetchUserBookings(user.id, 'host').then(bookings => {
        const completed = bookings.filter(b => b.status === 'completed');
        const totalEarned = completed.reduce((sum, b) => sum + b.total_price, 0);
        setCompletedBookings(completed.length);
        setEarnings(totalEarned);
        setOccupancyRate(45.5);
      });
    }
  }, [user, fetchUserBookings]);

  const handleEdit = (vehicle) => {
    setEditingVehicle(vehicle);
    setShowForm(true);
  };

  const handleDelete = async (vehicle) => {
    if (window.confirm(`Tem certeza que deseja excluir "${vehicle.title}"?`)) {
      await deleteVehicle(vehicle.id);
    }
  };

  const handleSubmit = async (data) => {
    if (editingVehicle) {
      await updateVehicle(editingVehicle.id, data);
    } else {
      await createVehicle(data);
    }
    setShowForm(false);
    setEditingVehicle(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-b from-slate-900 to-slate-800">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      <header className="sticky top-0 z-10 bg-black/30 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-slate-300 hover:text-white">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-xl font-bold text-white">Meus Veículos</h1>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/profile" className="text-sm text-slate-300 hover:text-blue-400">Perfil</Link>
            <button
              onClick={() => {
                setEditingVehicle(null);
                setShowForm(true);
              }}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-xl hover:from-blue-700 hover:to-blue-800"
            >
              <Plus className="w-4 h-4" /> Adicionar Veículo
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4">
        {/* Cards financeiros */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-white/10 p-4 flex items-center gap-3">
            <DollarSign className="w-8 h-8 text-green-400" />
            <div>
              <p className="text-sm text-slate-400">Ganhos totais</p>
              <p className="text-xl font-bold text-white">R$ {earnings.toFixed(2)}</p>
            </div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-white/10 p-4 flex items-center gap-3">
            <Calendar className="w-8 h-8 text-blue-400" />
            <div>
              <p className="text-sm text-slate-400">Reservas concluídas</p>
              <p className="text-xl font-bold text-white">{completedBookings}</p>
            </div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-white/10 p-4 flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-purple-400" />
            <div>
              <p className="text-sm text-slate-400">Taxa de ocupação</p>
              <p className="text-xl font-bold text-white">{occupancyRate.toFixed(1)}%</p>
            </div>
          </div>
        </div>

        {vehicles.length === 0 ? (
          <div className="text-center py-16 bg-slate-800/50 rounded-xl border border-white/10">
            <p className="text-slate-400">Nenhum veículo cadastrado ainda.</p>
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 text-blue-400 hover:underline"
            >
              Adicionar primeiro veículo
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicles.map((vehicle) => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </main>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <VehicleForm
              initialData={editingVehicle}
              onSubmit={handleSubmit}
              onCancel={() => {
                setShowForm(false);
                setEditingVehicle(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}