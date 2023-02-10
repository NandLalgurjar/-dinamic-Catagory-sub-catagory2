require('dotenv').config();
const Web_User = require("../module/Web_User")
const jwt = require("jsonwebtoken")
const Product = require("../module/Product");
const bcrypt = require("bcryptjs")


exports.Web_Home = async (req, res) => {

    let condition = [
        {
            $lookup: {
                from: "categories",
                localField: "last_category",
                foreignField: "_id",
                as: "result",
            },
        },
        {
            $unwind: {
                path: "$result",
            },
        },
        {
            $project: {
                ProductName: 1,
                image: 1,
                ProductPrice: 1,
                description: 1,
                category: 1,
                category_name: "$result.Name",
            },
        },
    ]
    const token = req.cookies.Eduport
    if (token) {
        const VerifyToken = jwt.verify(token, process.env.SECRT_KEY)
        const Userdata = await Web_User.findOne({ _id: VerifyToken._id })
        const FindProduct = await Product.aggregate(condition)
        res.render("api/index", { FindProduct, Userdata })
    }
}

exports.Web_User_Registetion = async (req, res) => {
    const FindData = await Web_User.findOne({ email: req.body.email })
    if (FindData) {
        console.log("email is allredy register")
        res.redirect("/web")
    } else {
        const { Confirm_password, password, ...rest } = req.body

        const has = await bcrypt.hash(password, 8)
        console.log("---->", has)
        rest.password = has

        data = new Web_User(rest)
        const result = await data.save()
        console.log("result", result)
        res.redirect("/web")

    }
}


exports.Web_User_Login = async (req, res) => {
    try {
        // console.log(req.body)
        // gbhjgbc
        // email = req.body.email
        let Userdata = await Web_User.findOne({ email: req.body.email })
        // console.log("Userdata----->", Userdata)
        const massages = "invalide login details"
        if (Userdata) {
            const match = await bcrypt.compare(req.body.password, Userdata.password)
            // console.log("bb--->", match)
            if (match) {
                let condition = [
                    {
                        $lookup: {
                            from: "categories",
                            localField: "last_category",
                            foreignField: "_id",
                            as: "result",
                        },
                    },
                    {
                        $unwind: {
                            path: "$result",
                        },
                    },
                    {
                        $project: {
                            ProductName: 1,
                            image: 1,
                            ProductPrice: 1,
                            description: 1,
                            category: 1,
                            category_name: "$result.Name",
                        },
                    },
                ]
                const FindProduct = await Product.aggregate(condition)
                const token = jwt.sign({ _id: Userdata._id }, process.env.SECRT_KEY)

                res.render("api/index", { FindProduct, Userdata })
                return res.cookie("Eduport", token, {
                    expires: new Date(Date.now() + 60000 * 60 * 6),
                    httpOnly: true
                })

            } else {
                return res.redirect("/web")
                console.log("password is wrong");
                // res.render("pages-login", { massages })
            }
        } else {
            return res.redirect("/web/sign-up")
            console.log("no data")//register
        }


    } catch (error) {
        console.log("Web_User_Login>", error);
    }

}