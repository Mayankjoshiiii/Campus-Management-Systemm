const connDB = require('../db/db.conn');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const util = require('util');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const query = util.promisify(connDB.query).bind(connDB);

exports.loginFaculty = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }
    try {
        const result = await query("SELECT * FROM Faculty WHERE email = ?", [email]);
        if (result.length === 0) {
            return res.status(404).json({ message: "Faculty not found" });
        }
        const isMatch = await bcrypt.compare(password, result[0].password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const token = jwt.sign(
            { id: result[0].faculty_id, email: result[0].email, name: result[0].name, role: "faculty" },
            process.env.JWT_SECRET_KEY,
            { expiresIn: '24h' }
        );
        return res.status(200).json({
            message: "Login successful",
            token,
            role: "faculty",
            email: result[0].email,
            name: result[0].name,
            faculty_id: result[0].faculty_id
        });
    } catch (err) {
        return res.status(500).json({ message: "Server error", error: err.message });
    }
};

exports.resetPassword = async (req, res) => {
    const { faculty_id, oldPassword, newPassword } = req.body;

    if (!newPassword || !oldPassword || !faculty_id) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const result = await query("SELECT * FROM Faculty WHERE faculty_id = ?", [faculty_id]);

        if (result.length === 0) {
            return res.status(404).json({ message: "Faculty not found" });
        }

        const isMatch = await bcrypt.compare(oldPassword, result[0].password);
        if (!isMatch) {
            return res.status(401).json({ message: "Incorrect old password" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await query("UPDATE Faculty SET password = ? WHERE faculty_id = ?", [hashedPassword, faculty_id]);

        return res.status(200).json({ message: "Password updated successfully" });
    } catch (err) {
        return res.status(500).json({ message: "Server error", error: err.message });
    }
};

exports.getFaculty = async (req, res) => {
    try {
        const result = await query('SELECT faculty_id, name, department, department_id, email, dob, contact_number, address, gender, profile_image FROM Faculty');
        return res.status(200).json({
            message: "Faculty retrieved successfully",
            faculty: result
        });
    } catch (err) {
        return res.status(500).json({ message: "Server error", error: err.message });
    }
};

exports.getAssignedSubjects = async (req, res) => {
    const facultyId = req.params.faculty_id;
    if (!facultyId) {
        return res.status(400).json({ message: "Faculty ID is required" });
    }
    try {
        const result = await query(
            `SELECT fs.*, s.subject_name, s.subject_code, s.credits, c.course_name, sec.section_name
             FROM Faculty_Subject fs
             JOIN Subjects s ON fs.subject_id = s.subject_id
             JOIN Courses c ON fs.course_id = c.course_id
             LEFT JOIN Sections sec ON fs.section_id = sec.section_id
             WHERE fs.faculty_id = ?`,
            [facultyId]
        );
        return res.status(200).json({
            message: "Assigned subjects retrieved successfully",
            subjects: result
        });
    } catch (err) {
        return res.status(500).json({ message: "Server error", error: err.message });
    }
};

exports.getSections = async (req, res) => {
    const facultyId = req.params.faculty_id;

    if (!facultyId) {
        return res.status(400).json({ message: "Faculty ID is required" });
    }

    try {
        const sections = await query(
            `SELECT DISTINCT s.section_id, s.section_name, s.course_id, s.branch_id, s.semester
             FROM Faculty_Subject fs
             JOIN Sections s ON fs.section_id = s.section_id
             WHERE fs.faculty_id = ?`,
            [facultyId]
        );

        return res.status(200).json(sections);
    } catch (err) {
        return res.status(500).json({ message: "Server error", error: err.message });
    }
};

exports.getStudentOfSection = async (req, res) => {
    const sectionId = req.params.section_id;
    if (!sectionId) {
        return res.status(400).json({ message: "Section ID required" });
    }
    try {
        const students = await query('SELECT student_id, name, email, roll_no, university_id, semester, contact FROM Student WHERE section_id = ?', [sectionId]);
        return res.status(200).json({ message: "Student list fetch successfully", students });
    } catch (err) {
        return res.status(500).json({ message: "Server error", error: err.message });
    }
};

// Mark Attendance
exports.markAttendance = async (req, res) => {
    const { faculty_subject_id, date, attendance } = req.body;

    if (!faculty_subject_id || !date || !attendance || !Array.isArray(attendance)) {
        return res.status(400).json({ message: "faculty_subject_id, date, and attendance array are required" });
    }

    try {
        for (const record of attendance) {
            const { student_id, status, remarks } = record;

            if (!student_id || !status) {
                continue;
            }

            await query(
                `INSERT INTO Attendance (student_id, faculty_subject_id, date, status, remarks)
                 VALUES (?, ?, ?, ?, ?)
                 ON DUPLICATE KEY UPDATE status = VALUES(status), remarks = VALUES(remarks)`,
                [student_id, faculty_subject_id, date, status, remarks || '']
            );
        }

        return res.status(200).json({ message: "Attendance marked successfully" });
    } catch (err) {
        console.error("Error marking attendance:", err);
        return res.status(500).json({ message: "Server error", error: err.message });
    }
};

exports.getAnnouncement = async (req, res) => {
    try {
        const announcements = await query(
            "SELECT * FROM announcement ORDER BY created_at DESC"
        );
        return res.status(200).json(announcements);
    } catch (err) {
        console.error("Error fetching announcements:", err);
        return res.status(500).json({ message: "Server error", error: err.message });
    }
};