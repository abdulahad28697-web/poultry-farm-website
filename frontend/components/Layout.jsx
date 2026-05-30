import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header.jsx';
import Footer from './Footer.jsx';

export default function Layout({ children }) {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin') && location.pathname !== '/admin/login';

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-gradient-to-b from-farm-beige via-white to-farm-beige">
        {isAdminRoute && (
          <div className="h-40 w-full overflow-hidden bg-slate-900 border-b-4 border-farm-green">
            <img 
              src="/images/flock.png" 
              alt="Admin Dashboard Background" 
              className="h-full w-full object-cover opacity-30 mix-blend-overlay" 
            />
          </div>
        )}
        <div className={isAdminRoute ? "-mt-8 relative z-10" : ""}>
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}

