// src/pages/Wishlist.jsx
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { getImageUrl } from '../api/api';

const C = {
  bg:        '#102B2A',
  bgCard:    '#0e2726',
  gold:      '#C9A581',
  goldMuted: 'rgba(201,165,129,0.3)',
  cream:     '#F5EDD8',
  creamMid:  'rgba(245,237,216,0.55)',
  creamLow:  'rgba(245,237,216,0.28)',
  line:      'rgba(201,165,129,0.15)',
};

const HeartIcon = ({ size = 15, filled = false }) => (
  <svg width={size} height={size} viewBox="0 0 24 24"
    fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);

const Wishlist = () => {
  const { items, toggleLike } = useWishlist();
  const { addToCart, isInCart } = useCart();

  if (items.length === 0) {
    return (
      <section style={{
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        padding: '80px 20px',
        color: C.cream,
        fontFamily: "'Inter', sans-serif",
      }}>
        <p style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 28,
          fontWeight: 300,
        }}>
          Your wishlist is empty
        </p>
        <p style={{ color: C.creamMid, fontSize: 14 }}>
          Tap the heart on anything you love, and it'll show up here.
        </p>
        <Link
          to="/products"
          style={{
            marginTop: 12,
            fontSize: 11,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: C.gold,
            border: `1px solid ${C.goldMuted}`,
            padding: '10px 24px',
            borderRadius: 2,
            textDecoration: 'none',
          }}
        >
          Browse Collections
        </Link>
      </section>
    );
  }

  return (
    <section style={{
      maxWidth: 1100,
      margin: '0 auto',
      padding: '48px 24px 96px',
      fontFamily: "'Inter', sans-serif",
      color: C.cream,
    }}>
      <h1 style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: 32,
        fontWeight: 400,
        letterSpacing: '0.04em',
        marginBottom: 32,
      }}>
        Your Wishlist
      </h1>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: 24,
      }}>
        {items.map((product) => {
          const alreadyInCart = isInCart(product._id, null);
          return (
            <div
              key={product._id}
              style={{
                position: 'relative',
                background: C.bgCard,
                border: `1px solid ${C.line}`,
                borderRadius: 4,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <button
                type="button"
                onClick={() => toggleLike(product)}
                aria-label="Remove from wishlist"
                style={{
                  position: 'absolute',
                  top: 10,
                  right: 10,
                  zIndex: 2,
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  border: 'none',
                  background: 'rgba(16,43,42,0.75)',
                  color: C.gold,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <HeartIcon filled />
              </button>

              <Link to={`/products/${product._id}`} style={{ textDecoration: 'none' }}>
                <div
                  style={{
                    width: '100%',
                    aspectRatio: '1 / 1',
                    backgroundColor: C.bg,
                    backgroundImage: product.image
                      ? `url(${getImageUrl(product.image)})`
                      : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                />
                <div style={{ padding: '14px 16px 4px' }}>
                  <p style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 18,
                    fontWeight: 500,
                    color: C.cream,
                    marginBottom: 4,
                  }}>
                    {product.name}
                  </p>
                  {product.price != null && (
                    <p style={{ fontSize: 14, color: C.gold, fontWeight: 600 }}>
                      ₹{product.price}
                    </p>
                  )}
                </div>
              </Link>

              <div style={{ padding: '10px 16px 16px' }}>
                <button
                  type="button"
                  disabled={alreadyInCart}
                  onClick={() => addToCart(product, { size: null, quantity: 1 })}
                  style={{
                    width: '100%',
                    padding: '10px 0',
                    background: alreadyInCart ? 'transparent' : C.gold,
                    border: alreadyInCart ? `1px solid ${C.line}` : 'none',
                    color: alreadyInCart ? C.creamLow : C.bg,
                    fontSize: 11,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    fontWeight: 700,
                    borderRadius: 2,
                    cursor: alreadyInCart ? 'default' : 'pointer',
                  }}
                >
                  {alreadyInCart ? 'In Bag' : 'Add to Bag'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Wishlist;