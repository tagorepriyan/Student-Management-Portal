import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, UserCheck, GraduationCap, Award, Plus, ArrowRight } from 'lucide-react';
import { studentService } from '../services/studentService';
import StudentModal from '../components/StudentModal';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeStudents: 0,
    graduatedStudents: 0,
    overallAvgGpa: 0.0,
    recentStudents: []
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [alert, setAlert] = useState(null);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      const res = await studentService.getDashboardStats();
      if (res.success) {
        setStats(res.data);
      }
    } catch (err) {
      console.error(err);
      setAlert({ type: 'error', message: 'Failed to load dashboard statistics.' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleCreateStudent = async (studentData) => {
    try {
      const res = await studentService.createStudent(studentData);
      if (res.success) {
        setIsModalOpen(false);
        setAlert({ type: 'success', message: 'Student registered successfully!' });
        fetchStats();
      }
    } catch (err) {
      setAlert({ type: 'error', message: err.message || 'Could not register student.' });
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard Overview</h1>
          <p className="page-subtitle">Academic portal metrics and student administrative summary</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={16} />
          <span>Register Student</span>
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

      {/* KPI Metrics */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-info">
            <h4>Total Enrolled</h4>
            <div className="metric-value">{isLoading ? '...' : stats.totalStudents}</div>
          </div>
          <div className="metric-icon-wrap">
            <Users size={22} />
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-info">
            <h4>Active Students</h4>
            <div className="metric-value">{isLoading ? '...' : stats.activeStudents}</div>
          </div>
          <div className="metric-icon-wrap" style={{ background: '#DCFCE7', color: '#16A34A' }}>
            <UserCheck size={22} />
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-info">
            <h4>Graduated</h4>
            <div className="metric-value">{isLoading ? '...' : stats.graduatedStudents}</div>
          </div>
          <div className="metric-icon-wrap" style={{ background: '#DBEAFE', color: '#1D4ED8' }}>
            <GraduationCap size={22} />
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-info">
            <h4>Avg Portal GPA</h4>
            <div className="metric-value">
              {isLoading ? '...' : Number(stats.overallAvgGpa || 0).toFixed(2)}
            </div>
          </div>
          <div className="metric-icon-wrap" style={{ background: '#FEF3C7', color: '#D97706' }}>
            <Award size={22} />
          </div>
        </div>
      </div>

      {/* Recent Students Card */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Recent Student Registrations</h2>
          <Link to="/students" className="btn btn-secondary btn-sm">
            <span>View All Students</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Full Name</th>
                <th>Department</th>
                <th>Status</th>
                <th>Admission Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentStudents && stats.recentStudents.length > 0 ? (
                stats.recentStudents.map((st) => (
                  <tr key={st.id}>
                    <td style={{ fontWeight: 600, color: 'var(--primary)' }}>{st.student_id}</td>
                    <td>{st.full_name}</td>
                    <td>{st.department}</td>
                    <td>
                      <span className={`status-badge status-${st.enrollment_status.toLowerCase()}`}>
                        {st.enrollment_status}
                      </span>
                    </td>
                    <td>{st.enrollment_date}</td>
                    <td>
                      <Link to={`/students/${st.id}`} className="btn btn-secondary btn-sm">
                        View Profile
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                    No student records registered yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Student Modal */}
      <StudentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateStudent}
      />
    </div>
  );
}
