# 🎓 Campus Cloud - University Management System (DBMS PBL)

A comprehensive, role-based University Management System built as a DBMS Project-Based Learning (PBL) application. Powered by **React + Vite**, **Express.js / Node.js**, and **MySQL / MariaDB**.

---

## 🚀 Quick Start (1-Click)

Simply double-click the included batch launcher:
```bat
start-project.bat
```
This script automatically:
1. Verifies that the MySQL service is running.
2. Checks and seeds the database tables if empty.
3. Starts the backend server on **port 5000**.
4. Starts the frontend Vite development server on **port 5173**.
5. Launches your default browser to `http://localhost:5173`.

---

## 🔑 Default Login Credentials

| Role | Email | Password | Dashboard URL |
| :--- | :--- | :--- | :--- |
| **👑 Admin** | `admin@university.edu` | `admin123` | `/admin/dashboard` |
| **👨‍🏫 Faculty / Teacher** | `faculty@university.edu` | `faculty123` | `/teacher/dashboard` |
| **🎓 Student** | `student@university.edu` | `student123` | `/student/dashboard` |

> **Tip:** You can also use the **1-Click Demo Buttons** on the Sign In page (`http://localhost:5173/signin`) to instantly test each role without typing.

---

## 🛠️ Manual Setup Instructions

### 1. Database Setup (MySQL)
1. Ensure your MySQL / MariaDB server (e.g. XAMPP) is running on port 3306.
2. In `backend/.env`, configure your database credentials:
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   database_pass=your_mysql_password
   DB_NAME=university
   DB_PORT=3306
   JWT_SECRET_KEY=university_mgmt_secret_key_2026_super_secure
   ```
3. Initialize and seed the database:
   ```bash
   cd backend
   npm install
   npm run setup-db
   npm run seed-db
   ```

### 2. Run Backend
```bash
cd backend
npm start
```
*Backend runs on `http://localhost:5000`.*

### 3. Run Frontend
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs on `http://localhost:5173`.*

---

## 📂 Project Structure

```
Campus-Management-Systemm/
├── Collections/                   # Sample CSV/XLSX files for bulk student uploads
│   ├── sample_students.csv
│   └── sample_students.xlsx
├── backend/                       # Express.js REST API & MySQL Models
│   ├── controllers/               # Business logic & controller handlers
│   ├── db/                        # MySQL pool & storage connections
│   ├── model/                     # SQL schema definitions (15 relational tables)
│   ├── routes/                    # API routes (/api, /admin, /faculty, /student)
│   ├── services/                  # Excel parsing & email services
│   ├── setup_database.js          # Automatic database & table creator
│   ├── seed_database.js           # Sample data seeder
│   └── app.js                     # Express server entry point
├── frontend/                      # React 19 + Vite Frontend SPA
│   ├── src/
│   │   ├── components/            # Sign In & Home components
│   │   ├── pages/                 # Admin, Teachers, and Students dashboards
│   │   └── styles/                # Styled Components UI themes
│   └── vite.config.js             # Vite configuration with API proxy
└── start-project.bat              # 1-Click launcher script
```

---

## 📊 Database Schema Overview (15 Tables)

- **`admin`**: System administrator accounts.
- **`departments`**: Academic departments with HOD details.
- **`Courses`**: Degree programs (B.Tech, BCA, M.Tech, etc.).
- **`Course_Branch`**: Academic branches associated with courses.
- **`Subjects`**: Curriculum subject definitions and credit ratings.
- **`Course_Subjects`**: Semester-wise subject allocations.
- **`Sections`**: Class sections mapped to courses and semesters.
- **`Faculty`**: Teaching staff profiles and departmental linkages.
- **`Student`**: Complete student information, enrollment, and guardian info.
- **`Faculty_Subject`**: Subject-faculty teaching allocations.
- **`Faculty_Section_Subject`**: Section-level teaching assignments.
- **`Student_Subject`**: Student-course enrollment records.
- **`Attendance`**: Daily lecture attendance tracking (Present/Absent).
- **`announcement`**: Campus-wide broadcasts categorized by department/type.
- **`calendar`**: Academic calendar documents and scheduling.

---

## 📄 License
ISC
