const BASE_URL = 'http://localhost:5000/api';

const getToken = () => localStorage.getItem('adminToken');

const headers = () => ({
  Authorization: `Bearer ${getToken()}`,
});

export const adminLogin = async (email, password) => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
};

export const fetchProducts = async () => {
  const res = await fetch(`${BASE_URL}/products`, { headers: headers() });
  return res.json();
};

export const createProduct = async (formData) => {
  const res = await fetch(`${BASE_URL}/products`, {
    method: 'POST',
    headers: headers(),
    body: formData,
  });
  return res.json();
};

export const deleteProduct = async (id) => {
  const res = await fetch(`${BASE_URL}/products/${id}`, {
    method: 'DELETE',
    headers: headers(),
  });
  return res.json();
};

export const fetchOrders = async () => {
  const res = await fetch(`${BASE_URL}/orders`, { headers: headers() });
  return res.json();
};

export const updateOrderStatus = async (id, status) => {
  const res = await fetch(`${BASE_URL}/orders/${id}/status`, {
    method: 'PUT',
    headers: { ...headers(), 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  return res.json();
};

export const fetchCategories = async () => {
  const res = await fetch(`${BASE_URL}/categories`, { headers: headers() });
  return res.json();
};

export const createCategory = async (name) => {
  const res = await fetch(`${BASE_URL}/categories`, {
    method: 'POST',
    headers: { ...headers(), 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });
  return res.json();
};