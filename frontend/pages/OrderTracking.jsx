import React, { useEffect, useMemo, useState } from 'react';
import { fetchMyOrders, fetchOrderByNumber } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

function labelizeStatus(status = '') {
  return status.replaceAll('_', ' ');
}

export default function OrderTracking() {
  const { token } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [trackingInput, setTrackingInput] = useState('');
  const [trackingError, setTrackingError] = useState('');
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [trackedOrder, setTrackedOrder] = useState(null);

  async function loadOrders() {
    setLoading(true);
    setError('');

    try {
      const data = await fetchMyOrders(token);
      setOrders(data.orders || []);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const summary = useMemo(() => {
    const now = new Date();
    const thisMonthOrders = orders.filter((order) => {
      const created = new Date(order.createdAt);
      return (
        created.getMonth() === now.getMonth() &&
        created.getFullYear() === now.getFullYear()
      );
    });

    const deliveredOrders = orders.filter((order) => order.status === 'delivered');
    const onTimePercentage = orders.length
      ? Math.round((deliveredOrders.length / orders.length) * 100)
      : 0;
    const totalValue = orders.reduce(
      (sum, order) => sum + Number(order.subtotal || 0),
      0
    );

    return {
      thisMonth: thisMonthOrders.length,
      onTimePercentage,
      totalValue
    };
  }, [orders]);

  async function handleTrackingSubmit(event) {
    event.preventDefault();
    setTrackingError('');
    setTrackedOrder(null);

    const orderNumber = trackingInput.trim();
    if (!orderNumber) {
      setTrackingError('Please enter a valid order number.');
      return;
    }

    setTrackingLoading(true);

    try {
      const data = await fetchOrderByNumber(orderNumber, token);
      setTrackedOrder(data.order);
    } catch (requestError) {
      setTrackingError(requestError.message);
    } finally {
      setTrackingLoading(false);
    }
  }

  return (
    <div className="section-padding">
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        <header className="max-w-3xl">
          <p className="inline-flex rounded-full bg-farm-beige-dark px-3 py-1 text-xs font-semibold tracking-wide text-farm-brown">
            ORDER TRACKING
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
            Track your Hussain Farms orders in one place.
          </h1>
          <p className="mt-4 text-sm md:text-base text-slate-700">
            View your recent orders, monitor delivery progress and search any
            order by order number.
          </p>
        </header>

        <section className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.7fr),minmax(0,1.3fr)]">
          <div className="space-y-5">
            <div className="rounded-3xl bg-white p-5 shadow-soft-card">
              <h2 className="text-lg font-semibold text-farm-brown">
                Track a specific order
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Enter your order number to view the latest status.
              </p>
              <form className="mt-4 flex flex-wrap gap-3" onSubmit={handleTrackingSubmit}>
                <input
                  type="text"
                  placeholder="e.g. HF-ORD-20260405-1234"
                  className="h-10 flex-1 min-w-[180px] rounded-full border border-slate-300 bg-farm-beige px-4 text-sm text-slate-800 placeholder:text-slate-400 focus:border-farm-green focus:outline-none focus:ring-2 focus:ring-farm-green/40"
                  value={trackingInput}
                  onChange={(event) => setTrackingInput(event.target.value)}
                />
                <button type="submit" className="btn-primary" disabled={trackingLoading}>
                  {trackingLoading ? 'Tracking...' : 'Track Order'}
                </button>
              </form>

              {trackingError ? (
                <p className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-xs text-red-600">
                  {trackingError}
                </p>
              ) : null}

              {trackedOrder ? (
                <div className="mt-4 rounded-2xl bg-farm-beige-dark/70 p-4 text-xs md:text-sm">
                  <p className="font-semibold text-farm-brown">{trackedOrder.orderNumber}</p>
                  <p className="mt-1 capitalize text-farm-green-dark">
                    Status: {labelizeStatus(trackedOrder.status)}
                  </p>
                  <p className="mt-1 text-slate-700">
                    Last update:{' '}
                    {new Date(trackedOrder.updatedAt).toLocaleString()}
                  </p>
                  <p className="mt-2 text-slate-700">
                    Subtotal: PKR {(trackedOrder.subtotal || 0).toLocaleString()}
                  </p>
                </div>
              ) : null}
            </div>

            <div className="rounded-3xl bg-farm-beige-dark/70 p-5 shadow-soft-card">
              <h2 className="text-base font-semibold text-farm-brown">Recent orders</h2>

              {loading ? (
                <p className="mt-3 text-sm text-slate-600">Loading orders...</p>
              ) : null}

              {error ? (
                <p className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-xs text-red-600">
                  {error}
                </p>
              ) : null}

              {!loading && !error && orders.length === 0 ? (
                <p className="mt-3 text-sm text-slate-600">
                  No orders found yet. Place your first order from the shop.
                </p>
              ) : null}

              {!loading && orders.length > 0 ? (
                <div className="mt-4 space-y-3 text-sm text-slate-700">
                  {orders.map((order) => (
                    <article
                      key={order._id}
                      className="flex flex-col gap-2 rounded-2xl bg-white p-3 md:flex-row md:items-center md:justify-between"
                    >
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-farm-green-dark">
                          {order.orderNumber}
                        </p>
                        <p className="text-xs text-slate-500">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                        <p className="mt-1 text-xs md:text-sm">
                          {order.items.map((item) => item.name).join(', ')}
                        </p>
                      </div>
                      <div className="text-right text-xs md:text-sm">
                        <p className="font-semibold text-farm-brown">
                          PKR {(order.subtotal || 0).toLocaleString()}
                        </p>
                        <p className="mt-1 text-[11px] capitalize text-farm-orange">
                          {labelizeStatus(order.status)}
                        </p>
                        <p className="mt-1 text-[11px] text-slate-500">
                          Updated {new Date(order.updatedAt).toLocaleString()}
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
              ) : null}
            </div>
          </div>

          <aside className="space-y-5 rounded-3xl bg-white p-5 shadow-soft-card">
            <h2 className="text-base font-semibold text-farm-brown">
              Order history overview
            </h2>
            <div className="grid grid-cols-3 gap-3 text-xs md:text-sm">
              <div className="rounded-2xl bg-farm-beige-dark p-3">
                <p className="text-[11px] text-slate-500">This month orders</p>
                <p className="mt-1 text-lg font-semibold text-farm-brown">
                  {summary.thisMonth}
                </p>
              </div>
              <div className="rounded-2xl bg-farm-beige-dark p-3">
                <p className="text-[11px] text-slate-500">Delivered ratio</p>
                <p className="mt-1 text-lg font-semibold text-farm-brown">
                  {summary.onTimePercentage}%
                </p>
              </div>
              <div className="rounded-2xl bg-farm-beige-dark p-3">
                <p className="text-[11px] text-slate-500">Total value</p>
                <p className="mt-1 text-lg font-semibold text-farm-brown">
                  PKR {summary.totalValue.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="rounded-2xl bg-farm-beige-dark p-4 text-xs md:text-sm text-slate-700">
              <p className="font-semibold text-farm-brown">
                Statements &amp; reconciliations
              </p>
              <p className="mt-2">
                For monthly statements, contact our team with your registered
                phone number and order details for account reconciliation.
              </p>
            </div>
          </aside>
        </section>
      </div>
    </div>
  );
}
