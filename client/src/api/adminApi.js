// src/api/adminApi.js
import axiosInstance from './axiosInstance';

export const fetchProducts = async () => {
  const res = await axiosInstance.get('/products');
  return res.data;
};

export const createProduct = async (formData) => {
  const res = await axiosInstance.post('/products', formData);
  return res.data;
};

export const deleteProduct = async (id) => {
  const res = await axiosInstance.delete(`/products/${id}`);
  return res.data;
};

export const fetchOrders = async () => {
  const res = await axiosInstance.get('/orders');
  return res.data;
};

export const updateOrderStatus = async (id, status) => {
  const res = await axiosInstance.put(`/orders/${id}/status`, { status });
  return res.data;
};

export const fetchCategories = async () => {
  const res = await axiosInstance.get('/categories');
  return res.data;
};

export const createCategory = async (name) => {
  const res = await axiosInstance.post('/categories', { name });
  return res.data;
};
export const deleteCategory = async (id) => {
  const res = await axiosInstance.delete(`/categories/${id}`);
  return res.data;
};
export const updateCategory = async (id, name) => {
  const res = await axiosInstance.put(`/categories/${id}`, { name });
  return res.data;
};
export const updateProduct = async (id, formData) => {
  const res = await axiosInstance.put(`/products/${id}`, formData);
  return res.data;
};

export const fetchProductById = async (id) => {
  const res = await axiosInstance.get(`/products/${id}`);
  return res.data;
};

// src/api/adminApi.js — add
export const resolveOrderRequest = async (id, decision, adminNote) => {
  const res = await axiosInstance.put(`/orders/${id}/resolve-request`, { decision, adminNote });
  return res.data;
};