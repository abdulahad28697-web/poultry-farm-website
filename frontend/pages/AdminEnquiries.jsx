import React, { useEffect, useState } from 'react';
import { fetchAdminEnquiries } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function AdminEnquiries() {
  const { token } = useAuth();
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadEnquiries() {
      try {
        const data = await fetchAdminEnquiries(token);
        setEnquiries(data.enquiries || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadEnquiries();
  }, [token]);

  return (
    <div className="section-padding">
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        <header className="max-w-3xl">
          <p className="inline-flex rounded-full bg-farm-beige-dark px-3 py-1 text-xs font-semibold tracking-wide text-farm-brown">
            ADMIN ENQUIRIES
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
            Customer Messages & Requests
          </h1>
          <p className="mt-4 text-sm md:text-base text-slate-700">
            Review incoming enquiries sent from the Home and Contact pages.
          </p>
        </header>

        {error && <p className="mt-4 text-xs text-red-600 bg-red-50 p-3 rounded-xl">{error}</p>}

        <section className="mt-8 space-y-4">
          {loading ? (
            <div className="rounded-3xl bg-white p-5 text-sm text-slate-600 shadow-soft-card">
              Loading enquiries...
            </div>
          ) : enquiries.length === 0 ? (
            <div className="rounded-3xl bg-white p-5 text-sm text-slate-600 shadow-soft-card">
              No new enquiries found.
            </div>
          ) : (
            enquiries.map((enq) => (
              <article key={enq._id} className="rounded-3xl bg-white p-6 shadow-soft-card">
                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-4">
                  <div>
                    <h2 className="text-base font-semibold text-farm-brown">{enq.name}</h2>
                    <p className="text-sm text-slate-500 mt-1">{enq.contact}</p>
                  </div>
                  <div className="text-right">
                    <p className="inline-flex bg-farm-beige-dark px-3 py-1 rounded-full text-xs font-semibold text-farm-orange">
                      {enq.topic}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-2">
                      {new Date(enq.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="pt-4">
                  <p className="text-sm text-slate-700 whitespace-pre-wrap">{enq.message}</p>
                </div>
              </article>
            ))
          )}
        </section>
      </div>
    </div>
  );
}
