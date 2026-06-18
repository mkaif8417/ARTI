import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminLogin } from '../api';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await adminLogin(email, password);
      if (data.token && data.role === 'admin') {
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('adminRole', data.role);
        navigate('/admin/dashboard');
      } else {
        setError(data.message || 'Access denied. Admins only.');
      }
    } catch {
      setError('Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-[var(--color-maroon-dark)] to-[var(--color-ink)]">
      <div className="w-full max-w-md bg-[var(--color-bg)] border border-[var(--color-line)] rounded-2xl shadow-[0_30px_60px_-15px_rgba(83,20,32,0.45)] px-8 py-10">
        <p className="text-[11px] uppercase tracking-[0.25em] text-[var(--color-gold)] mb-2">
          Management Panel
        </p>
        <h1 className="text-4xl text-[var(--color-maroon)] mb-4 [font-family:var(--font-display)]">
          ARTI Admin
        </h1>
        <div className="w-10 h-px bg-[var(--color-gold)] mb-4"></div>
        <p className="text-sm text-[var(--color-ink)]/60 mb-8">
          Sign in to manage your store
        </p>

        {error && (
          <div className="mb-5 px-4 py-3 rounded-lg text-sm bg-[var(--color-maroon)]/5 border border-[var(--color-maroon)]/20 text-[var(--color-maroon)]">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-[var(--color-ink)]/55 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@test.com"
              className="w-full bg-transparent border-0 border-b border-[var(--color-line)] pb-2 text-sm text-[var(--color-ink)] placeholder-[var(--color-ink)]/30 focus:outline-none focus:border-[var(--color-gold)] transition-colors duration-300"
            />
          </div>
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-[var(--color-ink)]/55 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full bg-transparent border-0 border-b border-[var(--color-line)] pb-2 text-sm text-[var(--color-ink)] placeholder-[var(--color-ink)]/30 focus:outline-none focus:border-[var(--color-gold)] transition-colors duration-300"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg text-xs uppercase tracking-[0.15em] font-medium bg-[var(--color-maroon)] text-[var(--color-bg)] hover:bg-[var(--color-maroon-dark)] disabled:opacity-50 transition-colors duration-300"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;