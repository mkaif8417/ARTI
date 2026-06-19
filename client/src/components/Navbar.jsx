// src/components/Navbar.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const C = {
  bg:        '#102B2A',
  bgDrawer:  '#0e2726',
  gold:      '#C9A581',
  goldMuted: 'rgba(201,165,129,0.3)',
  cream:     '#F5EDD8',
  creamMid:  'rgba(245,237,216,0.55)',
  creamLow:  'rgba(245,237,216,0.28)',
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

const Navbar = () => {
  const { user, logout } = useAuth();
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
      <style>{`
        .arti-nav-link {
          font-size: 11px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(245,237,216,0.55);
          text-decoration: none;
          font-family: 'Inter', sans-serif;
          transition: color 0.2s;
        }
        .arti-nav-link:hover { color: #C9A581; }

        .arti-icon-btn {
          color: rgba(245,237,216,0.55);
          display: flex;
          align-items: center;
          text-decoration: none;
          transition: color 0.2s;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
        }
        .arti-icon-btn:hover { color: #C9A581; }

        .arti-signin-btn {
          font-size: 11px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #C9A581;
          text-decoration: none;
          border: 1px solid rgba(201,165,129,0.3);
          padding: 7px 16px;
          border-radius: 2px;
          font-family: 'Inter', sans-serif;
          transition: border-color 0.2s;
        }
        .arti-signin-btn:hover { border-color: #C9A581; }

        /* hide/show logic */
        .arti-desktop { display: flex; }
        .arti-hamburger { display: none !important; }

        @media (max-width: 768px) {
          .arti-desktop  { display: none !important; }
          .arti-hamburger { display: flex !important; }
        }

        /* drawer link hover */
        .arti-drawer-link {
          display: block;
          padding: 15px 0;
          font-family: 'Cormorant Garamond', serif;
          font-size: 24px;
          font-weight: 300;
          color: #F5EDD8;
          text-decoration: none;
          letter-spacing: 0.04em;
          border-bottom: 1px solid rgba(201,165,129,0.12);
          transition: color 0.2s;
        }
        .arti-drawer-link:hover { color: #C9A581; }
      `}</style>

      {/* ── Navbar ───────────────────────────────────────────────────────── */}
      <nav style={{
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
      }}>

        {/* LEFT — nav links (desktop) */}
        <ul className="arti-desktop" style={{ gap: 32, listStyle: 'none', margin: 0, padding: 0, alignItems: 'center' }}>
          {navLinks.map(({ label, to }) => (
            <li key={label}>
              <Link to={to} className="arti-nav-link">{label}</Link>
            </li>
          ))}
        </ul>

        {/* CENTRE — logo (always visible, perfectly centred) */}
        <Link to="/" style={{
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 26,
          fontWeight: 600,
          letterSpacing: '0.28em',
          color: C.gold,
          textDecoration: 'none',
          userSelect: 'none',
          whiteSpace: 'nowrap',
        }}>
          ARTI
        </Link>

        {/* RIGHT — icons + auth (desktop) / hamburger (mobile) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>

          {/* Desktop icons */}
          <Link to="/search"   className="arti-icon-btn arti-desktop" title="Search"><SearchIcon /></Link>
          <Link to="/wishlist" className="arti-icon-btn arti-desktop" title="Wishlist"><HeartIcon /></Link>
          <Link to="/cart"     className="arti-icon-btn arti-desktop" title="Cart"><BagIcon /></Link>

          {/* Desktop auth */}
          <div className="arti-desktop" style={{ alignItems: 'center', gap: 16 }}>
            {user ? (
              <>
                <Link to="/orders" className="arti-nav-link">Orders</Link>
                <button onClick={handleLogout} className="arti-icon-btn" style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: "'Inter', sans-serif", color: C.creamLow }}>
                  Sign out
                </button>
              </>
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
            <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
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

        {/* Drawer top bar */}
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

          {/* X button */}
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

        {/* Drawer links */}
        <nav style={{ flex: 1, overflowY: 'auto', paddingTop: 8 }}>
          {navLinks.map(({ label, to }) => (
            <Link key={label} to={to} onClick={close} className="arti-drawer-link">
              {label}
            </Link>
          ))}
        </nav>

        {/* Drawer icons row */}
        <div style={{
          display: 'flex',
          gap: 20,
          padding: '20px 0',
          borderTop: `1px solid ${C.line}`,
          borderBottom: `1px solid ${C.line}`,
          marginBottom: 20,
        }}>
          {[
            { to: '/search',  title: 'Search',   icon: <SearchIcon /> },
            { to: '/wishlist',title: 'Wishlist',  icon: <HeartIcon size={20} /> },
            { to: '/cart',    title: 'Cart',      icon: <BagIcon size={20} /> },
          ].map(({ to, title, icon }) => (
            <Link key={to} to={to} onClick={close} className="arti-icon-btn" title={title}
              style={{ color: C.creamMid, padding: '4px 0' }}>
              {icon}
            </Link>
          ))}
        </div>

        {/* Drawer auth */}
        {user ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Link to="/orders" onClick={close} className="arti-nav-link" style={{ fontSize: 11 }}>
              My orders
            </Link>
            <button onClick={handleLogout} className="arti-icon-btn" style={{
              fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase',
              fontFamily: "'Inter', sans-serif", color: C.creamLow, justifyContent: 'flex-start',
            }}>
              Sign out
            </button>
          </div>
        ) : (
          <Link to="/login" onClick={close} style={{
            display: 'block', textAlign: 'center',
            fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase',
            fontFamily: "'Inter', sans-serif",
            color: C.bg, background: C.gold,
            padding: '13px 0', borderRadius: 2,
            textDecoration: 'none',
            transition: 'opacity 0.2s',
          }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            Sign in
          </Link>
        )}
      </div>
    </>
  );
};

export default Navbar;
