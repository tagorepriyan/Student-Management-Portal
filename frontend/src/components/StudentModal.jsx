import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const DEPARTMENTS = [
  'Computer Science',
  'Electrical Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Business Administration',
  'Information Technology'
];

const STATUSES = ['Active', 'Inactive', 'Graduated', 'Suspended'];

export default function StudentModal({ isOpen, onClose, onSubmit, student = null }) {
  const isEditing = Boolean(student);

  const [formData, setFormData] = useState({
    student_id: '',
    full_name: '',
    email: '',
    phone: '',
    department: 'Computer Science',
    dob: '',
    enrollment_date: '',
    enrollment_status: 'Active'
  });

  const [error, setError] = useState('');

  useEffect(() => {
    if (student) {
      setFormData({
        student_id: student.student_id || '',
        full_name: student.full_name || '',
        email: student.email || '',
        phone: student.phone || '',
        department: student.department || 'Computer Science',
        dob: student.dob ? student.dob.split('T')[0] : '',
        enrollment_date: student.enrollment_date ? student.enrollment_date.split('T')[0] : '',
        enrollment_status: student.enrollment_status || 'Active'
      });
    } else {
      setFormData({
        student_id: `STU-2024-00${Math.floor(100 + Math.random() * 900)}`,
        full_name: '',
        email: '',
        phone: '',
        department: 'Computer Science',
        dob: '2003-01-01',
        enrollment_date: new Date().toISOString().split('T')[0],
        enrollment_status: 'Active'
      });
    }
    setError('');
  }, [student, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Client-side validation
    if (!formData.student_id.trim() || !formData.full_name.trim() || !formData.email.trim() || !formData.phone.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!formData.dob || !formData.enrollment_date) {
      setError('Please provide valid birth and enrollment dates.');
      return;
    }

    onSubmit(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-dialog">
        <div className="modal-header">
          <h3 className="modal-title">{isEditing ? 'Edit Student Record' : 'Register New Student'}</h3>
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

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Student ID *</label>
                <input
                  type="text"
                  name="student_id"
                  className="form-input"
                  value={formData.student_id}
                  onChange={handleChange}
                  placeholder="e.g. STU-2024-001"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  name="full_name"
                  className="form-input"
                  value={formData.full_name}
                  onChange={handleChange}
                  placeholder="e.g. Jane Doe"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  className="form-input"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g. jane.doe@university.edu"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  className="form-input"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="e.g. +1-555-0199"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Department *</label>
                <select
                  name="department"
                  className="form-select"
                  value={formData.department}
                  onChange={handleChange}
                >
                  {DEPARTMENTS.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Enrollment Status *</label>
                <select
                  name="enrollment_status"
                  className="form-select"
                  value={formData.enrollment_status}
                  onChange={handleChange}
                >
                  {STATUSES.map(st => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Date of Birth *</label>
                <input
                  type="date"
                  name="dob"
                  className="form-input"
                  value={formData.dob}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Enrollment Date *</label>
                <input
                  type="date"
                  name="enrollment_date"
                  className="form-input"
                  value={formData.enrollment_date}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {isEditing ? 'Save Changes' : 'Register Student'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
