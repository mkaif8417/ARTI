// src/pages/Home.jsx
import { Link } from 'react-router-dom';

// ─── Design tokens ────────────────────────────────────────────────────────────
const C = {
  bg:        '#102B2A',
  bgCard:    '#152F2E',
  gold:      '#C9A581',
  goldMuted: 'rgba(201,165,129,0.35)',
  cream:     '#F5EDD8',
  creamMid:  'rgba(245,237,216,0.55)',
  creamLow:  'rgba(245,237,216,0.3)',
  line:      'rgba(201,165,129,0.15)',
};

// ─── Reusable tiny components ────────────────────────────────────────────────
const Eyebrow = ({ children }) => (
  <p style={{
    fontSize: 10,
    letterSpacing: '0.3em',
    textTransform: 'uppercase',
    color: C.gold,
    marginBottom: 10,
    fontFamily: "'Inter', sans-serif",
  }}>
    {children}
  </p>
);

const Divider = () => (
  <div style={{ width: 40, height: 1, background: C.goldMuted, margin: '16px 0' }} />
);

// ─── Hero grid cards ──────────────────────────────────────────────────────────
const heroItems = [
  { tag: 'Featured',    name: 'Handloom Silk Kurta', price: 'From ₹4,200', bg: '#1B3D35', gridArea: 'a' },
  { tag: 'Block Print', name: 'Indigo Dupatta',       price: '₹1,800',     bg: '#1E2E26', gridArea: 'b' },
  { tag: 'Embroidery',  name: 'Chikankari Top',       price: '₹3,500',     bg: '#2E1E1A', gridArea: 'c' },
  { tag: 'Weave',       name: 'Pashmina Stole',       price: '₹6,800',     bg: '#1A2030', gridArea: 'd' },
  { tag: 'New',         name: 'Ikat Saree',           price: '₹8,200',     bg: '#251828', gridArea: 'e' },
];

