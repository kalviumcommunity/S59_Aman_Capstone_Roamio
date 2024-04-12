const mongoose = require('mongoose');

const data = new mongoose.Schema({
    name: {
        type : String,
        // required : true
    },
    image : {
        type : Number,
        // required : true
    },
    mobileNumber : {
        type : Number,
        // required : true
    },
    friends : {
        type : Array,
        // required : true
    },
    trips : {
        type : Array,
        // required : true
    },
    posts : {
        type : Array,
        // required : true
    },
    badges : {
        type : Array,
        // required : true
    }
})


const dataSet = mongoose.model('users',data)

module.exports = dataSet