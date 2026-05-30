import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { submitEnquiry } from '../services/api.js';

const stats = [
  { label: 'Healthy Birds Raised', value: '45,000+' },
  { label: 'Fresh Eggs / Day', value: '32,000+' },
  { label: 'On‑Time Deliveries', value: '98%' }
];

const products = [
  {
    name: 'Farm Fresh Eggs',
    description: 'Clean, graded eggs packed the same day they are laid.',
    price: 'PKR 320 / dozen',
    image: '/images/eggs.png'
  },
  {
    name: 'Broiler Chicken',
    description: 'Tender, uniform broiler birds for shops and restaurants.',
    price: 'PKR 750 / kg',
    image: '/images/hero-chickens.png'
  },
  {
    name: 'Desi Chicken',
    description: 'Slow-grown desi birds with rich traditional flavour.',
    price: 'PKR 1500 / bird',
    image: '/images/rooster.png'
  }
];

export default function Home() {
  const [enquiryData, setEnquiryData] = useState({ name: '', contact: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  async function handleEnquiry(e) {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await submitEnquiry({ ...enquiryData, topic: 'Quick enquiry' });
      setSuccess(true);
      setEnquiryData({ name: '', contact: '', message: '' });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-slate-900 text-white">
        <div className="absolute inset-0">
          <img
            src="/images/flock.png"
            alt="Poultry farm sheds with chickens"
            className="h-full w-full object-cover"
            loading="eager"
          />
          <div className="farm-hero-overlay absolute inset-0" />
        </div>

        <div className="relative mx-auto flex max-w-6xl flex-col gap-10 px-4 py-16 md:flex-row md:items-center">
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-200">
              FRESH FROM OUR FARM
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
              Fresh Poultry from Hussain Farms
              <span className="block text-farm-orange">
                Safely Raised, Carefully Delivered
              </span>
            </h1>
            <p className="mt-3 text-sm md:text-base text-slate-200">
              Hussain Farms is a modern poultry farm providing high‑quality
              eggs, chicken and day‑old chicks to homes, shops and restaurants
              across the region.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link to="/shop" className="btn-primary">
                Order Fresh Poultry Products
              </Link>
              <Link to="/about" className="btn-secondary">
                Learn about our farm
              </Link>
            </div>

            <div className="mt-7 grid grid-cols-3 gap-3 text-center text-xs md:text-sm">
              {stats.map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl bg-white/10 px-3 py-3 backdrop-blur-sm"
                >
                  <p className="text-[11px] uppercase tracking-wide text-orange-100">
                    {item.label}
                  </p>
                  <p className="mt-1 text-base font-semibold text-white">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="hidden flex-1 md:flex md:justify-end">
            <div className="w-72 rounded-3xl bg-white/10 p-3 backdrop-blur">
              <img
                src="/images/chicks.png"
                alt="Newly hatched chicks"
                className="h-44 w-full rounded-2xl object-cover"
                loading="lazy"
              />
              <p className="mt-3 text-xs text-orange-100">
                Clean sheds, controlled climate and regular veterinary checks
                keep our flocks healthy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About band */}
      <section className="section-padding">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-6 md:grid-cols-[1.4fr,1.2fr]">
            <div>
              <h2 className="section-title">About Our Poultry Farm</h2>
              <p className="section-subtitle">
                Hussain Farms combines disciplined farm routines with modern
                equipment to keep birds comfortable and products safe.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-slate-700">
                <li>• Bio‑secure sheds with strict cleanliness routines</li>
                <li>• Regular vaccination and health checks by farm vets</li>
                <li>• Fresh feed and clean water lines in every shed</li>
                <li>• Transparent records from hatching to delivery</li>
              </ul>
            </div>
            <div className="space-y-3">
              <div className="rounded-2xl bg-white p-4 shadow-soft-card">
                <p className="text-xs font-semibold text-farm-brown">
                  Trusted by shops &amp; restaurants
                </p>
                <p className="mt-2 text-sm text-slate-700">
                  Retailers, bakeries and restaurants depend on us for reliable
                  daily supply of eggs and poultry.
                </p>
              </div>
              <div className="rounded-2xl bg-farm-orange-soft p-4">
                <p className="text-xs font-semibold text-farm-brown">
                  Consistent quality, every batch
                </p>
                <p className="mt-2 text-sm text-slate-700">
                  Birds and eggs are graded before dispatch so you receive
                  uniform, sale‑ready products.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured products */}
      <section className="section-padding bg-white">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="section-title">Fresh Poultry Products</h2>
              <p className="section-subtitle">
                Order eggs, chicken and chicks directly from Hussain Farms.
              </p>
            </div>
            <Link to="/shop" className="btn-secondary">
              View all products
            </Link>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {products.map((product) => (
              <article
                key={product.name}
                className="flex flex-col overflow-hidden rounded-2xl bg-[#FFFDFB] shadow-soft-card transition hover:-translate-y-1 hover:shadow-xl"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-40 w-full object-cover"
                  loading="lazy"
                />
                <div className="flex flex-1 flex-col gap-2 p-4 text-sm text-slate-700">
                  <p className="text-xs font-semibold uppercase tracking-wide text-farm-orange">
                    Farm Product
                  </p>
                  <h3 className="text-base font-semibold text-farm-brown">
                    {product.name}
                  </h3>
                  <p>{product.description}</p>
                  <p className="mt-1 text-xs font-semibold text-farm-green">
                    {product.price}
                  </p>
                  <Link
                    to="/shop"
                    className="mt-2 text-xs font-semibold text-farm-orange hover:text-orange-600"
                  >
                    Add to order →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Simple process */}
      <section className="section-padding">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="section-title">From Hatching to Your Table</h2>
          <p className="section-subtitle">
            A clear, careful process ensures safe poultry products at every
            step.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-4 text-sm">
            {['Hatching', 'Feeding', 'Growth', 'Delivery'].map((step, index) => (
              <div
                key={step}
                className="rounded-2xl bg-white p-4 shadow-soft-card"
              >
                <p className="text-xs font-semibold text-farm-orange">
                  Step {index + 1}
                </p>
                <p className="mt-2 font-semibold text-farm-brown">{step}</p>
                <p className="mt-1 text-xs text-slate-600">
                  {step === 'Hatching' &&
                    'Strong chicks from carefully selected hatching eggs.'}
                  {step === 'Feeding' &&
                    'Balanced feed programs matched to each age group.'}
                  {step === 'Growth' &&
                    'Comfortable sheds with clean bedding and ventilation.'}
                  {step === 'Delivery' &&
                    'Timely deliveries to shops, hotels and homes.'}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact preview */}
      <section className="section-padding bg-farm-brown text-white">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-6 md:grid-cols-[1.4fr,1.2fr]">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">
                Connect With the Farm
              </h2>
              <p className="mt-2 text-sm text-orange-100">
                Share your order requirements and we’ll confirm availability,
                pricing and delivery times.
              </p>
              <div className="mt-4 space-y-1 text-sm">
                <p>Phone: +92 300 123 4567</p>
                <p>Email: orders@hussainfarms.com</p>
              </div>
            </div>
            <div className="rounded-2xl bg-transparent p-2">
              <p className="text-xs font-semibold text-orange-100">
                Quick enquiry
              </p>
              {success ? (
                <div className="mt-4 p-3 bg-farm-green text-white rounded-xl text-xs">
                  Thanks! We've received your enquiry and will be in touch shortly.
                </div>
              ) : (
                <form onSubmit={handleEnquiry} className="mt-3 space-y-3 text-xs">
                  <input
                    type="text"
                    required
                    value={enquiryData.name}
                    onChange={e => setEnquiryData(prev => ({...prev, name: e.target.value}))}
                    placeholder="Your name"
                    className="h-8 w-full rounded-full border border-orange-200/40 bg-white/10 px-3 text-xs text-white placeholder:text-orange-100/70 focus:outline-none"
                  />
                  <input
                    type="text"
                    required
                    value={enquiryData.contact}
                    onChange={e => setEnquiryData(prev => ({...prev, contact: e.target.value}))}
                    placeholder="Phone or email"
                    className="h-8 w-full rounded-full border border-orange-200/40 bg-white/10 px-3 text-xs text-white placeholder:text-orange-100/70 focus:outline-none"
                  />
                  <textarea
                    rows={3}
                    required
                    value={enquiryData.message}
                    onChange={e => setEnquiryData(prev => ({...prev, message: e.target.value}))}
                    placeholder="What would you like to order?"
                    className="w-full rounded-2xl border border-orange-200/20 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-orange-100/50 focus:border-farm-orange focus:outline-none"
                  />
                  {error && <p className="text-red-300 text-xs">{error}</p>}
                  <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-70">
                    {submitting ? 'Submitting...' : 'Submit enquiry'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}


