import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createOrder, fetchProducts } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';

export default function Shop() {
  const navigate = useNavigate();
  const { isAuthenticated, token } = useAuth();
  
  const { cart, orderItems, subtotal, handleQuantityChange, handleAddToCart, clearCart } = useCart();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await fetchProducts();
        setProducts(data.products || []);
      } catch (err) {
        console.error('Failed to load products', err);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  const [checkoutForm, setCheckoutForm] = useState({
    phone: '',
    address: '',
    notes: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  function handleCheckoutFieldChange(field, value) {
    setCheckoutForm((prev) => ({
      ...prev,
      [field]: value
    }));
  }

  async function handleCheckout(event) {
    event.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/shop' } } });
      return;
    }

    if (orderItems.length === 0) {
      setErrorMessage('Add at least one product before checkout.');
      return;
    }

    if (!checkoutForm.phone.trim() || !checkoutForm.address.trim()) {
      setErrorMessage('Phone and address are required to place an order.');
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        items: orderItems.map((item) => ({
          productId: item.product._id,
          name: item.product.name,
          quantity: item.quantity,
          unitPrice: item.product.price || 0,
          priceNote: item.product.price ? '' : item.product.priceNote || ''
        })),
        phone: checkoutForm.phone.trim(),
        address: checkoutForm.address.trim(),
        notes: checkoutForm.notes.trim()
      };

      const data = await createOrder(payload, token);
      setSuccessMessage(
        `Order placed successfully. Your order number is ${data.order.orderNumber}.`
      );
      clearCart();
      setCheckoutForm({
        phone: '',
        address: '',
        notes: ''
      });
    } catch (requestError) {
      setErrorMessage(requestError.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="section-padding">
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        <header className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="inline-flex rounded-full bg-farm-beige-dark px-3 py-1 text-xs font-semibold tracking-wide text-farm-brown">
              POULTRY SHOP
            </p>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
              Order fresh poultry products from Hussain Farms.
            </h1>
            <p className="mt-4 text-sm md:text-base text-slate-700">
              Select products, set delivery details and submit your order.
            </p>
          </div>
        </header>

        {!isAuthenticated ? (
          <div className="mt-6 rounded-2xl border border-orange-200 bg-orange-50 p-4 text-sm text-slate-700">
            Please{' '}
            <Link to="/login" className="font-semibold text-farm-green-dark">
              login as a user
            </Link>{' '}
            before checkout.
          </div>
        ) : null}

        <section className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,2.2fr),minmax(0,1.2fr)]">
          <div className="space-y-5">
            {loading ? (
              <div className="rounded-3xl bg-white p-5 text-sm text-slate-600 shadow-soft-card">
                Loading products...
              </div>
            ) : products.length === 0 ? (
              <div className="rounded-3xl bg-white p-5 text-sm text-slate-600 shadow-soft-card">
                No products available at the moment.
              </div>
            ) : (
              products.map((product) => {
              const quantity = cart[product._id]?.quantity || 0;

              return (
                <article
                  key={product._id}
                  className="flex flex-col gap-4 rounded-3xl bg-white p-4 text-sm text-slate-700 shadow-soft-card md:flex-row"
                >
                  <div className="h-32 w-full overflow-hidden rounded-2xl md:h-32 md:w-40">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-2">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <h2 className="text-base font-semibold text-farm-brown">
                          {product.name}
                        </h2>
                        <p className="mt-1 text-xs text-slate-600">
                          {product.description}
                        </p>
                      </div>
                      <div className="text-right text-xs">
                        {product.price ? (
                          <>
                            <p className="text-sm font-semibold text-farm-green-dark">
                              PKR {product.price.toLocaleString()}
                            </p>
                            <p className="text-[11px] text-slate-500">
                              {product.unit}
                            </p>
                          </>
                        ) : (
                          <p className="text-[11px] font-semibold text-farm-orange">
                            {product.priceNote}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                      <div className="inline-flex items-center rounded-full bg-farm-beige-dark/70 px-3 py-1 text-xs text-slate-700">
                        <span className="mr-2 text-[11px] uppercase tracking-wide text-farm-green-dark">
                          Quantity
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            handleQuantityChange(product, Math.max(0, quantity - 1))
                          }
                          className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-slate-700 shadow-sm"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          min="0"
                          className="mx-2 h-7 w-16 rounded-full border border-slate-200 bg-white px-2 text-center text-xs"
                          value={quantity}
                          onChange={(event) =>
                            handleQuantityChange(product, Number(event.target.value))
                          }
                        />
                        <button
                          type="button"
                          onClick={() => handleQuantityChange(product, quantity + 1)}
                          className="flex h-7 w-7 items-center justify-center rounded-full bg-farm-green text-white shadow-sm"
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleAddToCart(product)}
                        className="btn-primary"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </article>
              );
            }))}
          </div>

          <aside className="space-y-4 rounded-3xl bg-farm-beige-dark/70 p-5 shadow-soft-card">
            <h2 className="text-lg font-semibold text-farm-brown">Order summary</h2>
            {orderItems.length === 0 ? (
              <p className="text-sm text-slate-600">
                Add quantities for any product to start building your order.
              </p>
            ) : (
              <ul className="space-y-3 text-sm text-slate-700">
                {orderItems.map((item) => (
                  <li
                    key={item.product._id}
                    className="flex items-start justify-between gap-3 rounded-2xl bg-white p-3"
                  >
                    <div>
                      <p className="font-semibold text-farm-brown">{item.product.name}</p>
                      <p className="text-xs text-slate-500">
                        {item.quantity} x{' '}
                        {item.product.price
                          ? `PKR ${item.product.price.toLocaleString()}`
                          : item.product.priceNote || 'Rate on confirmation'}
                      </p>
                    </div>
                    {item.product.price ? (
                      <p className="text-xs font-semibold text-farm-green-dark">
                        PKR {(item.product.price * item.quantity).toLocaleString()}
                      </p>
                    ) : (
                      <p className="text-[11px] text-farm-orange">To be confirmed</p>
                    )}
                  </li>
                ))}
              </ul>
            )}

            <div className="space-y-2 border-t border-slate-300/60 pt-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Estimated subtotal</span>
                <span className="font-semibold text-farm-brown">
                  PKR {subtotal.toLocaleString()}
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Final pricing for market-linked products is confirmed by the
                Hussain Farms sales team.
              </p>
            </div>

            <form className="space-y-3 border-t border-slate-300/60 pt-3" onSubmit={handleCheckout}>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Phone number
                </label>
                <input
                  type="text"
                  value={checkoutForm.phone}
                  onChange={(event) =>
                    handleCheckoutFieldChange('phone', event.target.value)
                  }
                  className="mt-1 h-10 w-full rounded-full border border-slate-300 bg-white px-3 text-sm"
                  placeholder="+92..."
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Delivery address
                </label>
                <textarea
                  rows={2}
                  value={checkoutForm.address}
                  onChange={(event) =>
                    handleCheckoutFieldChange('address', event.target.value)
                  }
                  className="mt-1 w-full rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm"
                  placeholder="Enter full address"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Notes (optional)
                </label>
                <input
                  type="text"
                  value={checkoutForm.notes}
                  onChange={(event) =>
                    handleCheckoutFieldChange('notes', event.target.value)
                  }
                  className="mt-1 h-10 w-full rounded-full border border-slate-300 bg-white px-3 text-sm"
                  placeholder="Preferred delivery time, instructions..."
                />
              </div>

              {errorMessage ? (
                <p className="rounded-xl bg-red-50 px-3 py-2 text-xs text-red-600">
                  {errorMessage}
                </p>
              ) : null}

              {successMessage ? (
                <p className="rounded-xl bg-green-50 px-3 py-2 text-xs text-farm-green-dark">
                  {successMessage}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={submitting}
                className="btn-primary w-full justify-center disabled:cursor-not-allowed disabled:opacity-70"
              >
                {submitting ? 'Placing order...' : 'Proceed to Checkout'}
              </button>
            </form>
          </aside>
        </section>
      </div>
    </div>
  );
}
