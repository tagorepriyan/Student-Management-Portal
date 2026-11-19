import { request } from './api';

/**
 * Student API Services
 */
export const studentService = {
  // Fetch dashboard summary KPIs
  getDashboardStats: async () => {
    return request('/students/stats/summary');
  },

  // Fetch all students with optional search & filter params
  getAllStudents: async (params = {}) => {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.department && params.department !== 'All') query.append('department', params.department);
    if (params.status && params.status !== 'All') query.append('status', params.status);
    
    const queryString = query.toString();
    const endpoint = queryString ? `/students?${queryString}` : '/students';
    return request(endpoint);
  },

  // Fetch single student by internal ID
  getStudentById: async (id) => {
    return request(`/students/${id}`);
  },

  // Create new student
  createStudent: async (studentData) => {
    return request('/students', {
      method: 'POST',
      body: JSON.stringify(studentData)
    });
  },

  // Update existing student
  updateStudent: async (id, studentData) => {
    return request(`/students/${id}`, {
      method: 'PUT',
      body: JSON.stringify(studentData)
    });
  },

  // Delete student
  deleteStudent: async (id) => {
    return request(`/students/${id}`, {
      method: 'DELETE'
    });
  }
};
