import { useEffect, useState } from 'react';
import { Package, ShoppingCart, IndianRupee, Clock } from 'lucide-react';
import { fetchProducts, fetchOrders } from '../../api/adminApi';
const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="bg-gray-800 rounded-xl p-6 flex items-center gap-4">
    <div className={`p-3 rounded-lg ${color}`}>
      <Icon size={22} className="text-white" />
    </div>
    <div>
      <p className="text-gray-400 text-sm">{label}</p>
      <p className="text-white text-2xl font-bold mt-0.5">{value}</p>
    </div>
  </div>
);

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
      <h2 className="text-xl font-bold text-white mb-6">Dashboard</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Package} label="Total Products" value={products.length} color="bg-indigo-600" />
        <StatCard icon={ShoppingCart} label="Total Orders" value={orders.length} color="bg-emerald-600" />
        <StatCard icon={IndianRupee} label="Revenue" value={`₹${totalRevenue.toLocaleString()}`} color="bg-violet-600" />
        <StatCard icon={Clock} label="Pending Orders" value={pendingOrders} color="bg-amber-600" />
      </div>

      {/* Recent Orders */}
      <div className="bg-gray-800 rounded-xl p-6">
        <h3 className="text-white font-semibold mb-4">Recent Orders</h3>
        {orders.length === 0 ? (
          <p className="text-gray-400 text-sm">No orders yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="text-gray-400 border-b border-gray-700">
                  <th className="pb-3 pr-4">Order ID</th>
                  <th className="pb-3 pr-4">Total</th>
                  <th className="pb-3 pr-4">Status</th>
                  <th className="pb-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 5).map((order) => (
                  <tr key={order._id} className="border-b border-gray-700/50 text-gray-300">
                    <td className="py-3 pr-4 font-mono text-xs">{order._id.slice(-8)}</td>
                    <td className="py-3 pr-4">₹{order.totalPrice}</td>
                    <td className="py-3 pr-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        order.status === 'delivered' ? 'bg-emerald-500/20 text-emerald-400' :
                        order.status === 'shipped' ? 'bg-blue-500/20 text-blue-400' :
                        order.status === 'cancelled' ? 'bg-red-500/20 text-red-400' :
                        'bg-amber-500/20 text-amber-400'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</td>
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