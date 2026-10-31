const mysql = require('mysql');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const config = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || process.env.database_pass || 'mayank',
    port: parseInt(process.env.DB_PORT) || 3306,
    multipleStatements: true
};

console.log(`Connecting to MySQL on ${config.host}:${config.port} as ${config.user}...`);

const conn = mysql.createConnection(config);

conn.connect((err) => {
    if (err) {
        console.error('Failed to connect to MySQL:', err.message);
        process.exit(1);
    }
    console.log('Connected to MySQL server.');

    const schemaSql = `
    CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME || 'university'}\`;
    USE \`${process.env.DB_NAME || 'university'}\`;

    CREATE TABLE IF NOT EXISTS admin (
        admin_id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(100) NOT NULL
    );

    CREATE TABLE IF NOT EXISTS departments (
        department_id INT PRIMARY KEY AUTO_INCREMENT,
        department_name VARCHAR(100) NOT NULL UNIQUE,
        dept_code VARCHAR(16) NOT NULL UNIQUE,
        hod_name VARCHAR(100),
        hod_email VARCHAR(255),
        phone VARCHAR(20),
        office_location VARCHAR(100),
        description TEXT
    );

    CREATE TABLE IF NOT EXISTS Courses (
        course_id INT PRIMARY KEY AUTO_INCREMENT,
        course_name VARCHAR(100) NOT NULL UNIQUE,
        duration_years INT NOT NULL,
        total_semesters INT NOT NULL,
        course_code VARCHAR(20) UNIQUE,
        department VARCHAR(100),
        description TEXT
    );

    CREATE TABLE IF NOT EXISTS Course_Branch (
        branch_id INT PRIMARY KEY AUTO_INCREMENT,
        course_id INT NOT NULL,
        branch_name VARCHAR(100) NOT NULL,
        description TEXT,
        UNIQUE(course_id, branch_name),
        FOREIGN KEY (course_id) REFERENCES Courses(course_id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS Subjects (
        subject_id INT PRIMARY KEY AUTO_INCREMENT,
        subject_name VARCHAR(100) NOT NULL,
        subject_code VARCHAR(20) NOT NULL UNIQUE,
        course VARCHAR(100) NOT NULL,
        credits INT NOT NULL,
        description TEXT
    );

    CREATE TABLE IF NOT EXISTS Course_Subjects (
        cs_id INT PRIMARY KEY AUTO_INCREMENT,
        course_id INT NOT NULL,
        subject_id INT NOT NULL,
        semester INT NOT NULL,
        is_active BOOLEAN DEFAULT TRUE,
        FOREIGN KEY (course_id) REFERENCES Courses(course_id) ON DELETE CASCADE,
        FOREIGN KEY (subject_id) REFERENCES Subjects(subject_id) ON DELETE CASCADE,
        UNIQUE(course_id, subject_id, semester)
    );

    CREATE TABLE IF NOT EXISTS Sections (
        section_id INT PRIMARY KEY AUTO_INCREMENT,
        section_name VARCHAR(50) NOT NULL UNIQUE,
        course_id INT NOT NULL,
        branch_id INT,
        semester INT NOT NULL,
        FOREIGN KEY (course_id) REFERENCES Courses(course_id) ON DELETE CASCADE,
        FOREIGN KEY (branch_id) REFERENCES Course_Branch(branch_id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS Faculty (
        faculty_id INT UNIQUE AUTO_INCREMENT,
        name VARCHAR(100) NOT NULL,
        department VARCHAR(100),
        department_id VARCHAR(100),
        email VARCHAR(100) PRIMARY KEY,
        password VARCHAR(100) NOT NULL,
        dob DATE,
        contact_number VARCHAR(15),
        address TEXT,
        gender VARCHAR(10),
        profile_image VARCHAR(500)
    );

    CREATE TABLE IF NOT EXISTS Student (
        student_id INT PRIMARY KEY AUTO_INCREMENT,
        university_id CHAR(10) UNIQUE,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(100) NOT NULL,
        roll_no CHAR(10) UNIQUE,
        course_id INT NOT NULL,
        branch_id INT NULL,
        section_id INT DEFAULT NULL,
        semester INT,
        year INT,
        dob DATE,
        gender VARCHAR(10),
        nationality VARCHAR(50) DEFAULT NULL,
        blood_group VARCHAR(5) DEFAULT NULL,
        contact VARCHAR(15),
        address TEXT,
        father_name VARCHAR(100),
        father_contact VARCHAR(15),
        father_occupation VARCHAR(100),
        mother_name VARCHAR(100),
        mother_contact VARCHAR(15),
        mother_occupation VARCHAR(100),
        profile_image VARCHAR(500),
        FOREIGN KEY (course_id) REFERENCES Courses(course_id) ON DELETE CASCADE,
        FOREIGN KEY (branch_id) REFERENCES Course_Branch(branch_id) ON DELETE CASCADE,
        FOREIGN KEY (section_id) REFERENCES Sections(section_id) ON DELETE SET NULL
    ) AUTO_INCREMENT = 1000;

    CREATE TABLE IF NOT EXISTS Faculty_Subject (
        id INT PRIMARY KEY AUTO_INCREMENT,
        faculty_id INT NOT NULL,
        subject_id INT NOT NULL,
        course_id INT NOT NULL,
        branch_id INT NULL,
        section_id INT NULL,
        semester INT NOT NULL,
        FOREIGN KEY (faculty_id) REFERENCES Faculty(faculty_id) ON DELETE CASCADE,
        FOREIGN KEY (subject_id) REFERENCES Subjects(subject_id) ON DELETE CASCADE,
        FOREIGN KEY (course_id) REFERENCES Courses(course_id) ON DELETE CASCADE,
        FOREIGN KEY (branch_id) REFERENCES Course_Branch(branch_id) ON DELETE CASCADE,
        FOREIGN KEY (section_id) REFERENCES Sections(section_id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS Faculty_Section_Subject (
        id INT PRIMARY KEY AUTO_INCREMENT,
        faculty_id INT NOT NULL,
        section_id INT NOT NULL,
        subject_id INT NOT NULL,
        FOREIGN KEY (faculty_id) REFERENCES Faculty(faculty_id) ON DELETE CASCADE,
        FOREIGN KEY (section_id) REFERENCES Sections(section_id) ON DELETE CASCADE,
        FOREIGN KEY (subject_id) REFERENCES Subjects(subject_id) ON DELETE CASCADE,
        UNIQUE(faculty_id, section_id, subject_id)
    );

    CREATE TABLE IF NOT EXISTS Student_Subject (
        id INT PRIMARY KEY AUTO_INCREMENT,
        student_id INT NOT NULL,
        subject_id INT NOT NULL,
        FOREIGN KEY (student_id) REFERENCES Student(student_id) ON DELETE CASCADE,
        FOREIGN KEY (subject_id) REFERENCES Subjects(subject_id) ON DELETE CASCADE,
        UNIQUE(student_id, subject_id)
    );

    CREATE TABLE IF NOT EXISTS Attendance (
        attendance_id INT PRIMARY KEY AUTO_INCREMENT,
        student_id INT NOT NULL,
        faculty_subject_id INT NOT NULL,
        date DATE NOT NULL,
        status ENUM('Present','Absent') NOT NULL,
        remarks VARCHAR(255) DEFAULT '',
        FOREIGN KEY (student_id) REFERENCES Student(student_id) ON DELETE CASCADE,
        FOREIGN KEY (faculty_subject_id) REFERENCES Faculty_Subject(id) ON DELETE CASCADE,
        UNIQUE(student_id, faculty_subject_id, date)
    );

    CREATE TABLE IF NOT EXISTS announcement (
        announcement_id INT PRIMARY KEY AUTO_INCREMENT,
        title VARCHAR(255) NOT NULL,
        type VARCHAR(50) DEFAULT 'Others',
        description TEXT,
        file_url VARCHAR(500),
        admin_id INT DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS calendar (
        calendar_id INT PRIMARY KEY AUTO_INCREMENT,
        title VARCHAR(255) NOT NULL,
        file_path VARCHAR(500),
        uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    `;

    conn.query(schemaSql, (err, results) => {
        if (err) {
            console.error('Error executing schema SQL:', err);
            conn.end();
            process.exit(1);
        }
        console.log('Database and all tables created successfully!');
        conn.end();
        process.exit(0);
    });
});
