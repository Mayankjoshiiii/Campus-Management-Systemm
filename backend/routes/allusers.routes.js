const express=require("express");
const router=express.Router();

const allUsersController=require('../controllers/allUsers.controllers');


router.get('/get-subjects',allUsersController.getAllSubject);

module.exports = router;