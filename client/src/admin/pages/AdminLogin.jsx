import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const userData = await login(email, password);
      if (userData.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        setError('Access denied. Admins only.');
      }
    } catch {
      setError('Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-[var(--color-bg-card)] to-[var(--color-bg)]">
      <div className="w-full max-w-md bg-[var(--color-bg)] border border-[var(--color-line)] rounded-2xl shadow-[0_30px_60px_-15px_rgba(16,43,42,0.6)] px-8 py-10">
        <p className="text-[11px] uppercase tracking-[0.25em] text-[var(--color-gold)] mb-2">
          Management Panel
        </p>
        <h1 className="text-4xl text-[var(--color-gold)] mb-4 [font-family:var(--font-display)]">
          ARTI Admin
        </h1>
        <div className="w-10 h-px bg-[var(--color-gold)] mb-4"></div>
        <p className="text-sm text-[var(--color-cream)]/60 mb-8">
          Sign in to manage your store
        </p>

        {error && (
          <div className="mb-5 px-4 py-3 rounded-lg text-sm bg-[var(--color-gold)]/5 border border-[var(--color-gold)]/20 text-[var(--color-gold)]">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-[var(--color-cream)]/55 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@test.com"
              className="w-full bg-transparent border-0 border-b border-[var(--color-line)] pb-2 text-sm text-[var(--color-cream)] placeholder-[var(--color-cream)]/30 focus:outline-none focus:border-[var(--color-gold)] transition-colors duration-300"
            />
          </div>
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-[var(--color-cream)]/55 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full bg-transparent border-b border-[var(--color-line)] pb-2 text-sm text-[var(--color-cream)] placeholder-[var(--color-cream)]/30 focus:outline-none focus:border-[var(--color-gold)] transition-colors duration-300"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg text-xs uppercase tracking-[0.15em] font-medium bg-[var(--color-gold)] text-[var(--color-bg)] hover:opacity-90 disabled:opacity-50 transition-opacity duration-300"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;