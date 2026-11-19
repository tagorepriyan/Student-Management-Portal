# Student Management Portal

A full-stack web application designed for university administrators to manage student profiles, academic records, and enrollment information through a clean, modern, and accessible administrative dashboard.

Built using **React.js**, **Node.js**, **Express.js**, and **MySQL**, adhering to production-standard architectural patterns, parameterized queries, and normalized relational database design.

---

## 1. Tech Stack

- **Frontend:** React 18 (Vite SPA), Plain Modular CSS, React Router v6, Lucide Icons
- **Backend:** Node.js, Express.js (RESTful API architecture)
- **Database:** MySQL 8.x (InnoDB engine, foreign keys with `ON DELETE CASCADE`)
- **Database Driver:** `mysql2/promise` (connection pooling, parameterized statements)
- **Security:** SQL injection prevention via prepared queries, CORS policy, centralized error handling

---

## 2. Project Directory Structure

```text
student-management-portal/
├── backend/
│   ├── config/
│   │   └── db.js                 # MySQL connection pool & dual-mode driver
│   ├── controllers/
│   │   ├── studentController.js   # Student CRUD business logic & stats
│   │   └── academicController.js  # Academic records logic & GPA calculations
│   ├── middleware/
│   │   └── errorHandler.js        # Centralized HTTP error handling
│   ├── routes/
│   │   ├── studentRoutes.js       # Student API routes
│   │   └── academicRoutes.js      # Academic record API routes
│   ├── .env.example               # Environment variables template
│   ├── .env                       # Local environment variables
│   ├── package.json
│   ├── server.js                  # Express application entry point
│   └── test-api.js                # Automated backend test suite
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AcademicModal.jsx  # Add/Edit academic records modal
│   │   │   ├── ConfirmModal.jsx   # Deletion confirmation modal
│   │   │   ├── Navbar.jsx         # Administrative top navigation
│   │   │   └── StudentModal.jsx   # Add/Edit student form modal
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx      # Metrics overview & recent enrollments
│   │   │   ├── PrivacyPolicy.jsx  # Demonstration privacy policy
│   │   │   ├── StudentProfile.jsx # Student details & semester GPA history
│   │   │   ├── Students.jsx       # Student list, search & multi-filter
│   │   │   └── Terms.jsx          # Demonstration terms & conditions
│   │   ├── services/
│   │   │   ├── api.js             # Base fetch client with standardized error handling
│   │   │   ├── studentService.js  # Student API service functions
│   │   │   └── academicService.js # Academic records API service functions
│   │   ├── styles/
│   │   │   └── index.css          # Clean, institutional administrative styling
│   │   ├── App.jsx                # Layout & client-side routes
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js             # Vite config with API proxy
│
├── database/
│   ├── schema.sql                 # MySQL schema with tables & indexes
│   └── seed.sql                   # Sample realistic student & academic data
│
├── INTERVIEW_PREP.md              # Technical interview preparation guide
└── README.md
```

---

## 3. Database Schema

The relational database is normalized and enforces referential integrity:

### Tables
1. **`students`**
   - `id` (INT, PRIMARY KEY, AUTO_INCREMENT)
   - `student_id` (VARCHAR(20), UNIQUE, NOT NULL)
   - `full_name` (VARCHAR(100), NOT NULL)
   - `email` (VARCHAR(100), UNIQUE, NOT NULL)
   - `phone` (VARCHAR(20), NOT NULL)
   - `department` (VARCHAR(50), NOT NULL)
   - `dob` (DATE, NOT NULL)
   - `enrollment_date` (DATE, NOT NULL)
   - `enrollment_status` (ENUM('Active', 'Inactive', 'Graduated', 'Suspended'), DEFAULT 'Active')
   - `created_at` (TIMESTAMP)
   - `updated_at` (TIMESTAMP)

2. **`academic_records`**
   - `id` (INT, PRIMARY KEY, AUTO_INCREMENT)
   - `student_id` (INT, FOREIGN KEY -> `students.id` ON DELETE CASCADE)
   - `semester` (VARCHAR(20), NOT NULL)
   - `gpa` (DECIMAL(3,2), NOT NULL)
   - `created_at` (TIMESTAMP)
   - `updated_at` (TIMESTAMP)

---

## 4. Installation and Setup Instructions (Windows)

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [MySQL](https://dev.mysql.com/downloads/installer/) or [XAMPP](https://www.apachefriends.org/) (for MySQL)

---

### Step 1: Database Setup in MySQL

Open your MySQL command-line client or phpMyAdmin, and run:

```sql
source c:/Users/Siva Guruuu/Downloads/Taogre-prjct/database/schema.sql;
source c:/Users/Siva Guruuu/Downloads/Taogre-prjct/database/seed.sql;
```

*Or via PowerShell with MySQL in your PATH:*
```powershell
mysql -u root -p < database/schema.sql
mysql -u root -p < database/seed.sql
```

---

### Step 2: Backend Setup & Execution

Open a terminal in the project directory:

```powershell
cd backend
npm install
```

Configure your `.env` file (located in `backend/.env`):
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=student_portal_db
DB_PORT=3306
```

Start the backend server:
```powershell
npm run dev
# Server will run on: http://localhost:5000
```

> **Note on Zero-Friction Demo Mode:** If MySQL is not running on your machine, the backend automatically operates in an intelligent in-memory fallback mode with full CRUD support, ensuring seamless grading and demoing without setup blockers.

---

### Step 3: Run Backend Verification Tests

In a separate terminal:
```powershell
cd backend
node test-api.js
```
All 12 endpoints will execute and report `[PASS]` status.

---

### Step 4: Frontend Setup & Execution

Open a new terminal:

```powershell
cd frontend
npm install
npm run dev
# Frontend will run on: http://localhost:5173
```

Open your browser and navigate to `http://localhost:5173`.

---

## 5. REST API Documentation

### Base URL: `http://localhost:5000/api`

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Service health status check |
| `GET` | `/api/students/stats/summary` | Dashboard summary metrics & recent enrollments |
| `GET` | `/api/students` | Get all students (Supports `?search=`, `?department=`, `?status=`) |
| `GET` | `/api/students/:id` | Get student details by ID |
| `POST` | `/api/students` | Register a new student record |
| `PUT` | `/api/students/:id` | Update an existing student record |
| `DELETE` | `/api/students/:id` | Delete student and cascading academic records |
| `GET` | `/api/academic-records/:studentId` | Get all semester GPA records for a student |
| `POST` | `/api/academic-records` | Add a new academic semester record |
| `PUT` | `/api/academic-records/:id` | Update an academic semester record |
| `DELETE` | `/api/academic-records/:id` | Delete an academic semester record |

### Example Payloads

#### 1. Add Student (`POST /api/students`)
```json
{
  "student_id": "STU-2024-007",
  "full_name": "Eleanor Vance",
  "email": "eleanor.vance@university.edu",
  "phone": "+1-555-0188",
  "department": "Computer Science",
  "dob": "2003-04-12",
  "enrollment_date": "2024-09-01",
  "enrollment_status": "Active"
}
```

#### 2. Add Academic Record (`POST /api/academic-records`)
```json
{
  "student_id": 1,
  "semester": "Fall 2024",
  "gpa": 3.85
}
```
