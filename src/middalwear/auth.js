require('dotenv').config();
const jwt = require("jsonwebtoken");
const Users = require("../api/module/user");


const auth = async (req, res, next) => {
    try {
        const token = req.cookies.NiceAdmin;
        const varifyuser = await jwt.verify(token, process.env.SECRT_KEY)
        console.log("varifyuser auth", varifyuser)
        const user = await Users.find({ _id: varifytokemn._id })

        req.token = [];
        req.user = user;
        next()
    } catch (error) {
        res.send(error)
    }
}

module.exports = auth