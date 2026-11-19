import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import StudentProfile from './pages/StudentProfile';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Terms from './pages/Terms';

export default function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/students" element={<Students />} />
            <Route path="/students/:id" element={<StudentProfile />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="*" element={
              <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
                <h2>Page Not Found</h2>
                <p style={{ margin: '1rem 0 1.5rem', color: 'var(--text-muted)' }}>
                  The requested page does not exist.
                </p>
                <Link to="/" className="btn btn-primary">Return to Dashboard</Link>
              </div>
            } />
          </Routes>
        </main>

        <footer className="footer">
          <div className="footer-inner">
            <div>
              &copy; {new Date().getFullYear()} Student Management Portal. Internal Administrative System.
            </div>
            <div className="footer-links">
              <Link to="/privacy" className="footer-link">Privacy Policy</Link>
              <Link to="/terms" className="footer-link">Terms & Conditions</Link>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}
