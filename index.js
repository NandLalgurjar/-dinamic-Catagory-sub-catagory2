const Express = require("express");
const app = Express();
const PORT = 5000;
require("./src/datasoources/conn")
const CookieParser = require('cookie-parser');
const hbs = require("hbs");

const path = require("path");
const UserRouter = require("./src/api/router/router");
const partials_path = path.join(__dirname, "./src/templates/partials");

app.use(Express.urlencoded({ extended: true }));
app.use(Express.json());
app.use(CookieParser());
app.use(Express.static(path.join(__dirname, '/public')));

app.set('views', path.join(__dirname, './src/templates/views'));
app.set('view engine', 'hbs');
hbs.registerPartials(partials_path);

app.use(UserRouter);

app.listen(PORT, () => {
    console.log(`NewNice server runing at port number  ${PORT}`);
})