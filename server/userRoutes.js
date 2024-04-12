const express = require('express');
const userRoutes = express.Router();
const User = require('./schema/userSchema.js');
require('dotenv').config();


userRoutes.get('/', async (req,res)=>{
    try{
        const Users = await User.find()
        res.json(Users)
    }catch(err){
        res.json({error : `An error occured while geting the data . ${err}`})
    }
})

module.exports = userRoutes