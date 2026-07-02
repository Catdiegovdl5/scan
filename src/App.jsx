import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import InteractiveReader from './pages/InteractiveReader';
import AdminDashboard from './pages/AdminDashboard';
import Go from './pages/Go';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import useTikTokAnalytics from './hooks/useTikTokAnalytics';
import './App.css';

function AppContent() {
  // Inicializa o tracker de métricas do TikTok em todo o app
  useTikTokAnalytics();

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/ler/:slug/:capitulo" element={<InteractiveReader />} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
      <Route path="/go" element={<Go />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
