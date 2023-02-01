require('dotenv').config();
const { LoginUser, userregister, AddCategory, add_sub_categorys, viwes_categorys, create_sub2_category } = require("../services/loginuser")
const jwt = require("jsonwebtoken")
const Users = require("../module/user")
const CategoryModule = require("../module/category");
const { default: mongoose } = require('mongoose');

exports.Dashboard = async (req, res) => {
    try {
        const token = req.cookies.NiceAdmin
        if (token) {
            const VerifyToken = jwt.verify(token, process.env.SECRT_KEY)
            const UserData = await Users.find({ _id: VerifyToken._id })
            res.render("index", { UserData })
        } else {
            res.render("pages-login")
        }
    } catch (error) {
        console.log("UserData", error)
    }
};

exports.LoginUser = async (req, res) => {
    try {
        const token = req.cookies.NiceAdmin
        if (token) {
            res.redirect("/")
        } else {
            const logindata = await LoginUser(req, res)
        }
    } catch (error) {
        console.log("LoginUser", error)
    }
}

exports.Register = (req, res) => {
    const token = req.cookies.NiceAdmin
    if (token) {
        res.render("index")
    } else {
        res.render("pages-register")
    }
}

exports.UserRegistetion = async (req, res) => {
    const savedata = await userregister(req, res)
}

exports.SignOut = async (req, res) => {
    res.clearCookie("NiceAdmin", 'token', { expires: new Date(0) })
        .redirect("/");
}
exports.Category = async (req, res) => {
    res.render("create_category")
}

let _id;
exports.AddCategory = async (req, res, next) => {
    if (!_id) {
        await AddCategory(req, res)
    } else {
        await AddCategory(req, res, _id)
    }
}
exports.ViwesCategory = async (req, res) => {
    res.render("viwes_category")
}
exports.ViwesCategoryes = async (req, res) => {
    {
        let start = req.query.start;
        let limit = req.query.length;
        let condition = { parent_Name: null };
        CategoryModule.countDocuments(condition).exec((err, row) => {
            if (err) console.log(err);
            let newData = row
            let data = [];
            let count = 1;
            let i = 1
            CategoryModule.find(condition).limit(limit).skip(start).exec(async (err, row1) => {

                // }
                // row1.forEach(async (index) => {
                for await (const index of row1) {
                    const ddd = await CategoryModule.find({ parent_Name: index._id })
                    // console.log("index", i, ddd.length)
                    i++
                    let dele;
                    if (ddd.length > 0) {
                        dele = `<a href="#">Not Delete</a>`
                    } else {
                        dele = `<a href="delete/${index._id}">delete</a>`
                    }
                    data.push({
                        "count": count,
                        "Name": index.Name,
                        "image": `<img src="/uploads/${index.image}" alt="Girl in a jacket" width="50" height="60">`,
                        "edit": `<a href="edit/${index._id}">edit</a>`,
                        "delete": dele,
                    });
                    count++;
                };
                if (count > row1.length) {
                    let jsonValue = JSON.stringify({
                        recordsTotal: row,
                        recordsFiltered: newData,
                        data: data
                    });
                    res.send(jsonValue);
                }
            });
        });
    }
}

exports.edit_category = async (req, res) => {
    _id = req.params.id
    // console.log("req.params.id", _id);
    if (_id) {
        const update_data = await CategoryModule.find({ _id })
        // console.log("update_data", update_data)
        if (update_data) {
            res.render("edit_category", { update_data });
        }
    }
}
exports.delete_category = async (req, res) => {
    _id = req.params.id
    // console.log("delete_category", _id);
    const result = await CategoryModule.findByIdAndRemove({ _id });
    if (result) {
        // console.log("delete_category")
    }
    res.redirect("/viwes-category.html")
}
exports.sub_category_delete = async (req, res) => {
    _id = req.params.id
    // console.log("delete_sub_category", _id);
    const result = await CategoryModule.findByIdAndRemove({ _id });
    if (result) {
        // console.log("delete_sub_category")
    }
    res.redirect("/viwes_sub_category.html")
}

exports.sub_category = async (req, res) => {
    const findcategory = await CategoryModule.find({ parent_Name: null })
    res.render("create_sub_category", { findcategory })
}

