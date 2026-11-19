const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

// Stats summary route (placed before parameterized :id route to prevent collision)
router.get('/stats/summary', studentController.getStudentStats);

// Main Student CRUD endpoints
router.get('/', studentController.getAllStudents);
router.post('/', studentController.createStudent);
router.get('/:id', studentController.getStudentById);
router.put('/:id', studentController.updateStudent);
router.delete('/:id', studentController.deleteStudent);

module.exports = router;
