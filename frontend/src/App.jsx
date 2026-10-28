import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DomainProvider } from './context/DomainContext';
import { AuthProvider, useAuth } from './context/AuthContext';

import { DomainHeader } from './components/DomainHeader';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Corporate Pages
import { Home } from './pages/corporate/Home';
import { About } from './pages/corporate/About';
import { Products } from './pages/corporate/Products';
import { SecurityArchitecture } from './pages/corporate/SecurityArchitecture';
import { Developers } from './pages/corporate/Developers';
import { Contact } from './pages/corporate/Contact';
import { Documentation } from './pages/corporate/Documentation';

// Auth Pages
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { ForgotPassword } from './pages/auth/ForgotPassword';

// Customer Pages
import { CustomerDashboard } from './pages/customer/CustomerDashboard';
import { PaymentMethods } from './pages/customer/PaymentMethods';
import { TransactionHistory } from './pages/customer/TransactionHistory';
import { InitiatePayment } from './pages/customer/InitiatePayment';
import { SecuritySettings } from './pages/customer/SecuritySettings';

// Payment Sandbox Pages
import { CheckoutSandbox } from './pages/payment/CheckoutSandbox';
import { PaymentStatus } from './pages/payment/PaymentStatus';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { UserManagement } from './pages/admin/UserManagement';
import { RoleManagement } from './pages/admin/RoleManagement';
import { TransactionMonitoring } from './pages/admin/TransactionMonitoring';
import { SecurityAlerts } from './pages/admin/SecurityAlerts';
import { AuditLogs } from './pages/admin/AuditLogs';
import { SystemHealth } from './pages/admin/SystemHealth';

// Security Lab Workbench
import { SecurityTestingLab } from './pages/lab/SecurityTestingLab';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DomainProvider>
          <div className="min-h-screen flex flex-col justify-between bg-navy-950 text-slate-100 font-sans">
            <div>
              <DomainHeader />
              <Navbar />
              <main className="transition-all duration-300">
                <Routes>
                  {/* Corporate Domain Routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/security" element={<SecurityArchitecture />} />
                  <Route path="/developers" element={<Developers />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/documentation" element={<Documentation />} />

                  {/* Auth Routes */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />

                  {/* Customer Portal Domain Routes */}
                  <Route path="/customer" element={<ProtectedRoute><CustomerDashboard /></ProtectedRoute>} />
                  <Route path="/customer/methods" element={<ProtectedRoute><PaymentMethods /></ProtectedRoute>} />
                  <Route path="/customer/transactions" element={<ProtectedRoute><TransactionHistory /></ProtectedRoute>} />
                  <Route path="/customer/transfer" element={<ProtectedRoute><InitiatePayment /></ProtectedRoute>} />
                  <Route path="/customer/security" element={<ProtectedRoute><SecuritySettings /></ProtectedRoute>} />

                  {/* Payment Sandbox Application Domain Routes */}
                  <Route path="/pay" element={<CheckoutSandbox />} />
                  <Route path="/pay/status" element={<PaymentStatus />} />

                  {/* Admin Portal Domain Routes */}
                  <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
                  <Route path="/admin/users" element={<ProtectedRoute><UserManagement /></ProtectedRoute>} />
                  <Route path="/admin/roles" element={<ProtectedRoute><RoleManagement /></ProtectedRoute>} />
                  <Route path="/admin/transactions" element={<ProtectedRoute><TransactionMonitoring /></ProtectedRoute>} />
                  <Route path="/admin/alerts" element={<ProtectedRoute><SecurityAlerts /></ProtectedRoute>} />
                  <Route path="/admin/audit" element={<ProtectedRoute><AuditLogs /></ProtectedRoute>} />
                  <Route path="/admin/health" element={<ProtectedRoute><SystemHealth /></ProtectedRoute>} />

                  {/* Security Testing Lab Domain Route */}
                  <Route path="/security-lab" element={<SecurityTestingLab />} />

                  {/* Fallback Catch-All */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
            </div>
            <Footer />
          </div>
        </DomainProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
