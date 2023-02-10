const mongoose = require("mongoose");

var ObjectId = require('mongodb').ObjectId;

const Web_Users = new mongoose.Schema({
    email: {
        type: String,
        require: true,

    },
    password: {
        type: String,
        require: true,
    },
    Confirm_password: {
        type: String,
        require: true,
    }

})


const Web_User = new mongoose.model("Web_User", Web_Users)
module.exports = Web_User;


