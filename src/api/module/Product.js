const mongoose = require("mongoose");

var ObjectId = require('mongodb').ObjectId;

const Product_shecme = new mongoose.Schema({
    ProductName: {
        type: String,
    },
    ProductPrice: {
        type: Number
    },
    image: {
        type: [String],
    },
    description: {
        type: String
    },
    last_category: {
        type: ObjectId,
    },
    category: {
        type: [ObjectId],
        default: null
    },
})


const Product = new mongoose.model("Product", Product_shecme)
module.exports = Product;


