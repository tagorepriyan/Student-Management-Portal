import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  Building2, 
  Calendar, 
  Award, 
  Plus, 
  Edit2, 
  Trash2, 
  BookOpen 
} from 'lucide-react';
import { studentService } from '../services/studentService';
import { academicService } from '../services/academicService';
import StudentModal from '../components/StudentModal';
import AcademicModal from '../components/AcademicModal';
import ConfirmModal from '../components/ConfirmModal';

export default function StudentProfile() {
  const { id } = useParams();

  const [student, setStudent] = useState(null);
  const [academicData, setAcademicData] = useState({
    cumulativeGpa: 0,
    totalSemesters: 0,
    data: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  // Modal States
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [isAcademicModalOpen, setIsAcademicModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [deleteRecordTarget, setDeleteRecordTarget] = useState(null);

  const loadProfileData = async () => {
    try {
      setIsLoading(true);
      const [studentRes, academicRes] = await Promise.all([
        studentService.getStudentById(id),
        academicService.getRecordsByStudentId(id)
      ]);

      if (studentRes.success) {
        setStudent(studentRes.data);
      }
      if (academicRes.success) {
        setAcademicData({
          cumulativeGpa: academicRes.cumulativeGpa,
          totalSemesters: academicRes.totalSemesters,
          data: academicRes.data
        });
      }
    } catch (err) {
      console.error(err);
      setAlert({ type: 'error', message: err.message || 'Failed to load student profile details.' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProfileData();
  }, [id]);

  // Update Student Profile
  const handleUpdateStudent = async (formData) => {
    try {
      await studentService.updateStudent(id, formData);
      setAlert({ type: 'success', message: 'Student profile updated successfully.' });
      setIsStudentModalOpen(false);
      loadProfileData();
    } catch (err) {
      setAlert({ type: 'error', message: err.message || 'Could not update student profile.' });
    }
  };

  // Add / Edit Academic Record
  const handleSaveAcademicRecord = async (recordData) => {
    try {
      if (editingRecord) {
        await academicService.updateRecord(editingRecord.id, recordData);
        setAlert({ type: 'success', message: 'Academic record updated successfully.' });
      } else {
        await academicService.createRecord({ ...recordData, student_id: Number(id) });
        setAlert({ type: 'success', message: 'Academic record added successfully.' });
      }
      setIsAcademicModalOpen(false);
      setEditingRecord(null);
      loadProfileData();
    } catch (err) {
      setAlert({ type: 'error', message: err.message || 'Failed to save academic record.' });
    }
  };

  // Delete Academic Record
  const handleDeleteAcademicRecord = async () => {
    if (!deleteRecordTarget) return;
    try {
      await academicService.deleteRecord(deleteRecordTarget.id);
      setAlert({ type: 'success', message: 'Academic record removed successfully.' });
      setDeleteRecordTarget(null);
      loadProfileData();
    } catch (err) {
      setAlert({ type: 'error', message: err.message || 'Could not delete academic record.' });
    }
  };

  if (isLoading && !student) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--text-muted)' }}>
        Loading student profile...
      </div>
    );
  }

  if (!student) {
    return (
      <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
        <h2>Student Not Found</h2>
        <p style={{ margin: '1rem 0 1.5rem', color: 'var(--text-muted)' }}>
          The requested student record does not exist or may have been deleted.
        </p>
        <Link to="/students" className="btn btn-primary">
          Back to Students List
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <Link to="/students" className="btn btn-secondary btn-sm">
          <ArrowLeft size={15} />
          <span>Back to Students List</span>
        </Link>
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

      {/* Student Overview Header Card */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div className="card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className="metric-icon-wrap" style={{ width: '40px', height: '40px' }}>
              <User size={20} />
            </div>
            <div>
              <h2 className="card-title" style={{ fontSize: '1.35rem' }}>{student.full_name}</h2>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginTop: '0.2rem' }}>
                <span style={{ fontWeight: 600, color: 'var(--primary)', fontSize: '0.9rem' }}>
                  {student.student_id}
                </span>
                <span className={`status-badge status-${student.enrollment_status.toLowerCase()}`}>
                  {student.enrollment_status}
                </span>
              </div>
            </div>
          </div>

          <button className="btn btn-secondary btn-sm" onClick={() => setIsStudentModalOpen(true)}>
            <Edit2 size={14} />
            <span>Edit Profile</span>
          </button>
        </div>

        <div className="card-body">
          <div className="form-grid" style={{ rowGap: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <Building2 size={18} color="var(--text-muted)" />
              <div>
                <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>
                  Department
                </div>
                <div style={{ fontWeight: 500 }}>{student.department}</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <Mail size={18} color="var(--text-muted)" />
              <div>
                <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>
                  Email Address
                </div>
                <div style={{ fontWeight: 500 }}>{student.email}</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <Phone size={18} color="var(--text-muted)" />
              <div>
                <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>
                  Phone Number
                </div>
                <div style={{ fontWeight: 500 }}>{student.phone}</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <Calendar size={18} color="var(--text-muted)" />
              <div>
                <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>
                  Date of Birth
                </div>
                <div style={{ fontWeight: 500 }}>{student.dob ? student.dob.split('T')[0] : 'N/A'}</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <Calendar size={18} color="var(--text-muted)" />
              <div>
                <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>
                  Enrollment Date
                </div>
                <div style={{ fontWeight: 500 }}>{student.enrollment_date ? student.enrollment_date.split('T')[0] : 'N/A'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Academic Performance Summary */}
      <div className="metrics-grid" style={{ marginBottom: '2rem' }}>
        <div className="metric-card">
          <div className="metric-info">
            <h4>Cumulative GPA</h4>
            <div className="metric-value">
              {academicData.totalSemesters > 0 ? academicData.cumulativeGpa.toFixed(2) : '0.00'}
            </div>
          </div>
          <div className="metric-icon-wrap" style={{ background: '#FEF3C7', color: '#D97706' }}>
            <Award size={22} />
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-info">
            <h4>Semesters Completed</h4>
            <div className="metric-value">{academicData.totalSemesters}</div>
          </div>
          <div className="metric-icon-wrap" style={{ background: '#EFF6FF', color: '#1D4ED8' }}>
            <BookOpen size={22} />
          </div>
        </div>
      </div>

      {/* Academic Records Table */}
      <div className="card">
        <div className="card-header">
          <div>
            <h2 className="card-title">Academic Records</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              Semester-wise academic standing and GPA history
            </p>
          </div>
          <button 
            className="btn btn-primary btn-sm"
            onClick={() => {
              setEditingRecord(null);
              setIsAcademicModalOpen(true);
            }}
          >
            <Plus size={15} />
            <span>Add Academic Record</span>
          </button>
        </div>

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Semester / Term</th>
                <th>GPA</th>
                <th>Recorded Date</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {academicData.data.length > 0 ? (
                academicData.data.map((record, index) => (
                  <tr key={record.id}>
                    <td style={{ color: 'var(--text-dim)', fontWeight: 600 }}>{index + 1}</td>
                    <td style={{ fontWeight: 600 }}>{record.semester}</td>
                    <td>
                      <span style={{ 
                        fontWeight: 700, 
                        color: Number(record.gpa) >= 3.5 ? '#15803D' : Number(record.gpa) >= 3.0 ? 'var(--primary)' : 'var(--text-main)' 
                      }}>
                        {Number(record.gpa).toFixed(2)}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                      {record.created_at ? record.created_at.split('T')[0] : 'N/A'}
                    </td>
                    <td>
                      <div className="actions-cell" style={{ justifyContent: 'flex-end' }}>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => {
                            setEditingRecord(record);
                            setIsAcademicModalOpen(true);
                          }}
                          title="Edit Record"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => setDeleteRecordTarget(record)}
                          title="Delete Record"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">
                    <div className="empty-state">
                      <BookOpen size={36} className="empty-state-icon" />
                      <h3>No Academic Records</h3>
                      <p style={{ marginTop: '0.35rem' }}>
                        No semester GPA records have been entered for this student yet.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Student Modal */}
      <StudentModal
        isOpen={isStudentModalOpen}
        onClose={() => setIsStudentModalOpen(false)}
        onSubmit={handleUpdateStudent}
        student={student}
      />

      {/* Add / Edit Academic Modal */}
      <AcademicModal
        isOpen={isAcademicModalOpen}
        onClose={() => {
          setIsAcademicModalOpen(false);
          setEditingRecord(null);
        }}
        onSubmit={handleSaveAcademicRecord}
        record={editingRecord}
      />

      {/* Delete Record Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteRecordTarget)}
        title="Delete Academic Record"
        message={`Are you sure you want to delete the record for '${deleteRecordTarget?.semester}'?`}
        confirmText="Delete Record"
        onConfirm={handleDeleteAcademicRecord}
        onCancel={() => setDeleteRecordTarget(null)}
      />
    </div>
  );
}
