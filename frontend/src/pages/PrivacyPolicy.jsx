import React from 'react';
import { Shield, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PrivacyPolicy() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <Link to="/" className="btn btn-secondary btn-sm">
          <ArrowLeft size={15} />
          <span>Back to Dashboard</span>
        </Link>
      </div>

      <div className="card">
        <div className="card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Shield size={22} color="var(--primary)" />
            <h1 className="card-title" style={{ fontSize: '1.25rem' }}>Privacy Policy</h1>
          </div>
        </div>

        <div className="card-body" style={{ lineHeight: 1.7, color: 'var(--text-main)', fontSize: '0.95rem' }}>
          <p style={{ marginBottom: '1rem' }}>
            <strong>Last Updated: November 2026</strong>
          </p>

          <section style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '0.5rem' }}>1. Project Nature & Scope</h3>
            <p>
              This Student Management Portal is an educational demonstration and portfolio application built to showcase full-stack development using React.js, Node.js, Express.js, and MySQL. It is not an enterprise commercial service.
            </p>
          </section>

          <section style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '0.5rem' }}>2. Information Managed</h3>
            <p>
              The portal manages synthetic administrative records, including student names, email addresses, phone numbers, academic departments, birth dates, and semester GPA performance records.
            </p>
          </section>

          <section style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '0.5rem' }}>3. Data Storage & Usage</h3>
            <p>
              All data is stored locally in the application's MySQL database instance or runtime memory during development. No personal data is transmitted to third-party tracking services, analytics vendors, or commercial advertisers.
            </p>
          </section>

          <section style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '0.5rem' }}>4. Data Modification & Deletion</h3>
            <p>
              Authorized administrators can create, update, and permanently delete student records and academic histories at any time through the management dashboard.
            </p>
          </section>

          <section>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '0.5rem' }}>5. Contact</h3>
            <p>
              For inquiries regarding this portfolio project or its technical implementation, please contact the developer via the project repository.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
