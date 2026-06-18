import { useAuth } from '../context/AuthContext.jsx';

const Home = () => {
  const { user, logout } = useAuth();

  return (
    <div style={{ padding: 48, maxWidth: 560 }}>
      <h1 style={{ fontFamily: 'var(--font-display)', marginBottom: 12 }}>
        Welcome, {user?.name || 'shopper'}
      </h1>
      <p style={{ color: 'rgba(42,33,24,0.7)', marginBottom: 24 }}>
        You're signed in. This is a placeholder — the product storefront and
        admin dashboard get built next.
      </p>
      <div className="min-h-screen flex items-center justify-center">
      <h1 className="text-4xl font-bold text-blue-600">
        Tailwind is Working!
      </h1>
    </div>
      <button
        className="auth-submit"
        style={{ width: 'auto', padding: '10px 22px' }}
        onClick={logout}
      >
        Log out
      </button>
    </div>
  );
};

export default Home;
