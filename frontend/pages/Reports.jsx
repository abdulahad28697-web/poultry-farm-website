import React, { useEffect, useState } from 'react';
import { fetchFlockRecords, addFlockRecord } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function Reports() {
  const { token } = useAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Form state
  const [mortality, setMortality] = useState('');
  const [chicks, setChicks] = useState('');
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function loadRecords() {
    setLoading(true);
    setError('');
    try {
      const data = await fetchFlockRecords(token);
      setRecords(data.records || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRecords();
  }, [token]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await addFlockRecord({
        mortalityCount: Number(mortality),
        totalChicks: Number(chicks),
        note
      }, token);
      setMortality('');
      setChicks('');
      setNote('');
      loadRecords();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="section-padding">
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        <header className="max-w-3xl">
          <p className="inline-flex rounded-full bg-farm-beige-dark px-3 py-1 text-xs font-semibold tracking-wide text-farm-brown">
            ADMIN FLOCK REPORTS
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
            Daily Flock Health & Mortality
          </h1>
          <p className="mt-4 text-sm md:text-base text-slate-700">
            Log daily mortality rates and update active chick counts to maintain accurate farm records.
          </p>
        </header>

        <section className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr),minmax(0,2fr)]">
          {/* Form */}
          <div className="rounded-3xl bg-white p-6 shadow-soft-card self-start">
            <h2 className="text-base font-semibold text-farm-brown">Submit Daily Report</h2>
            <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-sm">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Total Chicks Count
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={chicks}
                  onChange={(e) => setChicks(e.target.value)}
                  className="mt-1 h-10 w-full rounded-full border border-slate-300 px-4 text-sm focus:border-farm-green focus:outline-none"
                  placeholder="e.g. 45000"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Mortality (Deceased Birds)
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={mortality}
                  onChange={(e) => setMortality(e.target.value)}
                  className="mt-1 h-10 w-full rounded-full border border-slate-300 px-4 text-sm focus:border-farm-green focus:outline-none"
                  placeholder="e.g. 15"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Notes (Optional)
                </label>
                <textarea
                  rows={3}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="mt-1 w-full rounded-2xl border border-slate-300 px-3 py-2 text-sm focus:border-farm-green focus:outline-none"
                  placeholder="Any vet visits or observations?"
                />
              </div>
              {error && <p className="text-xs text-red-600 bg-red-50 p-2 rounded-xl">{error}</p>}
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary w-full justify-center disabled:opacity-70"
              >
                {submitting ? 'Saving...' : 'Log Record'}
              </button>
            </form>
          </div>

          {/* History */}
          <div className="space-y-4">
            <h2 className="text-base font-semibold text-farm-brown">Flock History Log</h2>
            {loading ? (
              <p className="text-sm text-slate-500">Loading records...</p>
            ) : records.length === 0 ? (
              <div className="rounded-2xl bg-white p-5 text-sm text-slate-600 shadow-soft-card">
                No flock records found. Submit your first daily report!
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {records.map((record) => (
                  <article key={record._id} className="rounded-2xl bg-white p-5 shadow-soft-card flex flex-wrap gap-4 justify-between items-start">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-farm-green-dark">
                        {new Date(record.recordDate).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        Logged by {record.recordedBy?.name || 'Admin'}
                      </p>
                      {record.note && (
                        <p className="mt-2 text-sm text-slate-700 bg-farm-beige-dark/50 p-2 rounded-lg">
                          &quot;{record.note}&quot;
                        </p>
                      )}
                    </div>
                    <div className="flex gap-4 text-center">
                      <div className="bg-farm-beige-dark/50 px-4 py-2 rounded-xl">
                        <p className="text-[11px] uppercase tracking-wide text-slate-500">Total Chicks</p>
                        <p className="text-lg font-semibold text-farm-brown">{record.totalChicks.toLocaleString()}</p>
                      </div>
                      <div className="bg-red-50 px-4 py-2 rounded-xl">
                        <p className="text-[11px] uppercase tracking-wide text-red-700">Mortality</p>
                        <p className="text-lg font-semibold text-red-700">{record.mortalityCount}</p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
