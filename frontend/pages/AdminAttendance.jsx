import React, { useEffect, useState } from 'react';
import { fetchAttendance, addAttendance } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function AdminAttendance() {
  const { token } = useAuth();
  
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Form state
  const [employeeName, setEmployeeName] = useState('');
  const [status, setStatus] = useState('Present');
  const [notes, setNotes] = useState('');

  async function loadRecords() {
    setLoading(true);
    try {
      const data = await fetchAttendance(token, selectedDate);
      setRecords(data.records || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRecords();
  }, [token, selectedDate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      await addAttendance({
        employeeName,
        date: selectedDate,
        status,
        notes
      }, token);

      setEmployeeName('');
      setStatus('Present');
      setNotes('');
      loadRecords();
    } catch (err) {
      setError(err.message);
    }
  };

  const getStatusColor = (st) => {
    switch(st) {
      case 'Present': return 'bg-farm-green text-white';
      case 'Absent': return 'bg-red-500 text-white';
      case 'Half-Day': return 'bg-yellow-500 text-white';
      case 'Leave': return 'bg-blue-500 text-white';
      default: return 'bg-slate-200 text-slate-800';
    }
  };

  return (
    <div className="section-padding">
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        <header className="max-w-3xl mb-8">
          <p className="inline-flex rounded-full bg-farm-beige-dark px-3 py-1 text-xs font-semibold tracking-wide text-farm-brown">
            ADMIN ATTENDANCE
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
            Employee Daily Attendance
          </h1>
          <p className="mt-4 text-sm md:text-base text-slate-700">
            Track your farm staff presence, leaves, and absents.
          </p>
        </header>

        {/* Date Selector */}
        <div className="mb-8 flex flex-wrap items-center gap-4 border-b border-slate-200 pb-4">
          <label className="text-sm font-semibold text-slate-700">Select Date:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm shadow-sm focus:border-farm-orange focus:ring-farm-orange"
          />
        </div>

        {error && <p className="mb-4 text-xs text-red-600 bg-red-50 p-3 rounded-xl">{error}</p>}

        <div className="grid gap-8 lg:grid-cols-3">
           {/* Add Form */}
           <div className="lg:col-span-1">
            <div className="rounded-3xl bg-white p-6 shadow-soft-card sticky top-24">
              <h2 className="text-lg font-semibold text-slate-800 mb-4">Mark Attendance</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-700">Employee Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Doe"
                    value={employeeName}
                    onChange={(e) => setEmployeeName(e.target.value)}
                    className="w-full rounded-2xl border-slate-200 bg-slate-50 p-3 text-sm focus:border-farm-orange focus:ring-farm-orange"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-700">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full rounded-2xl border-slate-200 bg-slate-50 p-3 text-sm focus:border-farm-orange focus:ring-farm-orange"
                  >
                    <option value="Present">Present</option>
                    <option value="Absent">Absent</option>
                    <option value="Half-Day">Half-Day</option>
                    <option value="Leave">Leave</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-700">Notes (Optional)</label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full rounded-2xl border-slate-200 bg-slate-50 p-3 text-sm focus:border-farm-orange focus:ring-farm-orange"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-full bg-farm-orange py-3 text-sm font-bold text-white transition hover:bg-orange-600 shadow-md"
                >
                  Save Record
                </button>
              </form>
            </div>
          </div>

          {/* Records List */}
          <div className="lg:col-span-2">
            <h2 className="text-lg font-semibold text-slate-800 mb-4 px-2">Records for {new Date(selectedDate).toDateString()}</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {loading ? (
                <div className="col-span-full rounded-3xl bg-white p-5 text-sm text-slate-600 shadow-soft-card">
                  Loading records...
                </div>
              ) : records.length === 0 ? (
                <div className="col-span-full rounded-3xl bg-white p-5 text-sm text-slate-600 shadow-soft-card">
                  No attendance records found for this date.
                </div>
              ) : (
                records.map((rec) => (
                  <article key={rec._id} className="rounded-3xl bg-white p-5 shadow-soft-card border border-slate-50 flex items-center justify-between gap-4">
                    <div>
                      <h4 className="text-base font-bold text-slate-800">{rec.employeeName}</h4>
                      {rec.notes && <p className="text-[11px] text-slate-500 mt-1">{rec.notes}</p>}
                    </div>
                    <span className={`inline-block rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider shadow-sm ${getStatusColor(rec.status)}`}>
                      {rec.status}
                    </span>
                  </article>
                ))
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
