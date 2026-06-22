// Development
// const SERVER_URL = 'http://localhost:5000';

// Production (Vercel + Render)
const SERVER_URL = import.meta.env.VITE_API_URL;

const BASE_URL = `${SERVER_URL}/api`;

export { SERVER_URL };

export const fetchProducts = async () => {
  const res = await fetch(`${BASE_URL}/products`);
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
};

export const fetchProductById = async (id) => {
  const res = await fetch(`${BASE_URL}/products/${id}`);
  if (!res.ok) throw new Error('Failed to fetch product');
  return res.json();
};

export const fetchCategories = async () => {
  const res = await fetch(`${BASE_URL}/categories`);
  if (!res.ok) throw new Error('Failed to fetch categories');
  return res.json();
};

export const getImageUrl = (path) => {
  if (!path) return null;
  const cleanPath = path.replace(/\\/g, '/');
  return `${SERVER_URL}/${cleanPath}`;
};