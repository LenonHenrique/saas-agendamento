import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Admin pages
import Dashboard from './pages/admin/Dashboard';
import Clients from './pages/admin/Clients';
import TimeSlots from './pages/admin/TimeSlots';
import Settings from './pages/admin/Settings';

// Booking pages
import BookingPage from './pages/booking/BookingPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Admin routes */}
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/admin/clientes" element={<Clients />} />
        <Route path="/admin/horarios" element={<TimeSlots />} />
        <Route path="/admin/configuracoes" element={<Settings />} />
        
        {/* Booking routes */}
        <Route path="/agendar" element={<BookingPage />} />
        
        {/* Redirect root to booking page for clients */}
        <Route path="/" element={<Navigate to="/agendar" replace />} />
      </Routes>
    </Router>
  );
}

export default App;