exports.add_sub_category = async (req, res) => {
    req.body.image = req.file.filename
    // console.log("add_sub_category req.body", req.body)
    await add_sub_categorys(req, res)
}
exports.viwes_sub_category = async (req, res) => {
    res.render("viwes_sub_category")
}
exports.viwes_sub_categorys = async (req, res) => {
    let start = Number(req.query.start);
    let limit = Number(req.query.length);
    let condition = [
        {
            $match: {
                parent_Name: {
                    $ne: null,
                },
            },
        },
        {
            $lookup: {
                from: "categories",
                localField: "parent_Name",
                foreignField: "_id",
                as: "parent",
            },
        }, {
            $unwind: {
                path: "$parent",
            },
        },
        {
            $skip: start
        },
        {
            $limit: limit
        },
    ]

    CategoryModule.countDocuments({ parent_Name: { $ne: null } }).exec(async (err, row) => {
        if (err) console.log(err);
        let newData = row
        let data = [];
        let count = 1;
        await CategoryModule.aggregate(condition).exec(async (err, row1) => {
            for await (const index of row1) {
                const ddd = await CategoryModule.find({ parent_Name: index._id })
                // console.log("index", ddd.length)

                let dele;
                if (ddd.length > 0) {
                    dele = `<a href="#">Not Delete</a>`
                } else {
                    dele = `<a href="delete/${index._id}">delete</a>`
                }
                data.push({
                    "count": count,
                    "Name": index.Name,
                    "image": `<img src="/uploads/${index.image}" alt="Girl in a jacket" width="50" height="60">`,
                    "parent_Name": index.parent.Name,
                    "edit": `<a href="edit/${index._id}">edit</a>`,
                    "delete": dele,

                });
                count++;
            };
            if (count > row1.length) {
                let jsonValue = JSON.stringify({
                    recordsTotal: row,
                    recordsFiltered: newData,
                    data: data
                });
                res.send(jsonValue);
            }
        });
    });
}


exports.sub2_category = async (req, res) => {
    const findcategory = await CategoryModule.find({ parent_Name: { $ne: null } })
    res.render("create_sub2_category", { findcategory })
}
exports.create_sub2_category = async (req, res) => {
    await create_sub2_category(req, res)
}
exports.viwes_sub2_category = async (req, res) => {
    res.render("viwes_sub2_category")
}
exports.Viwes_Sub2_CategoryDataTable = async (req, res) => {
    {
        let start = Number(req.query.start);
        let limit = Number(req.query.length);
        let condition = [
            {
                $match: {
                    parent_Name: {
                        $ne: null,
                    },
                },
            },
            {
                $lookup: {
                    from: "categories",
                    localField: "parent_Name",
                    foreignField: "_id",
                    as: "parent",
                },
            }, {
                $unwind: {
                    path: "$parent",
                },
            },
            {
                $skip: start
            },
            {
                $limit: limit
            },
        ]
        CategoryModule.countDocuments({ parent_Name: { $ne: null } }).exec(async (err, row) => {
            if (err) console.log(err);
            let newData = row
            let data = [];
            let count = 1;
            await CategoryModule.aggregate(condition).exec(async (err, row1) => {
                for await (const index of row1) {
                    const ddd = await CategoryModule.find({ parent_Name: index._id })
                    // console.log("index", ddd.length)

                    let dele;
                    if (ddd.length > 0) {
                        dele = `<a href="#">Not Delete</a>`
                    } else {
                        dele = `<a href="delete/${index._id}">delete</a>`
                    }
                    data.push({
                        "count": count,
                        "Name": index.Name,
                        "image": `<img src="/uploads/${index.image}" alt="Girl in a jacket" width="50" height="60">`,
                        "parent_Name": index.parent.Name,
                        "edit": `<a href="edit/${index._id}">edit</a>`,
                        "delete": dele,

                    });
                    count++;
                };
                if (count > row1.length) {
                    let jsonValue = JSON.stringify({
                        recordsTotal: row,
                        recordsFiltered: newData,
                        data: data
                    });
                    res.send(jsonValue);
                }
            });
        });
    }
}



exports.dropdown = async (req, res) => {
    const findcategory = await CategoryModule.find({ parent_Name: null })
    res.render("dropdown", { findcategory })
}

exports.optiongeturl = async (req, res) => {
    const ff = req.query.select
    // console.log("req.query", ff.length);
    // console.log(`=======${req.url}`)
    if (ff.length == 24) {
        const _id = mongoose.Types.ObjectId(ff)

        const sub_category = await CategoryModule.find({ parent_Name: _id })
        const userdata = []
        sub_category.forEach((index) => {
            userdata.push({
                "_id": index._id,
                "Name": index.Name,
            });
        });

        res.send(userdata);
    }
}
exports.sub2_category2 = async (req, res) => {
    const ff = req.query.select
    // console.log("req.query 22222", ff.length);
    // console.log(`=======${req.url}`)
    if (ff.length == 24) {
        const _id = mongoose.Types.ObjectId(ff)

        const sub_category = await CategoryModule.find({ parent_Name: _id })
        const userdata = []
        sub_category.forEach((index) => {
            // index.Email
            userdata.push({
                "_id": index._id,
                "Name": index.Name,
            });
        });

        res.send(userdata);
    }
}