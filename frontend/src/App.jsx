import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext, AuthProvider } from './context/AuthContext';
import { OrbitNavbar } from './components/OrbitHero';
import Footer from './components/Footer';
import Home from './pages/Home';
import Auth from './pages/Auth';
import Marketplace from './pages/Marketplace';
import DealRoom from './pages/DealRoom';
import Feed from './pages/Feed';
import Campaigns from './pages/Campaigns';
import QuantumMatchmaker from './components/QuantumMatchmaker';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div className="text-center font-label text-xs text-white/50 py-20">ESTABLISHING SESSION...</div>;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return children;
};

function AppContent() {
  const { user } = useContext(AuthContext);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Render OrbitNavbar on all pages except Auth gateway */}
      {window.location.pathname !== '/auth' && <OrbitNavbar />}
      
      <main className="flex-1 flex flex-col">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          
          <Route path="/marketplace" element={
            <ProtectedRoute>
              {user?.role === 'brand' ? <Marketplace /> : <Navigate to="/campaigns" replace />}
            </ProtectedRoute>
          } />

          <Route path="/campaigns" element={
            <ProtectedRoute>
              <Campaigns />
            </ProtectedRoute>
          } />

          <Route path="/dashboard/brand-workbench" element={
            <ProtectedRoute>
              <Campaigns />
            </ProtectedRoute>
          } />
          
          <Route path="/deal-room" element={
            <ProtectedRoute>
              <DealRoom />
            </ProtectedRoute>
          } />
          
          <Route path="/feed" element={
            <ProtectedRoute>
              <Feed />
            </ProtectedRoute>
          } />

          <Route path="/ai-scout" element={
            <ProtectedRoute>
              <QuantumMatchmaker />
            </ProtectedRoute>
          } />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {window.location.pathname !== '/auth' && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}
