import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { mockUsers, mockVehicles, mockBookings } from '../mocks/data';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users, Car, Calendar, DollarSign } from 'lucide-react';

export function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalVehicles: 0,
    totalBookings: 0,
    totalRevenue: 0,
    pendingVehicles: 0,
    pendingBookings: 0,
  });
  const [users] = useState(mockUsers);
  const [vehicles] = useState(mockVehicles);
  const [bookings] = useState(mockBookings);
  const [activeTab, setActiveTab] = useState('stats');

  useEffect(() => {
    const totalRevenue = bookings.reduce((sum, b) => sum + b.total_price, 0);
    setStats({
      totalUsers: users.length,
      totalVehicles: vehicles.length,
      totalBookings: bookings.length,
      totalRevenue,
      pendingVehicles: vehicles.filter(v => v.status === 'pending').length,
      pendingBookings: bookings.filter(b => b.status === 'pending').length,
    });
  }, []);

  const handleUserRoleChange = (userId, newRole) => {
    alert(`Simulado: alterar usuário ${userId} para ${newRole}`);
  };

  const handleVehicleStatusChange = (vehicleId, newStatus) => {
    alert(`Simulado: alterar veículo ${vehicleId} para ${newStatus}`);
  };

  const handleBookingStatusChange = (bookingId, newStatus) => {
    alert(`Simulado: alterar reserva ${bookingId} para ${newStatus}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Link to="/" className="text-slate-600 hover:text-slate-800">← Voltar</Link>
          <h1 className="text-2xl font-bold">Painel do Administrador</h1>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow p-4 flex items-center gap-4">
            <Users className="w-10 h-10 text-blue-600" />
            <div><p className="text-sm text-slate-500">Total de usuários</p><p className="text-2xl font-bold">{stats.totalUsers}</p></div>
          </div>
          <div className="bg-white rounded-xl shadow p-4 flex items-center gap-4">
            <Car className="w-10 h-10 text-green-600" />
            <div><p className="text-sm text-slate-500">Total de veículos</p><p className="text-2xl font-bold">{stats.totalVehicles}</p></div>
          </div>
          <div className="bg-white rounded-xl shadow p-4 flex items-center gap-4">
            <Calendar className="w-10 h-10 text-purple-600" />
            <div><p className="text-sm text-slate-500">Reservas realizadas</p><p className="text-2xl font-bold">{stats.totalBookings}</p></div>
          </div>
          <div className="bg-white rounded-xl shadow p-4 flex items-center gap-4">
            <DollarSign className="w-10 h-10 text-yellow-600" />
            <div><p className="text-sm text-slate-500">Faturamento total</p><p className="text-2xl font-bold">R$ {stats.totalRevenue.toFixed(2)}</p></div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b mb-4">
          {['stats', 'users', 'vehicles', 'bookings'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 ${activeTab === tab ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-600'}`}>
              {tab === 'stats' && 'Estatísticas'}
              {tab === 'users' && 'Usuários'}
              {tab === 'vehicles' && 'Veículos'}
              {tab === 'bookings' && 'Reservas'}
            </button>
          ))}
        </div>

        {/* Conteúdo */}
        {activeTab === 'stats' && (
          <div className="bg-white rounded-xl shadow p-6">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[{ name: 'Usuários', value: stats.totalUsers }, { name: 'Veículos', value: stats.totalVehicles }, { name: 'Reservas', value: stats.totalBookings }]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-white rounded-xl shadow overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr><th className="px-4 py-3 text-left text-xs font-medium">Nome</th><th className="px-4 py-3 text-left text-xs">Email</th><th className="px-4 py-3 text-left text-xs">Papel</th><th className="px-4 py-3 text-left text-xs">Ações</th></tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id}><td className="px-4 py-2">{u.full_name}</td><td className="px-4 py-2">{u.email}</td><td className="px-4 py-2 capitalize">{u.role}</td><td className="px-4 py-2"><select value={u.role} onChange={e => handleUserRoleChange(u.id, e.target.value)} className="border rounded p-1"><option value="guest">Hóspede</option><option value="host">Anfitrião</option><option value="admin">Admin</option></select></td></tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'vehicles' && (
          <div className="bg-white rounded-xl shadow overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50"><tr><th className="px-4 py-3 text-left">Título</th><th className="px-4 py-3 text-left">Preço/dia</th><th className="px-4 py-3 text-left">Status</th><th className="px-4 py-3 text-left">Ações</th></tr></thead>
              <tbody>
                {vehicles.map(v => (
                  <tr key={v.id}><td className="px-4 py-2">{v.title}</td><td className="px-4 py-2">R$ {v.price_per_day}</td><td className="px-4 py-2 capitalize">{v.status}</td><td className="px-4 py-2"><button onClick={() => handleVehicleStatusChange(v.id, 'active')} className="bg-green-600 text-white px-2 py-1 rounded text-xs">Aprovar</button></td></tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'bookings' && (
          <div className="bg-white rounded-xl shadow overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50"><tr><th className="px-4 py-3 text-left">ID</th><th className="px-4 py-3 text-left">Veículo</th><th className="px-4 py-3 text-left">Total</th><th className="px-4 py-3 text-left">Status</th><th className="px-4 py-3 text-left">Ações</th></tr></thead>
              <tbody>
                {bookings.map(b => (
                  <tr key={b.id}><td className="px-4 py-2 text-xs">{b.id}</td><td className="px-4 py-2">{b.vehicles?.title || '—'}</td><td className="px-4 py-2">R$ {b.total_price}</td><td className="px-4 py-2 capitalize">{b.status}</td><td className="px-4 py-2"><select onChange={e => handleBookingStatusChange(b.id, e.target.value)} defaultValue={b.status} className="border rounded p-1"><option value="pending">Pendente</option><option value="approved">Aprovado</option><option value="active">Ativo</option><option value="completed">Concluído</option><option value="cancelled">Cancelado</option></select></td></tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}