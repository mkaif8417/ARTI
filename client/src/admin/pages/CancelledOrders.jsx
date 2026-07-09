import { useEffect, useState } from 'react';
import { fetchOrders } from '../../api/adminApi';

const CancelledOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    fetchOrders().then((data) => {
      const all = Array.isArray(data) ? data : [];
      setOrders(all.filter((o) => o.status === 'cancelled'));
      setLoading(false);
    });
  };

  useEffect(() => { load(); }, []);

  return (
    <div>
      <h2 className="text-2xl text-[var(--color-cream)] mb-6 [font-family:var(--font-display)]">
        Cancelled Orders
      </h2>

      {loading ? (
        <p className="text-[var(--color-cream)]/50 text-sm">Loading...</p>
      ) : orders.length === 0 ? (
        <div className="bg-[var(--color-bg-card)] border border-[var(--color-line)] rounded-xl p-12 text-center">
          <p className="text-[var(--color-cream)]/50">No cancelled orders.</p>
        </div>
      ) : (
        <div className="bg-[var(--color-bg-card)] border border-[var(--color-line)] rounded-xl overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="border-b border-[var(--color-line)]">
              <tr className="text-[var(--color-cream)]/50">
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Payment</th>
                <th className="px-6 py-4">Reason</th>
                <th className="px-6 py-4">Cancelled On</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order._id}
                  className="border-b border-[var(--color-line)] hover:bg-[var(--color-gold)]/5 transition-colors"
                >
                  <td className="px-6 py-4 font-mono text-xs text-[var(--color-cream)]/50">
                    {order._id.slice(-8)}
                  </td>
                  <td className="px-6 py-4 text-[var(--color-cream)]">{order.user?.name || '—'}</td>
                  <td className="px-6 py-4 text-[var(--color-cream)]">₹{order.totalPrice}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        order.isPaid
                          ? 'bg-emerald-500/15 text-emerald-400'
                          : 'bg-red-500/15 text-red-400'
                      }`}
                    >
                      {order.isPaid ? 'Paid' : 'Unpaid'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[var(--color-cream)]/70 max-w-[220px] truncate" title={order.request?.reason}>
                    {order.request?.reason || '—'}
                  </td>
                  <td className="px-6 py-4 text-[var(--color-cream)]/50">
                    {order.request?.resolvedAt
                      ? new Date(order.request.resolvedAt).toLocaleDateString()
                      : new Date(order.updatedAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CancelledOrders;