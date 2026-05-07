import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';
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
  const [users, setUsers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('stats');

  useEffect(() => {
    fetchAllData();
  }, []);

  async function fetchAllData() {
    setLoading(true);
    const { data: profiles } = await supabase.from('profiles').select('*');
    const { data: vehiclesData } = await supabase.from('vehicles').select('*');
    const { data: bookingsData } = await supabase.from('bookings').select('*, vehicles(title)');

    if (profiles) setUsers(profiles);
    if (vehiclesData) setVehicles(vehiclesData);
    if (bookingsData) setBookings(bookingsData);

    const totalUsers = profiles?.length || 0;
    const totalVehicles = vehiclesData?.length || 0;
    const totalBookings = bookingsData?.length || 0;
    const totalRevenue = bookingsData?.reduce((sum, b) => sum + (b.total_price || 0), 0) || 0;
    const pendingVehicles = vehiclesData?.filter(v => v.status === 'pending').length || 0;
    const pendingBookings = bookingsData?.filter(b => b.status === 'pending').length || 0;

    setStats({ totalUsers, totalVehicles, totalBookings, totalRevenue, pendingVehicles, pendingBookings });
    setLoading(false);
  }

  const handleUserRoleChange = async (userId, newRole) => {
    const { error } = await supabase.auth.admin.updateUserById(userId, { user_metadata: { role: newRole } });
    if (error) {
      alert('Erro ao atualizar papel');
    } else {
      await supabase.from('profiles').update({ role: newRole }).eq('id', userId);
      fetchAllData();
    }
  };

  const handleVehicleStatusChange = async (vehicleId, newStatus) => {
    const { error } = await supabase.from('vehicles').update({ status: newStatus }).eq('id', vehicleId);
    if (!error) fetchAllData();
  };

  const handleBookingStatusChange = async (bookingId, newStatus) => {
    const { error } = await supabase.from('bookings').update({ status: newStatus }).eq('id', bookingId);
    if (!error) fetchAllData();
  };

  if (loading) return <div className="p-8 text-center">Carregando dashboard...</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Painel do Administrador</h1>

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

        <div className="flex gap-2 border-b mb-4">
          <button onClick={() => setActiveTab('stats')} className={`px-4 py-2 ${activeTab === 'stats' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-600'}`}>Estatísticas</button>
          <button onClick={() => setActiveTab('users')} className={`px-4 py-2 ${activeTab === 'users' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-600'}`}>Usuários</button>
          <button onClick={() => setActiveTab('vehicles')} className={`px-4 py-2 ${activeTab === 'vehicles' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-600'}`}>Veículos</button>
          <button onClick={() => setActiveTab('bookings')} className={`px-4 py-2 ${activeTab === 'bookings' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-600'}`}>Reservas</button>
        </div>

        {activeTab === 'stats' && (
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Resumo</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[
                  { name: 'Usuários', value: stats.totalUsers },
                  { name: 'Veículos', value: stats.totalVehicles },
                  { name: 'Reservas', value: stats.totalBookings },
                ]}>
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
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr><th className="px-4 py-3 text-left text-xs font-medium uppercase">Nome</th><th className="px-4 py-3 text-left text-xs font-medium uppercase">Email</th><th className="px-4 py-3 text-left text-xs font-medium uppercase">Papel</th><th className="px-4 py-3 text-left text-xs font-medium uppercase">Ações</th></tr>
              </thead>
              <tbody className="divide-y">
                {users.map(u => (
                  <tr key={u.id}>
                    <td className="px-4 py-2">{u.full_name || '—'}</td>
                    <td className="px-4 py-2">{u.email || u.id}</td>
                    <td className="px-4 py-2 capitalize">{u.role}</td>
                    <td className="px-4 py-2">
                      <select value={u.role} onChange={e => handleUserRoleChange(u.id, e.target.value)} className="border rounded p-1 text-sm">
                        <option value="guest">Hóspede</option>
                        <option value="host">Anfitrião</option>
                        <option value="admin">Administrador</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'vehicles' && (
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr><th className="px-4 py-3 text-left text-xs">Título</th><th className="px-4 py-3 text-left text-xs">Proprietário</th><th className="px-4 py-3 text-left text-xs">Preço/dia</th><th className="px-4 py-3 text-left text-xs">Status</th><th className="px-4 py-3 text-left text-xs">Ações</th></tr>
              </thead>
              <tbody>
                {vehicles.map(v => (
                  <tr key={v.id}>
                    <td className="px-4 py-2">{v.title}</td>
                    <td className="px-4 py-2">{v.owner_id}</td>
                    <td className="px-4 py-2">R$ {v.price_per_day}</td>
                    <td className="px-4 py-2 capitalize">{v.status}</td>
                    <td className="px-4 py-2 flex gap-2">
                      {v.status === 'pending' && <button onClick={() => handleVehicleStatusChange(v.id, 'active')} className="bg-green-600 text-white px-2 py-1 rounded text-xs">Aprovar</button>}
                      {(v.status === 'active' || v.status === 'pending') && <button onClick={() => handleVehicleStatusChange(v.id, 'inactive')} className="bg-red-600 text-white px-2 py-1 rounded text-xs">Desativar</button>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'bookings' && (
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr><th className="px-4 py-3 text-left text-xs">ID</th><th className="px-4 py-3 text-left text-xs">Veículo</th><th className="px-4 py-3 text-left text-xs">Total</th><th className="px-4 py-3 text-left text-xs">Status</th><th className="px-4 py-3 text-left text-xs">Ações</th></tr>
              </thead>
              <tbody>
                {bookings.map(b => (
                  <tr key={b.id}>
                    <td className="px-4 py-2 text-xs">{b.id.slice(0,8)}</td>
                    <td className="px-4 py-2">{b.vehicles?.title || '—'}</td>
                    <td className="px-4 py-2">R$ {b.total_price}</td>
                    <td className="px-4 py-2 capitalize">{b.status}</td>
                    <td className="px-4 py-2">
                      <select onChange={e => handleBookingStatusChange(b.id, e.target.value)} defaultValue={b.status} className="border rounded p-1 text-sm">
                        <option value="pending">Pendente</option>
                        <option value="approved">Aprovado</option>
                        <option value="active">Ativo</option>
                        <option value="completed">Concluído</option>
                        <option value="cancelled">Cancelado</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}