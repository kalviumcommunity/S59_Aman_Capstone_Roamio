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
userRoutes.post('/add-user',async (req, res)=>{
    const newUser = new User({
        userID: req.body.userID,
        name: req.body.name,
        image : req.body.image,
        email : req.body.email,
        password : req.body.password,
        mobileNumber : req.body.mobileNumber,
        friends : req.body.friends,
        trips : req.body.trips,
        posts : req.body.posts,
        badges : req.body.badges
    });
    try{
        const saveUser = await newUser.save();
        res.json(`${newUser.name} joined Roamio successfully.🎉`)
        console.log(`${newUser.name} joined Roamio successfully.🎉`)
    } catch (err){
        console.log("Error occured while adding the user " + err)
        res.status(500).json({error : 'An error occured while adding you to our database .'})
    }
})

module.exports = userRoutes