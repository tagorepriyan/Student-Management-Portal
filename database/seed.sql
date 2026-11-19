-- ===================================================
-- Student Management Portal - Sample Seed Data
-- ===================================================

USE student_portal_db;

-- Insert Sample Students
INSERT INTO students (id, student_id, full_name, email, phone, department, dob, enrollment_date, enrollment_status) VALUES
(1, 'STU-2024-001', 'Alex Johnson', 'alex.johnson@university.edu', '+1-555-0101', 'Computer Science', '2002-05-14', '2022-09-01', 'Active'),
(2, 'STU-2024-002', 'Sophia Martinez', 'sophia.martinez@university.edu', '+1-555-0102', 'Electrical Engineering', '2001-11-23', '2021-09-01', 'Active'),
(3, 'STU-2024-003', 'Liam Chen', 'liam.chen@university.edu', '+1-555-0103', 'Mechanical Engineering', '2003-02-18', '2023-09-01', 'Active'),
(4, 'STU-2024-004', 'Emily Davis', 'emily.davis@university.edu', '+1-555-0104', 'Business Administration', '2000-08-30', '2020-09-01', 'Graduated'),
(5, 'STU-2024-005', 'Marcus Brown', 'marcus.brown@university.edu', '+1-555-0105', 'Computer Science', '2002-12-10', '2022-09-01', 'Inactive'),
(6, 'STU-2024-006', 'Olivia Taylor', 'olivia.taylor@university.edu', '+1-555-0106', 'Information Technology', '2003-07-04', '2023-09-01', 'Active');

-- Reset Auto-Increment to match latest id
ALTER TABLE students AUTO_INCREMENT = 7;

-- Insert Sample Academic Records
INSERT INTO academic_records (student_id, semester, gpa) VALUES
(1, 'Fall 2022', 3.75),
(1, 'Spring 2023', 3.82),
(1, 'Fall 2023', 3.90),
(2, 'Fall 2021', 3.50),
(2, 'Spring 2022', 3.65),
(2, 'Fall 2022', 3.70),
(3, 'Fall 2023', 3.40),
(3, 'Spring 2024', 3.55),
(4, 'Fall 2020', 3.60),
(4, 'Spring 2021', 3.75),
(4, 'Fall 2021', 3.80),
(4, 'Spring 2022', 3.95),
(5, 'Fall 2022', 2.80),
(6, 'Fall 2023', 3.88);
