import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await register(form);
      navigate('/shop', { replace: true });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  }

  function updateField(key, value) {
    setForm((prev) => ({
      ...prev,
      [key]: value
    }));
  }

  return (
    <div className="section-padding">
      <div className="mx-auto max-w-md rounded-3xl bg-white p-6 shadow-soft-card">
        <p className="inline-flex rounded-full bg-farm-beige-dark px-3 py-1 text-xs font-semibold tracking-wide text-farm-brown">
          USER REGISTRATION
        </p>
        <h1 className="mt-4 text-2xl font-semibold text-farm-brown">
          Create your customer account
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Register to place and track poultry orders.
        </p>

        <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Full Name
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(event) => updateField('name', event.target.value)}
              className="mt-1 h-10 w-full rounded-full border border-slate-300 px-4 text-sm focus:border-farm-green focus:outline-none"
              placeholder="Your name"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Email
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(event) => updateField('email', event.target.value)}
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
              minLength={6}
              value={form.password}
              onChange={(event) => updateField('password', event.target.value)}
              className="mt-1 h-10 w-full rounded-full border border-slate-300 px-4 text-sm focus:border-farm-green focus:outline-none"
              placeholder="At least 6 characters"
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
            {submitting ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className="mt-4 text-xs text-slate-600">
          Already have an account?{' '}
          <Link className="font-semibold text-farm-green-dark" to="/login">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
