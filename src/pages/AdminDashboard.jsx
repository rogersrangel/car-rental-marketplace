import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { mockUsers, mockVehicles, mockBookings } from '../mocks/data';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { Users, Car, Calendar, DollarSign, TrendingUp, ArrowLeft } from 'lucide-react';

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
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    hover: { scale: 1.02, transition: { duration: 0.2 } },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Cabeçalho com botão voltar */}
        <div className="flex items-center gap-3 mb-8">
          <Link to="/" className="p-2 bg-white rounded-xl shadow-sm hover:shadow transition">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
            Painel do Administrador
          </h1>
        </div>

        {/* Cards animados (grid) */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8"
        >
          {[
            { label: 'Usuários', value: stats.totalUsers, icon: Users, color: 'primary' },
            { label: 'Veículos', value: stats.totalVehicles, icon: Car, color: 'green' },
            { label: 'Reservas', value: stats.totalBookings, icon: Calendar, color: 'purple' },
            { label: 'Faturamento', value: `R$ ${stats.totalRevenue.toFixed(2)}`, icon: DollarSign, color: 'yellow' },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              variants={cardVariants}
              whileHover="hover"
              className="bg-white rounded-xl shadow-sm border border-slate-100 p-5"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-slate-500 text-sm font-medium">{item.label}</p>
                  <p className="text-2xl font-bold text-slate-800 mt-1">{item.value}</p>
                </div>
                <div className={`p-3 rounded-xl bg-${item.color === 'primary' ? 'primary' : item.color}-50`}>
                  <item.icon className={`w-6 h-6 text-${item.color === 'primary' ? 'primary' : item.color}-600`} />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Tabs estilizadas */}
        <div className="flex gap-2 border-b border-slate-200 mb-6">
          {['stats', 'users', 'vehicles', 'bookings'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 text-sm font-medium rounded-t-lg transition-all ${
                activeTab === tab
                  ? 'bg-white text-primary-600 border-b-2 border-primary-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
              }`}
            >
              {tab === 'stats' && '📊 Estatísticas'}
              {tab === 'users' && '👥 Usuários'}
              {tab === 'vehicles' && '🚗 Veículos'}
              {tab === 'bookings' && '📅 Reservas'}
            </button>
          ))}
        </div>

        {/* Conteúdo dinâmico com animação */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'stats' && (
            <div className="bg-white rounded-xl shadow-md p-6 border border-slate-100">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">📈 Resumo geral</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="name" tick={{ fill: '#64748b' }} />
                    <YAxis tick={{ fill: '#64748b' }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
                    />
                    <Legend wrapperStyle={{ paddingTop: '16px' }} />
                    <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} animationDuration={800} animationEasing="ease-out" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-xl">
                  <Clock className="w-5 h-5 text-amber-600" />
                  <div><p className="text-sm text-amber-700">Veículos pendentes</p><p className="font-bold">{stats.pendingVehicles}</p></div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-rose-50 rounded-xl">
                  <AlertCircle className="w-5 h-5 text-rose-600" />
                  <div><p className="text-sm text-rose-700">Reservas pendentes</p><p className="font-bold">{stats.pendingBookings}</p></div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-slate-100">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Nome</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Papel</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {users.map(u => (
                      <tr key={u.id} className="hover:bg-slate-50 transition">
                        <td className="px-6 py-3 text-sm font-medium text-slate-800">{u.full_name}</td>
                        <td className="px-6 py-3 text-sm text-slate-600">{u.email}</td>
                        <td className="px-6 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            u.role === 'admin' ? 'bg-purple-100 text-purple-700' : u.role === 'host' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'
                          }`}>{u.role}</span>
                        </td>
                        <td className="px-6 py-3">
                          <select value={u.role} onChange={e => handleUserRoleChange(u.id, e.target.value)} className="border border-slate-300 rounded-lg p-1 text-sm bg-white">
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
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-slate-100">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr><th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Título</th><th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Preço/dia</th><th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th><th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Ações</th></tr>
                  </thead>
                  <tbody>
                    {vehicles.map(v => (
                      <tr key={v.id} className="hover:bg-slate-50">
                        <td className="px-6 py-3 text-sm font-medium">{v.title}</td>
                        <td className="px-6 py-3 text-sm">R$ {v.price_per_day}</td>
                        <td className="px-6 py-3 text-sm"><span className={`px-2 py-1 rounded-full text-xs font-medium ${v.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{v.status}</span></td>
                        <td className="px-6 py-3"><button onClick={() => handleVehicleStatusChange(v.id, 'active')} className="bg-primary-600 text-white px-3 py-1 rounded text-xs hover:bg-primary-700">Aprovar</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'bookings' && (
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-slate-100">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50"><tr><th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">ID</th><th className="px-6 py-3 text-left text-xs font-medium">Veículo</th><th className="px-6 py-3 text-left text-xs font-medium">Total</th><th className="px-6 py-3 text-left text-xs font-medium">Status</th><th className="px-6 py-3 text-left text-xs">Ações</th></tr></thead>
                  <tbody>
                    {bookings.map(b => (
                      <tr key={b.id} className="hover:bg-slate-50">
                        <td className="px-6 py-3 text-xs text-slate-500">{b.id.slice(0,8)}</td>
                        <td className="px-6 py-3 text-sm">{b.vehicles?.title || '—'}</td>
                        <td className="px-6 py-3 text-sm">R$ {b.total_price}</td>
                        <td className="px-6 py-3 text-sm"><span className="px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">{b.status}</span></td>
                        <td className="px-6 py-3">
                          <select onChange={e => handleBookingStatusChange(b.id, e.target.value)} defaultValue={b.status} className="border border-slate-300 rounded p-1 text-sm bg-white">
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