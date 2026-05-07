import { useState, useEffect } from 'react';
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

  useEffect(() => {
    if (user && vehicles.length > 0) {
      fetchUserBookings(user.id, 'host').then(bookings => {
        const completed = bookings.filter(b => b.status === 'completed');
        const totalEarned = completed.reduce((sum, b) => sum + b.total_price, 0);
        setCompletedBookings(completed.length);
        setEarnings(totalEarned);

        // Taxa de ocupação simplificada (dias reservados / dias totais no mês)
        const totalDays = vehicles.reduce((sum, v) => sum + 30, 0); // 30 dias por veículo
        const bookedDays = bookings.reduce((sum, b) => {
          const days = Math.ceil((new Date(b.end_date) - new Date(b.start_date)) / (1000 * 60 * 60 * 24));
          return sum + days;
        }, 0);
        setOccupancyRate(totalDays ? (bookedDays / totalDays) * 100 : 0);
      });
    }
  }, [user, vehicles, fetchUserBookings]);

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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Carregando veículos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 p-4 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-slate-600 hover:text-slate-800">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-xl font-bold text-slate-800">Meus Veículos</h1>
          </div>
          <button
            onClick={() => {
              setEditingVehicle(null);
              setShowForm(true);
            }}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" /> Adicionar Veículo
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4">
        {/* Cards financeiros */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow p-4 flex items-center gap-3">
            <DollarSign className="w-8 h-8 text-green-600" />
            <div>
              <p className="text-sm text-slate-500">Ganhos totais</p>
              <p className="text-xl font-bold">R$ {earnings.toFixed(2)}</p>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-4 flex items-center gap-3">
            <Calendar className="w-8 h-8 text-blue-600" />
            <div>
              <p className="text-sm text-slate-500">Reservas concluídas</p>
              <p className="text-xl font-bold">{completedBookings}</p>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-4 flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-purple-600" />
            <div>
              <p className="text-sm text-slate-500">Taxa de ocupação</p>
              <p className="text-xl font-bold">{occupancyRate.toFixed(1)}%</p>
            </div>
          </div>
        </div>

        {vehicles.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 bg-white rounded-lg border border-slate-200"
          >
            <p className="text-slate-500">Nenhum veículo cadastrado ainda.</p>
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 text-blue-600 hover:underline font-medium"
            >
              Adicionar primeiro veículo
            </button>
          </motion.div>
        )}

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