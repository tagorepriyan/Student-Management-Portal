import React from 'react';
import { FileCheck, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Terms() {
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
            <FileCheck size={22} color="var(--primary)" />
            <h1 className="card-title" style={{ fontSize: '1.25rem' }}>Terms & Conditions</h1>
          </div>
        </div>

        <div className="card-body" style={{ lineHeight: 1.7, color: 'var(--text-main)', fontSize: '0.95rem' }}>
          <p style={{ marginBottom: '1rem' }}>
            <strong>Last Updated: November 2026</strong>
          </p>

          <section style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '0.5rem' }}>1. Acceptance of Terms</h3>
            <p>
              By accessing and using this Student Management Portal prototype, you acknowledge that this software was engineered solely for technical demonstration and portfolio evaluation purposes.
            </p>
          </section>

          <section style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '0.5rem' }}>2. Intended Administrative Use</h3>
            <p>
              The system simulates an internal higher education registrar dashboard allowing administrative users to record student enrollment, manage academic profiles, and track semester performance.
            </p>
          </section>

          <section style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '0.5rem' }}>3. Software Disclaimer</h3>
            <p>
              This software is provided "as is", without warranty of any kind, express or implied. The author and contributors are not liable for any claims or damages arising from the use of this software.
            </p>
          </section>

          <section>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '0.5rem' }}>4. Academic Integrity & Portfolio Rights</h3>
            <p>
              The source code is licensed for academic inspection, recruitment review, and personal learning.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
