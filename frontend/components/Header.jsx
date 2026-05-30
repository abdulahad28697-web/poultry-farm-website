import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  ShoppingCartIcon,
  MagnifyingGlassIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';

const baseNavItems = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/departments', label: 'Departments' },
  { to: '/shop', label: 'Shop' },
  { to: '/blog', label: 'Blog' },
  { to: '/contact', label: 'Contact' }
];

function buildNavItems(user) {
  const items = [...baseNavItems];

  if (user?.role === 'user') {
    items.splice(4, 0, { to: '/orders', label: 'My Orders' });
  }

  if (user?.role === 'admin') {
    items.unshift(
      { to: '/admin/orders', label: 'Admin Orders' },
      { to: '/admin/reports', label: 'Flock Reports' },
      { to: '/admin/enquiries', label: 'Enquiries' },
      { to: '/admin/products', label: 'Products' },
      { to: '/admin/finances', label: 'Finances' },
      { to: '/admin/attendance', label: 'Attendance' },
      { to: '/admin/inventory', label: 'Inventory' },
      { to: '/admin/health', label: 'Health Mgmt' }
    );
  }

  return items;
}

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const navItems = buildNavItems(user);
  
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchOpen(false);
      navigate('/shop');
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-orange-100 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-farm-orange text-white shadow-sm">
              <span className="text-xl">🐔</span>
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-semibold tracking-tight text-slate-900">
                Hussain Farms
              </span>
              <span className="text-[11px] text-slate-500">
                Fresh Poultry &amp; Eggs
              </span>
            </div>
          </Link>

          {/* Nav */}
          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  [
                    'rounded-full px-3 py-1 text-xs font-medium transition',
                    isActive
                      ? 'bg-farm-orange text-white shadow-sm'
                      : 'text-slate-600 hover:bg-farm-orange-soft'
                  ].join(' ')
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="hidden h-8 w-8 items-center justify-center rounded-full border border-orange-100 bg-white text-slate-500 shadow-sm transition hover:border-orange-300 hover:text-orange-600 md:flex"
            >
              <MagnifyingGlassIcon className="h-4 w-4" />
            </button>
            <Link
              to="/shop"
              className="relative flex h-8 w-8 items-center justify-center rounded-full bg-farm-orange text-white shadow-sm transition hover:bg-orange-600"
            >
              <ShoppingCartIcon className="h-4 w-4" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-farm-green text-[10px] font-bold text-white shadow-sm">
                  {totalItems}
                </span>
              )}
            </Link>

            {!isAuthenticated ? (
              <>
                <Link
                  to="/login"
                  className="hidden h-8 items-center gap-1 rounded-full border border-orange-100 bg-white px-3 text-[11px] font-medium text-slate-700 shadow-sm hover:bg-farm-orange-soft md:flex"
                >
                  <UserIcon className="h-3.5 w-3.5" />
                  <span>User Login</span>
                </Link>
                <Link
                  to="/admin/login"
                  className="hidden h-8 items-center rounded-full bg-farm-green px-3 text-[11px] font-medium text-white shadow-sm hover:bg-farm-green-dark md:flex"
                >
                  Admin
                </Link>
              </>
            ) : (
              <>
                <div className="hidden items-center gap-2 rounded-full border border-orange-100 bg-white px-3 py-1 text-[11px] font-medium text-slate-700 md:flex">
                  <UserIcon className="h-3.5 w-3.5" />
                  <span>{user?.name}</span>
                  <span className="rounded-full bg-farm-beige px-2 py-0.5 text-[10px] uppercase tracking-wide text-farm-brown">
                    {user?.role}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={logout}
                  className="hidden h-8 items-center gap-1 rounded-full border border-orange-100 bg-white px-3 text-[11px] font-medium text-slate-700 shadow-sm hover:bg-farm-orange-soft md:flex"
                >
                  <ArrowRightOnRectangleIcon className="h-3.5 w-3.5" />
                  <span>Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Search Overlay */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-slate-900/60 backdrop-blur-sm pt-20">
          <div className="w-full max-w-2xl px-4 animate-in fade-in slide-in-from-top-4 duration-200">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <MagnifyingGlassIcon className="absolute left-4 h-5 w-5 text-slate-400" />
              <input
                autoFocus
                type="text"
                placeholder="Search products, orders, or articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-14 w-full rounded-full border-none bg-white pl-12 pr-14 text-slate-800 shadow-2xl focus:outline-none focus:ring-4 focus:ring-farm-orange/20"
              />
              <button
                type="button"
                onClick={() => setIsSearchOpen(false)}
                className="absolute right-3 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}


