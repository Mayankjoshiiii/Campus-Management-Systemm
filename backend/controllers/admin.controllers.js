const connDB = require('../db/db.conn');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const util = require('util');
require('dotenv').config();
const cloudinary=require('../db/cloudinary.conn');
const fs=require('fs');
const path = require('path');

const query = util.promisify(connDB.query).bind(connDB);
const adminService = require('../services/admin.services');


function generateRandomPassword(length = 8) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$';
    let password = '';
    for (let i = 0; i < length; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
}

exports.adminLogin = async (req, res) => {
    const { email, password } = req.body;
    // console.log(req.body);
    if (!email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }
    try {
        const result = await query('SELECT * FROM admin WHERE email=?', [email]);
        if (result.length === 0) {
            return res.status(404).json({ message: "Admin not found" });
        }
        const isMatch = await bcrypt.compare(password, result[0].password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const token = jwt.sign(
            { id: result[0].admin_id, email: result[0].email, name: result[0].name },
            process.env.JWT_SECRET_KEY,
            { expiresIn: '1h' }
        );
        return res.status(200).json({
            message: "Login successful",
            token,
            role: "admin",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
};


exports.addStudent = async (req, res) => {
    try {
        const {
            name,
            email,
            course_id,
            branch_id,
            section_id,
            semester,
            year,
            dob,
            gender,
            nationality,
            blood_group,
            contact,
            address,
            father_name,
            father_contact,
            father_occupation,
            mother_name,
            mother_contact,
            mother_occupation
        } = req.body;

        
        const lastStudent = await query("SELECT MAX(university_id) AS maxUniId FROM Student");
        let university_id = "10001";
        if (lastStudent[0].maxUniId) {
            university_id = (parseInt(lastStudent[0].maxUniId) + 1).toString().padStart(5, "0");
        }

        
        const lastRoll = await query("SELECT MAX(roll_no) AS maxRoll FROM Student");
        let newRollNo = "20001";
        if (lastRoll[0].maxRoll) {
            newRollNo = (parseInt(lastRoll[0].maxRoll) + 1).toString().padStart(5, "0");
        }

        const password = generateRandomPassword();
        const mailSendDetails = await adminService.sendCredentials(email, name, password, "Student");
        if (!mailSendDetails.success) {
            return res.status(500).json({
                success: false,
                message: "Error sending email",
                error: mailSendDetails.error
            });
        }
        const hashedPassword = await bcrypt.hash(mailSendDetails.password, 10);
        const result = await query(
            `INSERT INTO Student (
                university_id, name, email, password, roll_no,
                course_id, branch_id, section_id,
                semester, year, dob, gender,
                nationality, blood_group, contact, address,
                father_name, father_contact, father_occupation,
                mother_name, mother_contact, mother_occupation
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                university_id, name, email, hashedPassword, newRollNo,
                course_id, branch_id || null, section_id || null,
                semester, year, dob, gender,
                nationality, blood_group, contact, address,
                father_name, father_contact, father_occupation,
                mother_name, mother_contact, mother_occupation
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(500).json({ success: false, message: "Error adding student" });
        }

        return res.status(201).json({
            success: true,
            message: "Student added successfully",
            data: {
                student_id: result.insertId,
                university_id,
                roll_no: newRollNo
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Error adding student",
            error: err.message
        });
    }
};

/////probleming  this route... check later....
exports.addBulkStudent = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "File is required" });
        }
        
        const students = await adminService.parseStudentFile(req.file.path);

        const requiredFields = [
            'name', 'email', 'course_id', 'semester', 'year',
            'dob', 'gender', 'contact', 'address'
        ];

        for (const student of students) {
            for (const field of requiredFields) {
                if (!student[field]) {
                    return res.status(400).json({
                        message: `Missing field ${field} in some record`
                    });
                }
            }
        }
        console.log("all okay");
        const values = [];
        let failedEmails = [];

        const [lastIds] = await query(`
            SELECT 
                COALESCE(MAX(CAST(roll_no AS UNSIGNED)), 0) AS last_roll,
                COALESCE(MAX(CAST(university_id AS UNSIGNED)), 0) AS last_univ
            FROM Student
        `);

        let rollCounter = lastIds.last_roll;
        let univCounter = lastIds.last_univ;

        for (const s of students) {
            const password = generateRandomPassword();

            // Send email with credentials
            const mailSendDetails = await adminService.sendCredentials(
                s.email, s.name, password, "Student"
            );
            if (!mailSendDetails.success) {
                failedEmails.push({ email: s.email, error: mailSendDetails.error });
                continue; // Skip this student if email fails
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            
            rollCounter++;
            univCounter++;
            const roll_no = String(rollCounter).padStart(5, '0');
            const university_id = String(univCounter).padStart(5, '0');

            values.push([
                university_id,
                s.name,
                s.email,
                hashedPassword,
                roll_no,
                s.course_id,
                s.branch_id,
                s.section_id || null,
                s.semester,
                s.year,
                s.dob,
                s.gender,
                s.nationality || null,
                s.blood_group || null,
                s.contact,
                s.address,
                s.father_name || null,
                s.father_contact || null,
                s.father_occupation || null,
                s.mother_name || null,
                s.mother_contact || null,
                s.mother_occupation || null
            ]);
        }

        if (values.length === 0) {
            return res.status(500).json({
                message: "No students added. All emails failed.",
                failedEmails
            });
        }

        const sql = `
            INSERT INTO Student
            (university_id, name, email, password, roll_no,
             course_id, branch_id, section_id,
             semester, year, dob, gender,
             nationality, blood_group, contact, address,
             father_name, father_contact, father_occupation,
             mother_name, mother_contact, mother_occupation)
            VALUES ?
        `;

        await query(sql, [values]);

        res.status(201).json({
            message: "Bulk students added successfully",
            added: values.length,
            failedEmails
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};




exports.uploadAnnouncement = async (req, res) => {
    const { type, title, description } = req.body;
    let fileUrl = null;

    try {
        if (req.file) {
            // Normalize path for all OS
            const filePath = req.file.path.split(path.sep).join(path.posix.sep);
            const result = await cloudinary.uploader.upload(filePath, {
                folder: type || "Others",
                resource_type: 'auto',
                access_mode: "public"
            });
            fs.unlinkSync(req.file.path);
            fileUrl = result.secure_url;
        }

        // Save announcement info in DB
        await query(
            `INSERT INTO announcement (title, description, type, file_url, admin_id, created_at)
             VALUES (?, ?, ?, ?, ?, NOW())`,
            [
                title || '',
                description || '',
                type || 'Others',
                fileUrl,
                req.user?.admin_id || 1 
            ]
        );

        res.status(201).json({
            message: "Announcement saved successfully",
            url: fileUrl
        });

    } catch (err) {
        res.status(500).json({
            message: "Uploading failed.",
            error: err.message
        });
    }
}

exports.addNewCourse = async (req, res) => {
    const { course_name, duration_years, department, course_code, description } = req.body;

    if (!course_name || !course_code || !duration_years) {
        return res.status(400).json({ message: "Course name, code, and duration (years) are required" });
    }
    const total_semesters = duration_years * 2;
    try {
        const existing = await query('SELECT * FROM Courses WHERE course_code = ?', [course_code]);
        if (existing.length > 0) {
            return res.status(409).json({ message: "Course with this code already exists" });
        }
        await query(
            `INSERT INTO Courses (course_name, duration_years, total_semesters, department, course_code, description)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [course_name, duration_years, total_semesters, department || null, course_code, description || null]
        );

        res.status(201).json({ message: "Course added successfully" });
    } catch (error) {
        console.error("Error adding course:", error);
        res.status(500).json({ message: "Server error" });
    }
};

exports.getAllCourses=async(req,res)=>{
    try{
        //console.log("Fetching all courses");
        const courses=await query('SELECT * FROM Courses');
        if(courses.length===0){
            return res.status(404).json("No courses found");
        }
        res.status(200).json(courses);
    }
    catch(error){
        console.error("Error fetching courses:", error);
        return res.status(500).json({ message: "Server error" });
    }
}

exports.addBranch=async(req,res)=>{
    const {branch_name,course_id,description}=req.body;
    if(!branch_name ||!course_id){
        return res.status(400).json({message:"Branch name and course ID are required"});
    }
    try{
        const existing =await query('SELECT * FROM Course_Branch WHERE branch_name=? AND course_id=?',[branch_name, course_id]);
        if(existing.length>0){
            return res.status(499).json({ message: "Branch already exists for this course" });
        }
        await query('INSERT INTO Course_Branch (branch_name, course_id, description) VALUES (?, ?, ?)',
            [branch_name, course_id, description || null]
        );
        res.status(201).json({ message: "Branch added successfully" });
    }
    catch(err){
        console.error("Error adding branch:",err);
        return res.status(500).json({message:"Server error",error:err.message});
    }
}
exports.getAllBranches=async(req,res)=>{
    try{
        const branches= await query('Select * from Course_Branch');
        if(branches.length===0){
            return res.status(404).json({message:"No branches found"});
        }
        res.status(200).json(branches);
    }
    catch(err){
        return res.status(500).json({message:"Server Error",error:err.message});
    }
}

exports.addNewSubject=async(req,res)=>{
    const {subject_name,subject_code,course,credits,description}=req.body;
    try{
        if(!subject_name || !subject_code ||!course || !credits){
            return res.status(400).json({ message: "Subject name, code, and credits are required" });
        }
        const existing = await query('SELECT * FROM Subjects WHERE subject_code = ?', [subject_code]);
        if (existing.length > 0) {
            return res.status(409).json({ message: "Subject with this code already exists" });
        }
        await query(
            `INSERT INTO Subjects (subject_name, subject_code,course, credits, description)
             VALUES (?, ?, ?, ?, ?)`,
            [subject_name, subject_code,course, credits, description || null]
        );

        res.status(201).json({ message: "Subject added successfully" });
    }
    catch(error){
        console.error("Error adding subject:", error);
        res.status(500).json({ message: "Server error" });
    }
}
exports.getAllSubjects=async(req,res)=>{
    try{
        const subjects=await query('SELECT * FROM Subjects');
        if(subjects.length===0){
            return res.status(404).json("No subjects found");
        }
        res.status(200).json(subjects); 
    }
    catch(error){
        return res.status(500).json({message:"server error",error:error.message});
    }
}

exports.getAllSubjectsByCourse=async(req,res)=>{
    const course = req.params.course;
    if (!course) {
        return res.status(400).json({ message: "Course Name is required" });
    }
    try {
        const subjects = await query(
            `SELECT * FROM Subjects WHERE course= ?`,
            [course]
        );
        if (subjects.length === 0) {
            return res.status(404).json({ message: "No subjects found for this course" });
        }
        res.status(200).json(subjects);
    } catch (error) {
        console.error("Error fetching subjects by course:", error);
        res.status(500).json({ message: "Server error" });
    }
}

exports.addSection=async(req,res)=>{
    const {section_name,course_id,semster,branch_id}=req.body;
    if(!section_name || !course_id || !semster){
        return res.status(400).json({ message: "Section name, course ID, and semester are required" });
    }
    try {
        const existing = await query('SELECT * FROM Sections WHERE section_name = ? AND course_id = ? AND semester = ?', [section_name, course_id, semster]);
        if (existing.length > 0) {
            return res.status(409).json({ message: "Section already exists for this course and semester" });
        }
        await query(
            `INSERT INTO Sections (section_name, course_id, semester,branch_id) VALUES (?, ?, ?, ?)`,
            [section_name, course_id, semster,branch_id || null]
        );

        res.status(201).json({ message: "Section added successfully" });
    } catch (error) {
        console.error("Error adding section:", error);
        res.status(500).json({ message: "Server error" });
    }
}

exports.getAllSections=async(req,res)=>{
    const {course_id}=req.params;
    if(!course_id){
        return res.status(400).json({message:"Course ID is required"});
    }
    try{
        const results=await query('SELECT * FROM sections WHERE course_id=?',[course_id]);
        if(results.length===0){
            return res.status(404).json({message:"No sections found"});
        }
        return res.status(200).json(results);
    }
    catch(err){
        return res.status(500).json({message:"Server error",error:err.message});
    }
}

exports.addStudentsToSection = async (req, res) => {
    const { course_id, branch_id, semester, section_id, student_ids } = req.body;

    if (!course_id || !branch_id || !section_id || !semester || !Array.isArray(student_ids) || student_ids.length === 0) {
        return res.status(400).json({ message: "Course ID, branch ID, semester, section ID, and student IDs array are required" });
    }

    try {
        const section = await query('SELECT * FROM Sections WHERE section_id = ?', [section_id]);
        if (section.length === 0) {
            return res.status(404).json({ message: "Section not found" });
        }

        const students = await query('SELECT * FROM Student WHERE student_id IN (?)', [student_ids]);
        if (students.length !== student_ids.length) {
            return res.status(404).json({ message: "Some students not found" });
        }

        
        await query(
            `UPDATE Student
             SET section_id = ?, semester = ?, course_id = ?, branch_id = ? 
             WHERE student_id IN (?)`,
            [section_id, semester, course_id, branch_id, student_ids]
        );

        res.status(200).json({ message: "Students updated with section successfully" });

    } catch (error) {
        console.error("Error updating students section:", error);
        res.status(500).json({ message: "Server error" });
    }
};

exports.addDepartment= async(req,res)=>{
    const{ department_name,dept_code,hod_name,hod_email,phone,office_location,description} = req.body;
    if(!department_name || !dept_code ){
        return res.status(400).json({message:"Department name and code are required"});
    }
    try{
        const existing=await query('SELECT * FROM Departments WHERE dept_code=?',[dept_code]);
        if(existing.length>0){
            return res.status(409).json({message:"Department with this code already exists"});
        }
        await query(
            `INSERT INTO Departments (department_name, dept_code, hod_name, hod_email, phone, office_location, description)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [department_name, dept_code, hod_name || null, hod_email || null, phone || null, office_location || null, description || null]
        );
        res.status(201).json({message:"Department added successfully"});
    }
    catch(err){
        return res.status(500).json({message:"server error",error:err.message});
    }
}

exports.getAllDepartments=async(req,res)=>{
    try{
        const departments=await query("SELECT * FROM Departments");
        if(departments.length==0){
            return res.status(404).json({message:"No departments found"});
        }
        return res.status(200).json(departments);
    }
    catch(err){
        return res.status(500).json({message:"Server error",error:err.message});
    }
}

//adding faculty...
exports.addFaculty=async(req,res)=>{
    const {name,department_id,email,dob,contact_number,address,gender}=req.body;
    if(!name || !email){
        return res.status(400).json({ message: "Name and email are required" });
    }
    

    try {
        const existing = await query('SELECT * FROM Faculty WHERE email = ?', [email]);
        if (existing.length > 0) {
            return res.status(409).json({ message: "Faculty with this email already exists" });
        }
        const password = generateRandomPassword();
        // Send credentials to faculty email
        const mailSendDetails = await adminService.sendCredentials(email, name, password,"Faculty Member");
        if (!mailSendDetails.success) {
            return res.status(500).json({ message: "Error sending email", error: mailSendDetails.error });
        }
        const hashedPassword = await bcrypt.hash(mailSendDetails.password, 10);
        await query(
            `INSERT INTO Faculty (name, department_id, email, password, dob, contact_number, address, gender)
             VALUES (?, ? , ?, ?, ?, ?, ?, ?)`,
            [name, department_id, email,hashedPassword, dob, contact_number, address, gender]
        );

        res.status(201).json({ message: "Faculty added successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.getAllFaculty=async(req,res)=>{
    try{

        const faculties=await query('SELECT * FROM faculty');
        if(faculties.length===0){
            return res.status(404).json({ message: "No faculty found" });
        }
        res.status(200).json(faculties);
    }
    catch(error){
        console.error("Error fetching faculty:", error);
        return res.status(500).json({ message: "Server error", error: error.message }
        );
    }
}

exports.assignSubjectToFaculty=async(req,res)=>{
    const {faculty_id, subject_id, course_id, branch_id, section_id, semester} = req.body;
    if (!faculty_id || !subject_id || !course_id || !semester) {
        return res.status(400).json({ message: "Faculty ID, subject ID, course ID, and semester are required" });
    }
    try {
        const faculty = await query('SELECT * FROM Faculty WHERE faculty_id = ?', [faculty_id]);
        if(faculty.length===0){
            return res.status(404).json({message:"Faculty not found"});
        }
        const subject = await query('SELECT * FROM Subjects WHERE subject_id = ?', [subject_id]);
        if(subject.length===0){
            return res.status(404).json({message:"Subject not found"});
        }
        const existing = await query('SELECT * FROM Faculty_Subject WHERE faculty_id = ? AND subject_id = ?', [faculty_id, subject_id]);
        if (existing.length > 0) {
            return res.status(409).json({ message: "Subject already assigned to this faculty" });
        }
        
        await query(
            `INSERT INTO Faculty_Subject (faculty_id, subject_id, course_id, branch_id, section_id, semester)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [faculty_id, subject_id, course_id, branch_id || null, section_id || null, semester]
        );

        return res.status(201).json({ message: "Subject assigned to faculty successfully" });
    }
    catch(error){
        return res.status(500).json({message:"Server error",error:error.message});
    }
}
