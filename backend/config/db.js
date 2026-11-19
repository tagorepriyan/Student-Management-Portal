const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

let isConnectedToMySQL = false;

// Create standard MySQL connection pool
const realPool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'student_portal_db',
  port: Number(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  dateStrings: true
});

// In-Memory Fallback State (Initialized with sample seed data for instant zero-dependency testing)
const inMemoryData = {
  nextStudentId: 7,
  nextAcademicId: 15,
  students: [
    {
      id: 1,
      student_id: 'STU-2024-001',
      full_name: 'Alex Johnson',
      email: 'alex.johnson@university.edu',
      phone: '+1-555-0101',
      department: 'Computer Science',
      dob: '2002-05-14',
      enrollment_date: '2022-09-01',
      enrollment_status: 'Active',
      created_at: '2022-09-01 10:00:00'
    },
    {
      id: 2,
      student_id: 'STU-2024-002',
      full_name: 'Sophia Martinez',
      email: 'sophia.martinez@university.edu',
      phone: '+1-555-0102',
      department: 'Electrical Engineering',
      dob: '2001-11-23',
      enrollment_date: '2021-09-01',
      enrollment_status: 'Active',
      created_at: '2021-09-01 10:00:00'
    },
    {
      id: 3,
      student_id: 'STU-2024-003',
      full_name: 'Liam Chen',
      email: 'liam.chen@university.edu',
      phone: '+1-555-0103',
      department: 'Mechanical Engineering',
      dob: '2003-02-18',
      enrollment_date: '2023-09-01',
      enrollment_status: 'Active',
      created_at: '2023-09-01 10:00:00'
    },
    {
      id: 4,
      student_id: 'STU-2024-004',
      full_name: 'Emily Davis',
      email: 'emily.davis@university.edu',
      phone: '+1-555-0104',
      department: 'Business Administration',
      dob: '2000-08-30',
      enrollment_date: '2020-09-01',
      enrollment_status: 'Graduated',
      created_at: '2020-09-01 10:00:00'
    },
    {
      id: 5,
      student_id: 'STU-2024-005',
      full_name: 'Marcus Brown',
      email: 'marcus.brown@university.edu',
      phone: '+1-555-0105',
      department: 'Computer Science',
      dob: '2002-12-10',
      enrollment_date: '2022-09-01',
      enrollment_status: 'Inactive',
      created_at: '2022-09-01 10:00:00'
    },
    {
      id: 6,
      student_id: 'STU-2024-006',
      full_name: 'Olivia Taylor',
      email: 'olivia.taylor@university.edu',
      phone: '+1-555-0106',
      department: 'Information Technology',
      dob: '2003-07-04',
      enrollment_date: '2023-09-01',
      enrollment_status: 'Active',
      created_at: '2023-09-01 10:00:00'
    }
  ],
  academic_records: [
    { id: 1, student_id: 1, semester: 'Fall 2022', gpa: 3.75, created_at: '2022-12-20' },
    { id: 2, student_id: 1, semester: 'Spring 2023', gpa: 3.82, created_at: '2023-05-15' },
    { id: 3, student_id: 1, semester: 'Fall 2023', gpa: 3.90, created_at: '2023-12-20' },
    { id: 4, student_id: 2, semester: 'Fall 2021', gpa: 3.50, created_at: '2021-12-20' },
    { id: 5, student_id: 2, semester: 'Spring 2022', gpa: 3.65, created_at: '2022-05-15' },
    { id: 6, student_id: 2, semester: 'Fall 2022', gpa: 3.70, created_at: '2022-12-20' },
    { id: 7, student_id: 3, semester: 'Fall 2023', gpa: 3.40, created_at: '2023-12-20' },
    { id: 8, student_id: 3, semester: 'Spring 2024', gpa: 3.55, created_at: '2024-05-15' },
    { id: 9, student_id: 4, semester: 'Fall 2020', gpa: 3.60, created_at: '2020-12-20' },
    { id: 10, student_id: 4, semester: 'Spring 2021', gpa: 3.75, created_at: '2021-05-15' },
    { id: 11, student_id: 4, semester: 'Fall 2021', gpa: 3.80, created_at: '2021-12-20' },
    { id: 12, student_id: 4, semester: 'Spring 2022', gpa: 3.95, created_at: '2022-05-15' },
    { id: 13, student_id: 5, semester: 'Fall 2022', gpa: 2.80, created_at: '2022-12-20' },
    { id: 14, student_id: 6, semester: 'Fall 2023', gpa: 3.88, created_at: '2023-12-20' }
  ]
};

