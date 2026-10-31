const fs = require('fs');
const xlsx = require('xlsx');
const nodemailer = require('nodemailer');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

exports.parseStudentFile = async (filePath) => {
    // Read Excel/CSV file
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    // Delete file after parsing to save space
    try {
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    } catch (e) {
        console.warn("Could not delete temporary uploaded file:", e.message);
    }

    return data.map(row => ({
        name: row.name || row.Name,
        email: row.email || row.Email,
        roll_no: row.roll_no || row.rollNo || row.RollNo,
        course: row.course || row.Course || row.course_id || row.courseId,
        branch: row.branch || row.Branch || row.branch_id || row.branchId,
        semester: row.semester || row.Semester,
        year: row.year || row.Year,
        dob: row.dob || row.Dob || row.DOB,
        gender: row.gender || row.Gender,
        contact: row.contact || row.contactNo || row.Contact,
        address: row.address || row.Address,
        nationality: row.nationality || 'Indian',
        blood_group: row.blood_group || row.bloodGroup || null,
        father_name: row.father_name || row.parentName || null,
        father_contact: row.father_contact || row.parentContactNo || null,
        father_occupation: row.father_occupation || row.parentOccupation || null,
        mother_name: row.mother_name || null,
        mother_contact: row.mother_contact || null,
        mother_occupation: row.mother_occupation || null
    }));
};

exports.sendCredentials = async (email, name, password, role) => {
    console.log(`[Credentials Generated] Role: ${role}, User: ${name}, Email: ${email}, Password: ${password}`);

    // If email credentials are not configured, return immediately with success
    if (!process.env.ADMIN_EMAIL || process.env.ADMIN_EMAIL === 'admin@example.com' || !process.env.ADMIN_EMAIL_PASS) {
        console.log(`[Email Notice] Email credentials not configured. Skipping SMTP send.`);
        return { success: true, password: password, emailed: false };
    }

    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.ADMIN_EMAIL,
                pass: process.env.ADMIN_EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: `Campus Cloud University <${process.env.ADMIN_EMAIL}>`,
            to: email,
            subject: 'Welcome to Campus Cloud University – Your Login Credentials',
            text: `Dear ${name},

Welcome to Campus Cloud University!
We are excited to have you join our community as a valued ${role}.

Your account has been successfully created. Please find your login credentials below:

Username: ${email}
Password: ${password}

You can access the portal at: http://localhost:5173/signin

Important:
Please change your password after your first login and keep your credentials confidential.

Best regards,
IT & Administrative Services
Campus Cloud University`
        };

        try {
            await transporter.sendMail(mailOptions);
            console.log(`[Email Sent] Successfully delivered to ${email}`);
            return { success: true, password: password, emailed: true };
        } catch (err) {
            console.warn(`[Email Warning] Could not send email to ${email}: ${err.message}. Credentials logged to console.`);
            // Return success anyway so user creation succeeds offline
            return { success: true, password: password, emailed: false, warning: err.message };
        }
    } catch (err) {
        console.error("Error setting up email transporter:", err);
        return { success: true, password: password, emailed: false };
    }
};
