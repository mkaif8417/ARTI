import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { getImageUrl } from '../api/api';
import { useAuth } from '../context/AuthContext';
import OrderActions from '../components/OrderActions';

const C = {
  bg:        '#102B2A',
  bgCard:    '#0e2726',
  gold:      '#C9A581',
  cream:     '#F5EDD8',
  creamMid:  'rgba(245,237,216,0.55)',
  line:      'rgba(201,165,129,0.15)',
};

const STATUS_STYLES = {
  pending:            { color: '#E0B34D', label: 'Pending' },
  processing:         { color: '#4DA6E0', label: 'Order Confirmed' },
  shipped:            { color: '#9B7FE0', label: 'Shipped' },
  delivered:          { color: '#4DD68C', label: 'Delivered' },
  cancelled:          { color: '#E05C5C', label: 'Cancelled' },
  return_requested:   { color: '#E08A3D', label: 'Return Requested' },
  exchange_requested: { color: '#3DC5E0', label: 'Exchange Requested' },
};

// Ordered steps for the progress tracker (cancelled/return/exchange shown separately)
const TRACK_STEPS = ['pending', 'processing', 'shipped', 'delivered'];

const StatusBadge = ({ status }) => {
  const s = STATUS_STYLES[status] || STATUS_STYLES.pending;
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '4px 12px',
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 600,
        letterSpacing: '0.03em',
        color: s.color,
        background: `${s.color}1A`,
        border: `1px solid ${s.color}40`,
        textTransform: 'capitalize',
      }}
    >
      {s.label}
    </span>
  );
};

const OrderTracker = ({ status }) => {
  if (status === 'cancelled') {
    return (
      <div style={{ fontSize: 13, color: STATUS_STYLES.cancelled.color, marginTop: 12 }}>
        This order was cancelled.
      </div>
    );
  }

  if (status === 'return_requested' || status === 'exchange_requested') {
    const s = STATUS_STYLES[status];
    return (
      <div style={{ fontSize: 13, color: s.color, marginTop: 12 }}>
        {status === 'return_requested'
          ? 'Your return request is being reviewed.'
          : 'Your exchange request is being reviewed.'}
      </div>
    );
  }

  const currentIndex = TRACK_STEPS.indexOf(status);
  const progressPercent = TRACK_STEPS.length > 1 ? (currentIndex / (TRACK_STEPS.length - 1)) * 100 : 0;

  return (
    <div style={{ position: 'relative', marginTop: 24, marginBottom: 4, padding: '0 6px' }}>
      {/* keyframes for the pulse + shimmer */}
      <style>{`
        @keyframes trackerPulse {
          0%   { box-shadow: 0 0 0 0 ${C.gold}80; }
          70%  { box-shadow: 0 0 0 8px ${C.gold}00; }
          100% { box-shadow: 0 0 0 0 ${C.gold}00; }
        }
        @keyframes trackerShimmer {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
      `}</style>

      {/* base line */}
      <div
        style={{
          position: 'absolute',
          top: 6,
          left: 6,
          right: 6,
          height: 2,
          background: C.line,
          zIndex: 0,
        }}
      />

      {/* gold progress line */}
      <div
        style={{
          position: 'absolute',
          top: 6,
          left: 6,
          height: 2,
          width: `calc(${progressPercent}% * (100% - 12px) / 100%)`,
          background: C.gold,
          zIndex: 1,
          overflow: 'hidden',
          transition: 'width 0.3s',
        }}
      >
        {/* shimmer only shows if not yet delivered (order still "moving") */}
        {status !== 'delivered' && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '30%',
              height: '100%',
              background: `linear-gradient(90deg, transparent, ${C.cream}CC, transparent)`,
              animation: 'trackerShimmer 1.8s ease-in-out infinite',
            }}
          />
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', zIndex: 2 }}>
        {TRACK_STEPS.map((step, i) => {
          const reached = i <= currentIndex;
          const isCurrent = i === currentIndex;
          return (
            <div key={step} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: '0 1 auto' }}>
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  background: reached ? C.gold : C.bgCard,
                  border: `2px solid ${reached ? C.gold : C.line}`,
                  transition: 'background 0.3s, border-color 0.3s',
                  animation: isCurrent ? 'trackerPulse 1.6s infinite' : 'none',
                }}
              />
              <span
                style={{
                  marginTop: 6,
                  fontSize: 10,
                  letterSpacing: '0.02em',
                  textAlign: 'center',
                  color: reached ? C.cream : C.creamMid,
                  whiteSpace: 'nowrap',
                  fontWeight: isCurrent ? 700 : 400,
                }}
              >
                {STATUS_STYLES[step].label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const OrderCard = ({ order, onUpdated }) => {
  const [expanded, setExpanded] = useState(false);
  const itemCount = order.orderItems.reduce((sum, it) => sum + it.quantity, 0);

  return (
    <div
      style={{
        background: C.bgCard,
        border: `1px solid ${C.line}`,
        borderRadius: 4,
        marginBottom: 20,
        overflow: 'hidden',
      }}
    >
      {/* Header row */}
      <div
        onClick={() => setExpanded((e) => !e)}
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 16,
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '18px 24px',
          cursor: 'pointer',
        }}
      >
        <div>
          <div style={{ fontSize: 11, color: C.creamMid, letterSpacing: '0.05em', marginBottom: 4 }}>
            ORDER #{order._id.slice(-8).toUpperCase()}
          </div>
          <div style={{ fontSize: 13, color: C.cream }}>
            {new Date(order.createdAt).toLocaleDateString('en-IN', {
              day: 'numeric', month: 'short', year: 'numeric',
            })}
            {' · '}{itemCount} item{itemCount > 1 ? 's' : ''}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <span
            style={{
              fontSize: 12,
              fontWeight: 600,
              padding: '4px 10px',
              borderRadius: 999,
              color: order.isPaid ? '#4DD68C' : '#E05C5C',
              background: order.isPaid ? '#4DD68C1A' : '#E05C5C1A',
              border: `1px solid ${order.isPaid ? '#4DD68C40' : '#E05C5C40'}`,
            }}
          >
            {order.isPaid ? 'Paid' : 'Unpaid'}
          </span>

          <StatusBadge status={order.status} />

          <span style={{ fontSize: 15, fontWeight: 600, color: C.gold, minWidth: 80, textAlign: 'right' }}>
            ₹{order.totalPrice}
          </span>

          <svg
            width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.creamMid} strokeWidth="1.5"
            style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
          >
            <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div style={{ padding: '0 24px 24px', borderTop: `1px solid ${C.line}` }}>
          <OrderTracker status={order.status} />

          <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
            {order.orderItems.map((item) => (
              <div key={item._id || item.product} style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                <div
                  style={{
                    width: 52, height: 52, borderRadius: 3, overflow: 'hidden',
                    background: '#0a1c1b', flexShrink: 0,
                    border: `1px solid ${C.line}`,
                  }}
                >
                  {item.image && (
                    <img
                      src={getImageUrl(item.image)}
                      alt={item.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13.5, color: C.cream }}>{item.name}</div>
                  <div style={{ fontSize: 12, color: C.creamMid, marginTop: 2 }}>
                    Qty {item.quantity} × ₹{item.price}
                  </div>
                </div>
                <div style={{ fontSize: 13, color: C.cream }}>
                  ₹{item.quantity * item.price}
                </div>
              </div>
            ))}
          </div>

          {order.shippingAddress && (
            <div style={{ marginTop: 20, paddingTop: 16, borderTop: `1px solid ${C.line}` }}>
              <div style={{ fontSize: 11, color: C.creamMid, letterSpacing: '0.05em', marginBottom: 6 }}>
                SHIPPING ADDRESS
              </div>
              <div style={{ fontSize: 13, color: C.cream, lineHeight: 1.6 }}>
                {order.shippingAddress.fullName}<br />
                {order.shippingAddress.address}, {order.shippingAddress.city}<br />
                {order.shippingAddress.state ? `${order.shippingAddress.state}, ` : ''}
                {order.shippingAddress.country} - {order.shippingAddress.postalCode}<br />
                {order.shippingAddress.phone}
              </div>
            </div>
          )}

          <div style={{ marginTop: 20, paddingTop: 16, borderTop: `1px solid ${C.line}` }}>
            <OrderActions order={order} onUpdated={onUpdated} />
          </div>
        </div>
      )}
    </div>
  );
};

