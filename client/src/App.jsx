import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Home from './pages/Home.jsx';
import AdminApp from './admin/AdminApp.jsx';
import { useAuth } from './context/AuthContext.jsx';

function App() {
  const { user } = useAuth();

  return (
    <Routes>
   
      {/* Customer routes */}
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/" replace /> : <Register />} />
      <Route path="/" element={user ? <Home /> : <Navigate to="/login" replace />} />

      {/* Admin routes */}
      <Route path="/admin/*" element={<AdminApp />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;