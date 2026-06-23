// src/pages/Home.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchProducts, fetchCategories, getImageUrl } from '../api/api';
import HeroCarousel from '../components/HeroCarousel';
import '../styles/home.css';
import Divider from '../components/Divider';


// Fallback colors cycled through when rendering cards (since DB products don't have a "bg" field)
const FALLBACK_COLORS = ['#1B3D35', '#1E2E26', '#2E1E1A', '#1A2030', '#251828'];

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const [productsData, categoriesData] = await Promise.all([
          fetchProducts(),
          fetchCategories(),
        ]);
        setProducts(Array.isArray(productsData) ? productsData : []);
        setCategories(Array.isArray(categoriesData) ? categoriesData : []);
      } catch (err) {
        setError('Could not load products right now. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Bestsellers: next 4 products (just an example split — adjust as you like)
  const bestsellers = products.slice(0, 4);

  if (loading) {
    return (
      <div style={{ background: '#102B2A', minHeight: '100vh', color: '#F5EDD8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ background: '#102B2A', minHeight: '100vh', color: '#F5EDD8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div style={{ background: '#102B2A', minHeight: '100vh', color: '#F5EDD8', fontFamily: "'Inter', sans-serif" }}>

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <HeroCarousel products={products} />
    <Divider/>

      {/* ── TRUST STRIP ───────────────────────────────────────────────────── */}
      <div className="trust-strip">
        {['Free shipping above ₹2,000', 'Handcrafted by artisans', 'Easy 7-day returns', 'COD available'].map((text, i, arr) => (
          <span key={text} className="trust-item">
            <span className="trust-text">{text}</span>
            {i < arr.length - 1 && <span className="trust-dot" />}
          </span>
        ))}
      </div>

      {/* ── CATEGORIES ────────────────────────────────────────────────────── */}
      <section className="home-section">
        <div className="section-head">
          <h2 className="section-title">Shop by craft</h2>
          <Link to="/products" className="section-link">All categories</Link>
        </div>
        {categories.length === 0 ? (
          <p className="trust-text">No categories added yet.</p>
        ) : (
          <div className="category-grid">
            {categories.map(({ _id, name }, i) => (
              <Link
                to={`/products?category=${_id}`}
                key={_id}
                className="category-card"
                style={{ background: FALLBACK_COLORS[i % FALLBACK_COLORS.length] }}
              >
                <p className="category-name">{name}</p>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* ── BESTSELLERS ───────────────────────────────────────────────────── */}
      <section className="home-section">
        <div className="section-head">
          <div>
            <p className="trust-text" style={{ marginBottom: 10 }}>Most loved</p>
            <h2 className="section-title">Bestsellers</h2>
          </div>
          <Link to="/products" className="section-link">View all</Link>
        </div>
        {bestsellers.length === 0 ? (
          <p className="trust-text">No products added yet.</p>
        ) : (
          <div className="bestseller-grid">
            {bestsellers.map((product, i) => {
              const imageUrl = getImageUrl(product.image);
              return (
                <Link to={`/products/${product._id}`} key={product._id} className="bestseller-card">
                  <div
                    className="bestseller-image"
                    style={{
                      background: imageUrl ? `url(${imageUrl}) center/cover no-repeat` : FALLBACK_COLORS[i % FALLBACK_COLORS.length],
                    }}
                  >
                    <div className="weave-overlay" style={{ opacity: 0.07 }} />
                  </div>
                  <div className="bestseller-info">
                    <p className="bestseller-cat">{product.category?.name || ''}</p>
                    <p className="bestseller-name">{product.name}</p>
                    <p className="bestseller-price">₹{product.price}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* ── CRAFT BANNER ──────────────────────────────────────────────────── */}
      <section className="craft-banner">
        <div>
          <p className="trust-text" style={{ marginBottom: 10 }}>Our promise</p>
          <h2 className="banner-title">Every piece tells the story of the hands that made it</h2>
          <p className="banner-text">
            We work directly with master artisans from Rajasthan, Varanasi, Lucknow, and beyond — preserving centuries-old craft while paying fair wages.
          </p>
        </div>
        <Link to="/story" className="banner-cta">Our story</Link>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────────────── */}
      <footer className="home-footer">
        <span className="footer-wordmark">ARTI — Handcrafted India</span>
        <span className="footer-copy">© 2025 All rights reserved</span>
      </footer>
    </div>
  );
};

export default Home;