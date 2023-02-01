const Express = require("express");
const Router = Express.Router();
const auth = require("../../middalwear/auth")
const Upload = require("../../middalwear/img");

const {
    Dashboard,
    LoginUser,
    Register,
    UserRegistetion,
    SignOut,
    Category,
    AddCategory,
    ViwesCategory,
    ViwesCategoryes,
    edit_category,
    sub_category,
    add_sub_category,
    viwes_sub_category,
    viwes_sub_categorys,
    delete_category,
    sub_category_delete,
    dropdown,
    optiongeturl,
    sub2_category,
    sub2_category2,
    create_sub2_category,
    viwes_sub2_category,
    Viwes_Sub2_CategoryDataTable

} = require("../controler/controller")
//users
Router.get("/", Dashboard);
Router.post("/loginuser", LoginUser);
Router.get("/pages-register.html", Register);
Router.post("/sighup", UserRegistetion)
Router.get("/Sign_Out", SignOut)

//category
Router.get("/category.html", Category)
Router.post("/add_category", Upload.single("file"), AddCategory)
Router.get("/viwes-category.html", ViwesCategory)
Router.get("/viwes_categoryes", ViwesCategoryes)

// edit delete
Router.get("/edit/:id", edit_category)
Router.get("/delete/:id", delete_category)
Router.get("/sub_category_delete/:id", sub_category_delete)

//sub_category
Router.get("/sub_category.html", sub_category)
Router.post("/add_sub-category", Upload.single("file"), add_sub_category)
Router.get("/viwes_sub_category.html", viwes_sub_category)
Router.get("/viwes_sub_categorys", viwes_sub_categorys)

//sub2_category.html
Router.get("/sub2_category.html", sub2_category)
Router.post("/create_sub2_category", Upload.single("file"), create_sub2_category)
Router.get("/viwes-sub2-category.html", viwes_sub2_category)//datatable caling
Router.get("/viwes_sub2_category", Viwes_Sub2_CategoryDataTable)

//dropdown
Router.get("/dropdown", dropdown)
Router.get("/optiongeturl/:id", optiongeturl)
Router.get("/sub2_category/:id", sub2_category2)



module.exports = Router;




































