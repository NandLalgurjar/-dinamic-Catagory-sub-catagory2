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
    delete_category,

    sub_category,
    add_sub_category,
    viwes_sub_category,
    viwes_sub_categorys,

    dropdown,
    optiongeturl,
    // Add_Product

    // sub2_category2,
    // sub_category_delete,
    // sub2_category,
    // create_sub2_category,
    // viwes_sub2_category,
    // Viwes_Sub2_CategoryDataTable

} = require("../controler/controller")

//users
Router.get("/", Dashboard);
Router.post("/loginuser", LoginUser);
Router.get("/pages-register", Register);
Router.post("/sighup", UserRegistetion)
Router.get("/Sign_Out", SignOut)

//category
Router.get("/category", Category)
Router.post("/add_category", Upload.single("file"), AddCategory)
// Router.get("/view-category", ViwesCategory)
Router.get("/view-category/:id?", ViwesCategory)
Router.get("/viwes_categoryes/:id?", ViwesCategoryes)

// edit delete
Router.get("/edit/:id", edit_category)
Router.get("/delete/:id", delete_category)
// Router.get("/sub_category_delete/:id", sub_category_delete)//new

//sub_category
Router.get("/sub_category/:id?", sub_category)
Router.post("/add_sub-category", Upload.single("file"), add_sub_category)
Router.get("/view_sub_category/:id?", viwes_sub_category)
Router.get("/viwes_sub_categorys/:id?", viwes_sub_categorys)

//sub2_category.html
// Router.get("/sub2_category.html", sub2_category)
// Router.post("/create_sub2_category", Upload.single("file"), create_sub2_category)
// Router.get("/viwes-sub2-category.html", viwes_sub2_category)//datatable caling
// Router.get("/viwes_sub2_category", Viwes_Sub2_CategoryDataTable)

//dropdown
Router.get("/Product-registration/:id?", dropdown)
Router.get("/optiongeturl/:id?", optiongeturl)
// Router.get("/sub2_category/:id", sub2_category2)



const { Add_Product, Views_Products, Views_Products_DataTable, Edit_Product, Delete_Product } = require("../controler/product_controller")
//Add-Product
Router.post("/Add-Product", Upload.array("file"), Add_Product)
Router.get("/Views-Product", Views_Products)
Router.get("/Views_Products_DataTable", Views_Products_DataTable)
//Edit-Product/
Router.get("/Edit-Product/:id", Edit_Product)
Router.get("/Delete-Product/:id", Delete_Product)



const { Web_Home, serve_sign_up, Web_User_Registetion, Web_User_Login, serve_sign_in, User_Edit_Profile, Add_To_Cart, baket } = require("../controler/apicontroller")
const webauth = require("../../middalwear/webauth")
//WEb 

Router.get("/web", Web_Home)

Router.get("/web/sign-up", serve_sign_up)
Router.post("/web/Web-User-sign-up", Web_User_Registetion)
Router.get("/Web-User-sign-in", serve_sign_in)
Router.post("/Web-User-sign-in", Web_User_Login)
Router.get("/web/Edit-Profile", webauth, User_Edit_Profile)

Router.get("/Add-To-Cart", Add_To_Cart)
Router.get("/baket", baket)



















module.exports = Router;




































