import { request } from './api';

/**
 * Academic Records API Services
 */
export const academicService = {
  // Get all semester records for a student
  getRecordsByStudentId: async (studentId) => {
    return request(`/academic-records/${studentId}`);
  },

  // Add a new semester record
  createRecord: async (recordData) => {
    return request('/academic-records', {
      method: 'POST',
      body: JSON.stringify(recordData)
    });
  },

  // Update a semester record
  updateRecord: async (id, recordData) => {
    return request(`/academic-records/${id}`, {
      method: 'PUT',
      body: JSON.stringify(recordData)
    });
  },

  // Delete a semester record
  deleteRecord: async (id) => {
    return request(`/academic-records/${id}`, {
      method: 'DELETE'
    });
  }
};
