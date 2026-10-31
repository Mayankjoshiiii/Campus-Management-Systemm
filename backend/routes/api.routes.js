const express = require('express');
const router = express.Router();
const connDB = require('../db/db.conn');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const util = require('util');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const adminService = require('../services/admin.services');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const query = util.promisify(connDB.query).bind(connDB);

// Set up local multer storage for file uploads
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});
const upload = multer({ storage });

function generateRandomPassword(length = 8) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$';
    let password = '';
    for (let i = 0; i < length; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
}

// -------------------------------------------------------------
// 1. UNIFIED AUTHENTICATION (/api/auth/login)
// -------------------------------------------------------------
router.post('/auth/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ status: "error", message: "Email and password are required" });
    }

    try {
        // 1. Check Admin
        const admins = await query('SELECT * FROM admin WHERE email = ?', [email]);
        if (admins.length > 0) {
            const isMatch = await bcrypt.compare(password, admins[0].password);
            if (isMatch) {
                const token = jwt.sign(
                    { id: admins[0].admin_id, email: admins[0].email, name: admins[0].name, role: "admin" },
                    process.env.JWT_SECRET_KEY,
                    { expiresIn: '24h' }
                );
                return res.status(200).json({
                    status: "success",
                    role: "Admin",
                    email: admins[0].email,
                    name: admins[0].name,
                    token,
                    redirectUrl: "/admin/dashboard"
                });
            }
        }

        // 2. Check Faculty
        const faculties = await query('SELECT * FROM Faculty WHERE email = ?', [email]);
        if (faculties.length > 0) {
            const isMatch = await bcrypt.compare(password, faculties[0].password);
            if (isMatch) {
                const token = jwt.sign(
                    { id: faculties[0].faculty_id, email: faculties[0].email, name: faculties[0].name, role: "faculty" },
                    process.env.JWT_SECRET_KEY,
                    { expiresIn: '24h' }
                );
                return res.status(200).json({
                    status: "success",
                    role: "Teacher",
                    email: faculties[0].email,
                    name: faculties[0].name,
                    token,
                    redirectUrl: "/teacher/dashboard"
                });
            }
        }

        // 3. Check Student
        const students = await query('SELECT * FROM Student WHERE email = ?', [email]);
        if (students.length > 0) {
            const isMatch = await bcrypt.compare(password, students[0].password);
            if (isMatch) {
                const token = jwt.sign(
                    { id: students[0].student_id, email: students[0].email, name: students[0].name, role: "student" },
                    process.env.JWT_SECRET_KEY,
                    { expiresIn: '24h' }
                );
                return res.status(200).json({
                    status: "success",
                    role: "Student",
                    email: students[0].email,
                    name: students[0].name,
                    token,
                    redirectUrl: "/student/dashboard"
                });
            }
        }

        return res.status(401).json({ status: "error", message: "Invalid email or password" });
    } catch (err) {
        console.error("Login error:", err);
        return res.status(500).json({ status: "error", message: "Server error during login" });
    }
});

