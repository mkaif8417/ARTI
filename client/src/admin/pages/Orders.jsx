import { useEffect, useState } from 'react';
import { fetchOrders, updateOrderStatus } from '../../api/adminApi';
const STATUS_OPTIONS = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

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
    delivered: 'bg-emerald-500/20 text-emerald-400',
    shipped: 'bg-blue-500/20 text-blue-400',
    cancelled: 'bg-red-500/20 text-red-400',
    processing: 'bg-violet-500/20 text-violet-400',
    pending: 'bg-amber-500/20 text-amber-400',
  }[s] || 'bg-gray-500/20 text-gray-400');

  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-6">Orders</h2>

      {loading ? (
        <p className="text-gray-400 text-sm">Loading...</p>
      ) : orders.length === 0 ? (
        <div className="bg-gray-800 rounded-xl p-12 text-center">
          <p className="text-gray-400">No orders yet.</p>
        </div>
      ) : (
        <div className="bg-gray-800 rounded-xl overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="border-b border-gray-700">
              <tr className="text-gray-400">
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
                <tr key={order._id} className="border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-gray-400">{order._id.slice(-8)}</td>
                  <td className="px-6 py-4 text-white">{order.user?.name || '—'}</td>
                  <td className="px-6 py-4 text-white">₹{order.totalPrice}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${order.isPaid ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                      {order.isPaid ? 'Paid' : 'Unpaid'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatus(order._id, e.target.value)}
                      className={`text-xs font-medium px-2 py-1 rounded-lg border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 ${statusColor(order.status)} bg-transparent`}
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s} className="bg-gray-800 text-white">{s}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4 text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</td>
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