import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import {
  fetchVaccinations, addVaccination, updateVaccination, deleteVaccination,
  fetchTreatments, addTreatment, updateTreatment, deleteTreatment,
  fetchVetVisits, addVetVisit, updateVetVisit, deleteVetVisit
} from '../services/api.js';

export default function AdminHealth() {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState('vaccinations'); // 'vaccinations' | 'treatments' | 'vetVisits'

  // Loading & Error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Data states
  const [vaccinations, setVaccinations] = useState([]);
  const [treatments, setTreatments] = useState([]);
  const [vetVisits, setVetVisits] = useState([]);

  // Search filter
  const [searchTerm, setSearchTerm] = useState('');

  // Form Modal state
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  // Form Field states
  const [vaccinationForm, setVaccinationForm] = useState({ vaccineName: '', targetDisease: '', flockGroup: '', scheduledDate: '', status: 'Scheduled', cost: 0, administeredBy: '' });
  const [treatmentForm, setTreatmentForm] = useState({ diagnosis: '', flockGroup: '', treatment: '', medicationUsed: '', startDate: '', endDate: '', cost: 0, outcome: 'Ongoing' });
  const [vetVisitForm, setVetVisitForm] = useState({ vetName: '', contactNumber: '', visitDate: '', purpose: '', cost: 0, notes: '' });

  // Load active tab's data
  async function loadData() {
    setLoading(true);
    setError('');
    try {
      if (activeTab === 'vaccinations') {
        const res = await fetchVaccinations(token);
        setVaccinations(res.vaccinations || []);
      } else if (activeTab === 'treatments') {
        const res = await fetchTreatments(token);
        setTreatments(res.treatments || []);
      } else if (activeTab === 'vetVisits') {
        const res = await fetchVetVisits(token);
        setVetVisits(res.visits || []);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch medical health records.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
    setSearchTerm('');
    setError('');
    setSuccessMsg('');
  }, [activeTab, token]);

  // Flash messages helper
  function triggerSuccess(msg) {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 4000);
  }

  // DELETE handler
  async function handleDelete(id) {
    if (!window.confirm('Are you sure you want to delete this clinical health record?')) return;
    setError('');
    try {
      if (activeTab === 'vaccinations') {
        await deleteVaccination(id, token);
        setVaccinations(vaccinations.filter(v => v._id !== id));
        triggerSuccess('Vaccination record deleted successfully!');
      } else if (activeTab === 'treatments') {
        await deleteTreatment(id, token);
        setTreatments(treatments.filter(t => t._id !== id));
        triggerSuccess('Treatment record deleted successfully!');
      } else if (activeTab === 'vetVisits') {
        await deleteVetVisit(id, token);
        setVetVisits(vetVisits.filter(v => v._id !== id));
        triggerSuccess('Veterinary visit logged out successfully!');
      }
    } catch (err) {
      setError(err.message || 'Failed to delete record.');
    }
  }

  // Quick Action: Toggle Vaccination Done/Undone
  async function handleToggleVaccinationStatus(vac) {
    setError('');
    try {
      const newStatus = vac.status === 'Scheduled' ? 'Administered' : 'Scheduled';
      await updateVaccination(vac._id, { ...vac, status: newStatus }, token);
      triggerSuccess(`Vaccine marked as ${newStatus}!`);
      loadData();
    } catch (err) {
      setError(err.message || 'Failed to toggle vaccination status.');
    }
  }

  // Edit Initiator
  function openEditModal(item) {
    setIsEditMode(true);
    setCurrentId(item._id);
    if (activeTab === 'vaccinations') {
      setVaccinationForm({
        vaccineName: item.vaccineName || '',
        targetDisease: item.targetDisease || '',
        flockGroup: item.flockGroup || '',
        scheduledDate: item.scheduledDate ? new Date(item.scheduledDate).toISOString().split('T')[0] : '',
        status: item.status || 'Scheduled',
        cost: item.cost || 0,
        administeredBy: item.administeredBy || ''
      });
    } else if (activeTab === 'treatments') {
      setTreatmentForm({
        diagnosis: item.diagnosis || '',
        flockGroup: item.flockGroup || '',
        treatment: item.treatment || '',
        medicationUsed: item.medicationUsed || '',
        startDate: item.startDate ? new Date(item.startDate).toISOString().split('T')[0] : '',
        endDate: item.endDate ? new Date(item.endDate).toISOString().split('T')[0] : '',
        cost: item.cost || 0,
        outcome: item.outcome || 'Ongoing'
      });
    } else if (activeTab === 'vetVisits') {
      setVetVisitForm({
        vetName: item.vetName || '',
        contactNumber: item.contactNumber || '',
        visitDate: item.visitDate ? new Date(item.visitDate).toISOString().split('T')[0] : '',
        purpose: item.purpose || '',
        cost: item.cost || 0,
        notes: item.notes || ''
      });
    }
    setShowModal(true);
  }

  // Create Initiator
  function openCreateModal() {
    setIsEditMode(false);
    setCurrentId(null);
    setVaccinationForm({ vaccineName: '', targetDisease: '', flockGroup: '', scheduledDate: '', status: 'Scheduled', cost: 0, administeredBy: '' });
    setTreatmentForm({ diagnosis: '', flockGroup: '', treatment: '', medicationUsed: '', startDate: '', endDate: '', cost: 0, outcome: 'Ongoing' });
    setVetVisitForm({ vetName: '', contactNumber: '', visitDate: '', purpose: '', cost: 0, notes: '' });
    setShowModal(true);
  }

  // Form Submit handler
  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      if (activeTab === 'vaccinations') {
        const payload = { ...vaccinationForm, cost: Number(vaccinationForm.cost) };
        if (isEditMode) {
          await updateVaccination(currentId, payload, token);
          triggerSuccess('Vaccination schedule updated successfully!');
        } else {
          await addVaccination(payload, token);
          triggerSuccess('New vaccination schedule registered!');
        }
      } else if (activeTab === 'treatments') {
        const payload = { ...treatmentForm, cost: Number(treatmentForm.cost) };
        if (!payload.endDate) delete payload.endDate;

        if (isEditMode) {
          await updateTreatment(currentId, payload, token);
          triggerSuccess('Flock treatment record updated successfully!');
        } else {
          await addTreatment(payload, token);
          triggerSuccess('New treatment logs submitted!');
        }
      } else if (activeTab === 'vetVisits') {
        const payload = { ...vetVisitForm, cost: Number(vetVisitForm.cost) };

        if (isEditMode) {
          await updateVetVisit(currentId, payload, token);
          triggerSuccess('Veterinary audit log revised!');
        } else {
          await addVetVisit(payload, token);
          triggerSuccess('New veterinarian farm visit logged!');
        }
      }
      setShowModal(false);
      loadData();
    } catch (err) {
      setError(err.message || 'Error saving record.');
    }
  }

  // Calculated HUD stats
  const scheduledVaccinesCount = vaccinations.filter(v => v.status === 'Scheduled').length;
  const activeTreatmentsCount = treatments.filter(t => t.outcome === 'Ongoing').length;
  const totalClinicalSpend = 
    vaccinations.reduce((acc, curr) => acc + (curr.cost || 0), 0) +
    treatments.reduce((acc, curr) => acc + (curr.cost || 0), 0) +
    vetVisits.reduce((acc, curr) => acc + (curr.cost || 0), 0);

  const lastVetDate = vetVisits.length > 0 ? new Date(vetVisits[0].visitDate).toLocaleDateString() : 'No visits';

  // Filter lists based on search term
  const filteredVaccinations = vaccinations.filter(v => v.vaccineName.toLowerCase().includes(searchTerm.toLowerCase()) || v.targetDisease.toLowerCase().includes(searchTerm.toLowerCase()) || v.flockGroup.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredTreatments = treatments.filter(t => t.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) || t.flockGroup.toLowerCase().includes(searchTerm.toLowerCase()) || t.treatment.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredVetVisits = vetVisits.filter(v => v.vetName.toLowerCase().includes(searchTerm.toLowerCase()) || v.purpose.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="section-padding">
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        
        {/* Header Section */}
        <header className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="inline-flex rounded-full bg-farm-beige-dark px-3 py-1 text-xs font-semibold tracking-wide text-farm-brown">
              CLINICAL VETERINARY PORTAL
            </p>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              Flock Health & Medical Management
            </h1>
            <p className="mt-2 text-sm text-slate-600 max-w-2xl">
              Oversee vaccination schedules, maintain disease diagnosis &amp; treatment history logs, and schedule vet visits to secure biosecurity.
            </p>
          </div>
          <div>
            <button
              onClick={openCreateModal}
              className="btn-primary"
            >
              + Add Clinical Log
            </button>
          </div>
        </header>

        {/* HUD clinical scoreboard */}
        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-3xl border border-orange-100 bg-white p-5 shadow-soft-card">
            <span className="text-2xl">💉</span>
            <h3 className="mt-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Scheduled Vaccines</h3>
            <p className="mt-1 text-2xl font-bold text-amber-500">{scheduledVaccinesCount} pending</p>
          </div>
          <div className="rounded-3xl border border-orange-100 bg-white p-5 shadow-soft-card">
            <span className="text-2xl">🩹</span>
            <h3 className="mt-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Flocks Under Treatment</h3>
            <p className="mt-1 text-2xl font-bold text-red-500">{activeTreatmentsCount} active batches</p>
          </div>
          <div className="rounded-3xl border border-orange-100 bg-white p-5 shadow-soft-card">
            <span className="text-2xl">🩺</span>
            <h3 className="mt-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Last Veterinarian Visit</h3>
            <p className="mt-1 text-2xl font-bold text-farm-brown">{lastVetDate}</p>
          </div>
          <div className="rounded-3xl border border-orange-100 bg-white p-5 shadow-soft-card">
            <span className="text-2xl">💳</span>
            <h3 className="mt-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Total Bio-Spend ($)</h3>
            <p className="mt-1 text-2xl font-bold text-farm-green">${totalClinicalSpend.toLocaleString()}</p>
          </div>
        </section>

        {/* Tabs and Search */}
        <div className="mt-10 flex flex-col gap-4 border-b border-orange-100 pb-5 sm:flex-row sm:items-center sm:justify-between">
          {/* Tab selectors */}
          <div className="flex gap-2 rounded-2xl bg-orange-50 p-1.5 self-start">
            {[
              { id: 'vaccinations', label: '💉 Vaccination Schedule' },
              { id: 'treatments', label: '🧬 Disease & Treatments' },
              { id: 'vetVisits', label: '🩺 Veterinary Management' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-xl px-4 py-2 text-xs font-semibold transition ${
                  activeTab === tab.id
                    ? 'bg-farm-orange text-white shadow-md'
                    : 'text-slate-600 hover:text-farm-brown hover:bg-orange-100/50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="relative max-w-xs w-full">
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-10 w-full rounded-full border border-orange-200 bg-white pl-4 pr-10 text-xs focus:border-farm-orange focus:outline-none"
            />
            <span className="absolute right-3.5 top-2.5 text-slate-400">🔍</span>
          </div>
        </div>

        {/* Global Notifications */}
        {error && <p className="mt-4 text-xs text-red-600 bg-red-50 p-3 rounded-2xl border border-red-200">{error}</p>}
        {successMsg && <p className="mt-4 text-xs text-farm-green bg-green-50 p-3 rounded-2xl border border-green-200">{successMsg}</p>}

        {/* Main Content Area */}
        <section className="mt-6">
          {loading ? (
            <div className="flex items-center gap-2 text-sm text-slate-500 py-10">
              <span className="animate-spin text-lg">⏳</span> Querying biosecurity database...
            </div>
          ) : (
            <>
              {/* VACCINATION SCHEDULE TAB */}
              {activeTab === 'vaccinations' && (
                filteredVaccinations.length === 0 ? (
                  <div className="rounded-3xl bg-white p-10 text-center text-sm text-slate-500 shadow-soft-card border border-orange-100">
                    No vaccinations registered. Log your flock's immunization schedule!
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredVaccinations.map(vac => {
                      const daysLeft = Math.ceil((new Date(vac.scheduledDate) - new Date()) / (1000 * 60 * 60 * 24));
                      return (
                        <article key={vac._id} className="rounded-3xl border border-orange-100 bg-white p-6 shadow-soft-card hover:shadow-md transition duration-200 flex flex-col justify-between">
                          <div>
                            <div className="flex items-start justify-between">
                              <h3 className="font-semibold text-slate-800">{vac.vaccineName}</h3>
                              <button
                                onClick={() => handleToggleVaccinationStatus(vac)}
                                className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider transition ${
                                  vac.status === 'Administered' ? 'bg-green-100 text-farm-green hover:bg-green-200' : 'bg-amber-100 text-amber-600 hover:bg-amber-200'
                                }`}
                                title="Click to toggle status"
                              >
                                {vac.status}
                              </button>
                            </div>
                            <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mt-1">Disease: {vac.targetDisease}</p>
                            
                            <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-slate-600 bg-farm-beige p-3 rounded-2xl">
                              <div>
                                <span className="block text-[10px] text-slate-400 uppercase font-semibold">Flock Group</span>
                                <span className="font-bold text-farm-brown text-sm">{vac.flockGroup}</span>
                              </div>
                              <div>
                                <span className="block text-[10px] text-slate-400 uppercase font-semibold">Vaccine Cost</span>
                                <span className="font-bold text-farm-brown text-sm">${vac.cost || 0}</span>
                              </div>
                            </div>

                            <p className="text-[11px] text-slate-500 mt-4 flex items-center gap-1 font-semibold">
                              <span>📅</span> Date: <strong className="text-slate-700">{new Date(vac.scheduledDate).toLocaleDateString()}</strong> 
                              {vac.status === 'Scheduled' && daysLeft >= 0 && (
                                <span className="text-amber-600 font-bold ml-1 bg-amber-50 px-1.5 py-0.5 rounded-lg text-[9px]">({daysLeft} days left)</span>
                              )}
                            </p>
                            
                            {vac.administeredBy && (
                              <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                                <span>👨‍⚕️</span> Administered By: <strong className="text-slate-700">{vac.administeredBy}</strong>
                              </p>
                            )}
                          </div>
                          
                          <div className="mt-6 flex justify-end gap-2 border-t border-slate-100 pt-3">
                            <button
                              onClick={() => openEditModal(vac)}
                              className="rounded-full bg-orange-50 hover:bg-orange-100 text-farm-orange px-3 py-1.5 text-xs font-bold transition"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(vac._id)}
                              className="rounded-full bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 text-xs font-bold transition"
                            >
                              Delete
                            </button>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                )
              )}

              {/* DISEASE & TREATMENTS RECORDS */}
              {activeTab === 'treatments' && (
                filteredTreatments.length === 0 ? (
                  <div className="rounded-3xl bg-white p-10 text-center text-sm text-slate-500 shadow-soft-card border border-orange-100">
                    No medical treatment history found. Monitor flock health regularly!
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredTreatments.map(t => (
                      <article key={t._id} className="rounded-3xl border border-orange-100 bg-white p-6 shadow-soft-card hover:shadow-md transition duration-200 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between">
                            <h3 className="font-semibold text-slate-800">{t.diagnosis}</h3>
                            <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                              t.outcome === 'Recovered' ? 'bg-green-100 text-farm-green' :
                              t.outcome === 'Ongoing' ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-500'
                            }`}>
                              {t.outcome}
                            </span>
                          </div>
                          <p className="text-[11px] font-semibold text-slate-700 bg-farm-orange/5 px-2 py-1 rounded-xl mt-2 self-start flex items-center gap-1">
                            💊 <strong className="text-farm-brown font-bold">{t.treatment}</strong>
                          </p>

                          <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-slate-600 bg-farm-beige p-3 rounded-2xl">
                            <div>
                              <span className="block text-[10px] text-slate-400 uppercase font-semibold">Flock Group</span>
                              <span className="font-bold text-farm-brown text-sm">{t.flockGroup}</span>
                            </div>
                            <div>
                              <span className="block text-[10px] text-slate-400 uppercase font-semibold">Meds Price</span>
                              <span className="font-bold text-farm-brown text-sm">${t.cost || 0}</span>
                            </div>
                          </div>

                          <div className="mt-4 space-y-1 text-[11px] text-slate-500">
                            {t.medicationUsed && (
                              <p>🧪 Medications: <strong className="text-slate-700">{t.medicationUsed}</strong></p>
                            )}
                            <p>📅 Start Date: <strong className="text-slate-700">{new Date(t.startDate).toLocaleDateString()}</strong></p>
                            {t.endDate && (
                              <p>📅 Resolved Date: <strong className="text-slate-700">{new Date(t.endDate).toLocaleDateString()}</strong></p>
                            )}
                          </div>
                        </div>
                        
                        <div className="mt-6 flex justify-end gap-2 border-t border-slate-100 pt-3">
                          <button
                            onClick={() => openEditModal(t)}
                            className="rounded-full bg-orange-50 hover:bg-orange-100 text-farm-orange px-3 py-1.5 text-xs font-bold transition"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(t._id)}
                            className="rounded-full bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 text-xs font-bold transition"
                          >
                            Delete
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                )
              )}

              {/* VETERINARY MANAGEMENT */}
              {activeTab === 'vetVisits' && (
                filteredVetVisits.length === 0 ? (
                  <div className="rounded-3xl bg-white p-10 text-center text-sm text-slate-500 shadow-soft-card border border-orange-100">
                    No veterinarians visits logged. Keep an audit record of vet diagnostics!
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredVetVisits.map(visit => (
                      <article key={visit._id} className="rounded-3xl border border-orange-100 bg-white p-6 shadow-soft-card hover:shadow-md transition duration-200 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between">
                            <h3 className="font-semibold text-slate-800">Dr. {visit.vetName}</h3>
                            <span className="inline-flex rounded-full bg-slate-100 text-slate-700 px-2.5 py-0.5 text-[10px] font-bold">
                              {visit.contactNumber || 'No Phone'}
                            </span>
                          </div>
                          <p className="text-[11px] font-medium text-slate-600 bg-orange-50 px-2.5 py-1 rounded-xl mt-3">
                            🩺 Purpose: <strong className="text-farm-brown">{visit.purpose}</strong>
                          </p>

                          <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-slate-600 bg-farm-beige p-3 rounded-2xl">
                            <div>
                              <span className="block text-[10px] text-slate-400 uppercase font-semibold">Visit Date</span>
                              <span className="font-bold text-farm-brown text-sm">{new Date(visit.visitDate).toLocaleDateString()}</span>
                            </div>
                            <div>
                              <span className="block text-[10px] text-slate-400 uppercase font-semibold">Audit Cost</span>
                              <span className="font-bold text-farm-brown text-sm">${visit.cost || 0}</span>
                            </div>
                          </div>

                          {visit.notes && (
                            <p className="mt-3 text-[11px] text-slate-600 bg-slate-50 p-2 rounded-xl border border-slate-100 italic">
                              &quot;{visit.notes}&quot;
                            </p>
                          )}
                        </div>
                        
                        <div className="mt-6 flex justify-end gap-2 border-t border-slate-100 pt-3">
                          <button
                            onClick={() => openEditModal(visit)}
                            className="rounded-full bg-orange-50 hover:bg-orange-100 text-farm-orange px-3 py-1.5 text-xs font-bold transition"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(visit._id)}
                            className="rounded-full bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 text-xs font-bold transition"
                          >
                            Delete
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                )
              )}
            </>
          )}
        </section>
      </div>

      {/* CRUD MODAL FOR HEALTH ITEMS */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            {/* Close Button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 font-bold"
            >
              ✕
            </button>

            <h2 className="text-lg font-bold text-farm-brown">
              {isEditMode ? '🩺 Edit Clinical Record' : '✨ Log New Clinical Record'}
            </h2>
            <p className="text-xs text-slate-500 mt-1 uppercase tracking-wide font-semibold">
              Module: {activeTab === 'vaccinations' ? 'Vaccination Schedule' : activeTab === 'treatments' ? 'Disease & Treatments' : 'Veterinary Management'}
            </p>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-xs text-slate-700">
              
              {/* FORM FIELDS FOR VACCINATIONS */}
              {activeTab === 'vaccinations' && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wide text-slate-400">Vaccine Name *</label>
                      <input
                        type="text"
                        required
                        value={vaccinationForm.vaccineName}
                        onChange={(e) => setVaccinationForm({ ...vaccinationForm, vaccineName: e.target.value })}
                        className="mt-1 h-10 w-full rounded-full border border-orange-200 px-4 text-xs focus:border-farm-orange focus:outline-none"
                        placeholder="Gumboro / Lasota"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wide text-slate-400">Target Disease *</label>
                      <input
                        type="text"
                        required
                        value={vaccinationForm.targetDisease}
                        onChange={(e) => setVaccinationForm({ ...vaccinationForm, targetDisease: e.target.value })}
                        className="mt-1 h-10 w-full rounded-full border border-orange-200 px-4 text-xs focus:border-farm-orange focus:outline-none"
                        placeholder="Newcastle Disease"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wide text-slate-400">Flock/Group Name *</label>
                      <input
                        type="text"
                        required
                        value={vaccinationForm.flockGroup}
                        onChange={(e) => setVaccinationForm({ ...vaccinationForm, flockGroup: e.target.value })}
                        className="mt-1 h-10 w-full rounded-full border border-orange-200 px-4 text-xs focus:border-farm-orange focus:outline-none"
                        placeholder="Batch 2026-A"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wide text-slate-400">Status *</label>
                      <select
                        value={vaccinationForm.status}
                        onChange={(e) => setVaccinationForm({ ...vaccinationForm, status: e.target.value })}
                        className="mt-1 h-10 w-full rounded-full border border-orange-200 px-4 text-xs focus:border-farm-orange focus:outline-none bg-white"
                      >
                        <option value="Scheduled">Scheduled</option>
                        <option value="Administered">Administered</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wide text-slate-400">Total Cost ($)</label>
                      <input
                        type="number"
                        min="0"
                        value={vaccinationForm.cost}
                        onChange={(e) => setVaccinationForm({ ...vaccinationForm, cost: e.target.value })}
                        className="mt-1 h-10 w-full rounded-full border border-orange-200 px-4 text-xs focus:border-farm-orange focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wide text-slate-400">Administered By</label>
                      <input
                        type="text"
                        value={vaccinationForm.administeredBy}
                        onChange={(e) => setVaccinationForm({ ...vaccinationForm, administeredBy: e.target.value })}
                        className="mt-1 h-10 w-full rounded-full border border-orange-200 px-4 text-xs focus:border-farm-orange focus:outline-none"
                        placeholder="Dr. Johnson"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wide text-slate-400">Scheduled Date *</label>
                    <input
                      type="date"
                      required
                      value={vaccinationForm.scheduledDate}
                      onChange={(e) => setVaccinationForm({ ...vaccinationForm, scheduledDate: e.target.value })}
                      className="mt-1 h-10 w-full rounded-full border border-orange-200 px-4 text-xs focus:border-farm-orange focus:outline-none"
                    />
                  </div>
                </>
              )}

              {/* FORM FIELDS FOR DISEASE & TREATMENT */}
              {activeTab === 'treatments' && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wide text-slate-400">Diagnosis / Symptom *</label>
                      <input
                        type="text"
                        required
                        value={treatmentForm.diagnosis}
                        onChange={(e) => setTreatmentForm({ ...treatmentForm, diagnosis: e.target.value })}
                        className="mt-1 h-10 w-full rounded-full border border-orange-200 px-4 text-xs focus:border-farm-orange focus:outline-none"
                        placeholder="Coccidiosis / Lethargy"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wide text-slate-400">Affected Flock *</label>
                      <input
                        type="text"
                        required
                        value={treatmentForm.flockGroup}
                        onChange={(e) => setTreatmentForm({ ...treatmentForm, flockGroup: e.target.value })}
                        className="mt-1 h-10 w-full rounded-full border border-orange-200 px-4 text-xs focus:border-farm-orange focus:outline-none"
                        placeholder="Shed 2 Chicks"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wide text-slate-400">Treatment Plan *</label>
                    <input
                      type="text"
                      required
                      value={treatmentForm.treatment}
                      onChange={(e) => setTreatmentForm({ ...treatmentForm, treatment: e.target.value })}
                      className="mt-1 h-10 w-full rounded-full border border-orange-200 px-4 text-xs focus:border-farm-orange focus:outline-none"
                      placeholder="e.g. Amprolium in drinking water"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wide text-slate-400">Medications Used</label>
                      <input
                        type="text"
                        value={treatmentForm.medicationUsed}
                        onChange={(e) => setTreatmentForm({ ...treatmentForm, medicationUsed: e.target.value })}
                        className="mt-1 h-10 w-full rounded-full border border-orange-200 px-4 text-xs focus:border-farm-orange focus:outline-none"
                        placeholder="Amprol 9.6%"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wide text-slate-400">Treatment Outcome *</label>
                      <select
                        value={treatmentForm.outcome}
                        onChange={(e) => setTreatmentForm({ ...treatmentForm, outcome: e.target.value })}
                        className="mt-1 h-10 w-full rounded-full border border-orange-200 px-4 text-xs focus:border-farm-orange focus:outline-none bg-white"
                      >
                        <option value="Ongoing">Ongoing</option>
                        <option value="Recovered">Recovered</option>
                        <option value="Loss">Loss</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wide text-slate-400">Start Date *</label>
                      <input
                        type="date"
                        required
                        value={treatmentForm.startDate}
                        onChange={(e) => setTreatmentForm({ ...treatmentForm, startDate: e.target.value })}
                        className="mt-1 h-10 w-full rounded-full border border-orange-200 px-4 text-xs focus:border-farm-orange focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wide text-slate-400">Resolved Date</label>
                      <input
                        type="date"
                        value={treatmentForm.endDate}
                        onChange={(e) => setTreatmentForm({ ...treatmentForm, endDate: e.target.value })}
                        className="mt-1 h-10 w-full rounded-full border border-orange-200 px-4 text-xs focus:border-farm-orange focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wide text-slate-400">Treatment Cost ($)</label>
                    <input
                      type="number"
                      min="0"
                      value={treatmentForm.cost}
                      onChange={(e) => setTreatmentForm({ ...treatmentForm, cost: e.target.value })}
                      className="mt-1 h-10 w-full rounded-full border border-orange-200 px-4 text-xs focus:border-farm-orange focus:outline-none"
                    />
                  </div>
                </>
              )}

              {/* FORM FIELDS FOR VET VISITS */}
              {activeTab === 'vetVisits' && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wide text-slate-400">Doctor/Vet Name *</label>
                      <input
                        type="text"
                        required
                        value={vetVisitForm.vetName}
                        onChange={(e) => setVetVisitForm({ ...vetVisitForm, vetName: e.target.value })}
                        className="mt-1 h-10 w-full rounded-full border border-orange-200 px-4 text-xs focus:border-farm-orange focus:outline-none"
                        placeholder="Dr. Michael Scott"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wide text-slate-400">Contact Number</label>
                      <input
                        type="text"
                        value={vetVisitForm.contactNumber}
                        onChange={(e) => setVetVisitForm({ ...vetVisitForm, contactNumber: e.target.value })}
                        className="mt-1 h-10 w-full rounded-full border border-orange-200 px-4 text-xs focus:border-farm-orange focus:outline-none"
                        placeholder="+1 555-0199"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wide text-slate-400">Visit Date *</label>
                      <input
                        type="date"
                        required
                        value={vetVisitForm.visitDate}
                        onChange={(e) => setVetVisitForm({ ...vetVisitForm, visitDate: e.target.value })}
                        className="mt-1 h-10 w-full rounded-full border border-orange-200 px-4 text-xs focus:border-farm-orange focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wide text-slate-400">Visitation Cost ($)</label>
                      <input
                        type="number"
                        min="0"
                        value={vetVisitForm.cost}
                        onChange={(e) => setVetVisitForm({ ...vetVisitForm, cost: e.target.value })}
                        className="mt-1 h-10 w-full rounded-full border border-orange-200 px-4 text-xs focus:border-farm-orange focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wide text-slate-400">Purpose of Visit *</label>
                    <input
                      type="text"
                      required
                      value={vetVisitForm.purpose}
                      onChange={(e) => setVetVisitForm({ ...vetVisitForm, purpose: e.target.value })}
                      className="mt-1 h-10 w-full rounded-full border border-orange-200 px-4 text-xs focus:border-farm-orange focus:outline-none"
                      placeholder="Routine flock immunization check / Epidemic review"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wide text-slate-400">Audit Notes / Directives</label>
                    <textarea
                      rows={3}
                      value={vetVisitForm.notes}
                      onChange={(e) => setVetVisitForm({ ...vetVisitForm, notes: e.target.value })}
                      className="mt-1 w-full rounded-2xl border border-orange-200 px-3 py-2 text-xs focus:border-farm-orange focus:outline-none"
                      placeholder="Instructions, biosecurity prescriptions..."
                    />
                  </div>
                </>
              )}

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-full bg-slate-100 text-slate-700 px-5 py-2 hover:bg-slate-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