const bestsellers = [
  { cat: 'Kurta',  name: 'Ajrakh Print Shirt',  price: '₹2,900', bg: '#1E2E26', slug: 'ajrakh-print-shirt' },
  { cat: 'Saree',  name: 'Banarasi Silk',        price: '₹12,500', bg: '#2E1E1A', slug: 'banarasi-silk' },
  { cat: 'Stole',  name: 'Kalamkari Dupatta',    price: '₹1,600', bg: '#1B3D35', slug: 'kalamkari-dupatta' },
  { cat: 'Jacket', name: 'Bandhani Jacket',       price: '₹5,400', bg: '#251828', slug: 'bandhani-jacket' },
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
    <div style={{ background: C.bg, minHeight: '100vh', color: C.cream, fontFamily: "'Inter', sans-serif" }}>

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section style={{ padding: '52px 40px 36px' }}>
        {/* Headline row */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          marginBottom: 32,
        }}>
          <div>
            <Eyebrow>New Arrivals — Summer 2025</Eyebrow>
            <h1 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 56,
              fontWeight: 300,
              lineHeight: 1.08,
              color: C.cream,
              margin: 0,
            }}>
              Worn by hand,<br />
              <em style={{ fontStyle: 'italic', color: C.gold }}>woven with soul</em>
            </h1>
          </div>
          <p style={{
            fontSize: 12,
            color: C.creamMid,
            maxWidth: 200,
            lineHeight: 1.8,
            textAlign: 'right',
            marginBottom: 6,
          }}>
            Premium handcrafted textiles<br />made by artisans across India
          </p>
        </div>

        {/* Product grid */}
        <div style={{
          display: 'grid',
          gridTemplateAreas: `"a b c" "a d e"`,
          gridTemplateColumns: '1.5fr 1fr 1fr',
          gridTemplateRows: '260px 200px',
          gap: 10,
        }}>
          {heroItems.map(({ tag, name, price, bg, gridArea }) => (
            <Link
              to="/products"
              key={name}
              style={{
                gridArea,
                background: bg,
                borderRadius: 4,
                border: `1px solid ${C.line}`,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                padding: 20,
                textDecoration: 'none',
                position: 'relative',
                overflow: 'hidden',
                transition: 'border-color 0.3s',
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = C.goldMuted}
              onMouseLeave={e => e.currentTarget.style.borderColor = C.line}
            >
              {/* Subtle weave texture overlay */}
              <div style={{
                position: 'absolute', inset: 0, opacity: 0.06,
                backgroundImage: `repeating-linear-gradient(45deg, ${C.gold} 0px, ${C.gold} 1px, transparent 1px, transparent 9px),
                  repeating-linear-gradient(-45deg, ${C.gold} 0px, ${C.gold} 1px, transparent 1px, transparent 9px)`,
              }} />
              <p style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.gold, marginBottom: 4 }}>{tag}</p>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, color: C.cream, marginBottom: 2 }}>{name}</p>
              <p style={{ fontSize: 11, color: C.creamLow }}>{price}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ── TRUST STRIP ───────────────────────────────────────────────────── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 28,
        padding: '14px 40px',
        borderTop: `1px solid ${C.line}`,
        borderBottom: `1px solid ${C.line}`,
      }}>
        {['Free shipping above ₹2,000', 'Handcrafted by artisans', 'Easy 7-day returns', 'COD available'].map((text, i, arr) => (
          <span key={text} style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
            <span style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.creamLow }}>{text}</span>
            {i < arr.length - 1 && <span style={{ width: 3, height: 3, borderRadius: '50%', background: C.goldMuted, display: 'inline-block' }} />}
          </span>
        ))}
      </div>

      {/* ── CATEGORIES ────────────────────────────────────────────────────── */}
      <section style={{ padding: '48px 40px 0' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 24 }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, fontWeight: 300, margin: 0 }}>
            Shop by craft
          </h2>
          <Link to="/products" style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.gold, textDecoration: 'none', borderBottom: `1px solid ${C.goldMuted}`, paddingBottom: 2 }}>
            All categories
          </Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
          {categories.map(({ name, count, bg }) => (
            <Link
              to="/products"
              key={name}
              style={{
                background: bg,
                border: `1px solid ${C.line}`,
                borderRadius: 4,
                padding: '28px 20px',
                textDecoration: 'none',
                transition: 'border-color 0.3s',
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = C.goldMuted}
              onMouseLeave={e => e.currentTarget.style.borderColor = C.line}
            >
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, color: C.cream, marginBottom: 6 }}>{name}</p>
              <p style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.creamLow }}>{count}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ── BESTSELLERS ───────────────────────────────────────────────────── */}
      <section style={{ padding: '48px 40px 0' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 24 }}>
          <div>
            <Eyebrow>Most loved</Eyebrow>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, fontWeight: 300, margin: 0 }}>Bestsellers</h2>
          </div>
          <Link to="/products" style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.gold, textDecoration: 'none', borderBottom: `1px solid ${C.goldMuted}`, paddingBottom: 2 }}>
            View all
          </Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
          {bestsellers.map(({ cat, name, price, bg, slug }) => (
            <Link
              to={`/products/${slug}`}
              key={name}
              style={{ textDecoration: 'none', border: `1px solid ${C.line}`, borderRadius: 4, overflow: 'hidden', transition: 'border-color 0.3s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = C.goldMuted}
              onMouseLeave={e => e.currentTarget.style.borderColor = C.line}
            >
              {/* Product image placeholder */}
              <div style={{
                height: 200,
                background: bg,
                position: 'relative',
                overflow: 'hidden',
              }}>
                <div style={{
                  position: 'absolute', inset: 0, opacity: 0.07,
                  backgroundImage: `repeating-linear-gradient(45deg, ${C.gold} 0px, ${C.gold} 1px, transparent 1px, transparent 9px),
                    repeating-linear-gradient(-45deg, ${C.gold} 0px, ${C.gold} 1px, transparent 1px, transparent 9px)`,
                }} />
              </div>
              <div style={{ padding: '14px 16px', borderTop: `1px solid ${C.line}`, background: C.bgCard }}>
                <p style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.gold, marginBottom: 5 }}>{cat}</p>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 17, color: C.cream, marginBottom: 6 }}>{name}</p>
                <p style={{ fontSize: 11, color: C.creamLow }}>{price}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── CRAFT BANNER ──────────────────────────────────────────────────── */}
      <section style={{
        margin: '52px 40px',
        padding: '48px 52px',
        border: `1px solid ${C.line}`,
        borderRadius: 4,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: '#152F2E',
      }}>
        <div>
          <Eyebrow>Our promise</Eyebrow>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 36, fontWeight: 300, margin: '0 0 12px', maxWidth: 420 }}>
            Every piece tells the story of the hands that made it
          </h2>
          <p style={{ fontSize: 13, color: C.creamMid, lineHeight: 1.8, maxWidth: 400 }}>
            We work directly with master artisans from Rajasthan, Varanasi, Lucknow, and beyond — preserving centuries-old craft while paying fair wages.
          </p>
        </div>
        <Link to="/story" style={{
          fontSize: 11,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: C.bg,
          background: C.gold,
          padding: '14px 28px',
          borderRadius: 2,
          textDecoration: 'none',
          whiteSpace: 'nowrap',
          flexShrink: 0,
          marginLeft: 40,
          transition: 'opacity 0.2s',
        }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
        >
          Our story
        </Link>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────────────── */}
      <footer style={{
        borderTop: `1px solid ${C.line}`,
        padding: '24px 40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 14, letterSpacing: '0.3em', color: 'rgba(201,165,129,0.4)' }}>
          ARTI — Handcrafted India
        </span>
        <span style={{ fontSize: 10, color: 'rgba(245,237,216,0.2)', letterSpacing: '0.1em' }}>
          © 2025 All rights reserved
        </span>
      </footer>
    </div>
  );
};

export default Home;