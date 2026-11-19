const { pool } = require('../config/db');

/**
 * Controller for Academic Records Operations
 */

// 1. Get all academic records for a given student
exports.getRecordsByStudentId = async (req, res, next) => {
  try {
    const { studentId } = req.params;

    // Verify student exists
    const [student] = await pool.query(
      `SELECT id, student_id, full_name FROM students WHERE id = ?`,
      [studentId]
    );

    if (student.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Student with ID ${studentId} does not exist.`
      });
    }

    const [records] = await pool.query(
      `SELECT id, student_id, semester, gpa, created_at, updated_at 
       FROM academic_records 
       WHERE student_id = ? 
       ORDER BY id ASC`,
      [studentId]
    );

    // Calculate cumulative GPA
    let cumulativeGpa = 0.0;
    if (records.length > 0) {
      const sum = records.reduce((acc, curr) => acc + parseFloat(curr.gpa), 0);
      cumulativeGpa = Number((sum / records.length).toFixed(2));
    }

    res.status(200).json({
      success: true,
      student: student[0],
      cumulativeGpa,
      totalSemesters: records.length,
      data: records
    });
  } catch (error) {
    next(error);
  }
};

// 2. Add an academic record for a student
exports.createAcademicRecord = async (req, res, next) => {
  try {
    const { student_id, semester, gpa } = req.body;

    // Validation
    if (!student_id || !semester || gpa === undefined || gpa === null) {
      return res.status(400).json({
        success: false,
        message: 'student_id, semester, and gpa are required.'
      });
    }

    const numericGpa = parseFloat(gpa);
    if (isNaN(numericGpa) || numericGpa < 0.0 || numericGpa > 4.0) {
      return res.status(400).json({
        success: false,
        message: 'GPA must be a valid number between 0.00 and 4.00.'
      });
    }

    // Verify student exists
    const [student] = await pool.query(`SELECT id FROM students WHERE id = ?`, [student_id]);
    if (student.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Cannot add academic record: Student with ID ${student_id} not found.`
      });
    }

    const insertSql = `
      INSERT INTO academic_records (student_id, semester, gpa)
      VALUES (?, ?, ?)
    `;

    const [result] = await pool.query(insertSql, [
      student_id,
      semester.trim(),
      numericGpa
    ]);

    const [created] = await pool.query(
      `SELECT * FROM academic_records WHERE id = ?`,
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: 'Academic record added successfully.',
      data: created[0]
    });
  } catch (error) {
    next(error);
  }
};

// 3. Update an academic record by ID
exports.updateAcademicRecord = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { semester, gpa } = req.body;

    // Check if record exists
    const [existing] = await pool.query(
      `SELECT id, student_id FROM academic_records WHERE id = ?`,
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Academic record with ID ${id} not found.`
      });
    }

    if (!semester || gpa === undefined || gpa === null) {
      return res.status(400).json({
        success: false,
        message: 'semester and gpa are required for update.'
      });
    }

    const numericGpa = parseFloat(gpa);
    if (isNaN(numericGpa) || numericGpa < 0.0 || numericGpa > 4.0) {
      return res.status(400).json({
        success: false,
        message: 'GPA must be a valid number between 0.00 and 4.00.'
      });
    }

    await pool.query(
      `UPDATE academic_records SET semester = ?, gpa = ? WHERE id = ?`,
      [semester.trim(), numericGpa, id]
    );

    const [updated] = await pool.query(
      `SELECT * FROM academic_records WHERE id = ?`,
      [id]
    );

    res.status(200).json({
      success: true,
      message: 'Academic record updated successfully.',
      data: updated[0]
    });
  } catch (error) {
    next(error);
  }
};

// 4. Delete an academic record
exports.deleteAcademicRecord = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [existing] = await pool.query(
      `SELECT id FROM academic_records WHERE id = ?`,
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Academic record with ID ${id} not found.`
      });
    }

    await pool.query(`DELETE FROM academic_records WHERE id = ?`, [id]);

    res.status(200).json({
      success: true,
      message: 'Academic record deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
};
