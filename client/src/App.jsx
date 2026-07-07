import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminApp from './admin/AdminApp';
import Divider from './components/Divider';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Checkout from './pages/Checkout';
import SearchPage from './pages/SearchPage';   
import Orders from './pages/Order';
// Uncomment as you build:
// import Products from './pages/Products';
// import Profile from './pages/Profile';

const PublicLayout = () => (
  <>
    <Navbar />
    {/* <Divider/> */}
    <Outlet />
  </>
);

const ProtectedRoute = ({ children }) => {
  const { user, getToken } = useAuth();
  if (!getToken() || !user) return <Navigate to="/login" replace />;
  return children;
};

function App() {
  const { user } = useAuth();

  return (
    <CartProvider>
      <WishlistProvider>
        <Routes>

          {/* ── Pages WITH Navbar ──────────────────────────────────── */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />

            <Route path="/search" element={<SearchPage />} />   {/* 👈 add this */}

            {/* Uncomment as you build: */}
            {/* <Route path="/products" element={<Products />} /> */}
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              }
            />

            {/* Protected pages also get Navbar */}
            <Route path="/orders"  element={<ProtectedRoute><Orders /></ProtectedRoute>} />
            {/* <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} /> */}
          </Route>

          {/* ── Auth pages — NO Navbar ─────────────────────────────── */}
          <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
          <Route path="/register" element={user ? <Navigate to="/" replace /> : <Register />} />
          {/* reset and forget password routes */}
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* ── Admin — fully self-contained ───────────────────────── */}
          <Route path="/admin/*" element={<AdminApp />} />

          {/* ── 404 ────────────────────────────────────────────────── */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </WishlistProvider>
    </CartProvider>
  );
}

export default App;