// -------------------------------------------------------------
// 2. DASHBOARD COUNTS & STATS
// -------------------------------------------------------------
router.get('/AdminDashboard/students/count', async (req, res) => {
    try {
        const [result] = await query('SELECT COUNT(*) AS count FROM Student');
        res.status(200).json(result.count || 0);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

router.get('/AdminDashboard/faculty/count', async (req, res) => {
    try {
        const [result] = await query('SELECT COUNT(*) AS count FROM Faculty');
        res.status(200).json(result.count || 0);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

// -------------------------------------------------------------
// 3. CALENDAR (ACADEMIC CALENDAR)
// -------------------------------------------------------------
router.get('/calendar', async (req, res) => {
    try {
        const calendars = await query('SELECT * FROM calendar ORDER BY uploaded_at DESC LIMIT 1');
        if (calendars.length === 0 || !calendars[0].file_path || !fs.existsSync(calendars[0].file_path)) {
            // Send default text/calendar notice
            res.setHeader('Content-Type', 'application/json');
            return res.status(200).json({ title: "Academic Calendar 2025-2026", message: "No PDF uploaded yet." });
        }
        res.setHeader('Content-Disposition', `inline; filename="${calendars[0].title}.pdf"`);
        res.setHeader('Content-Type', 'application/pdf');
        fs.createReadStream(calendars[0].file_path).pipe(res);
    } catch (err) {
        res.status(500).json({ message: "Error reading calendar", error: err.message });
    }
});

router.post('/calendar', upload.single('file'), async (req, res) => {
    try {
        const title = req.body.title || "Academic Calendar";
        const filePath = req.file ? req.file.path : null;
        if (!filePath) {
            return res.status(400).json({ message: "Calendar PDF file is required" });
        }
        await query('INSERT INTO calendar (title, file_path) VALUES (?, ?)', [title, filePath]);
        res.status(201).json({ message: "Calendar uploaded successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error uploading calendar", error: err.message });
    }
});

// -------------------------------------------------------------
// 4. STUDENT MANAGEMENT (Single & Bulk)
// -------------------------------------------------------------
router.post('/uploadStudent', async (req, res) => {
    try {
        const {
            name, email, univId, course, branch, semester, year,
            rollNo, dob, contactNo, address, gender, nationality,
            bloodGroup, parentContactNo, parentName, parentOccupation
        } = req.body;

        if (!name || !email) {
            return res.status(400).json({ message: "Name and email are required" });
        }

        // Check if student exists
        const existing = await query('SELECT * FROM Student WHERE email = ?', [email]);
        if (existing.length > 0) {
            return res.status(409).json({ message: "Student with this email already exists" });
        }

        // Resolve course_id
        let resolvedCourseId = 1;
        if (course) {
            if (!isNaN(course)) {
                resolvedCourseId = parseInt(course);
            } else {
                const [c] = await query('SELECT course_id FROM Courses WHERE course_name = ?', [course]);
                if (c) resolvedCourseId = c.course_id;
            }
        }

        // Resolve branch_id
        let resolvedBranchId = null;
        if (branch) {
            if (!isNaN(branch)) {
                resolvedBranchId = parseInt(branch);
            } else {
                const [b] = await query('SELECT branch_id FROM Course_Branch WHERE branch_name = ?', [branch]);
                if (b) resolvedBranchId = b.branch_id;
            }
        }

        // Auto-generate IDs if not supplied
        let university_id = univId;
        if (!university_id) {
            const [lastStudent] = await query("SELECT MAX(CAST(university_id AS UNSIGNED)) AS maxUniId FROM Student");
            university_id = (lastStudent.maxUniId ? lastStudent.maxUniId + 1 : 10001).toString();
        }

        let roll_no = rollNo;
        if (!roll_no) {
            const [lastRoll] = await query("SELECT MAX(CAST(roll_no AS UNSIGNED)) AS maxRoll FROM Student");
            roll_no = (lastRoll.maxRoll ? lastRoll.maxRoll + 1 : 20001).toString();
        }

        const password = generateRandomPassword();
        await adminService.sendCredentials(email, name, password, "Student");
        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await query(
            `INSERT INTO Student (
                university_id, name, email, password, roll_no,
                course_id, branch_id, semester, year, dob, gender,
                nationality, blood_group, contact, address,
                father_name, father_contact, father_occupation
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                university_id, name, email, hashedPassword, roll_no,
                resolvedCourseId, resolvedBranchId, semester || 1, year || 2025,
                dob || null, gender || 'Other', nationality || 'Indian', bloodGroup || null,
                contactNo ? String(contactNo) : null, address || null,
                parentName || null, parentContactNo ? String(parentContactNo) : null, parentOccupation || null
            ]
        );

        res.status(201).json({
            success: true,
            message: "Student added successfully",
            studentId: result.insertId,
            university_id,
            roll_no
        });
    } catch (err) {
        console.error("Error in uploadStudent:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

router.post('/uploadStudentDetails', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "File is required" });
        }

        const students = await adminService.parseStudentFile(req.file.path);
        if (!students || students.length === 0) {
            return res.status(400).json({ message: "No student records found in file" });
        }

        const [lastIds] = await query(`
            SELECT 
                COALESCE(MAX(CAST(roll_no AS UNSIGNED)), 20000) AS last_roll,
                COALESCE(MAX(CAST(university_id AS UNSIGNED)), 10000) AS last_univ
            FROM Student
        `);

        let rollCounter = lastIds.last_roll;
        let univCounter = lastIds.last_univ;
        let addedCount = 0;

        for (const s of students) {
            if (!s.name || !s.email) continue;

            const existing = await query('SELECT student_id FROM Student WHERE email = ?', [s.email]);
            if (existing.length > 0) continue;

            let courseId = 1;
            if (s.course) {
                if (!isNaN(s.course)) {
                    courseId = parseInt(s.course);
                } else {
                    const [c] = await query('SELECT course_id FROM Courses WHERE course_name = ?', [s.course]);
                    if (c) courseId = c.course_id;
                }
            }

            let branchId = null;
            if (s.branch) {
                if (!isNaN(s.branch)) {
                    branchId = parseInt(s.branch);
                } else {
                    const [b] = await query('SELECT branch_id FROM Course_Branch WHERE branch_name = ?', [s.branch]);
                    if (b) branchId = b.branch_id;
                }
            }

            rollCounter++;
            univCounter++;
            const roll_no = s.roll_no || String(rollCounter);
            const university_id = String(univCounter);

            const password = generateRandomPassword();
            await adminService.sendCredentials(s.email, s.name, password, "Student");
            const hashedPassword = await bcrypt.hash(password, 10);

            await query(
                `INSERT INTO Student (
                    university_id, name, email, password, roll_no,
                    course_id, branch_id, semester, year, dob, gender,
                    nationality, blood_group, contact, address,
                    father_name, father_contact, father_occupation,
                    mother_name, mother_contact, mother_occupation
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    university_id, s.name, s.email, hashedPassword, roll_no,
                    courseId, branchId, s.semester || 1, s.year || 2025, s.dob || null, s.gender || 'Other',
                    s.nationality || 'Indian', s.blood_group || null, s.contact || null, s.address || null,
                    s.father_name || null, s.father_contact || null, s.father_occupation || null,
                    s.mother_name || null, s.mother_contact || null, s.mother_occupation || null
                ]
            );
            addedCount++;
        }

        res.status(200).json({
            message: `Successfully processed ${addedCount} student records.`,
            added: addedCount
        });
    } catch (err) {
        console.error("Error in uploadStudentDetails:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

// -------------------------------------------------------------
// 5. FACULTY MANAGEMENT
// -------------------------------------------------------------
router.post('/uploadFaculty', async (req, res) => {
    try {
        const { name, department, email, dob, contactNo, address, gender } = req.body;
        if (!name || !email) {
            return res.status(400).json({ message: "Name and email are required" });
        }

        const existing = await query('SELECT * FROM Faculty WHERE email = ?', [email]);
        if (existing.length > 0) {
            return res.status(409).json({ message: "Faculty with this email already exists" });
        }

        const password = generateRandomPassword();
        await adminService.sendCredentials(email, name, password, "Faculty Member");
        const hashedPassword = await bcrypt.hash(password, 10);

        await query(
            `INSERT INTO Faculty (name, department, department_id, email, password, dob, contact_number, address, gender)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [name, department || 'General', department || 'General', email, hashedPassword, dob || null, contactNo ? String(contactNo) : null, address || null, gender || 'Other']
        );

        res.status(201).json({ message: "Faculty added successfully" });
    } catch (err) {
        console.error("Error in uploadFaculty:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

// -------------------------------------------------------------
// 6. ENROLLMENTS & CLASSES
// -------------------------------------------------------------
router.get('/enrollments', async (req, res) => {
    try {
        const enrollments = await query(
            `SELECT fs.id, fs.faculty_id, fs.subject_id, fs.course_id, fs.semester,
                    s.subject_name AS subjectName, s.subject_code AS subjectCode, s.credits,
                    f.name AS facultyName, f.email AS emailId
             FROM Faculty_Subject fs
             JOIN Subjects s ON fs.subject_id = s.subject_id
             JOIN Faculty f ON fs.faculty_id = f.faculty_id`
        );
        res.status(200).json(enrollments);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

router.post('/enrollments/create-for-all', async (req, res) => {
    const { subjectName, subjectCode, credits, emailId } = req.body;
    if (!subjectName || !subjectCode || !emailId) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        // Find faculty
        const [fac] = await query('SELECT faculty_id, name FROM Faculty WHERE email = ?', [emailId]);
        if (!fac) {
            return res.status(404).json({ message: `Faculty with email ${emailId} not found` });
        }

        // Insert or find subject
        let [subj] = await query('SELECT subject_id FROM Subjects WHERE subject_code = ?', [subjectCode]);
        let subjectId;
        if (!subj) {
            const result = await query(
                'INSERT INTO Subjects (subject_name, subject_code, course, credits, description) VALUES (?, ?, ?, ?, ?)',
                [subjectName, subjectCode, 'B.Tech', credits || 4, subjectName]
            );
            subjectId = result.insertId;
        } else {
            subjectId = subj.subject_id;
        }

        // Check if faculty already assigned
        const existing = await query('SELECT id FROM Faculty_Subject WHERE faculty_id = ? AND subject_id = ?', [fac.faculty_id, subjectId]);
        let enrollmentId;
        if (existing.length === 0) {
            const ins = await query(
                'INSERT INTO Faculty_Subject (faculty_id, subject_id, course_id, semester) VALUES (?, ?, 1, 5)',
                [fac.faculty_id, subjectId]
            );
            enrollmentId = ins.insertId;
        } else {
            enrollmentId = existing[0].id;
        }

        res.status(201).json({
            id: enrollmentId,
            subjectName,
            subjectCode,
            credits: credits || 4,
            facultyName: fac.name,
            emailId
        });
    } catch (err) {
        console.error("Error creating enrollment:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

// -------------------------------------------------------------
// 7. ANNOUNCEMENTS
// -------------------------------------------------------------
router.get('/all/announcement', async (req, res) => {
    try {
        const announcements = await query('SELECT * FROM announcement ORDER BY created_at DESC');
        const formatted = announcements.map(a => ({
            id: a.announcement_id,
            title: a.title,
            message: a.description || '',
            type: a.type,
            file_url: a.file_url,
            date: a.created_at ? a.created_at.toISOString().split('T')[0] : ''
        }));
        res.status(200).json(formatted);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

router.post('/admin/announcement', async (req, res) => {
    const { title, message, type } = req.body;
    if (!title && !message) {
        return res.status(400).json({ message: "Title or message is required" });
    }
    try {
        await query(
            'INSERT INTO announcement (title, description, type) VALUES (?, ?, ?)',
            [title || 'General Announcement', message || '', type || 'Others']
        );
        res.status(201).json({ message: "Announcement created successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

router.delete('/delete/Announcement/:id', async (req, res) => {
    const id = req.params.id;
    try {
        await query('DELETE FROM announcement WHERE announcement_id = ?', [id]);
        res.status(200).json({ message: "Announcement deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

// -------------------------------------------------------------
// 8. ATTENDANCE (Teacher & Student Views)
// -------------------------------------------------------------
// Faculty subjects
router.get('/attendance/faculty/:email/subjects', async (req, res) => {
    const { email } = req.params;
    try {
        const subjects = await query(
            `SELECT fs.id, s.subject_id, s.subject_name AS name, s.subject_code AS code
             FROM Faculty_Subject fs
             JOIN Faculty f ON fs.faculty_id = f.faculty_id
             JOIN Subjects s ON fs.subject_id = s.subject_id
             WHERE f.email = ?`,
            [email]
        );
        res.status(200).json(subjects);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

// Students and attendance for subject & date
router.get('/attendance/subject/:id/date/:date', async (req, res) => {
    const { id, date } = req.params;
    try {
        const [fs] = await query('SELECT * FROM Faculty_Subject WHERE id = ?', [id]);
        if (!fs) {
            return res.status(404).json({ message: "Subject assignment not found" });
        }

        const students = await query(
            `SELECT s.student_id AS id, s.name AS studentName, s.email AS studentEmail, s.roll_no AS studentRollNo,
                    a.status, a.remarks
             FROM Student s
             LEFT JOIN Attendance a ON a.student_id = s.student_id AND a.faculty_subject_id = ? AND a.date = ?
             WHERE s.course_id = ? AND s.semester = ?`,
            [id, date, fs.course_id, fs.semester]
        );

        const result = students.map(st => ({
            id: st.id,
            studentName: st.studentName,
            studentEmail: st.studentEmail,
            studentRollNo: st.studentRollNo,
            present: st.status === 'Present' ? true : (st.status === 'Absent' ? false : null),
            remarks: st.remarks || ''
        }));

        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

// Stats for subject
router.get('/attendance/stats/subject/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [stats] = await query(
            `SELECT 
                COUNT(DISTINCT a.date) AS classesConducted,
                COUNT(DISTINCT a.student_id) AS totalStudents,
                ROUND(COALESCE(SUM(CASE WHEN a.status = 'Present' THEN 1 ELSE 0 END) * 100.0 / NULLIF(COUNT(a.attendance_id), 0), 0), 2) AS averageAttendance
             FROM Attendance a
             WHERE a.faculty_subject_id = ?`,
            [id]
        );
        res.status(200).json(stats || { totalStudents: 0, classesConducted: 0, averageAttendance: 0 });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

// Bulk attendance submit by teacher
router.post('/attendance/bulk', async (req, res) => {
    const { subjectId, date, studentAttendances } = req.body;
    if (!subjectId || !date || !Array.isArray(studentAttendances)) {
        return res.status(400).json({ message: "subjectId, date, and studentAttendances array are required" });
    }

    try {
        for (const item of studentAttendances) {
            const [st] = await query('SELECT student_id FROM Student WHERE email = ?', [item.studentEmail]);
            if (st) {
                const status = item.present ? 'Present' : 'Absent';
                await query(
                    `INSERT INTO Attendance (student_id, faculty_subject_id, date, status, remarks)
                     VALUES (?, ?, ?, ?, ?)
                     ON DUPLICATE KEY UPDATE status = VALUES(status), remarks = VALUES(remarks)`,
                    [st.student_id, subjectId, date, status, item.remarks || '']
                );
            }
        }
        res.status(200).json({ message: "Attendance recorded successfully" });
    } catch (err) {
        console.error("Error submitting bulk attendance:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

// Student attendance summary & subjects
router.get('/attendance/student/:email/subjects', async (req, res) => {
    const { email } = req.params;
    try {
        const [student] = await query('SELECT student_id, course_id, semester FROM Student WHERE email = ?', [email]);
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }
        const subjects = await query(
            `SELECT fs.id, s.subject_id, s.subject_name AS name, s.subject_code AS code
             FROM Faculty_Subject fs
             JOIN Subjects s ON fs.subject_id = s.subject_id
             WHERE fs.course_id = ? AND fs.semester = ?`,
            [student.course_id, student.semester]
        );
        res.status(200).json(subjects);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

router.get('/students/:email/attendance-summary', async (req, res) => {
    const { email } = req.params;
    try {
        const [student] = await query('SELECT student_id FROM Student WHERE email = ?', [email]);
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        const [summary] = await query(
            `SELECT 
                COUNT(attendance_id) AS totalClasses,
                SUM(CASE WHEN status = 'Present' THEN 1 ELSE 0 END) AS presentClasses,
                SUM(CASE WHEN status = 'Absent' THEN 1 ELSE 0 END) AS absentClasses,
                ROUND(COALESCE(SUM(CASE WHEN status = 'Present' THEN 1 ELSE 0 END) * 100.0 / NULLIF(COUNT(attendance_id), 0), 0), 2) AS overallPercentage
             FROM Attendance
             WHERE student_id = ?`,
            [student.student_id]
        );

        res.status(200).json({
            overallPercentage: summary ? summary.overallPercentage || 0 : 0,
            totalClasses: summary ? summary.totalClasses || 0 : 0,
            presentClasses: summary ? summary.presentClasses || 0 : 0,
            absentClasses: summary ? summary.absentClasses || 0 : 0,
            streak: 4
        });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

router.get('/attendance/student/:email', async (req, res) => {
    const { email } = req.params;
    try {
        const [student] = await query('SELECT student_id FROM Student WHERE email = ?', [email]);
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        const records = await query(
            `SELECT a.attendance_id AS id, a.date, a.status, a.remarks,
                    s.subject_name AS subject, s.subject_code AS subjectCode
             FROM Attendance a
             JOIN Faculty_Subject fs ON a.faculty_subject_id = fs.id
             JOIN Subjects s ON fs.subject_id = s.subject_id
             WHERE a.student_id = ?
             ORDER BY a.date DESC`,
            [student.student_id]
        );

        res.status(200).json(records);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

router.get('/attendance/student/:email/subject/:subjectId', async (req, res) => {
    const { email, subjectId } = req.params;
    try {
        const [student] = await query('SELECT student_id FROM Student WHERE email = ?', [email]);
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        const records = await query(
            `SELECT a.attendance_id AS id, a.date, a.status, a.remarks,
                    s.subject_name AS subject, s.subject_code AS subjectCode
             FROM Attendance a
             JOIN Faculty_Subject fs ON a.faculty_subject_id = fs.id
             JOIN Subjects s ON fs.subject_id = s.subject_id
             WHERE a.student_id = ? AND fs.id = ?
             ORDER BY a.date DESC`,
            [student.student_id, subjectId]
        );

        res.status(200).json(records);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

// -------------------------------------------------------------
// 9. PROFILES & IMAGES
// -------------------------------------------------------------
router.get('/students/by-email/:email', async (req, res) => {
    const { email } = req.params;
    try {
        const students = await query(
            `SELECT s.*, c.course_name AS course, b.branch_name AS branch, sec.section_name AS section
             FROM Student s
             LEFT JOIN Courses c ON s.course_id = c.course_id
             LEFT JOIN Course_Branch b ON s.branch_id = b.branch_id
             LEFT JOIN Sections sec ON s.section_id = sec.section_id
             WHERE s.email = ?`,
            [email]
        );
        if (students.length === 0) {
            return res.status(404).json({ message: "Student not found" });
        }
        res.status(200).json(students[0]);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

router.get('/faculty/by-email/:email', async (req, res) => {
    const { email } = req.params;
    try {
        const faculties = await query('SELECT * FROM Faculty WHERE email = ?', [email]);
        if (faculties.length === 0) {
            return res.status(404).json({ message: "Faculty not found" });
        }
        res.status(200).json(faculties[0]);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

router.get('/teachers/by-email/:email', async (req, res) => {
    const { email } = req.params;
    try {
        const faculties = await query('SELECT * FROM Faculty WHERE email = ?', [email]);
        if (faculties.length === 0) {
            return res.status(404).json({ message: "Teacher not found" });
        }
        res.status(200).json(faculties[0]);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

router.get('/teachers', async (req, res) => {
    try {
        const teachers = await query('SELECT faculty_id, name, department, email, contact_number, address, gender FROM Faculty');
        res.status(200).json(teachers);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

router.get('/students', async (req, res) => {
    try {
        const students = await query(
            `SELECT s.student_id, s.name, s.email, s.roll_no, s.university_id, s.semester, s.contact,
                    c.course_name, b.branch_name, sec.section_name
             FROM Student s
             LEFT JOIN Courses c ON s.course_id = c.course_id
             LEFT JOIN Course_Branch b ON s.branch_id = b.branch_id
             LEFT JOIN Sections sec ON s.section_id = sec.section_id`
        );
        res.status(200).json(students);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

router.post('/students/upload-image', upload.single('image'), async (req, res) => {
    try {
        const email = req.body.email;
        if (!req.file || !email) {
            return res.status(400).json({ message: "Image file and email are required" });
        }
        await query('UPDATE Student SET profile_image = ? WHERE email = ?', [req.file.path, email]);
        res.status(200).json({ message: "Profile image uploaded successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

router.get('/students/profile-image/:email', async (req, res) => {
    const { email } = req.params;
    try {
        const [student] = await query('SELECT profile_image FROM Student WHERE email = ?', [email]);
        if (student && student.profile_image && fs.existsSync(student.profile_image)) {
            return fs.createReadStream(student.profile_image).pipe(res);
        }
        res.status(404).send("No image found");
    } catch (err) {
        res.status(500).send("Server error");
    }
});

router.post('/faculty/upload-image', upload.single('image'), async (req, res) => {
    try {
        const email = req.body.email;
        if (!req.file || !email) {
            return res.status(400).json({ message: "Image file and email are required" });
        }
        await query('UPDATE Faculty SET profile_image = ? WHERE email = ?', [req.file.path, email]);
        res.status(200).json({ message: "Profile image uploaded successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

router.get('/faculty/profile-image/:email', async (req, res) => {
    const { email } = req.params;
    try {
        const [fac] = await query('SELECT profile_image FROM Faculty WHERE email = ?', [email]);
        if (fac && fac.profile_image && fs.existsSync(fac.profile_image)) {
            return fs.createReadStream(fac.profile_image).pipe(res);
        }
        res.status(404).send("No image found");
    } catch (err) {
        res.status(500).send("Server error");
    }
});

module.exports = router;
