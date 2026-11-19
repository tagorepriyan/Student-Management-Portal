import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const COMMON_SEMESTERS = [
  'Fall 2021',
  'Spring 2022',
  'Fall 2022',
  'Spring 2023',
  'Fall 2023',
  'Spring 2024',
  'Fall 2024',
  'Spring 2025'
];

export default function AcademicModal({ isOpen, onClose, onSubmit, record = null }) {
  const isEditing = Boolean(record);

  const [semester, setSemester] = useState('');
  const [gpa, setGpa] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (record) {
      setSemester(record.semester || '');
      setGpa(record.gpa !== undefined ? record.gpa : '');
    } else {
      setSemester('Fall 2024');
      setGpa('3.50');
    }
    setError('');
  }, [record, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!semester.trim()) {
      setError('Please provide a semester title.');
      return;
    }

    const numericGpa = parseFloat(gpa);
    if (isNaN(numericGpa) || numericGpa < 0.0 || numericGpa > 4.0) {
      setError('GPA must be a valid number between 0.00 and 4.00.');
      return;
    }

    onSubmit({
      semester: semester.trim(),
      gpa: Number(numericGpa.toFixed(2))
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-dialog" style={{ maxWidth: '440px' }}>
        <div className="modal-header">
          <h3 className="modal-title">{isEditing ? 'Edit Academic Record' : 'Add Semester Record'}</h3>
          <button className="modal-close-btn" onClick={onClose} type="button">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && (
              <div className="alert-banner alert-error" style={{ marginBottom: '1rem' }}>
                <span>{error}</span>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label">Semester / Term *</label>
                <input
                  type="text"
                  className="form-input"
                  list="semester-suggestions"
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  placeholder="e.g. Fall 2024"
                  required
                />
                <datalist id="semester-suggestions">
                  {COMMON_SEMESTERS.map(s => (
                    <option key={s} value={s} />
                  ))}
                </datalist>
              </div>

              <div className="form-group">
                <label className="form-label">Grade Point Average (GPA) *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.00"
                  max="4.00"
                  className="form-input"
                  value={gpa}
                  onChange={(e) => setGpa(e.target.value)}
                  placeholder="0.00 - 4.00"
                  required
                />
                <small style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                  Standard 4.0 scale (e.g. 3.75)
                </small>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {isEditing ? 'Save Changes' : 'Add Record'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
