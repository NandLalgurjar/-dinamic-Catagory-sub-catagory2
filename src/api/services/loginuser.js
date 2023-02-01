require('dotenv').config();
const Users = require("../module/user")
const jwt = require("jsonwebtoken")

exports.LoginUser = async (req, res) => {
    try {
        email = req.body.email
        let Userdata = await Users.find({ username: req.body.username })
        let pass;
        let username;
        let _id;
        const massages = "invalide login details"
        Userdata.forEach(element => {
            pass = element.Password;
            username = element.username;
            _id = element._id;
        });
        if (Userdata.length == 0) {
            res.redirect("pages-register");
        } else {
            if (username == req.body.username) {
                if (pass === req.body.Password) {
                    const token = jwt.sign({ _id: _id }, process.env.SECRT_KEY)

                    res.render("index", { Userdata })
                    res.cookie("NiceAdmin", token, {
                        expires: new Date(Date.now() + 60000 * 60 * 6),
                        httpOnly: true
                    })
                } else {
                    // console.log("password is wrong");
                    res.render("pages-login", { massages })
                }
            } else {
                // console.log("email is wrong");
                res.render("pages-login", { massages })
            }
        }

    } catch (error) {
        console.log("LoginUser>", error);
    }

}

exports.userregister = async (req, res) => {
    const bodydata = req.body
    if (req.body.username) {
        const data = await Users.find({ username: req.body.username });
        // console.log("username", data)
        if (data.length > 0) {
            // console.log("username must be uniqe")
            const massges = "username must be uniqe"
            return res.render("pages-register", { massges, bodydata })
        }
    }

    const data = await Users.find({ email: req.body.email });

    if (data.length == 0) {
        userdata = new Users({
            name: req.body.name,
            email: req.body.email,
            username: req.body.username,
            Password: req.body.Password,
            terms: req.body.terms,
        })
        const result = await userdata.save();
        res.redirect("/");
    } else {
        res.redirect("/")
    }
}

const category = require("../module/category");
const mongoose = require('mongoose');

exports.AddCategory = async (req, res, _id) => {
    const id = mongoose.Types.ObjectId(_id)
    req.body.image = req.file.filename
    const img = req.file;
    if (!id) {
        // console.log("update")
        if (req.body.parent_Name) {
            const updateuserdata = await category.findOneAndUpdate({ _id: id }, {
                $set: {
                    parent_Name: req.body.parent_Name,
                    Name: req.body.Name,
                    image: req.body.image
                }
            })
        } else {
            // console.log("update  else")
            const updateuserdata = await category.findOneAndUpdate({ _id: id }, {
                $set: {
                    Name: req.body.Name,
                    image: req.body.image
                }
            })
        }
        const updateuserdata = await category.findOneAndUpdate({ _id: id }, {
            // $set: {
            // parent_Name: req.body.parent_Name,
            Name: req.body.Name,
            image: req.body.image
            // }
        })
        // console.log("updateuserdata", updateuserdata)
        res.redirect("/viwes-category.html")
    } else {

        if (req.body.parent_Name) {
            const data = new category({
                parent_Name: req.body.parent_Name,
                Name: req.body.Name,
                image: req.body.image
            })
            const save = await data.save()
        } else {
            // console.log("add else")
            const data = new category({
                Name: req.body.Name,
                image: req.body.image
            })
            const save = await data.save()
        }
        res.redirect("/viwes-category.html")

    }
}

exports.viwes_categorys = async (req, res) => {
    const finddata = await category.find({ parent_Name: null })

    // console.log("hellohghggh", finddata)
}

exports.add_sub_categorys = async (req, res) => {

    const parent_id = mongoose.Types.ObjectId(req.body.parent_Name)
    req.body.image = req.file.filename
    const img = req.file;
    // if (parent_id) {

    if (parent_id) {
        const data = new category({
            parent_Name: parent_id,
            Name: req.body.Name,
            image: req.body.image
        })
        const save = await data.save()
    } else {
        // console.log("add else")
        const data = new category({
            Name: req.body.Name,
            image: req.body.image
        })
        const save = await data.save()
    }
    res.redirect("/")
    // } else {
    //     console.log("update  else")
    //     const updateuserdata = await category.findOneAndUpdate({ _id: id }, {
    //         $set: {
    //             // parent_Name: req.body.parent_Name,
    //             Name: req.body.Name,
    //             image: req.body.image
    //         }
    //     })
    // }
    // const updateuserdata = await category.findOneAndUpdate({ _id: id }, {
    //     // $set: {
    //     // parent_Name: req.body.parent_Name,
    //     Name: req.body.Name,
    //     image: req.body.image
    //     // }
    // })
    // console.log("updateuserdata", updateuserdata)
    // ccc
    // } else {
    //     console.log("add")

    //     if (req.body.parent_Name) {
    //         const data = new category({
    //             parent_Name: req.body.parent_Name,
    //             Name: req.body.Name,
    //             image: req.body.image
    //         })
    //         const save = await data.save()
    //     } else {
    //         console.log("add else")
    //         const data = new category({
    //             Name: req.body.Name,
    //             image: req.body.image
    //         })
    //         const save = await data.save()
    //     }
    // res.redirect("/viwes-category.html")

    // }
    // console.log("body2", req.body)
}

exports.create_sub2_category = async (req, res) => {

    const parent_id = mongoose.Types.ObjectId(req.body.parent_Name)
    req.body.image = req.file.filename
    const img = req.file;
    // console.log("create_sub2_category", req.body)
    // if (parent_id) {

    if (parent_id) {
        const data = new category({
            parent_Name: parent_id,
            Name: req.body.Name,
            image: req.body.image
        })
        const save = await data.save()
    } else {
        // console.log("add else")
        const data = new category({
            Name: req.body.Name,
            image: req.body.image
        })
        const save = await data.save()
    }
    res.redirect("/")
}