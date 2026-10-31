const mysql = require('mysql');
const bcrypt = require('bcrypt');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const config = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || process.env.database_pass || 'mayank',
    port: parseInt(process.env.DB_PORT) || 3306,
    database: process.env.DB_NAME || 'university'
};

const conn = mysql.createConnection(config);

function query(sql, params = []) {
    return new Promise((resolve, reject) => {
        conn.query(sql, params, (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
}

async function seed() {
    try {
        console.log('Seeding university database...');

        // 1. Admin
        const adminPass = await bcrypt.hash('admin123', 10);
        await query(
            `INSERT INTO admin (name, email, password) VALUES (?, ?, ?)
             ON DUPLICATE KEY UPDATE name=VALUES(name), password=VALUES(password)`,
            ['University Admin', 'admin@university.edu', adminPass]
        );
        // Also support satya@gmail.com for backward compatibility
        await query(
            `INSERT INTO admin (name, email, password) VALUES (?, ?, ?)
             ON DUPLICATE KEY UPDATE name=VALUES(name), password=VALUES(password)`,
            ['Satya Admin', 'satya@gmail.com', adminPass]
        );
        console.log('✓ Admins seeded (admin@university.edu / admin123)');

        // 2. Departments
        const depts = [
            ['Computer Science & Engineering', 'CSE', 'Dr. Ramesh Kumar', 'ramesh.hod@university.edu', '0135-270001', 'Block A, Floor 3', 'Department of Computer Science & Engineering'],
            ['Information Technology', 'IT', 'Dr. Sunita Rao', 'sunita.hod@university.edu', '0135-270002', 'Block A, Floor 2', 'Department of Information Technology'],
            ['Electronics & Communication', 'ECE', 'Dr. Alok Verma', 'alok.hod@university.edu', '0135-270003', 'Block B, Floor 1', 'Department of Electronics & Communication'],
            ['Mechanical Engineering', 'ME', 'Dr. Rajesh Sharma', 'rajesh.hod@university.edu', '0135-270004', 'Block C, Floor 1', 'Department of Mechanical Engineering']
        ];
        for (const d of depts) {
            await query(
                `INSERT INTO departments (department_name, dept_code, hod_name, hod_email, phone, office_location, description)
                 VALUES (?, ?, ?, ?, ?, ?, ?)
                 ON DUPLICATE KEY UPDATE department_name=VALUES(department_name)`,
                d
            );
        }
        console.log('✓ Departments seeded');

        // 3. Courses
        const courses = [
            ['B.Tech', 4, 8, 'BT-CSE', 'Computer Science & Engineering', 'Bachelor of Technology'],
            ['BCA', 3, 6, 'BCA-01', 'Computer Science & Engineering', 'Bachelor of Computer Applications'],
            ['M.Tech', 2, 4, 'MT-CSE', 'Computer Science & Engineering', 'Master of Technology']
        ];
        for (const c of courses) {
            await query(
                `INSERT INTO Courses (course_name, duration_years, total_semesters, course_code, department, description)
                 VALUES (?, ?, ?, ?, ?, ?)
                 ON DUPLICATE KEY UPDATE duration_years=VALUES(duration_years)`,
                c
            );
        }
        console.log('✓ Courses seeded');

        const [btech] = await query('SELECT course_id FROM Courses WHERE course_name="B.Tech"');
        const btechId = btech ? btech.course_id : 1;

        // 4. Branches
        const branches = [
            [btechId, 'Computer Science', 'Core CSE program'],
            [btechId, 'Artificial Intelligence & ML', 'AI and Machine Learning specialization'],
            [btechId, 'Data Science', 'Data Science & Big Data']
        ];
        for (const b of branches) {
            await query(
                `INSERT INTO Course_Branch (course_id, branch_name, description)
                 VALUES (?, ?, ?)
                 ON DUPLICATE KEY UPDATE description=VALUES(description)`,
                b
            );
        }
        console.log('✓ Branches seeded');

        const [cseBranch] = await query('SELECT branch_id FROM Course_Branch WHERE branch_name="Computer Science"');
        const branchId = cseBranch ? cseBranch.branch_id : 1;

        // 5. Subjects
        const subjects = [
            ['Database Management Systems', 'CS301', 'B.Tech', 4, 'Relational Database Design, SQL, Transactions, Indexing'],
            ['Data Structures & Algorithms', 'CS302', 'B.Tech', 4, 'Arrays, Trees, Graphs, Sorting, Searching'],
            ['Operating Systems', 'CS303', 'B.Tech', 4, 'Processes, Threads, Concurrency, Memory Management'],
            ['Computer Networks', 'CS304', 'B.Tech', 3, 'OSI Model, TCP/IP, Routing Protocols, Sockets']
        ];
        for (const s of subjects) {
            await query(
                `INSERT INTO Subjects (subject_name, subject_code, course, credits, description)
                 VALUES (?, ?, ?, ?, ?)
                 ON DUPLICATE KEY UPDATE credits=VALUES(credits)`,
                s
            );
        }
        console.log('✓ Subjects seeded');

        const allSubjects = await query('SELECT subject_id FROM Subjects');
        for (const sub of allSubjects) {
            await query(
                `INSERT INTO Course_Subjects (course_id, subject_id, semester, is_active)
                 VALUES (?, ?, ?, TRUE)
                 ON DUPLICATE KEY UPDATE is_active=TRUE`,
                [btechId, sub.subject_id, 5]
            );
        }

        // 6. Sections
        await query(
            `INSERT INTO Sections (section_name, course_id, branch_id, semester)
             VALUES (?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE semester=VALUES(semester)`,
            ['Section A', btechId, branchId, 5]
        );
        await query(
            `INSERT INTO Sections (section_name, course_id, branch_id, semester)
             VALUES (?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE semester=VALUES(semester)`,
            ['Section B', btechId, branchId, 5]
        );
        console.log('✓ Sections seeded');

        const [secA] = await query('SELECT section_id FROM Sections WHERE section_name="Section A"');
        const secAId = secA ? secA.section_id : 1;

        // 7. Faculty
        const facultyPass = await bcrypt.hash('faculty123', 10);
        await query(
            `INSERT INTO Faculty (name, department, department_id, email, password, dob, contact_number, address, gender)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE name=VALUES(name), password=VALUES(password)`,
            [
                'Dr. Satya Prakash',
                'Computer Science & Engineering',
                'CSE',
                'faculty@university.edu',
                facultyPass,
                '1985-06-15',
                '9876543210',
                'Faculty Quarters, Campus Cloud University',
                'Male'
            ]
        );
        // Also add satyasingh159357@gmail.com for test script compatibility
        await query(
            `INSERT INTO Faculty (name, department, department_id, email, password, dob, contact_number, address, gender)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE name=VALUES(name), password=VALUES(password)`,
            [
                'Dr. Satya Prakash Singh',
                'Computer Science & Engineering',
                'CSE',
                'satyasingh159357@gmail.com',
                facultyPass,
                '1985-06-15',
                '9876543210',
                'Faculty Quarters, Campus Cloud University',
                'Male'
            ]
        );
        console.log('✓ Faculty seeded (faculty@university.edu / faculty123)');

        const [fac] = await query('SELECT faculty_id FROM Faculty WHERE email="faculty@university.edu"');
        const facultyId = fac ? fac.faculty_id : 1;
        const [dbmsSub] = await query('SELECT subject_id FROM Subjects WHERE subject_code="CS301"');
        const dbmsId = dbmsSub ? dbmsSub.subject_id : 1;

        // 8. Assign Faculty to Subject & Section
        await query(
            `INSERT INTO Faculty_Subject (faculty_id, subject_id, course_id, branch_id, section_id, semester)
             SELECT ?, ?, ?, ?, ?, ?
             WHERE NOT EXISTS (
                 SELECT 1 FROM Faculty_Subject WHERE faculty_id=? AND subject_id=? AND section_id=?
             )`,
            [facultyId, dbmsId, btechId, branchId, secAId, 5, facultyId, dbmsId, secAId]
        );

        await query(
            `INSERT INTO Faculty_Section_Subject (faculty_id, section_id, subject_id)
             VALUES (?, ?, ?)
             ON DUPLICATE KEY UPDATE subject_id=VALUES(subject_id)`,
            [facultyId, secAId, dbmsId]
        );

        const [facSubRecord] = await query('SELECT id FROM Faculty_Subject WHERE faculty_id=? AND subject_id=?', [facultyId, dbmsId]);
        const facSubId = facSubRecord ? facSubRecord.id : 1;

        // 9. Students
        const studentPass = await bcrypt.hash('student123', 10);
        const sampleStudents = [
            ['Aman Verma', 'student@university.edu', '10001', '20001', '2003-08-14', 'Male', '9811122233', 'Hostel 1, Campus Cloud University'],
            ['Riya Sen', 'riya@university.edu', '10002', '20002', '2003-11-20', 'Female', '9811122234', 'Hostel 2, Campus Cloud University'],
            ['Rohan Gupta', 'rohan@university.edu', '10003', '20003', '2004-01-05', 'Male', '9811122235', 'Hostel 1, Campus Cloud University'],
            ['Ananya Patel', 'ananya@university.edu', '10004', '20004', '2003-04-12', 'Female', '9811122236', 'Hostel 2, Campus Cloud University'],
            ['Kabir Singh', 'kabir@university.edu', '10005', '20005', '2003-09-30', 'Male', '9811122237', 'Hostel 1, Campus Cloud University']
        ];

        for (const s of sampleStudents) {
            await query(
                `INSERT INTO Student (
                    name, email, password, university_id, roll_no,
                    course_id, branch_id, section_id, semester, year,
                    dob, gender, nationality, blood_group, contact, address,
                    father_name, father_contact, father_occupation,
                    mother_name, mother_contact, mother_occupation
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 5, 2025, ?, ?, 'Indian', 'B+', ?, ?, 'Mr. Parent', '9800011122', 'Service', 'Mrs. Parent', '9800011123', 'Homemaker')
                ON DUPLICATE KEY UPDATE name=VALUES(name), password=VALUES(password)`,
                [s[0], s[1], studentPass, s[2], s[3], btechId, branchId, secAId, s[4], s[5], s[6], s[7]]
            );
        }
        console.log('✓ Students seeded (student@university.edu / student123)');

        // 10. Student Subjects & Attendance
        const allStuds = await query('SELECT student_id FROM Student');
        for (const st of allStuds) {
            await query(
                `INSERT INTO Student_Subject (student_id, subject_id)
                 VALUES (?, ?)
                 ON DUPLICATE KEY UPDATE subject_id=VALUES(subject_id)`,
                [st.student_id, dbmsId]
            );

            // Seed attendance dates
            const dates = ['2026-10-20', '2026-10-22', '2026-10-24', '2026-10-27', '2026-10-29'];
            for (let i = 0; i < dates.length; i++) {
                const status = (st.student_id + i) % 4 === 0 ? 'Absent' : 'Present';
                await query(
                    `INSERT INTO Attendance (student_id, faculty_subject_id, date, status, remarks)
                     VALUES (?, ?, ?, ?, ?)
                     ON DUPLICATE KEY UPDATE status=VALUES(status)`,
                    [st.student_id, facSubId, dates[i], status, status === 'Present' ? 'On time' : 'Medical leave']
                );
            }
        }
        console.log('✓ Attendance records seeded');

        // 11. Announcements
        const announcements = [
            ['Mid-Term Examination Schedule Released', 'Exam', 'The Mid-Term theory examinations for Semester 5 will commence from 15th November 2026. Hall tickets available on portal.', null, 1],
            ['Campus Placement Drive 2026', 'Academic', 'Top tech firms are visiting campus next month for internships and placements. Register via Placement Cell by 10th Nov.', null, 1],
            ['Annual Tech Fest - TechnoCloud 2026', 'Others', 'Registrations are now open for Hackathons, Coding Contests, and Robotics competitions!', null, 1]
        ];
        for (const a of announcements) {
            await query(
                `INSERT INTO announcement (title, type, description, file_url, admin_id)
                 VALUES (?, ?, ?, ?, ?)`,
                a
            );
        }
        console.log('✓ Announcements seeded');

        console.log('\n=========================================');
        console.log('DATABASE SEEDED SUCCESSFULLY!');
        console.log('Default Logins:');
        console.log('  Admin:   admin@university.edu    / admin123');
        console.log('  Faculty: faculty@university.edu  / faculty123');
        console.log('  Student: student@university.edu  / student123');
        console.log('=========================================\n');

        conn.end();
        process.exit(0);
    } catch (err) {
        console.error('Seeding failed:', err);
        conn.end();
        process.exit(1);
    }
}

seed();
