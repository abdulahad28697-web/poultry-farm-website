import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import {
  fetchTools, addTool, updateTool, deleteTool,
  fetchFeeds, addFeed, updateFeed, deleteFeed,
  fetchAccessories, addAccessory, updateAccessory, deleteAccessory
} from '../services/api.js';

export default function AdminInventory() {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState('tools'); // 'tools' | 'feed' | 'accessories'

  // Loading & Error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Data states
  const [tools, setTools] = useState([]);
  const [feeds, setFeeds] = useState([]);
  const [accessories, setAccessories] = useState([]);

  // Search filter
  const [searchTerm, setSearchTerm] = useState('');

  // Form Modal state
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  // Form Field states
  const [toolForm, setToolForm] = useState({ name: '', sku: '', quantity: 0, condition: 'Good', lastServiced: '', cost: 0 });
  const [feedForm, setFeedForm] = useState({ name: '', type: '', quantity: 0, unit: 'bags', cost: 0, expirationDate: '' });
  const [accessoryForm, setAccessoryForm] = useState({ name: '', category: '', quantity: 0, unit: 'pcs', location: '', cost: 0 });

  // Load active tab's data
  async function loadData() {
    setLoading(true);
    setError('');
    try {
      if (activeTab === 'tools') {
        const res = await fetchTools(token);
        setTools(res.tools || []);
      } else if (activeTab === 'feed') {
        const res = await fetchFeeds(token);
        setFeeds(res.feeds || []);
      } else if (activeTab === 'accessories') {
        const res = await fetchAccessories(token);
        setAccessories(res.accessories || []);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch inventory records.');
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
    if (!window.confirm('Are you sure you want to delete this inventory item?')) return;
    setError('');
    try {
      if (activeTab === 'tools') {
        await deleteTool(id, token);
        setTools(tools.filter(t => t._id !== id));
        triggerSuccess('Tool deleted successfully!');
      } else if (activeTab === 'feed') {
        await deleteFeed(id, token);
        setFeeds(feeds.filter(f => f._id !== id));
        triggerSuccess('Feed record deleted successfully!');
      } else if (activeTab === 'accessories') {
        await deleteAccessory(id, token);
        setAccessories(accessories.filter(a => a._id !== id));
        triggerSuccess('Farm accessory deleted successfully!');
      }
    } catch (err) {
      setError(err.message || 'Failed to delete item.');
    }
  }

  // Edit Initiator
  function openEditModal(item) {
    setIsEditMode(true);
    setCurrentId(item._id);
    if (activeTab === 'tools') {
      setToolForm({
        name: item.name || '',
        sku: item.sku || '',
        quantity: item.quantity || 0,
        condition: item.condition || 'Good',
        lastServiced: item.lastServiced ? new Date(item.lastServiced).toISOString().split('T')[0] : '',
        cost: item.cost || 0
      });
    } else if (activeTab === 'feed') {
      setFeedForm({
        name: item.name || '',
        type: item.type || '',
        quantity: item.quantity || 0,
        unit: item.unit || 'bags',
        cost: item.cost || 0,
        expirationDate: item.expirationDate ? new Date(item.expirationDate).toISOString().split('T')[0] : ''
      });
    } else if (activeTab === 'accessories') {
      setAccessoryForm({
        name: item.name || '',
        category: item.category || '',
        quantity: item.quantity || 0,
        unit: item.unit || 'pcs',
        location: item.location || '',
        cost: item.cost || 0
      });
    }
    setShowModal(true);
  }

  // Create Initiator
  function openCreateModal() {
    setIsEditMode(false);
    setCurrentId(null);
    setToolForm({ name: '', sku: '', quantity: 0, condition: 'Good', lastServiced: '', cost: 0 });
    setFeedForm({ name: '', type: '', quantity: 0, unit: 'bags', cost: 0, expirationDate: '' });
    setAccessoryForm({ name: '', category: '', quantity: 0, unit: 'pcs', location: '', cost: 0 });
    setShowModal(true);
  }

  // Form Submit handler
  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      if (activeTab === 'tools') {
        const payload = { ...toolForm, quantity: Number(toolForm.quantity), cost: Number(toolForm.cost) };
        if (!payload.lastServiced) delete payload.lastServiced;

        if (isEditMode) {
          await updateTool(currentId, payload, token);
          triggerSuccess('Tool updated successfully!');
        } else {
          await addTool(payload, token);
          triggerSuccess('New tool added successfully!');
        }
      } else if (activeTab === 'feed') {
        const payload = { ...feedForm, quantity: Number(feedForm.quantity), cost: Number(feedForm.cost) };
        if (!payload.expirationDate) delete payload.expirationDate;

        if (isEditMode) {
          await updateFeed(currentId, payload, token);
          triggerSuccess('Feed record updated successfully!');
        } else {
          await addFeed(payload, token);
          triggerSuccess('New feed record added successfully!');
        }
      } else if (activeTab === 'accessories') {
        const payload = { ...accessoryForm, quantity: Number(accessoryForm.quantity), cost: Number(accessoryForm.cost) };

        if (isEditMode) {
          await updateAccessory(currentId, payload, token);
          triggerSuccess('Farm accessory updated successfully!');
        } else {
          await addAccessory(payload, token);
          triggerSuccess('New farm accessory added successfully!');
        }
      }
      setShowModal(false);
      loadData();
    } catch (err) {
      setError(err.message || 'Error saving record.');
    }
  }

  // Calculated HUD stats
  const totalTools = tools.reduce((acc, curr) => acc + curr.quantity, 0);
  const totalBagsOfFeed = feeds.reduce((acc, curr) => acc + (curr.unit === 'bags' ? curr.quantity : 0), 0);
  const totalAccValuation = accessories.reduce((acc, curr) => acc + (curr.cost * curr.quantity), 0);
  const brokenToolsCount = tools.filter(t => t.condition === 'Broken').length;

  // Filter lists based on search term
  const filteredTools = tools.filter(t => t.name.toLowerCase().includes(searchTerm.toLowerCase()) || (t.sku && t.sku.toLowerCase().includes(searchTerm.toLowerCase())));
  const filteredFeeds = feeds.filter(f => f.name.toLowerCase().includes(searchTerm.toLowerCase()) || f.type.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredAccessories = accessories.filter(a => a.name.toLowerCase().includes(searchTerm.toLowerCase()) || a.category.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="section-padding">
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        
        {/* Header Section */}
        <header className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="inline-flex rounded-full bg-farm-beige-dark px-3 py-1 text-xs font-semibold tracking-wide text-farm-brown">
              ADMIN CONTROL CENTER
            </p>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              Inventory Management
            </h1>
            <p className="mt-2 text-sm text-slate-600 max-w-2xl">
              Manage tools, livestock feed, and poultry farm accessories. Keep track of current levels, maintenance cycles, and values.
            </p>
          </div>
          <div>
            <button
              onClick={openCreateModal}
              className="btn-primary"
            >
              + Add New Item
            </button>
          </div>
        </header>

        {/* HUD Scoreboard */}
        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-3xl border border-orange-100 bg-white p-5 shadow-soft-card">
            <span className="text-2xl">🔧</span>
            <h3 className="mt-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Total Tools Logged</h3>
            <p className="mt-1 text-2xl font-bold text-farm-brown">{tools.length} ({totalTools} items)</p>
          </div>
          <div className="rounded-3xl border border-orange-100 bg-white p-5 shadow-soft-card">
            <span className="text-2xl">🌾</span>
            <h3 className="mt-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Feed Stock (Bags)</h3>
            <p className="mt-1 text-2xl font-bold text-farm-brown">{totalBagsOfFeed} Bags</p>
          </div>
          <div className="rounded-3xl border border-orange-100 bg-white p-5 shadow-soft-card">
            <span className="text-2xl">💰</span>
            <h3 className="mt-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Accessories Valuation</h3>
            <p className="mt-1 text-2xl font-bold text-farm-green">${totalAccValuation.toLocaleString()}</p>
          </div>
          <div className="rounded-3xl border border-orange-100 bg-white p-5 shadow-soft-card">
            <span className="text-2xl">⚠️</span>
            <h3 className="mt-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Broken Tools Warning</h3>
            <p className="mt-1 text-2xl font-bold text-red-600">{brokenToolsCount} needing repairs</p>
          </div>
        </section>

        {/* Tabs and Search */}
        <div className="mt-10 flex flex-col gap-4 border-b border-orange-100 pb-5 sm:flex-row sm:items-center sm:justify-between">
          {/* Tab selectors */}
          <div className="flex gap-2 rounded-2xl bg-orange-50 p-1.5 self-start">
            {[
              { id: 'tools', label: '🔧 Tools Management' },
              { id: 'feed', label: '🌾 Feed Inventory' },
              { id: 'accessories', label: '🏡 Other Accessories' }
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
              <span className="animate-spin text-lg">⏳</span> Loading inventory data...
            </div>
          ) : (
            <>
              {/* TOOLS TAB VIEW */}
              {activeTab === 'tools' && (
                filteredTools.length === 0 ? (
                  <div className="rounded-3xl bg-white p-10 text-center text-sm text-slate-500 shadow-soft-card border border-orange-100">
                    No tools found matching your search. Add a new tool to get started!
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredTools.map(tool => (
                      <article key={tool._id} className="rounded-3xl border border-orange-100 bg-white p-6 shadow-soft-card hover:shadow-md transition duration-200 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between">
                            <h3 className="font-semibold text-slate-800">{tool.name}</h3>
                            <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                              tool.condition === 'Good' ? 'bg-green-100 text-farm-green' :
                              tool.condition === 'Needs Repair' ? 'bg-amber-100 text-amber-600' : 'bg-red-100 text-red-600'
                            }`}>
                              {tool.condition}
                            </span>
                          </div>
                          <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mt-1">SKU: {tool.sku || 'N/A'}</p>
                          
                          <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-slate-600 bg-farm-beige p-3 rounded-2xl">
                            <div>
                              <span className="block text-[10px] text-slate-400 uppercase font-semibold">Quantity</span>
                              <span className="font-bold text-farm-brown text-sm">{tool.quantity}</span>
                            </div>
                            <div>
                              <span className="block text-[10px] text-slate-400 uppercase font-semibold">Cost Per Item</span>
                              <span className="font-bold text-farm-brown text-sm">${tool.cost || 0}</span>
                            </div>
                          </div>
                          
                          {tool.lastServiced && (
                            <p className="text-[11px] text-slate-500 mt-3 flex items-center gap-1">
                              <span>📅</span> Last Serviced: <strong className="text-slate-700">{new Date(tool.lastServiced).toLocaleDateString()}</strong>
                            </p>
                          )}
                        </div>
                        
                        <div className="mt-6 flex justify-end gap-2 border-t border-slate-100 pt-3">
                          <button
                            onClick={() => openEditModal(tool)}
                            className="rounded-full bg-orange-50 hover:bg-orange-100 text-farm-orange px-3 py-1.5 text-xs font-bold transition"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(tool._id)}
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

              {/* FEED TAB VIEW */}
              {activeTab === 'feed' && (
                filteredFeeds.length === 0 ? (
                  <div className="rounded-3xl bg-white p-10 text-center text-sm text-slate-500 shadow-soft-card border border-orange-100">
                    No feed inventory records found. Add new feed supplies to track!
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredFeeds.map(feed => {
                      const isExpired = feed.expirationDate && new Date(feed.expirationDate) < new Date();
                      return (
                        <article key={feed._id} className="rounded-3xl border border-orange-100 bg-white p-6 shadow-soft-card hover:shadow-md transition duration-200 flex flex-col justify-between">
                          <div>
                            <div className="flex items-start justify-between">
                              <h3 className="font-semibold text-slate-800">{feed.name}</h3>
                              <span className="inline-flex rounded-full bg-orange-100 text-farm-brown px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                                {feed.type}
                              </span>
                            </div>
                            
                            <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-slate-600 bg-farm-beige p-3 rounded-2xl">
                              <div>
                                <span className="block text-[10px] text-slate-400 uppercase font-semibold">Available Stock</span>
                                <span className="font-bold text-farm-brown text-sm">{feed.quantity} {feed.unit}</span>
                              </div>
                              <div>
                                <span className="block text-[10px] text-slate-400 uppercase font-semibold">Price Paid</span>
                                <span className="font-bold text-farm-brown text-sm">${feed.cost || 0}</span>
                              </div>
                            </div>
                            
                            {feed.expirationDate && (
                              <p className={`text-[11px] mt-3 flex items-center gap-1 font-medium ${isExpired ? 'text-red-600 bg-red-50 px-2 py-1 rounded-xl self-start' : 'text-slate-500'}`}>
                                <span>📅</span> Expiry: <strong className={isExpired ? 'text-red-700' : 'text-slate-700'}>{new Date(feed.expirationDate).toLocaleDateString()}</strong> {isExpired && "(Expired!)"}
                              </p>
                            )}
                          </div>
                          
                          <div className="mt-6 flex justify-end gap-2 border-t border-slate-100 pt-3">
                            <button
                              onClick={() => openEditModal(feed)}
                              className="rounded-full bg-orange-50 hover:bg-orange-100 text-farm-orange px-3 py-1.5 text-xs font-bold transition"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(feed._id)}
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

              {/* FARM ACCESSORIES VIEW */}
              {activeTab === 'accessories' && (
                filteredAccessories.length === 0 ? (
                  <div className="rounded-3xl bg-white p-10 text-center text-sm text-slate-500 shadow-soft-card border border-orange-100">
                    No farm accessories found. Start logging fencing, heaters, or water feeders.
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredAccessories.map(acc => (
                      <article key={acc._id} className="rounded-3xl border border-orange-100 bg-white p-6 shadow-soft-card hover:shadow-md transition duration-200 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between">
                            <h3 className="font-semibold text-slate-800">{acc.name}</h3>
                            <span className="inline-flex rounded-full bg-green-100 text-farm-green-dark px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                              {acc.category}
                            </span>
                          </div>
                          
                          <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-slate-600 bg-farm-beige p-3 rounded-2xl">
                            <div>
                              <span className="block text-[10px] text-slate-400 uppercase font-semibold">Quantity</span>
                              <span className="font-bold text-farm-brown text-sm">{acc.quantity} {acc.unit}</span>
                            </div>
                            <div>
                              <span className="block text-[10px] text-slate-400 uppercase font-semibold">Total Cost</span>
                              <span className="font-bold text-farm-brown text-sm">${(acc.cost * acc.quantity).toLocaleString()}</span>
                            </div>
                          </div>
                          
                          {acc.location && (
                            <p className="text-[11px] text-slate-500 mt-3 flex items-center gap-1">
                              <span>📍</span> Storage Location: <strong className="text-slate-700">{acc.location}</strong>
                            </p>
                          )}
                        </div>
                        
                        <div className="mt-6 flex justify-end gap-2 border-t border-slate-100 pt-3">
                          <button
                            onClick={() => openEditModal(acc)}
                            className="rounded-full bg-orange-50 hover:bg-orange-100 text-farm-orange px-3 py-1.5 text-xs font-bold transition"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(acc._id)}
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

      {/* CRUD MODAL FOR ADD/EDIT */}
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
              {isEditMode ? '🔧 Edit Inventory Item' : '✨ Add New Inventory Item'}
            </h2>
            <p className="text-xs text-slate-500 mt-1 uppercase tracking-wide font-semibold">
              Module: {activeTab}
            </p>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-xs text-slate-700">
              
              {/* FORM FIELDS FOR TOOLS */}
              {activeTab === 'tools' && (
                <>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wide text-slate-400">Tool Name *</label>
                    <input
                      type="text"
                      required
                      value={toolForm.name}
                      onChange={(e) => setToolForm({ ...toolForm, name: e.target.value })}
                      className="mt-1 h-10 w-full rounded-full border border-orange-200 px-4 text-xs focus:border-farm-orange focus:outline-none"
                      placeholder="e.g. Electric Debeaker, Egg Trays"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wide text-slate-400">SKU / Code</label>
                      <input
                        type="text"
                        value={toolForm.sku}
                        onChange={(e) => setToolForm({ ...toolForm, sku: e.target.value })}
                        className="mt-1 h-10 w-full rounded-full border border-orange-200 px-4 text-xs focus:border-farm-orange focus:outline-none"
                        placeholder="TL-903"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wide text-slate-400">Quantity *</label>
                      <input
                        type="number"
                        required
                        min="0"
                        value={toolForm.quantity}
                        onChange={(e) => setToolForm({ ...toolForm, quantity: e.target.value })}
                        className="mt-1 h-10 w-full rounded-full border border-orange-200 px-4 text-xs focus:border-farm-orange focus:outline-none"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wide text-slate-400">Condition *</label>
                      <select
                        value={toolForm.condition}
                        onChange={(e) => setToolForm({ ...toolForm, condition: e.target.value })}
                        className="mt-1 h-10 w-full rounded-full border border-orange-200 px-4 text-xs focus:border-farm-orange focus:outline-none bg-white"
                      >
                        <option value="Good">Good</option>
                        <option value="Needs Repair">Needs Repair</option>
                        <option value="Broken">Broken</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wide text-slate-400">Cost Per Unit ($)</label>
                      <input
                        type="number"
                        min="0"
                        value={toolForm.cost}
                        onChange={(e) => setToolForm({ ...toolForm, cost: e.target.value })}
                        className="mt-1 h-10 w-full rounded-full border border-orange-200 px-4 text-xs focus:border-farm-orange focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wide text-slate-400">Last Serviced Date</label>
                    <input
                      type="date"
                      value={toolForm.lastServiced}
                      onChange={(e) => setToolForm({ ...toolForm, lastServiced: e.target.value })}
                      className="mt-1 h-10 w-full rounded-full border border-orange-200 px-4 text-xs focus:border-farm-orange focus:outline-none"
                    />
                  </div>
                </>
              )}

              {/* FORM FIELDS FOR FEED */}
              {activeTab === 'feed' && (
                <>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wide text-slate-400">Feed Brand/Name *</label>
                    <input
                      type="text"
                      required
                      value={feedForm.name}
                      onChange={(e) => setFeedForm({ ...feedForm, name: e.target.value })}
                      className="mt-1 h-10 w-full rounded-full border border-orange-200 px-4 text-xs focus:border-farm-orange focus:outline-none"
                      placeholder="e.g. Supreme Layer Crumbles"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wide text-slate-400">Feed Type *</label>
                      <input
                        type="text"
                        required
                        value={feedForm.type}
                        onChange={(e) => setFeedForm({ ...feedForm, type: e.target.value })}
                        className="mt-1 h-10 w-full rounded-full border border-orange-200 px-4 text-xs focus:border-farm-orange focus:outline-none"
                        placeholder="Chick Starter / Finisher"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wide text-slate-400">Unit (e.g. bags, kg) *</label>
                      <input
                        type="text"
                        required
                        value={feedForm.unit}
                        onChange={(e) => setFeedForm({ ...feedForm, unit: e.target.value })}
                        className="mt-1 h-10 w-full rounded-full border border-orange-200 px-4 text-xs focus:border-farm-orange focus:outline-none"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wide text-slate-400">Quantity *</label>
                      <input
                        type="number"
                        required
                        min="0"
                        value={feedForm.quantity}
                        onChange={(e) => setFeedForm({ ...feedForm, quantity: e.target.value })}
                        className="mt-1 h-10 w-full rounded-full border border-orange-200 px-4 text-xs focus:border-farm-orange focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wide text-slate-400">Cost ($)</label>
                      <input
                        type="number"
                        min="0"
                        value={feedForm.cost}
                        onChange={(e) => setFeedForm({ ...feedForm, cost: e.target.value })}
                        className="mt-1 h-10 w-full rounded-full border border-orange-200 px-4 text-xs focus:border-farm-orange focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wide text-slate-400">Expiration Date</label>
                    <input
                      type="date"
                      value={feedForm.expirationDate}
                      onChange={(e) => setFeedForm({ ...feedForm, expirationDate: e.target.value })}
                      className="mt-1 h-10 w-full rounded-full border border-orange-200 px-4 text-xs focus:border-farm-orange focus:outline-none"
                    />
                  </div>
                </>
              )}

              {/* FORM FIELDS FOR ACCESSORIES */}
              {activeTab === 'accessories' && (
                <>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wide text-slate-400">Accessory Name *</label>
                    <input
                      type="text"
                      required
                      value={accessoryForm.name}
                      onChange={(e) => setAccessoryForm({ ...accessoryForm, name: e.target.value })}
                      className="mt-1 h-10 w-full rounded-full border border-orange-200 px-4 text-xs focus:border-farm-orange focus:outline-none"
                      placeholder="e.g. Infrared Heat Lamp"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wide text-slate-400">Category *</label>
                      <input
                        type="text"
                        required
                        value={accessoryForm.category}
                        onChange={(e) => setAccessoryForm({ ...accessoryForm, category: e.target.value })}
                        className="mt-1 h-10 w-full rounded-full border border-orange-200 px-4 text-xs focus:border-farm-orange focus:outline-none"
                        placeholder="Fencing / Watering / Heating"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wide text-slate-400">Unit *</label>
                      <input
                        type="text"
                        required
                        value={accessoryForm.unit}
                        onChange={(e) => setAccessoryForm({ ...accessoryForm, unit: e.target.value })}
                        className="mt-1 h-10 w-full rounded-full border border-orange-200 px-4 text-xs focus:border-farm-orange focus:outline-none"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wide text-slate-400">Quantity *</label>
                      <input
                        type="number"
                        required
                        min="0"
                        value={accessoryForm.quantity}
                        onChange={(e) => setAccessoryForm({ ...accessoryForm, quantity: e.target.value })}
                        className="mt-1 h-10 w-full rounded-full border border-orange-200 px-4 text-xs focus:border-farm-orange focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wide text-slate-400">Unit Cost ($)</label>
                      <input
                        type="number"
                        min="0"
                        value={accessoryForm.cost}
                        onChange={(e) => setAccessoryForm({ ...accessoryForm, cost: e.target.value })}
                        className="mt-1 h-10 w-full rounded-full border border-orange-200 px-4 text-xs focus:border-farm-orange focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wide text-slate-400">Storage / Deployment Location</label>
                    <input
                      type="text"
                      value={accessoryForm.location}
                      onChange={(e) => setAccessoryForm({ ...accessoryForm, location: e.target.value })}
                      className="mt-1 h-10 w-full rounded-full border border-orange-200 px-4 text-xs focus:border-farm-orange focus:outline-none"
                      placeholder="e.g. Shed B, Barn 1"
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
