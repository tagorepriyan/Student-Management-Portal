const { pool } = require('../config/db');

/**
 * Controller for Student Management Operations
 */

// 1. Get all students with optional search and filtering
exports.getAllStudents = async (req, res, next) => {
  try {
    const { search, department, status } = req.query;

    let sql = `
      SELECT 
        s.id,
        s.student_id,
        s.full_name,
        s.email,
        s.phone,
        s.department,
        s.dob,
        s.enrollment_date,
        s.enrollment_status,
        s.created_at,
        ROUND(AVG(a.gpa), 2) AS average_gpa,
        COUNT(a.id) AS total_semesters
      FROM students s
      LEFT JOIN academic_records a ON s.id = a.student_id
      WHERE 1=1
    `;
    const params = [];

    // Filter by search query (name or student_id)
    if (search && search.trim() !== '') {
      sql += ` AND (s.full_name LIKE ? OR s.student_id LIKE ?)`;
      const searchParam = `%${search.trim()}%`;
      params.push(searchParam, searchParam);
    }

    // Filter by department
    if (department && department.trim() !== '' && department !== 'All') {
      sql += ` AND s.department = ?`;
      params.push(department.trim());
    }

    // Filter by enrollment status
    if (status && status.trim() !== '' && status !== 'All') {
      sql += ` AND s.enrollment_status = ?`;
      params.push(status.trim());
    }

    sql += ` GROUP BY s.id ORDER BY s.id DESC`;

    const [rows] = await pool.query(sql, params);
    res.status(200).json({
      success: true,
      count: rows.length,
      data: rows
    });
  } catch (error) {
    next(error);
  }
};

// 2. Get dashboard statistical summary
exports.getStudentStats = async (req, res, next) => {
  try {
    const [counts] = await pool.query(`
      SELECT 
        COUNT(*) AS total_students,
        SUM(CASE WHEN enrollment_status = 'Active' THEN 1 ELSE 0 END) AS active_students,
        SUM(CASE WHEN enrollment_status = 'Graduated' THEN 1 ELSE 0 END) AS graduated_students,
        SUM(CASE WHEN enrollment_status = 'Inactive' THEN 1 ELSE 0 END) AS inactive_students,
        COUNT(DISTINCT department) AS total_departments
      FROM students
    `);

    const [gpaStats] = await pool.query(`
      SELECT ROUND(AVG(gpa), 2) AS overall_avg_gpa FROM academic_records
    `);

    const [recentStudents] = await pool.query(`
      SELECT id, student_id, full_name, department, enrollment_status, enrollment_date 
      FROM students 
      ORDER BY id DESC 
      LIMIT 5
    `);

    res.status(200).json({
      success: true,
      data: {
        totalStudents: counts[0].total_students || 0,
        activeStudents: counts[0].active_students || 0,
        graduatedStudents: counts[0].graduated_students || 0,
        inactiveStudents: counts[0].inactive_students || 0,
        totalDepartments: counts[0].total_departments || 0,
        overallAvgGpa: gpaStats[0].overall_avg_gpa || 0.0,
        recentStudents: recentStudents || []
      }
    });
  } catch (error) {
    next(error);
  }
};

// 3. Get single student details by ID
exports.getStudentById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query(
      `SELECT * FROM students WHERE id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Student with ID ${id} not found.`
      });
    }

    res.status(200).json({
      success: true,
      data: rows[0]
    });
  } catch (error) {
    next(error);
  }
};

// 4. Add new student record
exports.createStudent = async (req, res, next) => {
  try {
    const {
      student_id,
      full_name,
      email,
      phone,
      department,
      dob,
      enrollment_date,
      enrollment_status
    } = req.body;

    // Server-side input validation
    if (!student_id || !full_name || !email || !phone || !department || !dob || !enrollment_date) {
      return res.status(400).json({
        success: false,
        message: 'All required student fields must be provided.'
      });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email address format.'
      });
    }

    const validStatuses = ['Active', 'Inactive', 'Graduated', 'Suspended'];
    const status = validStatuses.includes(enrollment_status) ? enrollment_status : 'Active';

    // Parameterized INSERT query
    const insertSql = `
      INSERT INTO students 
        (student_id, full_name, email, phone, department, dob, enrollment_date, enrollment_status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await pool.query(insertSql, [
      student_id.trim(),
      full_name.trim(),
      email.trim().toLowerCase(),
      phone.trim(),
      department.trim(),
      dob,
      enrollment_date,
      status
    ]);

    const newStudentId = result.insertId;

    const [createdRows] = await pool.query(`SELECT * FROM students WHERE id = ?`, [newStudentId]);

    res.status(201).json({
      success: true,
      message: 'Student record created successfully.',
      data: createdRows[0]
    });
  } catch (error) {
    next(error);
  }
};

// 5. Update existing student information
exports.updateStudent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      student_id,
      full_name,
      email,
      phone,
      department,
      dob,
      enrollment_date,
      enrollment_status
    } = req.body;

    // Check if student exists
    const [existing] = await pool.query(`SELECT id FROM students WHERE id = ?`, [id]);
    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Student with ID ${id} not found.`
      });
    }

    // Validation
    if (!student_id || !full_name || !email || !phone || !department || !dob || !enrollment_date) {
      return res.status(400).json({
        success: false,
        message: 'All student profile fields must be provided for update.'
      });
    }

    const validStatuses = ['Active', 'Inactive', 'Graduated', 'Suspended'];
    const status = validStatuses.includes(enrollment_status) ? enrollment_status : 'Active';

    const updateSql = `
      UPDATE students 
      SET 
        student_id = ?,
        full_name = ?,
        email = ?,
        phone = ?,
        department = ?,
        dob = ?,
        enrollment_date = ?,
        enrollment_status = ?
      WHERE id = ?
    `;

    await pool.query(updateSql, [
      student_id.trim(),
      full_name.trim(),
      email.trim().toLowerCase(),
      phone.trim(),
      department.trim(),
      dob,
      enrollment_date,
      status,
      id
    ]);

    const [updatedRows] = await pool.query(`SELECT * FROM students WHERE id = ?`, [id]);

    res.status(200).json({
      success: true,
      message: 'Student record updated successfully.',
      data: updatedRows[0]
    });
  } catch (error) {
    next(error);
  }
};

// 6. Delete student record
exports.deleteStudent = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [existing] = await pool.query(`SELECT id, full_name FROM students WHERE id = ?`, [id]);
    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Student with ID ${id} not found.`
      });
    }

    // Because ON DELETE CASCADE is configured on academic_records,
    // all linked academic records will be safely cleaned up automatically by MySQL.
    await pool.query(`DELETE FROM students WHERE id = ?`, [id]);

    res.status(200).json({
      success: true,
      message: `Student record '${existing[0].full_name}' and all associated academic records deleted successfully.`
    });
  } catch (error) {
    next(error);
  }
};
