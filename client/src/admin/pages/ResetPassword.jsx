// pages/admin/ResetPassword.jsx
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from "../../api/axiosInstance";

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
    await axiosInstance.post(`/auth/reset-password/${token}`, { password });
      navigate('/admin/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Reset link invalid or expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-[var(--color-bg-card)] to-[var(--color-bg)]">
      <div className="w-full max-w-md bg-[var(--color-bg)] border border-[var(--color-line)] rounded-2xl px-8 py-10">
        <h1 className="text-2xl text-[var(--color-gold)] mb-4">Set New Password</h1>
        {error && <div className="mb-5 px-4 py-3 rounded-lg text-sm bg-[var(--color-gold)]/5 border border-[var(--color-gold)]/20 text-[var(--color-gold)]">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="New password"
            className="w-full bg-transparent border-b border-[var(--color-line)] pb-2 text-sm text-[var(--color-cream)] focus:outline-none focus:border-[var(--color-gold)]"
          />
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            placeholder="Confirm password"
            className="w-full bg-transparent border-b border-[var(--color-line)] pb-2 text-sm text-[var(--color-cream)] focus:outline-none focus:border-[var(--color-gold)]"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg text-xs uppercase tracking-[0.15em] bg-[var(--color-gold)] text-[var(--color-bg)] disabled:opacity-50"
          >
            {loading ? 'Updating...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;