const mongoose = require("mongoose");

var ObjectId = require('mongodb').ObjectId;

const add_category = new mongoose.Schema({
    parent_Name: {
        type: mongoose.Types.ObjectId,
        default: null
    },
    Name: {
        type: String,
    },
    image: {
        type: String,
    }

})


const category = new mongoose.model("category", add_category)
module.exports = category;