// Safe Smart Query Proxy
const query = async (sql, params = []) => {
  if (isConnectedToMySQL) {
    return realPool.query(sql, params);
  }

  // Handle in-memory fallback simulation
  const trimmed = sql.trim().replace(/\s+/g, ' ');

  // 1. Stats query: COUNT(*) AS total_students...
  if (trimmed.includes('SELECT COUNT(*) AS total_students')) {
    const total_students = inMemoryData.students.length;
    const active_students = inMemoryData.students.filter(s => s.enrollment_status === 'Active').length;
    const graduated_students = inMemoryData.students.filter(s => s.enrollment_status === 'Graduated').length;
    const inactive_students = inMemoryData.students.filter(s => s.enrollment_status === 'Inactive').length;
    const departments = new Set(inMemoryData.students.map(s => s.department));
    return [[{
      total_students,
      active_students,
      graduated_students,
      inactive_students,
      total_departments: departments.size
    }]];
  }

  // 2. Stats query: overall_avg_gpa
  if (trimmed.includes('SELECT ROUND(AVG(gpa), 2) AS overall_avg_gpa')) {
    const sum = inMemoryData.academic_records.reduce((acc, r) => acc + Number(r.gpa), 0);
    const avg = inMemoryData.academic_records.length ? (sum / inMemoryData.academic_records.length).toFixed(2) : 0;
    return [[{ overall_avg_gpa: Number(avg) }]];
  }

  // 3. Stats query: recent students
  if (trimmed.includes('LIMIT 5')) {
    const recents = [...inMemoryData.students].sort((a, b) => b.id - a.id).slice(0, 5);
    return [recents];
  }

  // 4. GetAllStudents with filters
  if (trimmed.startsWith('SELECT s.id, s.student_id, s.full_name')) {
    let result = inMemoryData.students.map(s => {
      const records = inMemoryData.academic_records.filter(r => r.student_id === s.id);
      const sum = records.reduce((acc, r) => acc + Number(r.gpa), 0);
      const avg = records.length ? (sum / records.length).toFixed(2) : null;
      return {
        ...s,
        average_gpa: avg,
        total_semesters: records.length
      };
    });

    let pIdx = 0;
    if (trimmed.includes('s.full_name LIKE ? OR s.student_id LIKE ?')) {
      const searchVal = params[pIdx].replace(/%/g, '').toLowerCase();
      pIdx += 2;
      result = result.filter(s => s.full_name.toLowerCase().includes(searchVal) || s.student_id.toLowerCase().includes(searchVal));
    }
    if (trimmed.includes('s.department = ?')) {
      const dept = params[pIdx++];
      result = result.filter(s => s.department === dept);
    }
    if (trimmed.includes('s.enrollment_status = ?')) {
      const stat = params[pIdx++];
      result = result.filter(s => s.enrollment_status === stat);
    }

    result.sort((a, b) => b.id - a.id);
    return [result];
  }

  // 5. Select student by ID
  if (trimmed.includes('SELECT * FROM students WHERE id = ?')) {
    const id = Number(params[0]);
    const found = inMemoryData.students.filter(s => s.id === id);
    return [found];
  }

  // 6. Select student by ID minimal
  if (trimmed.includes('SELECT id, student_id, full_name FROM students WHERE id = ?') || trimmed.includes('SELECT id FROM students WHERE id = ?') || trimmed.includes('SELECT id, full_name FROM students WHERE id = ?')) {
    const id = Number(params[0]);
    const found = inMemoryData.students.filter(s => s.id === id);
    return [found];
  }

  // 7. Insert student
  if (trimmed.startsWith('INSERT INTO students')) {
    const [student_id, full_name, email, phone, department, dob, enrollment_date, enrollment_status] = params;
    // Check uniqueness
    if (inMemoryData.students.some(s => s.student_id === student_id || s.email === email)) {
      const err = new Error('Duplicate entry');
      err.code = 'ER_DUP_ENTRY';
      throw err;
    }
    const newStudent = {
      id: inMemoryData.nextStudentId++,
      student_id,
      full_name,
      email,
      phone,
      department,
      dob,
      enrollment_date,
      enrollment_status,
      created_at: new Date().toISOString()
    };
    inMemoryData.students.push(newStudent);
    return [{ insertId: newStudent.id }];
  }

  // 8. Update student
  if (trimmed.startsWith('UPDATE students SET')) {
    const [student_id, full_name, email, phone, department, dob, enrollment_date, enrollment_status, id] = params;
    const numId = Number(id);
    const index = inMemoryData.students.findIndex(s => s.id === numId);
    if (index !== -1) {
      inMemoryData.students[index] = {
        ...inMemoryData.students[index],
        student_id,
        full_name,
        email,
        phone,
        department,
        dob,
        enrollment_date,
        enrollment_status
      };
    }
    return [{ affectedRows: 1 }];
  }

  // 9. Delete student (with CASCADE delete of academic records)
  if (trimmed.startsWith('DELETE FROM students WHERE id = ?')) {
    const id = Number(params[0]);
    inMemoryData.students = inMemoryData.students.filter(s => s.id !== id);
    // Cascade delete academic records
    inMemoryData.academic_records = inMemoryData.academic_records.filter(r => r.student_id !== id);
    return [{ affectedRows: 1 }];
  }

  // 10. Select academic records for a student
  if (trimmed.includes('FROM academic_records WHERE student_id = ?')) {
    const studentId = Number(params[0]);
    const records = inMemoryData.academic_records.filter(r => r.student_id === studentId);
    return [records];
  }

  // 11. Select academic record by ID
  if (trimmed.includes('FROM academic_records WHERE id = ?')) {
    const id = Number(params[0]);
    const found = inMemoryData.academic_records.filter(r => r.id === id);
    return [found];
  }

  // 12. Insert academic record
  if (trimmed.startsWith('INSERT INTO academic_records')) {
    const [student_id, semester, gpa] = params;
    const newRecord = {
      id: inMemoryData.nextAcademicId++,
      student_id: Number(student_id),
      semester,
      gpa: Number(gpa),
      created_at: new Date().toISOString()
    };
    inMemoryData.academic_records.push(newRecord);
    return [{ insertId: newRecord.id }];
  }

  // 13. Update academic record
  if (trimmed.startsWith('UPDATE academic_records SET semester = ?, gpa = ? WHERE id = ?')) {
    const [semester, gpa, id] = params;
    const numId = Number(id);
    const index = inMemoryData.academic_records.findIndex(r => r.id === numId);
    if (index !== -1) {
      inMemoryData.academic_records[index].semester = semester;
      inMemoryData.academic_records[index].gpa = Number(gpa);
    }
    return [{ affectedRows: 1 }];
  }

  // 14. Delete academic record
  if (trimmed.startsWith('DELETE FROM academic_records WHERE id = ?')) {
    const id = Number(params[0]);
    inMemoryData.academic_records = inMemoryData.academic_records.filter(r => r.id !== id);
    return [{ affectedRows: 1 }];
  }

  return [[]];
};

const testConnection = async () => {
  try {
    const conn = await realPool.getConnection();
    console.log(`[Database] Connected successfully to MySQL database: ${process.env.DB_NAME || 'student_portal_db'}`);
    isConnectedToMySQL = true;
    conn.release();
    return true;
  } catch (error) {
    isConnectedToMySQL = false;
    console.log(`[Database Notice] MySQL service is currently offline or unreachable (${error.message}).`);
    console.log(`[Database Notice] Operating in dual-mode fallback so all API endpoints, CRUD, and views function immediately.`);
    console.log(`[Database Notice] Once MySQL is running, the server automatically connects to MySQL directly.`);
    return false;
  }
};

const pool = {
  query,
  getConnection: async () => realPool.getConnection()
};

module.exports = {
  pool,
  testConnection
};
