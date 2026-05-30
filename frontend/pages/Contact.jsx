import React, { useState } from 'react';
import { submitEnquiry } from '../services/api.js';

export default function Contact() {
  const [enquiryData, setEnquiryData] = useState({ name: '', contact: '', topic: 'General enquiry', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  async function handleEnquiry(e) {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await submitEnquiry(enquiryData);
      setSuccess(true);
      setEnquiryData({ name: '', contact: '', topic: 'General enquiry', message: '' });
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
            CONTACT &amp; SUPPORT
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
            Get in touch with Hussain Farms.
          </h1>
          <p className="mt-4 text-sm md:text-base text-slate-700">
            Whether you need regular supply, one-time bulk orders or would like
            to visit the farm, our team is ready to assist you.
          </p>
        </header>

        <section className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.5fr),minmax(0,1.3fr)]">
          {/* Contact form */}
          <div className="rounded-3xl bg-white p-6 shadow-soft-card">
            <h2 className="text-base font-semibold text-farm-brown">
              Send us a message
            </h2>
            {success ? (
              <div className="mt-4 p-5 bg-farm-green-dark text-white rounded-2xl shadow-soft-card">
                <h3 className="font-semibold text-lg">Message Sent!</h3>
                <p className="text-sm mt-2">Thank you for reaching out to Hussain Farms. Our team will review your enquiry and contact you soon.</p>
              </div>
            ) : (
              <form onSubmit={handleEnquiry} className="mt-4 space-y-4 text-sm">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-xs font-medium text-slate-600">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={enquiryData.name}
                      onChange={e => setEnquiryData(prev => ({...prev, name: e.target.value}))}
                      className="mt-1 h-9 w-full rounded-full border border-slate-300 bg-farm-beige px-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-farm-green focus:outline-none focus:ring-2 focus:ring-farm-green/40"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600">
                      Phone Number or Email
                    </label>
                    <input
                      type="text"
                      required
                      value={enquiryData.contact}
                      onChange={e => setEnquiryData(prev => ({...prev, contact: e.target.value}))}
                      className="mt-1 h-9 w-full rounded-full border border-slate-300 bg-farm-beige px-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-farm-green focus:outline-none focus:ring-2 focus:ring-farm-green/40"
                      placeholder="Contact details"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600">
                    Topic
                  </label>
                  <select 
                    value={enquiryData.topic}
                    onChange={e => setEnquiryData(prev => ({...prev, topic: e.target.value}))}
                    className="mt-1 h-9 w-full rounded-full border border-slate-300 bg-farm-beige px-3 text-sm text-slate-800 focus:border-farm-green focus:outline-none focus:ring-2 focus:ring-farm-green/40"
                  >
                    <option value="Place an order">Place an order</option>
                    <option value="Partnership / contract supply">Partnership / contract supply</option>
                    <option value="Visit the farm">Visit the farm</option>
                    <option value="General enquiry">General enquiry</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={enquiryData.message}
                    onChange={e => setEnquiryData(prev => ({...prev, message: e.target.value}))}
                    className="mt-1 w-full rounded-2xl border border-slate-300 bg-farm-beige px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-farm-green focus:outline-none focus:ring-2 focus:ring-farm-green/40"
                    placeholder="Tell us how we can help you..."
                  />
                </div>
                {error && <p className="text-red-600 bg-red-50 p-2 rounded-xl text-xs">{error}</p>}
                <button type="submit" disabled={submitting} className="btn-primary disabled:opacity-70">
                  {submitting ? 'Submitting...' : 'Submit enquiry'}
                </button>
              </form>
            )}
          </div>

          {/* Map and contact info */}
          <aside className="space-y-4">
            <div className="overflow-hidden rounded-3xl bg-slate-200 shadow-soft-card">
              {/* Google Maps embed placeholder */}
              <iframe
                title="Hussain Farms Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d108000.332!2d73.0479!3d31.418!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3AHussain%20Farms!2s!5e0!3m2!1sen!2s!4v1700000000000"
                width="100%"
                height="260"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <div className="rounded-3xl bg-farm-beige-dark/80 p-5 text-sm text-slate-700 shadow-soft-card">
              <h2 className="text-base font-semibold text-farm-brown">
                Contact details
              </h2>
              <p className="mt-2 text-xs md:text-sm">
                Hussain Farms, Rural Agricultural Zone,
                <br />
                Near City Bypass, Punjab, Pakistan
              </p>
              <div className="mt-3 space-y-1 text-xs md:text-sm">
                <p>
                  Phone:{' '}
                  <a
                    href="tel:+9203001234567"
                    className="font-semibold text-farm-brown"
                  >
                    +92 300 123 4567
                  </a>
                </p>
                <p>
                  Email:{' '}
                  <a
                    href="mailto:info@hussainfarms.com"
                    className="font-semibold text-farm-brown"
                  >
                    info@hussainfarms.com
                  </a>
                </p>
                <p>
                  Support:{' '}
                  <a
                    href="mailto:support@hussainfarms.com"
                    className="font-semibold text-farm-brown"
                  >
                    support@hussainfarms.com
                  </a>
                </p>
              </div>
              <div className="mt-4 rounded-2xl bg-white p-4 text-xs md:text-sm">
                <p className="font-semibold text-farm-brown">
                  Customer support hours
                </p>
                <p className="mt-1 text-slate-700">
                  Monday – Saturday, 8:00 AM – 7:00 PM
                  <br />
                  Sunday emergency line for active deliveries.
                </p>
              </div>
            </div>
          </aside>
        </section>
      </div>
    </div>
  );
}

