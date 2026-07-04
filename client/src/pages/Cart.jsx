// src/pages/Cart.jsx
import { Link, useNavigate } from 'react-router-dom';
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

const Cart = () => {
  const { items, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();

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
          color: C.cream,
        }}>
          Your bag is empty
        </p>
        <p style={{ color: C.creamMid, fontSize: 14 }}>
          Explore the collection and add something you love.
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
      maxWidth: 960,
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
        Your Bag
      </h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {items.map((item) => (
          <div
            key={`${item._id}-${item.size || 'none'}`}
            style={{
              display: 'flex',
              gap: 20,
              padding: '20px 0',
              borderBottom: `1px solid ${C.line}`,
            }}
          >
            <div
              style={{
                width: 96,
                height: 96,
                borderRadius: 4,
                backgroundColor: C.bgCard,
                backgroundImage: item.image
                  ? `url(${getImageUrl(item.image)})`
                  : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                flexShrink: 0,
              }}
            />

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <p style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 19,
                fontWeight: 500,
                color: C.cream,
              }}>
                {item.name}
              </p>

              {item.size && (
                <p style={{ fontSize: 12, color: C.creamMid }}>
                  Size: {item.size}
                </p>
              )}

              <p style={{ fontSize: 14, color: C.gold, fontWeight: 600 }}>
                ₹{item.price}
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 4 }}>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 10,
                  border: `1px solid ${C.line}`,
                  borderRadius: 2,
                  padding: '4px 12px',
                }}>
                  <button
                    type="button"
                    onClick={() =>
                      updateQuantity(item._id, item.size, item.quantity - 1)
                    }
                    disabled={item.quantity <= 1}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: C.creamMid,
                      cursor: item.quantity <= 1 ? 'not-allowed' : 'pointer',
                      fontSize: 15,
                      opacity: item.quantity <= 1 ? 0.3 : 1,
                    }}
                  >
                    −
                  </button>
                  <span style={{ fontSize: 13, minWidth: 16, textAlign: 'center' }}>
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      updateQuantity(item._id, item.size, item.quantity + 1)
                    }
                    style={{
                      background: 'none',
                      border: 'none',
                      color: C.creamMid,
                      cursor: 'pointer',
                      fontSize: 15,
                    }}
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => removeFromCart(item._id, item.size)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: C.creamLow,
                    fontSize: 11,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    textDecoration: 'underline',
                  }}
                >
                  Remove
                </button>
              </div>
            </div>

            <p style={{
              fontSize: 15,
              fontWeight: 600,
              color: C.cream,
              whiteSpace: 'nowrap',
            }}>
              ₹{(item.price * item.quantity).toFixed(2)}
            </p>
          </div>
        ))}
      </div>

      <div style={{
        marginTop: 32,
        display: 'flex',
        justifyContent: 'flex-end',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: 12,
      }}>
        <div style={{ display: 'flex', gap: 40, alignItems: 'baseline' }}>
          <span style={{ fontSize: 13, color: C.creamMid, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Total
          </span>
          <span style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 26,
            fontWeight: 600,
            color: C.gold,
          }}>
            ₹{cartTotal.toFixed(2)}
          </span>
        </div>

        <div style={{ display: 'flex', gap: 16 }}>
          <button
            type="button"
            onClick={clearCart}
            style={{
              background: 'none',
              border: `1px solid ${C.line}`,
              color: C.creamLow,
              padding: '12px 20px',
              borderRadius: 2,
              fontSize: 11,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              cursor: 'pointer',
            }}
          >
            Clear Bag
          </button>
          <button
            type="button"
            onClick={() => navigate('/checkout')}
            style={{
              background: C.gold,
              border: 'none',
              color: C.bg,
              padding: '12px 32px',
              borderRadius: 2,
              fontSize: 11,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Checkout
          </button>
        </div>
      </div>
    </section>
  );
};

export default Cart;