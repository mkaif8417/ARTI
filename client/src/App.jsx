// src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminApp from './admin/AdminApp';

// Add these as you build them out
// import Products from './pages/Products';
// import ProductDetail from './pages/ProductDetail';
// import Cart from './pages/Cart';
// import Checkout from './pages/Checkout';
// import Orders from './pages/Orders';
// import Profile from './pages/Profile';

const ProtectedRoute = ({ children }) => {
  const { user, getToken } = useAuth();
  if (!getToken() || !user) return <Navigate to="/login" replace />;
  return children;
};

function App() {
  const { user } = useAuth();

  return (
    <>
      <Routes>
        {/* Public — with Navbar */}
        <Route path="/" element={<><Navbar /><Home /></>} />

        {/* Uncomment as you build pages:
        <Route path="/products" element={<><Navbar /><Products /></>} />
        <Route path="/products/:slug" element={<><Navbar /><ProductDetail /></>} />
        */}

        {/* User-protected — with Navbar */}
        {/* 
        <Route path="/cart" element={<ProtectedRoute><Navbar /><Cart /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute><Navbar /><Orders /></ProtectedRoute>} />
        */}

        {/* Auth — no Navbar */}
        <Route path="/login"    element={user ? <Navigate to="/" replace /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/" replace /> : <Register />} />

        {/* Admin — fully self-contained */}
        <Route path="/admin/*" element={<AdminApp />} />

        {/* 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;