const express = require('express');
const router = express.Router();
const academicController = require('../controllers/academicController');

// Academic Records endpoints
router.get('/:studentId', academicController.getRecordsByStudentId);
router.post('/', academicController.createAcademicRecord);
router.put('/:id', academicController.updateAcademicRecord);
router.delete('/:id', academicController.deleteAcademicRecord);

module.exports = router;
