require("dotenv").config()
const mongoose = require('mongoose')

const connectDB = async () => {
    try{
        await mongoose.connect(process.env.URI)
        console.log("📦MongoDB Connected Successfully!")
    }
    catch(err){
        console.log("Connection failed:", err);
    }
}

const disconnectDB = async() => {
    mongoose.disconnect()
    console.log("Mongoose Disconnected Successfully!")
}

const isConnected = () => {
    return mongoose.connection.readyState === 1;
}

module.exports = {
    connectDB,
    disconnectDB,
    isConnected
}