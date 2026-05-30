import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function UserLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginUser } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const redirectPath = location.state?.from?.pathname || '/shop';

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await loginUser({ email, password });
      navigate(redirectPath, { replace: true });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="section-padding">
      <div className="mx-auto max-w-md rounded-3xl bg-white p-6 shadow-soft-card">
        <p className="inline-flex rounded-full bg-farm-beige-dark px-3 py-1 text-xs font-semibold tracking-wide text-farm-brown">
          USER LOGIN
        </p>
        <h1 className="mt-4 text-2xl font-semibold text-farm-brown">
          Sign in to your customer account
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Login to place orders and track deliveries.
        </p>

        <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-1 h-10 w-full rounded-full border border-slate-300 px-4 text-sm focus:border-farm-green focus:outline-none"
              placeholder="you@example.com"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-1 h-10 w-full rounded-full border border-slate-300 px-4 text-sm focus:border-farm-green focus:outline-none"
              placeholder="••••••••"
              required
            />
          </div>

          {error ? (
            <p className="rounded-xl bg-red-50 px-3 py-2 text-xs text-red-600">{error}</p>
          ) : null}

          <button
            type="submit"
            disabled={submitting}
            className="btn-primary w-full justify-center disabled:cursor-not-allowed disabled:opacity-70"
          >
            {submitting ? 'Signing in...' : 'Login'}
          </button>
        </form>

        <div className="mt-4 flex flex-col gap-2 text-xs text-slate-600">
          <p>
            New customer?{' '}
            <Link className="font-semibold text-farm-green-dark" to="/register">
              Create account
            </Link>
          </p>
          <p>
            Admin user?{' '}
            <Link className="font-semibold text-farm-green-dark" to="/admin/login">
              Admin login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
