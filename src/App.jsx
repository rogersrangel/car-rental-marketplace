import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { PrivateRoute } from './router/PrivateRoute';
import { Login } from './pages/Login';
import { Home } from './pages/Home';
import { HostDashboard } from './pages/HostDashboard';
import { VehicleDetail } from './pages/VehicleDetail';
import { MyReservations } from './pages/MyReservations';
import { AdminDashboard } from './pages/AdminDashboard';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route path="/vehicles/:id" element={<VehicleDetail />} />
          <Route path="/reservations" element={<PrivateRoute><MyReservations /></PrivateRoute>} />
          <Route path="/dashboard/host" element={<PrivateRoute requiredRole="host"><HostDashboard /></PrivateRoute>} />
          <Route path="/admin" element={<PrivateRoute requiredRole="admin"><AdminDashboard /></PrivateRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;