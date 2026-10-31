const bcrypt = require('bcrypt');
const util = require('util');
const connDB=require('../db/db.conn');
const query = util.promisify(connDB.query).bind(connDB);

exports.getAllSubject=async(req,res)=>{
    try{
        const result=await query('SELECT * FROM subjects');
        if(result.length===0){
            return res.status(404).json({message:"No sunjects found"});
        }
        return res.status(200).json({message:"Subjects retrieved successfully",subjects:result});
    }
    catch(err){
        return res.status(500).json({message:"Server error",error:err.message});
    }
}