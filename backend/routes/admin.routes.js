const express = require('express');
const router = express.Router();

const adminController = require('../controllers/admin.controllers');
const {upload}=require('../db/multer.conn');



//registering...
router.post('/signin',adminController.adminLogin)


router.post('/add-student', adminController.addStudent);
router.post('/add-bulk-student',upload.single('file'),adminController.addBulkStudent);

//annnouncements....

router.post('/add-announcement',upload.single('announcement_file'),adminController.uploadAnnouncement);

//adding new course...
router.post('/add-new-course',adminController.addNewCourse);
router.get('/get-all-courses', adminController.getAllCourses);
//adding branch in course...
router.post('/add-branch',adminController.addBranch);
router.get('/get-all-branches',adminController.getAllBranches);

//adding new subject...
router.post('/add-new-subject', adminController.addNewSubject);
router.get('/get-all-subjects', adminController.getAllSubjects);
router.get('/get-all-subjects-by-course/:course', adminController.getAllSubjectsByCourse);

//adding section in course....
router.post('/add-section',adminController.addSection);
router.get('/get-all-sections/:course_id',adminController.getAllSections);

//adding students to section...

//adding students to section...
router.post('/add-students-to-section',adminController.addStudentsToSection);




//adding department...
router.post('/add-department',adminController.addDepartment);
router.get('/get-all-departments',adminController.getAllDepartments);


//adding new faculty
router.post('/add-faculty', adminController.addFaculty);

router.get('/get-all-faculty',adminController.getAllFaculty);

//assigning subject course section wise to faculty...
router.post('/assign-course-secction-subject-to-faculty',adminController.assignSubjectToFaculty);

module.exports = router;