import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import '../styles/Navbar.css';

const C = {
  bg:        '#102B2A',
  bgDrawer:  '#0e2726',
  gold:      '#C9A581',
  cream:     '#F5EDD8',
  creamMid:  'rgba(245,237,216,0.55)',
  line:      'rgba(201,165,129,0.15)',
};

const navLinks = [
  { label: 'Collections', to: '/products' },
  { label: 'Textiles',    to: '/products?category=textiles' },
  { label: 'Artisans',   to: '/artisans' },
  { label: 'Story',      to: '/story' },
];

const SearchIcon = () => (
  <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35" strokeLinecap="round"/>
  </svg>
);
const HeartIcon = ({ size = 17 }) => (
  <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);
const BagIcon = ({ size = 17 }) => (
  <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
    <line x1="3" y1="6" x2="21" y2="6"/>
    <path d="M16 10a4 4 0 0 1-8 0"/>
  </svg>
);
/* Clean delivery-truck icon — reads clearly even at 17-18px */
const DeliveryIcon = ({ size = 17 }) => (
  <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <rect x="1" y="7" width="12" height="9" rx="1" />
    <path d="M13 10h4l3 3v3h-7z" />
    <circle cx="6" cy="18.5" r="1.6" fill="currentColor" stroke="none" />
    <circle cx="17" cy="18.5" r="1.6" fill="currentColor" stroke="none" />
  </svg>
);

const CountBadge = ({ count }) => {
  if (!count) return null;
  return (
    <span
      style={{
        position: 'absolute',
        top: -6,
        right: -8,
        minWidth: 15,
        height: 15,
        padding: '0 4px',
        borderRadius: 999,
        background: C.gold,
        color: C.bg,
        fontFamily: "'Inter', sans-serif",
        fontSize: 9,
        fontWeight: 700,
        lineHeight: '15px',
        textAlign: 'center',
      }}
    >
      {count > 99 ? '99+' : count}
    </span>
  );
};

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setOpen(false);
  };

  const close = () => setOpen(false);

  return (
    <>
      {/* ── Navbar ───────────────────────────────────────────────────────── */}
      <nav
        className="arti-navbar"
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          background: C.bg,
          borderBottom: `1px solid ${C.line}`,
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 40px',
        }}
      >
        {/* LEFT — nav links (desktop only) */}
        <ul className="arti-desktop" style={{ gap: 32, listStyle: 'none', margin: 0, padding: 0, alignItems: 'center' }}>
          {navLinks.map(({ label, to }) => (
            <li key={label}>
              <Link to={to} className="arti-nav-link">{label}</Link>
            </li>
          ))}
        </ul>

        {/* LOGO — centered on desktop, left-aligned on mobile (see CSS) */}
        <Link to="/" className="arti-logo">
          ARTI
        </Link>

        {/* RIGHT — icons (always visible) + auth (desktop) + hamburger (mobile) */}
        <div className="arti-right-group" style={{ display: 'flex', alignItems: 'center', gap: 20 }}>

          <div className="arti-icons-row">
            <Link to="/search" className="arti-icon-btn" title="Search">
              <SearchIcon />
            </Link>
            <Link to="/wishlist" className="arti-icon-btn" title="Wishlist">
              <HeartIcon />
              <CountBadge count={wishlistCount} />
            </Link>
            <Link to="/cart" className="arti-icon-btn" title="Cart">
              <BagIcon />
              <CountBadge count={cartCount} />
            </Link>
           <Link to="/orders" className="arti-icon-btn arti-orders-btn" title="My Orders">
  <DeliveryIcon />
</Link>
          </div>

          {/* Desktop auth */}
          <div className="arti-desktop" style={{ alignItems: 'center', gap: 16 }}>
            {user ? (
              <button onClick={handleLogout} className="arti-signout-btn">
                Sign out
              </button>
            ) : (
              <Link to="/login" className="arti-signin-btn">Sign in</Link>
            )}
          </div>

          {/* Hamburger (mobile only) */}
          <button
            onClick={() => setOpen(true)}
            className="arti-icon-btn arti-hamburger"
            aria-label="Open menu"
            style={{ color: C.creamMid }}
          >
            <svg width="21" height="21" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <line x1="3" y1="7"  x2="21" y2="7"  strokeLinecap="round"/>
              <line x1="3" y1="12" x2="16" y2="12" strokeLinecap="round"/>
              <line x1="3" y1="17" x2="21" y2="17" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      </nav>

      {/* ── Mobile overlay ───────────────────────────────────────────────── */}
      <div
        onClick={close}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.6)',
          zIndex: 200,
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity 0.3s',
        }}
      />

      {/* ── Mobile drawer ─────────────────────────────────────────────────── */}
      <div style={{
        position: 'fixed',
        top: 0, right: 0,
        width: 300,
        height: '100dvh',
        background: C.bgDrawer,
        borderLeft: `1px solid ${C.line}`,
        zIndex: 300,
        display: 'flex',
        flexDirection: 'column',
        padding: '0 28px 32px',
        transform: open ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.32s cubic-bezier(0.4,0,0.2,1)',
      }}>

        <div style={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: `1px solid ${C.line}`,
          marginBottom: 8,
        }}>
          <span style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 20,
            fontWeight: 600,
            letterSpacing: '0.25em',
            color: C.gold,
          }}>ARTI</span>

          <button
            onClick={close}
            aria-label="Close menu"
            style={{
              width: 36, height: 36,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'none',
              border: `1px solid ${C.line}`,
              borderRadius: 2,
              cursor: 'pointer',
              color: C.creamMid,
              transition: 'border-color 0.2s, color 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = C.gold; e.currentTarget.style.color = C.gold; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = C.line; e.currentTarget.style.color = C.creamMid; }}
          >
            <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <line x1="18" y1="6" x2="6" y2="18" strokeLinecap="round"/>
              <line x1="6"  y1="6" x2="18" y2="18" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <nav style={{ flex: 1, overflowY: 'auto', paddingTop: 8 }}>
          {navLinks.map(({ label, to }) => (
            <Link key={label} to={to} onClick={close} className="arti-drawer-link">
              {label}
            </Link>
          ))}
        </nav>

        {user ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <button onClick={handleLogout} className="arti-signout-btn">
              Sign out
            </button>
          </div>
        ) : (
          <Link to="/login" onClick={close} className="arti-fill-btn">
            Sign in
          </Link>
        )}
      </div>
    </>
  );
};

export default Navbar;