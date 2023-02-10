require('dotenv').config();
const jwt = require("jsonwebtoken")
const Users = require("../module/user")
const CategoryModule = require("../module/category");
const Product = require("../module/Product");
const Web_User = require("../module/Web_User")

const { Web_Home, Web_User_Registetion, Web_User_Login } = require("../services/apiservices")

exports.Web_Home = async (req, res) => {
    const massge = req.query.text
    // console.log("req.qqqq", req.query.text)
    if (req.cookies.Eduport != undefined && req.cookies.Eduport) {
        await Web_Home(req, res)
    } else {
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
        res.render("api/index", { FindProduct })
        // res.render("api/sign-in", { massge })
    }
}

exports.serve_sign_up = async (req, res) => {
    console.log("api/sign-up servr")
    res.render("api/sign-up")
}

exports.Web_User_Registetion = async (req, res) => {
    console.log("Web_User_Registetion--", req.body)
    if (req.body.password === req.body.Confirm_password) {
        await Web_User_Registetion(req, res)
    } else {
        console.log("password is not same")
    }

}

exports.serve_sign_in = async (req, res) => {
    // console.log(" req.user>>>>...", req.user)    
    console.log("api/sign-in servr")
    res.render("api/sign-in")
}

exports.Web_User_Login = async (req, res) => {
    console.log("login c")
    await Web_User_Login(req, res)
}

exports.User_Edit_Profile = async (req, res) => {

    console.log("req>>>>>", req.user)
}

exports.Add_To_Cart = async (req, res) => {
    let ProductCart = [];
    let product_id = [];
    const _id = req.query._id
    if (req.cookies.Cart) {
        ProductCart = req.cookies.Cart
        ProductCart.forEach((element) => {
            let varifytoken = jwt.verify(element, process.env.SECRT_KEY)
            const iddd = varifytoken._id
            product_id.push(iddd)
            // console.log("varifytoken", varifytoken._id)
        });
    }
    // if (product_id.length > 0) {
    console.log("-->", product_id)
    console.log("-->>>>", product_id.includes(_id))
    // }
    // ojhbk
    if (!product_id.includes(_id)) {
        let find_Product = await Product.findOne({ _id })
        // console.log("find_Product", find_Product)
        if (find_Product) {
            const token = jwt.sign({ _id: find_Product._id }, process.env.SECRT_KEY)
            if (token) {
                const chake = ProductCart.includes(token)
                // console.log("chake", chake)
                if (!chake) {
                    ProductCart.push(token)
                }
            }
        }
    }

    let numberofproduct = ProductCart.length
    console.log("ProductCart--->", numberofproduct)

    res.render("api/index", { ProductCart })
    res.cookie("Cart", ProductCart, {
        expires: new Date(Date.now() + 60000 * 60 * 6),
        httpOnly: true
    })

}

exports.baket = async (req, res) => {
    const ProductCart = req.cookies.Cart
    let NumberOfProduct = ProductCart.length
    console.log("baketbaketbaketbaket", ProductCart.length)
    res.send(ProductCart)
}
