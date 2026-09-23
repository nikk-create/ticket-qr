import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/lib/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';

import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';
import Events from '@/pages/Events';
import Landing from '@/pages/Landing';
import EventDetail from '@/pages/EventDetail';
import Organizer from '@/pages/Organizer';
import Subscribe from '@/pages/Subscribe';
import Privacy from '@/pages/Privacy';
import Terms from '@/pages/Terms';
import EventAdmin from '@/pages/EventAdmin';
import Scanner from '@/pages/Scanner';
import Reservations from '@/pages/Reservations';
import Dashboard from '@/pages/Dashboard';
import Profile from '@/pages/Profile';
import PageNotFound from '@/pages/PageNotFound';

const queryClient = new QueryClient();

export default function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            <Route path="/" element={<Landing />} />
            <Route path="/events" element={<Events />} />
            <Route path="/events/:id" element={<EventDetail />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />

            <Route path="/organizer" element={<ProtectedRoute><Organizer /></ProtectedRoute>} />
            <Route path="/organizer/subscribe" element={<ProtectedRoute><Subscribe /></ProtectedRoute>} />
            <Route path="/organizer/events/:id" element={<ProtectedRoute><EventAdmin /></ProtectedRoute>} />
            <Route path="/scan/:id" element={<ProtectedRoute><Scanner /></ProtectedRoute>} />
            <Route path="/reservations" element={<ProtectedRoute><Reservations /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </Router>
        <Toaster position="top-center" toastOptions={{
          style: { background: '#0B4F47', color: '#F7F2E7', borderRadius: '999px', fontSize: '14px' },
        }} />
      </QueryClientProvider>
    </AuthProvider>
  );
}
