import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { CartProvider } from './context/CartContext.jsx';
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Departments from './pages/Departments.jsx';
import Shop from './pages/Shop.jsx';
import OrderTracking from './pages/OrderTracking.jsx';
import Reports from './pages/Reports.jsx';
import Contact from './pages/Contact.jsx';
import Blog from './pages/Blog.jsx';
import UserLogin from './pages/UserLogin.jsx';
import AdminLogin from './pages/AdminLogin.jsx';
import Register from './pages/Register.jsx';
import AdminOrders from './pages/AdminOrders.jsx';

import AdminEnquiries from './pages/AdminEnquiries.jsx';
import AdminFinances from './pages/AdminFinances.jsx';
import AdminAttendance from './pages/AdminAttendance.jsx';
import AdminProducts from './pages/AdminProducts.jsx';
import AdminInventory from './pages/AdminInventory.jsx';
import AdminHealth from './pages/AdminHealth.jsx';

export default function App() {
  return (
    <CartProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/departments" element={<Departments />} />
          <Route path="/shop" element={<Shop />} />
          <Route
            path="/orders"
            element={
              <ProtectedRoute requiredRole="user" redirectTo="/login">
                <OrderTracking />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <ProtectedRoute requiredRole="admin" redirectTo="/admin/login">
                <AdminOrders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/reports"
            element={
              <ProtectedRoute requiredRole="admin" redirectTo="/admin/login">
                <Reports />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/enquiries"
            element={
              <ProtectedRoute requiredRole="admin" redirectTo="/admin/login">
                <AdminEnquiries />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/finances"
            element={
              <ProtectedRoute requiredRole="admin" redirectTo="/admin/login">
                <AdminFinances />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/attendance"
            element={
              <ProtectedRoute requiredRole="admin" redirectTo="/admin/login">
                <AdminAttendance />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/products"
            element={
              <ProtectedRoute requiredRole="admin" redirectTo="/admin/login">
                <AdminProducts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/inventory"
            element={
              <ProtectedRoute requiredRole="admin" redirectTo="/admin/login">
                <AdminInventory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/health"
            element={
              <ProtectedRoute requiredRole="admin" redirectTo="/admin/login">
                <AdminHealth />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<UserLogin />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/contact" element={<Contact />} />
          <Route
            path="*"
            element={
              <div className="section-padding">
                <div className="mx-auto max-w-4xl rounded-3xl bg-white p-6 text-sm text-slate-600 shadow-soft-card">
                  The page you requested could not be found.
                </div>
              </div>
            }
          />
        </Routes>
      </Layout>
    </CartProvider>
  );
}

