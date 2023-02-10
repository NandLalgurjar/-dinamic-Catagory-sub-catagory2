const Users = require("../module/user")
const CategoryModule = require("../module/category");
const Product = require("../module/Product");
const { default: mongoose } = require("mongoose");



exports.Add_Product = async (req, res) => {

    // console.log("Add_Product>1111>>", req.body)
    if (req.body._id) {
        const _id = mongoose.Types.ObjectId(req.body._id)
        // console.log("update data")
        const imgs = []
        const categorys = []
        const Product_details_update = {}
        req.files.forEach(element => {
            imgs.push(element.filename)
        });

        if (imgs.length > 0) {
            Product_details_update.image = imgs
        }
        if (req.body.ProductName) {
            Product_details_update.ProductName = req.body.ProductName
        }
        if (req.body.ProductPrice) {
            Product_details_update.ProductPrice = req.body.ProductPrice
        }
        if (req.body.description) {
            Product_details_update.description = req.body.description
        }

        // console.log("update Product_details_update---", Product_details_update)
        const find = await Product.findByIdAndUpdate({ _id })
        // console.log("find", find)


        // const result = await Product.findByIdAndUpdate({ _id }, { $Set: { Product_details_update } })
        const result = await Product.findOneAndUpdate({ _id }, {
            $set: Product_details_update
        })


        // console.log("result >>>>", result)
        if (result) {
            res.redirect("/Views-Product")
        }

    } else {

        // console.log("=============", req.body.category.length)
        const last_category = req.body.category[req.body.category.length - 1]
        // console.log("last_category", last_category)

        // kjbnvkjbnvn
        const imgs = []
        const categorys = []
        req.files.forEach(element => {
            imgs.push(element.filename)
        });
        // console.log("req.file.filename", imgs)
        if (imgs.length > 0) {
            req.body.image = imgs
        } else {
            req.body.image = "file-1675662678559noimg.jpg"
        }
        if (req.body.ProductName) {
            const findData = await Product.find({ ProductName: req.body.ProductName })
            if (findData.length > 0) {
                return res.send("ProductName if All Ready Reagister")
            }
        }
        if (req.body.category.length > 0) {
            // console.log("req.body.category", req.body.category)
            req.body.category.forEach((item) => {
                categorys.push(mongoose.Types.ObjectId(item))
            })
            req.body.category = categorys
            // console.log("hello  req.body.category = categorys ")
        }
        // console.log("req.body.categorys ...", categorys)

        Product_details = new Product({
            category: req.body.category,
            ProductName: req.body.ProductName,
            image: req.body.image,
            ProductPrice: req.body.ProductPrice,
            description: req.body.description,
            last_category: last_category,
        })

        const result = await Product_details.save();
        // console.log("result >>>>", result)
        if (result) {
            res.redirect("/Views-Product")
        }
    }
}


exports.Views_Products = async (req, res) => {
    console.log("Views_Products")
    res.render("Views_Products")
}
exports.Views_Products_DataTable = async (req, res) => {
    try {
        console.log("data table")
        // console.log("22", req.params.id)
        let start = Number(req.query.start);
        let limit = Number(req.query.length);
        // skip: start
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
        /*  if (req.params.id != undefined && req.params.id.length == 24) {
              // condition = [
              //     {
              //         $match: {
              //             parent_Name: mongoose.Types.ObjectId(req.params.id)
              //         },
              //     },
              //     {
              //         $lookup: {
              //             from: "categories",
              //             localField: "parent_Name",
              //             foreignField: "_id",
              //             as: "parent",
              //         },
              //     }, {
              //         $unwind: {
              //             path: "$parent",
              //         },
              //     },
              //     {
                       $skip: start
              //     },
              //     {
              //         $limit: limit
              //     },
              // ]
          } else {
              condition = [
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
          }*/

        Product.countDocuments(condition).exec(async (err, row) => {
            if (err) console.log(err);
            let newData = row
            let data = [];
            let count = 1;
            await Product.aggregate(condition).exec(async (err, row1) => {
                for await (const index of row1) {
                    let piture = []
                    // console.log("row1", row1)
                    // const FindData = await CategoryModule.find({ parent_Name: index._id })
                    // console.log("index", FindData.length)

                    /*   let dele;
                     dele = `<a href="/delete/${index._id}">delete</a>    ||  <a href="/add/${index._id}"> Add Sub category</a>`
                     if (FindData.length > 0) {
                           dele = `<a href="/view-category/?id=${index._id}"> view</a>    ||  <a href="/add/${index._id}"> Add Sub category</a>`
                       } else {
                           dele = `<a href="/delete/${index._id}">delete</a>    ||  <a href="/add/${index._id}"> Add Sub category</a>`
                       }*/
                    // console.log("index.image;;;", index.ProductName)

                    index.image.forEach(element => {
                        piture.push(`<img src="/uploads/${element}" alt="Girl in a jacket" width="50" height="60">`)
                    });
                    data.push({
                        "count": count,
                        "category": index.category_name,
                        "ProductName": index.ProductName,
                        "image": piture,
                        "ProductPrice": index.ProductPrice,
                        "description": index.description,
                        "Action": `<a href="/Product-registration/${index._id}">Edit</a> ||<a href="/Delete-Product/${index._id}">delete</a> `,

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
    } catch (error) {
        console.log(error)
    }
}

exports.Edit_Product = async (req, res) => {
    const _id = mongoose.Types.ObjectId(req.params.id)
    const FindData = await Product.findOne({ _id })
    if (FindData) {
        console.log("FindData", FindData)
        res.render("dropdown", { FindData })
        console.log("req", req.params.id)
    }

}
exports.Delete_Product = async (req, res) => {
    const _id = mongoose.Types.ObjectId(req.params.id)
    // const FindData = await Product.findOne({ _id })
    const result = await Product.findByIdAndRemove({ _id });
    if (result) {
        // if (ffff != undefined && ffff.length == 24) {
        // console.log("delete_category")
        res.redirect("/Views-Product")
        // } else {
        //     res.redirect(`/view-category`)
        // }
    }

}