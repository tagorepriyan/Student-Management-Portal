import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, Edit2, Trash2, Eye, FileText, AlertCircle } from 'lucide-react';
import { studentService } from '../services/studentService';
import StudentModal from '../components/StudentModal';
import ConfirmModal from '../components/ConfirmModal';

const DEPARTMENTS = [
  'All',
  'Computer Science',
  'Electrical Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Business Administration',
  'Information Technology'
];

const STATUSES = ['All', 'Active', 'Inactive', 'Graduated', 'Suspended'];

export default function Students() {
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('All');
  const [status, setStatus] = useState('All');

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [alert, setAlert] = useState(null);

  const fetchStudents = async () => {
    try {
      setIsLoading(true);
      const res = await studentService.getAllStudents({
        search,
        department,
        status
      });
      if (res.success) {
        setStudents(res.data);
      }
    } catch (err) {
      console.error(err);
      setAlert({ type: 'error', message: err.message || 'Failed to fetch students.' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchStudents();
    }, 250); // slight debounce for search input
    return () => clearTimeout(timer);
  }, [search, department, status]);

  const handleOpenCreateModal = () => {
    setEditingStudent(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (student) => {
    setEditingStudent(student);
    setIsFormModalOpen(true);
  };

  const handleSaveStudent = async (formData) => {
    try {
      if (editingStudent) {
        await studentService.updateStudent(editingStudent.id, formData);
        setAlert({ type: 'success', message: `Student '${formData.full_name}' updated successfully.` });
      } else {
        await studentService.createStudent(formData);
        setAlert({ type: 'success', message: `Student '${formData.full_name}' registered successfully.` });
      }
      setIsFormModalOpen(false);
      setEditingStudent(null);
      fetchStudents();
    } catch (err) {
      setAlert({ type: 'error', message: err.message || 'Operation failed.' });
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await studentService.deleteStudent(deleteTarget.id);
      setAlert({ type: 'success', message: `Student '${deleteTarget.full_name}' and academic records removed.` });
      setDeleteTarget(null);
      fetchStudents();
    } catch (err) {
      setAlert({ type: 'error', message: err.message || 'Could not delete student.' });
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Student Management</h1>
          <p className="page-subtitle">View, search, edit, and manage registered student profiles</p>
        </div>
        <button className="btn btn-primary" onClick={handleOpenCreateModal}>
          <Plus size={16} />
          <span>Add New Student</span>
        </button>
      </div>

      {alert && (
        <div className={`alert-banner alert-${alert.type}`}>
          <span>{alert.message}</span>
          <button 
            onClick={() => setAlert(null)} 
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
          >
            ×
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="filter-bar">
        <div className="search-input-wrap">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search by student name or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          className="filter-select"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
        >
          {DEPARTMENTS.map(dept => (
            <option key={dept} value={dept}>
              {dept === 'All' ? 'All Departments' : dept}
            </option>
          ))}
        </select>

        <select
          className="filter-select"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          {STATUSES.map(st => (
            <option key={st} value={st}>
              {st === 'All' ? 'All Statuses' : st}
            </option>
          ))}
        </select>
      </div>

      {/* Students Data Table */}
      <div className="card">
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Full Name</th>
                <th>Department</th>
                <th>Email</th>
                <th>Status</th>
                <th>Avg GPA</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
                    Loading student records...
                  </td>
                </tr>
              ) : students.length > 0 ? (
                students.map((student) => (
                  <tr key={student.id}>
                    <td style={{ fontWeight: 600, color: 'var(--primary)' }}>
                      {student.student_id}
                    </td>
                    <td style={{ fontWeight: 500 }}>{student.full_name}</td>
                    <td>{student.department}</td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{student.email}</td>
                    <td>
                      <span className={`status-badge status-${student.enrollment_status.toLowerCase()}`}>
                        {student.enrollment_status}
                      </span>
                    </td>
                    <td>
                      {student.average_gpa !== null ? (
                        <span style={{ fontWeight: 600 }}>{student.average_gpa}</span>
                      ) : (
                        <span style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>N/A</span>
                      )}
                    </td>
                    <td>
                      <div className="actions-cell" style={{ justifyContent: 'flex-end' }}>
                        <Link
                          to={`/students/${student.id}`}
                          className="btn btn-secondary btn-sm"
                          title="View Profile & Academic Records"
                        >
                          <Eye size={14} />
                          <span>Profile</span>
                        </Link>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => handleOpenEditModal(student)}
                          title="Edit Information"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => setDeleteTarget(student)}
                          title="Delete Record"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7">
                    <div className="empty-state">
                      <FileText size={36} className="empty-state-icon" />
                      <h3>No Students Found</h3>
                      <p style={{ marginTop: '0.35rem' }}>
                        No student records match your active search or filter criteria.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Student Modal */}
      <StudentModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingStudent(null);
        }}
        onSubmit={handleSaveStudent}
        student={editingStudent}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Confirm Student Deletion"
        message={`Are you sure you want to permanently delete '${deleteTarget?.full_name}' (${deleteTarget?.student_id})? This will also remove all corresponding academic records.`}
        confirmText="Delete Student"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
