import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { PrivateRoute } from './router/PrivateRoute';
import { Login } from './pages/Login';
import { Home } from './pages/Home';
import { HostDashboard } from './pages/HostDashboard';
import { VehicleDetail } from './pages/VehicleDetail';
import { MyReservations } from './pages/MyReservations';
import { AdminDashboard } from './pages/AdminDashboard';
import { Profile } from './pages/Profile';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/login" element={
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            <Login />
          </motion.div>
        } />
        <Route path="/" element={
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            <Home />
          </motion.div>
        } />
        <Route path="/vehicles/:id" element={
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <VehicleDetail />
          </motion.div>
        } />
        <Route path="/reservations" element={
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <PrivateRoute><MyReservations /></PrivateRoute>
          </motion.div>
        } />
        <Route path="/dashboard/host" element={
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <PrivateRoute requiredRole="host"><HostDashboard /></PrivateRoute>
          </motion.div>
        } />
        <Route path="/admin" element={
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <PrivateRoute requiredRole="admin"><AdminDashboard /></PrivateRoute>
          </motion.div>
        } />
        <Route path="/profile" element={
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <PrivateRoute><Profile /></PrivateRoute>
          </motion.div>
        } />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" toastOptions={{
          style: { background: '#1e293b', color: '#fff', borderRadius: '12px' },
          success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } }
        }} />
        <AnimatedRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;