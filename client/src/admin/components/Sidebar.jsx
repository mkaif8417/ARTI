import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, Tag, LogOut } from 'lucide-react';

const links = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { to: '/admin/categories', label: 'Categories', icon: Tag },
];

const Sidebar = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('token'); // matches the key your AuthContext actually uses
    navigate('/admin/login');
  };

  return (
    <aside className="w-64 min-h-screen bg-[var(--color-bg-card)] text-[var(--color-cream)] flex flex-col border-r border-[var(--color-line)]">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-[var(--color-line)]">
        <h1 className="text-xl tracking-wide text-[var(--color-gold)] [font-family:var(--font-display)]">
          ARTI Admin
        </h1>
        <p className="text-xs text-[var(--color-cream)]/40 mt-1 uppercase tracking-wider">
          Management Panel
        </p>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-[var(--color-gold)] text-[var(--color-bg)]'
                  : 'text-[var(--color-cream)]/60 hover:bg-[var(--color-gold)]/10 hover:text-[var(--color-cream)]'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-4 py-6 border-t border-[var(--color-line)]">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-2.5 w-full rounded-lg text-sm font-medium text-[var(--color-cream)]/60 hover:bg-red-500/10 hover:text-red-400 transition-colors"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;