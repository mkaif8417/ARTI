// src/admin/AdminApp.jsx
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import AdminRoute from './components/AdminRoute';
import AdminLogin from './pages/AdminLogin';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import AddProduct from './pages/AddProduct';
import EditProduct from './pages/EditProduct';
import Orders from './pages/Orders';
import Categories from './pages/Categories';
import Users from './pages/Users';

const AdminLayout = () => (
  <div className="flex min-h-screen bg-gray-950">
    <Sidebar />
    <main className="flex-1 p-8 overflow-y-auto">
      <Outlet />
    </main>
  </div>
);

const AdminApp = () => (
  <Routes>
    <Route path="login" element={<AdminLogin />} />

    <Route element={<AdminRoute><AdminLayout /></AdminRoute>}>
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route path="dashboard"         element={<Dashboard />} />
      <Route path="products"          element={<Products />} />
      <Route path="products/add"      element={<AddProduct />} />
      <Route path="products/edit/:id" element={<EditProduct />} />
      <Route path="orders"            element={<Orders />} />
      <Route path="categories"        element={<Categories />} />
      <Route path="users"             element={<Users />} />
    </Route>

    <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
  </Routes>
);

export default AdminApp;