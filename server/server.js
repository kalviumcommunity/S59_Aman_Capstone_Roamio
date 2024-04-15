const express = require('express');
const app = express()
const cors = require('cors')
const port = 8081;
const userRoutes = require('./userRoutes.js')
const {connectDB , isConnected} = require('./db.js')
require('dotenv').config()

connectDB()
app.use(cors())
app.use(express.json())
app.listen(port,()=>{
    console.log(`🚀server is running at http://localhost:${port}/`)
    if(isConnected){
        console.log("📦MongoDB Connected with Server , Successfully!")
    }
})
app.get('/',(req,res)=>{
    res.send('🚀Server started successfully')
})
app.use('/users',userRoutes);