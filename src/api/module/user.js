const mongoose = require("mongoose");

var ObjectId = require('mongodb').ObjectId;

const nice = new mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
        
    },
    username: {
        type: String,
    },
    Password: {
        type: String,
    },
    terms: {
        type: Number
    }
})


const user = new mongoose.model("user", nice)
module.exports = user;


