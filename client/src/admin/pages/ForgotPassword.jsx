// src/admin/pages/ForgotPassword.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from "../../api/axiosInstance";

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      await axiosInstance.post('/auth/forgot-password', { email });
      setMessage('If that email exists, a reset link has been sent.');
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
          Forgot Password
        </h1>
        <div className="w-10 h-px bg-[var(--color-gold)] mb-4"></div>
        <p className="text-sm text-[var(--color-cream)]/60 mb-8">
          Enter your email and we'll send you a reset link
        </p>

        {message && (
          <div className="mb-5 px-4 py-3 rounded-lg text-sm bg-green-500/10 border border-green-500/20 text-green-400">
            {message}
          </div>
        )}
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
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg text-xs uppercase tracking-[0.15em] font-medium bg-[var(--color-gold)] text-[var(--color-bg)] hover:opacity-90 disabled:opacity-50 transition-opacity duration-300"
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <button
          type="button"
          onClick={() => navigate('/admin/login')}
          className="mt-6 text-xs text-[var(--color-cream)]/50 hover:text-[var(--color-gold)] transition-colors"
        >
          ← Back to login
        </button>
      </div>
    </div>
  );
};

export default ForgotPassword;