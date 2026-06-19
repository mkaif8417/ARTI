// src/pages/Home.jsx
import { Link } from 'react-router-dom';
import '../styles/home.css';

// ─── Data ─────────────────────────────────────────────────────────────────────
const heroItems = [
  { tag: 'Featured',    name: 'Handloom Silk Kurta', price: 'From ₹4,200', bg: '#1B3D35', area: 'a' },
  { tag: 'Block Print', name: 'Indigo Dupatta',       price: '₹1,800',     bg: '#1E2E26', area: 'b' },
  { tag: 'Embroidery',  name: 'Chikankari Top',       price: '₹3,500',     bg: '#2E1E1A', area: 'c' },
  { tag: 'Weave',       name: 'Pashmina Stole',       price: '₹6,800',     bg: '#1A2030', area: 'd' },
  { tag: 'New',         name: 'Ikat Saree',           price: '₹8,200',     bg: '#251828', area: 'e' },
];

const bestsellers = [
  { cat: 'Kurta',  name: 'Ajrakh Print Shirt', price: '₹2,900',  bg: '#1E2E26', slug: 'ajrakh-print-shirt' },
  { cat: 'Saree',  name: 'Banarasi Silk',       price: '₹12,500', bg: '#2E1E1A', slug: 'banarasi-silk' },
  { cat: 'Stole',  name: 'Kalamkari Dupatta',   price: '₹1,600',  bg: '#1B3D35', slug: 'kalamkari-dupatta' },
  { cat: 'Jacket', name: 'Bandhani Jacket',     price: '₹5,400',  bg: '#251828', slug: 'bandhani-jacket' },
];

const categories = [
  { name: 'Kurtas & Shirts', count: '48 pieces', bg: '#1B3D35' },
  { name: 'Sarees',          count: '32 pieces', bg: '#2E1E1A' },
  { name: 'Dupattas',        count: '24 pieces', bg: '#1A2030' },
  { name: 'Stoles',          count: '18 pieces', bg: '#251828' },
];

// ─── Component ────────────────────────────────────────────────────────────────
const Home = () => {
  return (
    <div style={{ background: '#102B2A', minHeight: '100vh', color: '#F5EDD8', fontFamily: "'Inter', sans-serif" }}>

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="home-hero">
        <div className="hero-head">
          <div>
            <p className="trust-text" style={{ marginBottom: 10 }}>New Arrivals — Summer 2025</p>
            <h1 className="hero-title">
              Worn by hand,<br />
              <em>woven with soul</em>
            </h1>
          </div>
          <p className="hero-sub">
            Premium handcrafted textiles<br />made by artisans across India
          </p>
        </div>

        <div className="hero-grid">
          {heroItems.map(({ tag, name, price, bg, area }) => (
            <Link
              to="/products"
              key={name}
              className={`hero-card area-${area}`}
              style={{ background: bg }}
            >
              <div className="weave-overlay" />
              <p className="hero-card-tag">{tag}</p>
              <p className="hero-card-name">{name}</p>
              <p className="hero-card-price">{price}</p>
            </Link>
          ))}
        </div>
      </section>

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
        <div className="category-grid">
          {categories.map(({ name, count, bg }) => (
            <Link to="/products" key={name} className="category-card" style={{ background: bg }}>
              <p className="category-name">{name}</p>
              <p className="category-count">{count}</p>
            </Link>
          ))}
        </div>
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
        <div className="bestseller-grid">
          {bestsellers.map(({ cat, name, price, bg, slug }) => (
            <Link to={`/products/${slug}`} key={name} className="bestseller-card">
              <div className="bestseller-image" style={{ background: bg }}>
                <div className="weave-overlay" style={{ opacity: 0.07 }} />
              </div>
              <div className="bestseller-info">
                <p className="bestseller-cat">{cat}</p>
                <p className="bestseller-name">{name}</p>
                <p className="bestseller-price">{price}</p>
              </div>
            </Link>
          ))}
        </div>
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