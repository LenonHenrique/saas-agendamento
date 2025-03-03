import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Landing page
import LandingPage from './pages/LandingPage';

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
        
        {/* Landing page */}
        <Route path="/" element={<LandingPage />} />
      </Routes>
    </Router>
  );
}

export default App;