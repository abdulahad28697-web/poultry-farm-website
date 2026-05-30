import React, { useEffect, useState } from 'react';
import { fetchTransactions, fetchTransactionsSummary, addTransaction, updateTransaction, deleteTransaction, archiveAllTransactions } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { PencilSquareIcon, TrashIcon, ArchiveBoxIcon } from '@heroicons/react/24/outline'; 

function formatMoney(amount) {
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

export default function AdminFinances() {
  const { token } = useAuth();
  
  // Tabs: 'current' | 'archived'
  const [activeTab, setActiveTab] = useState('current');
  
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({ totalInvestment: 0, totalSales: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Form state
  const [editingId, setEditingId] = useState(null);
  const [type, setType] = useState('Sale');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [unitPrice, setUnitPrice] = useState(0);

  async function loadData() {
    setLoading(true);
    try {
      const isArchived = activeTab === 'archived';
      const [transData, summaryData] = await Promise.all([
        fetchTransactions(token, isArchived),
        fetchTransactionsSummary(token, isArchived)
      ]);
      setTransactions(transData.transactions || []);
      setSummary({
        totalInvestment: summaryData.totalInvestment || 0,
        totalSales: summaryData.totalSales || 0
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [token, activeTab]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const totalAmount = quantity * unitPrice;
      const payload = { type, category, description, quantity, unitPrice, totalAmount };

      if (editingId) {
        await updateTransaction(editingId, payload, token);
        setEditingId(null);
      } else {
        await addTransaction(payload, token);
      }

      setCategory('');
      setDescription('');
      setQuantity(1);
      setUnitPrice(0);
      
      loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditClick = (tx) => {
    setActiveTab('current'); // Ensure we are on current tab to edit properly
    setEditingId(tx._id);
    setType(tx.type);
    setCategory(tx.category);
    setDescription(tx.description || '');
    setQuantity(tx.quantity);
    setUnitPrice(tx.unitPrice);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteClick = async (id) => {
    if (!window.confirm('Are you sure you want to delete this transaction completely?')) return;
    try {
      await deleteTransaction(id, token);
      loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleArchiveAll = async () => {
    if (!window.confirm('Are you sure you want to End this Flock? All current records will be moved to the Old Records section, and your current totals will reset to 0.')) return;
    try {
      await archiveAllTransactions(token);
      loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setCategory('');
    setDescription('');
    setQuantity(1);
    setUnitPrice(0);
  };

  const netProfit = summary.totalSales - summary.totalInvestment;

  return (
    <div className="section-padding">
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        
        <header className="max-w-3xl mb-8 flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <p className="inline-flex rounded-full bg-farm-beige-dark px-3 py-1 text-xs font-semibold tracking-wide text-farm-brown">
              ADMIN FINANCES
            </p>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
              Purchases & Sales Ledger
            </h1>
            <p className="mt-4 text-sm md:text-base text-slate-700">
              Track your farm's investments and sales revenue for the current batch.
            </p>
          </div>
          <button 
            type="button" 
            onClick={handleArchiveAll}
            className="flex items-center gap-2 rounded-full bg-farm-brown px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 shrink-0"
          >
            <ArchiveBoxIcon className="h-4 w-4" />
            End Current Flock
          </button>
        </header>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-slate-200 mb-6">
          <button
            className={`px-4 py-2 font-semibold text-sm transition-colors border-b-2 ${activeTab === 'current' ? 'border-farm-orange text-farm-orange' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
            onClick={() => setActiveTab('current')}
          >
            Current Flock
          </button>
          <button
            className={`px-4 py-2 font-semibold text-sm transition-colors border-b-2 ${activeTab === 'archived' ? 'border-farm-orange text-farm-orange' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
            onClick={() => setActiveTab('archived')}
          >
            Old Records (Archived)
          </button>
        </div>

        {/* Dashboard Cards */}
        <div className="grid gap-4 sm:grid-cols-3 mb-8">
          <div className="rounded-3xl bg-farm-orange-soft p-6 shadow-soft-card border border-orange-100">
            <h3 className="text-sm font-semibold text-orange-900 uppercase tracking-widest mb-2">Total Sales</h3>
            <p className="text-3xl font-bold text-farm-orange">{formatMoney(summary.totalSales)}</p>
          </div>
          <div className="rounded-3xl bg-slate-50 p-6 shadow-soft-card border border-slate-100">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-2">Total Investments</h3>
            <p className="text-3xl font-bold text-slate-800">{formatMoney(summary.totalInvestment)}</p>
          </div>
          <div className={`rounded-3xl p-6 shadow-soft-card border flex flex-col justify-center
            ${netProfit >= 0 ? 'bg-farm-green/10 border-farm-green/20' : 'bg-red-50 border-red-100'}`}
          >
            <h3 className={`text-sm font-semibold uppercase tracking-widest mb-2
              ${netProfit >= 0 ? 'text-farm-green-dark' : 'text-red-700'}`}>Net Profit</h3>
            <p className={`text-3xl font-bold ${netProfit >= 0 ? 'text-farm-green' : 'text-red-600'}`}>
              {formatMoney(netProfit)}
            </p>
          </div>
        </div>

        {error && <p className="mb-4 text-xs text-red-600 bg-red-50 p-3 rounded-xl">{error}</p>}

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Add Form */}
          <div className="lg:col-span-1">
            <div className={`rounded-3xl bg-white p-6 shadow-soft-card sticky top-24 ${activeTab === 'archived' ? 'opacity-50 pointer-events-none' : ''}`}>
              <h2 className="text-lg font-semibold text-slate-800 mb-4">{editingId ? 'Edit Transaction' : 'Record Transaction'}</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-700">Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full rounded-2xl border-slate-200 bg-slate-50 p-3 text-sm focus:border-farm-orange focus:ring-farm-orange"
                  >
                    <option value="Sale">Sale (Revenue)</option>
                    <option value="Purchase">Purchase (Investment)</option>
                  </select>
                </div>
                
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-700">Category name</label>
                  <input
                    type="text" required placeholder="e.g. Chickens, Feed, Medicine"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-2xl border-slate-200 bg-slate-50 p-3 text-sm focus:border-farm-orange focus:ring-farm-orange"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-700">Quantity (e.g., kg or cars)</label>
                  <input
                    type="number" required min="0.01" step="0.01"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full rounded-2xl border-slate-200 bg-slate-50 p-3 text-sm focus:border-farm-orange focus:ring-farm-orange"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-700">Unit Price</label>
                  <input
                    type="number" required min="0" step="1"
                    value={unitPrice}
                    onChange={(e) => setUnitPrice(Number(e.target.value))}
                    className="w-full rounded-2xl border-slate-200 bg-slate-50 p-3 text-sm focus:border-farm-orange focus:ring-farm-orange"
                  />
                </div>
                
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-700">Total Calculation</label>
                  <div className="w-full rounded-2xl border border-transparent bg-slate-100 p-3 text-sm font-semibold text-slate-700 opacity-70">
                    {formatMoney(quantity * unitPrice)}
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-700">Notes / Description (Optional)</label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full rounded-2xl border-slate-200 bg-slate-50 p-3 text-sm focus:border-farm-orange focus:ring-farm-orange"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button type="submit" className="flex-1 rounded-full bg-farm-orange py-3 text-sm font-bold text-white transition hover:bg-orange-600 shadow-md">
                    {editingId ? 'Update Record' : 'Save Record'}
                  </button>
                  {editingId && (
                    <button type="button" onClick={cancelEdit} className="rounded-full bg-slate-200 px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-300">
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* History */}
          <div className="lg:col-span-2">
            <h2 className="text-lg font-semibold text-slate-800 mb-4 px-2">{activeTab === 'current' ? 'Transaction History' : 'Archived History'}</h2>
            <div className="space-y-4">
              {loading ? (
                <div className="rounded-3xl bg-white p-5 text-sm text-slate-600 shadow-soft-card">Loading transactions...</div>
              ) : transactions.length === 0 ? (
                <div className="rounded-3xl bg-white p-5 text-sm text-slate-600 shadow-soft-card">No records found in this view.</div>
              ) : (
                transactions.map((tx) => (
                  <article key={tx._id} className="relative rounded-3xl bg-white p-5 shadow-soft-card flex items-center justify-between gap-4 transition hover:shadow-md">
                    <div className="flex items-center gap-4">
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg shadow-sm
                        ${tx.type === 'Sale' ? 'bg-farm-green text-white' : 'bg-slate-200 text-slate-600'}`}
                      >
                        {tx.type === 'Sale' ? '+' : '-'}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-800">{tx.category}</h4>
                        <p className="text-xs text-slate-500">Qty: {tx.quantity} &times; {formatMoney(tx.unitPrice)}</p>
                        {tx.description && <p className="text-[10px] text-slate-400 mt-1">{tx.description}</p>}
                      </div>
                    </div>
                    <div className="text-right flex flex-col items-end pr-8">
                      <p className={`text-sm font-bold ${tx.type === 'Sale' ? 'text-farm-green' : 'text-slate-700'}`}>
                        {tx.type === 'Sale' ? '+' : '-'}{formatMoney(tx.totalAmount)}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-1">{new Date(tx.date).toLocaleDateString()}</p>
                    </div>

                    {/* Action buttons */}
                    <div className="absolute top-1/2 -translate-y-1/2 right-3 flex flex-col gap-1">
                      <button 
                        onClick={() => handleEditClick(tx)}
                        className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:text-farm-orange hover:bg-orange-50 transition"
                      >
                        <PencilSquareIcon className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteClick(tx._id)}
                        className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:text-red-500 hover:bg-red-50 transition"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>

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
