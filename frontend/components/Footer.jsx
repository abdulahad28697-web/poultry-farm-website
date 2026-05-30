import React from 'react';
import {
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';

const currentYear = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="mt-4 border-t border-slate-200 bg-farm-brown-dark text-farm-beige">
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🐓</span>
              <span className="text-lg font-semibold tracking-tight">
                Hussain Farms
              </span>
            </div>
            <p className="max-w-md text-sm text-farm-beige-dark/90">
              A modern, bio-secure poultry farm committed to delivering fresh,
              healthy poultry products from farm to table with full traceability
              and care.
            </p>
            <div className="flex gap-3">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-xs font-semibold tracking-wide">
                FB
              </span>
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-xs font-semibold tracking-wide">
                IG
              </span>
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-xs font-semibold tracking-wide">
                X
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold tracking-wide text-white">
              Contact
            </h3>
            <p className="flex items-start gap-2 text-sm text-farm-beige-dark/90">
              <MapPinIcon className="mt-0.5 h-4 w-4 flex-shrink-0" />
              <span>
                Hussain Farms, Rural Agricultural Zone,
                <br />
                Near City Bypass, Punjab, Pakistan
              </span>
            </p>
            <p className="flex items-center gap-2 text-sm text-farm-beige-dark/90">
              <PhoneIcon className="h-4 w-4 flex-shrink-0" />
              <a href="tel:+9203001234567" className="hover:text-white">
                +92 300 123 4567
              </a>
            </p>
            <p className="flex items-center gap-2 text-sm text-farm-beige-dark/90">
              <EnvelopeIcon className="h-4 w-4 flex-shrink-0" />
              <a
                href="mailto:info@hussainfarms.com"
                className="hover:text-white"
              >
                info@hussainfarms.com
              </a>
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold tracking-wide text-white">
              Quick Links
            </h3>
            <ul className="space-y-1.5 text-sm text-farm-beige-dark/90">
              <li>
                <a href="/shop" className="hover:text-white">
                  Order Fresh Poultry
                </a>
              </li>
              <li>
                <a href="/reports" className="hover:text-white">
                  Farm Reports
                </a>
              </li>
              <li>
                <a href="/departments" className="hover:text-white">
                  Farm Departments
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:text-white">
                  Contact &amp; Support
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-white/10 pt-4 text-xs text-farm-beige-dark/80 md:flex md:items-center md:justify-between">
          <p>
            © {currentYear} Hussain Farms. All rights reserved. Fresh poultry
            from a responsibly managed farm.
          </p>
          <p className="mt-2 md:mt-0">
            Designed for modern agriculture businesses.
          </p>
        </div>
      </div>
    </footer>
  );
}

