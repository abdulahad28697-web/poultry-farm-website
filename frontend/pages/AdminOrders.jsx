import React, { useEffect, useMemo, useState } from 'react';
import { fetchAdminOrders, updateOrderStatus } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

const orderStatuses = [
  'pending',
  'confirmed',
  'processing',
  'out_for_delivery',
  'delivered',
  'cancelled'
];

function labelizeStatus(status) {
  return status.replaceAll('_', ' ');
}

export default function AdminOrders() {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [draftStatusByOrder, setDraftStatusByOrder] = useState({});
  const [draftNoteByOrder, setDraftNoteByOrder] = useState({});
  const [loading, setLoading] = useState(true);
  const [savingOrderId, setSavingOrderId] = useState('');
  const [error, setError] = useState('');

  async function loadOrders(filter = '') {
    setLoading(true);
    setError('');

    try {
      const data = await fetchAdminOrders(token, filter);
      setOrders(data.orders || []);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrders(statusFilter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const summary = useMemo(() => {
    return orders.reduce(
      (accumulator, order) => {
        accumulator.total += 1;
        if (order.status === 'delivered') {
          accumulator.delivered += 1;
        }
        if (order.status === 'pending') {
          accumulator.pending += 1;
        }
        return accumulator;
      },
      {
        total: 0,
        delivered: 0,
        pending: 0
      }
    );
  }, [orders]);

  async function handleStatusUpdate(orderId) {
    const status = draftStatusByOrder[orderId];
    const note = draftNoteByOrder[orderId] || '';

    if (!status) {
      return;
    }

    setSavingOrderId(orderId);
    setError('');

    try {
      const response = await updateOrderStatus(orderId, { status, note }, token);
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId
            ? {
                ...order,
                ...response.order
              }
            : order
        )
      );
      setDraftNoteByOrder((prev) => ({ ...prev, [orderId]: '' }));
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSavingOrderId('');
    }
  }

  return (
    <div className="section-padding">
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        <header className="max-w-4xl">
          <p className="inline-flex rounded-full bg-farm-beige-dark px-3 py-1 text-xs font-semibold tracking-wide text-farm-brown">
            ADMIN ORDERS
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
            Manage customer orders and status updates.
          </h1>
          <p className="mt-3 text-sm text-slate-700">
            Filter orders, review customer details, and move each order through
            your delivery pipeline.
          </p>
        </header>

        <section className="mt-7 grid gap-3 text-xs md:grid-cols-3 md:text-sm">
          <div className="rounded-2xl bg-white p-4 shadow-soft-card">
            <p className="text-slate-500">Total orders</p>
            <p className="mt-1 text-lg font-semibold text-farm-brown">{summary.total}</p>
          </div>
          <div className="rounded-2xl bg-white p-4 shadow-soft-card">
            <p className="text-slate-500">Pending orders</p>
            <p className="mt-1 text-lg font-semibold text-farm-brown">{summary.pending}</p>
          </div>
          <div className="rounded-2xl bg-white p-4 shadow-soft-card">
            <p className="text-slate-500">Delivered orders</p>
            <p className="mt-1 text-lg font-semibold text-farm-brown">{summary.delivered}</p>
          </div>
        </section>

        <div className="mt-6 flex flex-wrap items-center gap-3 rounded-2xl bg-white p-4 shadow-soft-card">
          <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Filter by status
          </label>
          <select
            className="h-9 rounded-full border border-slate-300 px-3 text-sm"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <option value="">All statuses</option>
            {orderStatuses.map((status) => (
              <option key={status} value={status}>
                {labelizeStatus(status)}
              </option>
            ))}
          </select>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => loadOrders(statusFilter)}
          >
            Refresh
          </button>
        </div>

        {error ? (
          <p className="mt-4 rounded-2xl bg-red-50 p-3 text-xs text-red-600">{error}</p>
        ) : null}

        {loading ? (
          <div className="mt-6 rounded-3xl bg-white p-5 text-sm text-slate-600 shadow-soft-card">
            Loading orders...
          </div>
        ) : null}

        {!loading && orders.length === 0 ? (
          <div className="mt-6 rounded-3xl bg-white p-5 text-sm text-slate-600 shadow-soft-card">
            No orders found for the selected filter.
          </div>
        ) : null}

        {!loading && orders.length > 0 ? (
          <section className="mt-6 space-y-4">
            {orders.map((order) => {
              const currentDraftStatus = draftStatusByOrder[order._id] || order.status;

              return (
                <article
                  key={order._id}
                  className="rounded-3xl bg-white p-5 text-sm text-slate-700 shadow-soft-card"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-farm-green-dark">
                        {order.orderNumber}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {new Date(order.createdAt).toLocaleString()}
                      </p>
                      <p className="mt-2 text-xs">
                        Customer:{' '}
                        <span className="font-semibold">
                          {order.user?.name || 'Unknown'} ({order.user?.email || 'N/A'})
                        </span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-500">Current status</p>
                      <p className="font-semibold capitalize text-farm-brown">
                        {labelizeStatus(order.status)}
                      </p>
                    </div>
                  </div>

                  <ul className="mt-4 space-y-2 rounded-2xl bg-farm-beige-dark/60 p-3 text-xs md:text-sm">
                    {order.items.map((item) => (
                      <li key={`${order._id}-${item.productId}`} className="flex justify-between gap-3">
                        <span>
                          {item.name} × {item.quantity}
                        </span>
                        <span className="font-semibold">
                          {item.unitPrice
                            ? `PKR ${(item.unitPrice * item.quantity).toLocaleString()}`
                            : item.priceNote || 'Rate on confirmation'}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-3 grid gap-2 text-xs md:grid-cols-3 md:text-sm">
                    <p>
                      <span className="font-semibold">Phone:</span> {order.phone}
                    </p>
                    <p>
                      <span className="font-semibold">Address:</span> {order.address}
                    </p>
                    <p>
                      <span className="font-semibold">Subtotal:</span> PKR{' '}
                      {(order.subtotal || 0).toLocaleString()}
                    </p>
                  </div>

                  <div className="mt-4 grid gap-3 md:grid-cols-[1fr,1.4fr,auto]">
                    <select
                      value={currentDraftStatus}
                      onChange={(event) =>
                        setDraftStatusByOrder((prev) => ({
                          ...prev,
                          [order._id]: event.target.value
                        }))
                      }
                      className="h-10 rounded-full border border-slate-300 px-3 text-sm"
                    >
                      {orderStatuses.map((status) => (
                        <option key={status} value={status}>
                          {labelizeStatus(status)}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      placeholder="Optional note for status change"
                      value={draftNoteByOrder[order._id] || ''}
                      onChange={(event) =>
                        setDraftNoteByOrder((prev) => ({
                          ...prev,
                          [order._id]: event.target.value
                        }))
                      }
                      className="h-10 rounded-full border border-slate-300 px-4 text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => handleStatusUpdate(order._id)}
                      disabled={savingOrderId === order._id}
                      className="btn-primary disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {savingOrderId === order._id ? 'Saving...' : 'Update'}
                    </button>
                  </div>
                </article>
              );
            })}
          </section>
        ) : null}
      </div>
    </div>
  );
}
