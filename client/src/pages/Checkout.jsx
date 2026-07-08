// src/pages/Checkout.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { getImageUrl } from '../api/api';
import axiosInstance from '../api/axiosInstance';

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

const inputStyle = {
  width: '100%',
  background: 'transparent',
  border: `1px solid ${C.line}`,
  borderRadius: 2,
  padding: '11px 14px',
  color: C.cream,
  fontFamily: "'Inter', sans-serif",
  fontSize: 14,
  outline: 'none',
  boxSizing: 'border-box',
};

const labelStyle = {
  display: 'block',
  fontSize: 11,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: C.creamMid,
  marginBottom: 6,
};

// Set VITE_MOCK_PAYMENT=false in your client .env once you have real
// Razorpay test keys. While it's on (or unset), payment is simulated
// locally so you can test the full checkout flow without a live gateway.
const MOCK_PAYMENT = import.meta.env.VITE_MOCK_PAYMENT !== 'false';
const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY_ID;

const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

// Responsive rules that plain inline styles can't express (media queries).
// Scoped with a unique wrapper class so it can't leak into the rest of the app.
const ResponsiveStyles = () => (
  <style>{`
    .checkout-page {
      max-width: 1000px;
      margin: 0 auto;
      padding: 48px 24px 96px;
      font-family: 'Inter', sans-serif;
      color: ${C.cream};
      display: grid;
      grid-template-columns: 1.3fr 1fr;
      gap: 48px;
      box-sizing: border-box;
    }

    .checkout-fields-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .checkout-summary-card {
      background: ${C.bgCard};
      border: 1px solid ${C.line};
      border-radius: 4px;
      padding: 24px;
      height: fit-content;
    }

    .checkout-title {
      font-family: 'Cormorant Garamond', serif;
      font-weight: 400;
      margin-bottom: 8px;
      font-size: 30px;
    }

    .checkout-place-btn {
      width: 100%;
      padding: 14px 0;
      background: ${C.gold};
      border: none;
      color: ${C.bg};
      font-size: 12px;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      font-weight: 700;
      border-radius: 2px;
    }

    @media (max-width: 860px) {
      .checkout-page {
        grid-template-columns: 1fr;
        gap: 36px;
        padding: 32px 20px 72px;
      }
      .checkout-summary-card {
        order: -1;
      }
    }

    @media (max-width: 480px) {
      .checkout-page {
        padding: 24px 16px 56px;
        gap: 28px;
      }
      .checkout-title {
        font-size: 24px;
      }
      .checkout-fields-row {
        grid-template-columns: 1fr;
        gap: 16px;
      }
      .checkout-summary-card {
        padding: 18px;
      }
      .checkout-place-btn {
        padding: 15px 0;
        font-size: 12.5px;
      }
    }
  `}</style>
);