const Orders = () => {
  const { user, getToken } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchOrders = async () => {
    try {
      const { data } = await axiosInstance.get('/orders/myorders');
      // newest first
      const sorted = [...data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setOrders(sorted);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user && !getToken()) {
      setLoading(false);
      return;
    }
    fetchOrders();

    // Poll every 20s so status updates from admin panel reflect here
    const interval = setInterval(fetchOrders, 20000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const containerStyle = {
    minHeight: '70vh',
    background: C.bg,
    padding: '48px 24px 80px',
  };

  const innerStyle = {
    maxWidth: 820,
    margin: '0 auto',
  };

  // Not logged in
  if (!loading && !getToken()) {
    return (
      <div style={containerStyle}>
        <div style={{ ...innerStyle, textAlign: 'center', paddingTop: 60 }}>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", color: C.cream, fontSize: 28, marginBottom: 12 }}>
            My Orders
          </h1>
          <p style={{ color: C.creamMid, fontSize: 14, marginBottom: 28 }}>
            Please sign in to view your order history.
          </p>
          <Link
            to="/login"
            style={{
              display: 'inline-block',
              padding: '12px 32px',
              background: C.gold,
              color: C.bg,
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: '0.05em',
              borderRadius: 2,
              textDecoration: 'none',
            }}
          >
            SIGN IN
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={innerStyle}>
        <h1
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            color: C.cream,
            fontSize: 32,
            fontWeight: 600,
            marginBottom: 8,
          }}
        >
          My Orders
        </h1>
        <p style={{ color: C.creamMid, fontSize: 13.5, marginBottom: 36 }}>
          Track and review everything you've ordered from ARTI.
        </p>

        {loading && (
          <div style={{ color: C.creamMid, fontSize: 13.5, textAlign: 'center', padding: '60px 0' }}>
            Loading your orders…
          </div>
        )}

        {!loading && error && (
          <div style={{ color: '#E05C5C', fontSize: 13.5, textAlign: 'center', padding: '40px 0' }}>
            {error}
          </div>
        )}

        {!loading && !error && orders.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <p style={{ color: C.creamMid, fontSize: 14, marginBottom: 24 }}>
              You haven't placed any orders yet.
            </p>
            <Link
              to="/products"
              style={{
                display: 'inline-block',
                padding: '12px 32px',
                border: `1px solid ${C.gold}`,
                color: C.gold,
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: '0.05em',
                borderRadius: 2,
                textDecoration: 'none',
              }}
            >
              BROWSE COLLECTIONS
            </Link>
          </div>
        )}

        {!loading && !error && orders.length > 0 && (
          <div>
            {orders.map((order) => (
              <OrderCard key={order._id} order={order} onUpdated={fetchOrders} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;