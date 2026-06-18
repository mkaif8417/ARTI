import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import AdminRoute from './components/AdminRoute';
import AdminLogin from './pages/AdminLogin';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import AddProduct from './pages/AddProduct';
import Orders from './pages/Orders';
import Categories from './pages/Categories';

const AdminLayout = ({ children }) => (
  <div className="flex min-h-screen bg-gray-950">
    <Sidebar />
    <main className="flex-1 p-8 overflow-y-auto">{children}</main>
  </div>
);

const AdminApp = () => (
  <Routes>
    <Route path="login" element={<AdminLogin />} />
    <Route path="dashboard" element={<AdminRoute><AdminLayout><Dashboard /></AdminLayout></AdminRoute>} />
    <Route path="products" element={<AdminRoute><AdminLayout><Products /></AdminLayout></AdminRoute>} />
    <Route path="products/add" element={<AdminRoute><AdminLayout><AddProduct /></AdminLayout></AdminRoute>} />
    <Route path="orders" element={<AdminRoute><AdminLayout><Orders /></AdminLayout></AdminRoute>} />
    <Route path="categories" element={<AdminRoute><AdminLayout><Categories /></AdminLayout></AdminRoute>} />
    <Route path="*" element={<Navigate to="dashboard" replace />} />
  </Routes>
);

export default AdminApp;