const Checkout = () => {
  const { items, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const isFormValid =
    form.fullName.trim() &&
    form.phone.trim() &&
    form.address.trim() &&
    form.city.trim() &&
    form.state.trim() &&
    form.postalCode.trim() &&
    form.country.trim();

  const shippingPrice = 0; // flat/free for now — adjust if you add shipping tiers
  const totalPrice = cartTotal + shippingPrice;

  // Returns a paymentResult object on success, or null on failure/cancel.
  const handleRazorpayPayment = async (amount) => {
    if (MOCK_PAYMENT) {
      // Dev-only simulated payment — no network call to Razorpay at all.
      await new Promise((r) => setTimeout(r, 600));
      return {
        orderId: `mock_order_${Date.now()}`,
        paymentId: `mock_pay_${Date.now()}`,
        signature: 'mock_signature',
        status: 'success',
      };
    }

    try {
      const { data: order } = await axiosInstance.post('/payments/create-order', {
        amount,
      });

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        setError('Could not load payment gateway. Check your connection.');
        return null;
      }

      return await new Promise((resolve) => {
        const rzp = new window.Razorpay({
          key: RAZORPAY_KEY,
          amount: order.amount,
          currency: order.currency,
          order_id: order.id,
          name: 'ARTI',
          description: 'Order Payment',
          theme: { color: C.gold },
          modal: {
            ondismiss: () => resolve(null),
          },
          handler: async (response) => {
            try {
              const { data: verifyRes } = await axiosInstance.post('/payments/verify', {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              });
              if (verifyRes.verified) {
                resolve({
                  orderId: response.razorpay_order_id,
                  paymentId: response.razorpay_payment_id,
                  signature: response.razorpay_signature,
                  status: 'success',
                });
              } else {
                setError('Payment verification failed.');
                resolve(null);
              }
            } catch {
              setError('Payment verification failed.');
              resolve(null);
            }
          },
        });
        rzp.open();
      });
    } catch (err) {
      setError('Could not initiate payment.');
      return null;
    }
  };

  const handlePlaceOrder = async () => {
    if (!isFormValid) {
      setError('Please fill in all required shipping fields.');
      return;
    }
    setError(null);
    setPlacing(true);

    try {
      let paymentResult = null;

      if (paymentMethod === 'razorpay') {
        paymentResult = await handleRazorpayPayment(totalPrice);
        if (!paymentResult) {
          setPlacing(false);
          return; // payment failed or was cancelled — don't create the order
        }
      }

      const orderItems = items.map((item) => ({
        product: item._id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        image: item.image,
      }));

      const shippingAddress = {
        fullName: form.fullName,
        address: form.address,
        city: form.city,
        postalCode: form.postalCode,
        state: form.state,
        country: form.country,
        phone: form.phone,
      };

      const payload = {
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice: cartTotal,
        shippingPrice,
        totalPrice,
        // Note: your current createOrder controller doesn't read this field yet,
        // so paymentResult/isPaid won't actually be saved until the controller
        // is updated to accept it. Safe to send either way — extra fields are ignored.
        paymentResult,
      };

      await axiosInstance.post('/orders', payload);

      clearCart();
      navigate('/orders');
    } catch (err) {
      setError('Could not place your order. Please try again.');
    } finally {
      setPlacing(false);
    }
  };

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
        textAlign: 'center',
      }}>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 300 }}>
          Your bag is empty
        </p>
        <Link
          to="/products"
          style={{
            fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase',
            color: C.gold, border: `1px solid ${C.goldMuted}`, padding: '10px 24px',
            borderRadius: 2, textDecoration: 'none',
          }}
        >
          Browse Collections
        </Link>
      </section>
    );
  }

  return (
    <>
      <ResponsiveStyles />
      <section className="checkout-page">
        {/* ---------- Left: Shipping + Payment ---------- */}
        <div>
          <h1 className="checkout-title">Checkout</h1>

          {MOCK_PAYMENT && (
            <p style={{
              fontSize: 11.5,
              color: C.creamMid,
              border: `1px dashed ${C.goldMuted}`,
              padding: '8px 12px',
              borderRadius: 2,
              marginBottom: 24,
            }}>
              Dev mode: online payments are simulated (no real Razorpay call).
            </p>
          )}

          <p style={{ ...labelStyle, marginBottom: 14, fontSize: 12, marginTop: MOCK_PAYMENT ? 0 : 20 }}>
            Shipping Details
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 32 }}>
            <div>
              <label style={labelStyle}>Full Name *</label>
              <input style={inputStyle} name="fullName" value={form.fullName} onChange={handleChange} />
            </div>
            <div>
              <label style={labelStyle}>Phone Number *</label>
              <input style={inputStyle} name="phone" value={form.phone} onChange={handleChange} />
            </div>
            <div>
              <label style={labelStyle}>Address *</label>
              <input style={inputStyle} name="address" value={form.address} onChange={handleChange} />
            </div>
            <div className="checkout-fields-row">
              <div>
                <label style={labelStyle}>City *</label>
                <input style={inputStyle} name="city" value={form.city} onChange={handleChange} />
              </div>
              <div>
                <label style={labelStyle}>State *</label>
                <input style={inputStyle} name="state" value={form.state} onChange={handleChange} />
              </div>
            </div>
            <div className="checkout-fields-row">
              <div>
                <label style={labelStyle}>Postal Code *</label>
                <input style={inputStyle} name="postalCode" value={form.postalCode} onChange={handleChange} />
              </div>
              <div>
                <label style={labelStyle}>Country *</label>
                <input style={inputStyle} name="country" value={form.country} onChange={handleChange} />
              </div>
            </div>
          </div>

          <p style={{ ...labelStyle, marginBottom: 14, fontSize: 12 }}>Payment Method</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
            {[
              { value: 'cod', label: 'Cash on Delivery' },
              { value: 'razorpay', label: 'Pay Online (Razorpay)' },
            ].map((option) => (
              <label
                key={option.value}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  border: `1px solid ${paymentMethod === option.value ? C.gold : C.line}`,
                  borderRadius: 2,
                  padding: '12px 16px',
                  cursor: 'pointer',
                }}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value={option.value}
                  checked={paymentMethod === option.value}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span style={{ fontSize: 14 }}>{option.label}</span>
              </label>
            ))}
          </div>

          {error && (
            <p style={{ color: '#e07a7a', fontSize: 13, marginBottom: 12 }}>{error}</p>
          )}

          <button
            type="button"
            onClick={handlePlaceOrder}
            disabled={placing}
            className="checkout-place-btn"
            style={{
              cursor: placing ? 'not-allowed' : 'pointer',
              opacity: placing ? 0.6 : 1,
            }}
          >
            {placing ? 'Placing Order...' : 'Place Order'}
          </button>
        </div>

        {/* ---------- Right: Order summary ---------- */}
        <div className="checkout-summary-card">
          <p style={{ ...labelStyle, marginBottom: 18, fontSize: 12 }}>Order Summary</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 20 }}>
            {items.map((item) => (
              <div
                key={`${item._id}-${item.size || 'none'}`}
                style={{ display: 'flex', gap: 12 }}
              >
                <div style={{
                  width: 56, height: 56, borderRadius: 4, flexShrink: 0,
                  backgroundColor: C.bg,
                  backgroundImage: item.image ? `url(${getImageUrl(item.image)})` : 'none',
                  backgroundSize: 'cover', backgroundPosition: 'center',
                }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{
                    fontSize: 13.5, color: C.cream,
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {item.name}
                  </p>
                  {item.size && (
                    <p style={{ fontSize: 11, color: C.creamMid }}>Size: {item.size}</p>
                  )}
                  <p style={{ fontSize: 11, color: C.creamMid }}>Qty: {item.quantity}</p>
                </div>
                <p style={{ fontSize: 13, color: C.gold, fontWeight: 600, whiteSpace: 'nowrap' }}>
                  ₹{(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          <div style={{ borderTop: `1px solid ${C.line}`, paddingTop: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: C.creamMid }}>
              <span>Subtotal</span>
              <span>₹{cartTotal.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: C.creamMid }}>
              <span>Shipping</span>
              <span>{shippingPrice === 0 ? 'Free' : `₹${shippingPrice.toFixed(2)}`}</span>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              paddingTop: 8,
              borderTop: `1px solid ${C.line}`,
            }}>
              <span style={{ fontSize: 12, color: C.creamMid, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Total
              </span>
              <span style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 24,
                fontWeight: 600,
                color: C.gold,
              }}>
                ₹{totalPrice.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Checkout;