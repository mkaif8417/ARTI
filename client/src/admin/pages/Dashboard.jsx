import { useEffect, useState } from 'react';
import { Package, ShoppingCart, IndianRupee, Clock } from 'lucide-react';
import { fetchProducts, fetchOrders } from '../../api/adminApi';

const StatCard = ({ icon: Icon, label, value }) => (
  <div className="bg-[var(--color-bg-card)] border border-[var(--color-line)] rounded-xl p-6 flex items-center gap-4">
    <div className="p-3 rounded-lg bg-[var(--color-gold)]/15">
      <Icon size={22} className="text-[var(--color-gold)]" />
    </div>
    <div>
      <p className="text-[var(--color-cream)]/50 text-sm">{label}</p>
      <p className="text-[var(--color-cream)] text-2xl font-bold mt-0.5">{value}</p>
    </div>
  </div>
);

const statusStyle = (status) => ({
  delivered: 'bg-emerald-500/15 text-emerald-400',
  shipped: 'bg-blue-500/15 text-blue-400',
  cancelled: 'bg-red-500/15 text-red-400',
}[status] || 'bg-[var(--color-gold)]/15 text-[var(--color-gold)]');

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchProducts().then(setProducts);
    fetchOrders().then(setOrders);
  }, []);

  const totalRevenue = orders
    .filter((o) => o.isPaid)
    .reduce((sum, o) => sum + o.totalPrice, 0);

  const pendingOrders = orders.filter((o) => o.status === 'pending').length;

  return (
    <div>
      <h2 className="text-2xl text-[var(--color-cream)] mb-6 [font-family:var(--font-display)]">
        Dashboard
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Package} label="Total Products" value={products.length} />
        <StatCard icon={ShoppingCart} label="Total Orders" value={orders.length} />
        <StatCard icon={IndianRupee} label="Revenue" value={`₹${totalRevenue.toLocaleString()}`} />
        <StatCard icon={Clock} label="Pending Orders" value={pendingOrders} />
      </div>

      {/* Recent Orders */}
      <div className="bg-[var(--color-bg-card)] border border-[var(--color-line)] rounded-xl p-6">
        <h3 className="text-[var(--color-cream)] font-semibold mb-4">Recent Orders</h3>
        {orders.length === 0 ? (
          <p className="text-[var(--color-cream)]/50 text-sm">No orders yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="text-[var(--color-cream)]/50 border-b border-[var(--color-line)]">
                  <th className="pb-3 pr-4">Order ID</th>
                  <th className="pb-3 pr-4">Total</th>
                  <th className="pb-3 pr-4">Status</th>
                  <th className="pb-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 5).map((order) => (
                  <tr key={order._id} className="border-b border-[var(--color-line)] text-[var(--color-cream)]/80">
                    <td className="py-3 pr-4 font-mono text-xs">{order._id.slice(-8)}</td>
                    <td className="py-3 pr-4">₹{order.totalPrice}</td>
                    <td className="py-3 pr-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyle(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 text-[var(--color-cream)]/50">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;