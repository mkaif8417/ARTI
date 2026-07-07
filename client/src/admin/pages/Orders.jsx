import { useEffect, useState } from 'react';
import { fetchOrders, updateOrderStatus } from '../../api/adminApi';
const STATUS_OPTIONS = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

// Display label shown to the admin — keeps the underlying value ('processing')
// unchanged so it still matches the Order.js status enum on the backend.
const STATUS_LABELS = {
  pending: 'Pending',
  processing: 'Order Confirmed',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    fetchOrders().then((data) => {
      setOrders(Array.isArray(data) ? data : []);
      setLoading(false);
    });
  };

  useEffect(() => { load(); }, []);

  const handleStatus = async (id, status) => {
    await updateOrderStatus(id, status);
    load();
  };

  const statusColor = (s) => ({
    delivered: 'bg-emerald-500/15 text-emerald-400',
    shipped: 'bg-blue-500/15 text-blue-400',
    cancelled: 'bg-red-500/15 text-red-400',
    processing: 'bg-violet-500/15 text-violet-400',
    pending: 'bg-[var(--color-gold)]/15 text-[var(--color-gold)]',
  }[s] || 'bg-[var(--color-cream)]/10 text-[var(--color-cream)]/60');

  return (
    <div>
      <h2 className="text-2xl text-[var(--color-cream)] mb-6 [font-family:var(--font-display)]">
        Orders
      </h2>

      {loading ? (
        <p className="text-[var(--color-cream)]/50 text-sm">Loading...</p>
      ) : orders.length === 0 ? (
        <div className="bg-[var(--color-bg-card)] border border-[var(--color-line)] rounded-xl p-12 text-center">
          <p className="text-[var(--color-cream)]/50">No orders yet.</p>
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
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
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
                  <td className="px-6 py-4">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatus(order._id, e.target.value)}
                      className={`text-xs font-medium px-2 py-1 rounded-lg border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)]/40 ${statusColor(order.status)} bg-transparent`}
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s} className="bg-[var(--color-bg-card)] text-[var(--color-cream)]">
                          {STATUS_LABELS[s]}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4 text-[var(--color-cream)]/50">
                    {new Date(order.createdAt).toLocaleDateString()}
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

export default Orders;