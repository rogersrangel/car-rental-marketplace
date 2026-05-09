import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { mockUsers, mockVehicles, mockBookings } from '../mocks/data';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { Users, Car, Calendar, DollarSign, ArrowLeft, Clock, AlertCircle } from 'lucide-react';

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

  const chartData = [
    { name: 'Usuários', value: stats.totalUsers },
    { name: 'Veículos', value: stats.totalVehicles },
    { name: 'Reservas', value: stats.totalBookings },
  ];

  const handleUserRoleChange = (userId, newRole) => alert(`Simular: usuário ${userId} → ${newRole}`);
  const handleVehicleStatusChange = (vehicleId, newStatus) => alert(`Simular: veículo ${vehicleId} → ${newStatus}`);
  const handleBookingStatusChange = (bookingId, newStatus) => alert(`Simular: reserva ${bookingId} → ${newStatus}`);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    hover: { scale: 1.02 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Link to="/" className="p-2 bg-slate-800 rounded-xl hover:bg-slate-700 transition">
            <ArrowLeft className="w-5 h-5 text-slate-300" />
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
            Painel do Administrador
          </h1>
        </div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8"
        >
          {[
            { label: 'Usuários', value: stats.totalUsers, icon: Users, color: 'blue' },
            { label: 'Veículos', value: stats.totalVehicles, icon: Car, color: 'green' },
            { label: 'Reservas', value: stats.totalBookings, icon: Calendar, color: 'purple' },
            { label: 'Faturamento', value: `R$ ${stats.totalRevenue.toFixed(2)}`, icon: DollarSign, color: 'yellow' },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              variants={cardVariants}
              whileHover="hover"
              className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-white/10 p-5"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-slate-400 text-sm font-medium">{item.label}</p>
                  <p className="text-2xl font-bold text-white mt-1">{item.value}</p>
                </div>
                <div className={`p-3 rounded-xl bg-${item.color}-500/10`}>
                  <item.icon className={`w-6 h-6 text-${item.color}-400`} />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="flex gap-2 border-b border-white/10 mb-6">
          {['stats', 'users', 'vehicles', 'bookings'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 text-sm font-medium rounded-t-lg transition-all ${
                activeTab === tab
                  ? 'bg-slate-800/50 text-blue-400 border-b-2 border-blue-500'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/30'
              }`}
            >
              {tab === 'stats' && '📊 Estatísticas'}
              {tab === 'users' && '👥 Usuários'}
              {tab === 'vehicles' && '🚗 Veículos'}
              {tab === 'bookings' && '📅 Reservas'}
            </button>
          ))}
        </div>

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'stats' && (
            <div className="bg-slate-800/50 rounded-xl shadow-md p-6 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4">📈 Resumo geral</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="name" tick={{ fill: '#94a3b8' }} />
                    <YAxis tick={{ fill: '#94a3b8' }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1e293b', borderRadius: '12px', border: 'none' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Legend wrapperStyle={{ paddingTop: '16px' }} />
                    <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} animationDuration={800} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                <div className="flex items-center gap-3 p-3 bg-amber-500/10 rounded-xl border border-amber-500/20">
                  <Clock className="w-5 h-5 text-amber-400" />
                  <div><p className="text-sm text-amber-300">Veículos pendentes</p><p className="font-bold text-white">{stats.pendingVehicles}</p></div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-rose-500/10 rounded-xl border border-rose-500/20">
                  <AlertCircle className="w-5 h-5 text-rose-400" />
                  <div><p className="text-sm text-rose-300">Reservas pendentes</p><p className="font-bold text-white">{stats.pendingBookings}</p></div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="bg-slate-800/50 rounded-xl shadow-md overflow-hidden border border-white/10">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-white/10">
                  <thead className="bg-slate-900/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Nome</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Papel</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {users.map(u => (
                      <tr key={u.id} className="hover:bg-white/5 transition">
                        <td className="px-6 py-3 text-sm font-medium text-white">{u.full_name}</td>
                        <td className="px-6 py-3 text-sm text-slate-300">{u.email}</td>
                        <td className="px-6 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            u.role === 'admin' ? 'bg-purple-500/20 text-purple-300' : u.role === 'host' ? 'bg-blue-500/20 text-blue-300' : 'bg-slate-500/20 text-slate-300'
                          }`}>{u.role}</span>
                        </td>
                        <td className="px-6 py-3">
                          <select value={u.role} onChange={e => handleUserRoleChange(u.id, e.target.value)} className="bg-slate-700 border border-white/20 rounded-lg p-1 text-sm text-white">
                            <option value="guest">Hóspede</option><option value="host">Anfitrião</option><option value="admin">Admin</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'vehicles' && (
            <div className="bg-slate-800/50 rounded-xl shadow-md overflow-hidden border border-white/10">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-white/10">
                  <thead className="bg-slate-900/50">
                    <tr><th className="px-6 py-3 text-left text-xs font-medium text-slate-400">Título</th><th className="px-6 py-3 text-left text-xs font-medium text-slate-400">Preço/dia</th><th className="px-6 py-3 text-left text-xs font-medium text-slate-400">Status</th><th className="px-6 py-3 text-left text-xs font-medium text-slate-400">Ações</th></tr>
                  </thead>
                  <tbody>
                    {vehicles.map(v => (
                      <tr key={v.id} className="hover:bg-white/5">
                        <td className="px-6 py-3 text-sm text-white">{v.title}</td>
                        <td className="px-6 py-3 text-sm text-slate-300">R$ {v.price_per_day}</td>
                        <td className="px-6 py-3 text-sm"><span className="px-2 py-1 rounded-full text-xs bg-green-500/20 text-green-300">{v.status}</span></td>
                        <td className="px-6 py-3"><button onClick={() => handleVehicleStatusChange(v.id, 'active')} className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700">Aprovar</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'bookings' && (
            <div className="bg-slate-800/50 rounded-xl shadow-md overflow-hidden border border-white/10">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-white/10">
                  <thead className="bg-slate-900/50">
                    <tr><th className="px-6 py-3 text-left text-xs font-medium text-slate-400">ID</th><th className="px-6 py-3 text-left text-xs font-medium text-slate-400">Veículo</th><th className="px-6 py-3 text-left text-xs font-medium text-slate-400">Total</th><th className="px-6 py-3 text-left text-xs font-medium text-slate-400">Status</th><th className="px-6 py-3 text-left text-xs font-medium text-slate-400">Ações</th></tr>
                  </thead>
                  <tbody>
                    {bookings.map(b => (
                      <tr key={b.id} className="hover:bg-white/5">
                        <td className="px-6 py-3 text-xs text-slate-400">{b.id.slice(0,8)}</td>
                        <td className="px-6 py-3 text-sm text-white">{b.vehicles?.title || '—'}</td>
                        <td className="px-6 py-3 text-sm text-slate-300">R$ {b.total_price}</td>
                        <td className="px-6 py-3 text-sm"><span className="px-2 py-1 rounded-full text-xs bg-slate-500/20 text-slate-300">{b.status}</span></td>
                        <td className="px-6 py-3">
                          <select onChange={e => handleBookingStatusChange(b.id, e.target.value)} defaultValue={b.status} className="bg-slate-700 border border-white/20 rounded p-1 text-sm text-white">
                            <option value="pending">Pendente</option><option value="approved">Aprovado</option><option value="active">Ativo</option><option value="completed">Concluído</option><option value="cancelled">Cancelado</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}