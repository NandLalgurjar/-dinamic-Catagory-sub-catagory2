require('dotenv').config();
const jwt = require("jsonwebtoken");
const { default: mongoose } = require('mongoose');
const Web_User = require("../api/module/Web_User");


const auth = async (req, res, next) => {
    try {
        const token = req.cookies.Eduport;
        const varifyuser = await jwt.verify(token, process.env.SECRT_KEY)
        console.log("varifyuser auth", varifyuser._id)
        const _id = mongoose.Types.ObjectId(varifyuser._id)
        const user = await Web_User.findOne({ _id })

        req.token = [];
        req.user = user;
        next()
    } catch (error) {
        res.redirect("/Web-User-sign-in")
        // res.send(error)
    }
}

module.exports = auth