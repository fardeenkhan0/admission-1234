const express = require("express");
const app = express();
const port = 3000;
const web = require("./routes/web");
const connectdb = require("./db/connectdb");
const session = require("express-session");
const flash = require("connect-flash");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");

//fileupload
app.use(fileUpload({ useTempFiles: true }));

//token get
app.use(cookieParser());

//messages
app.use(
  session({
    secret: "secret",
    cookie: { maxAge: 6000 },
    resave: false,
    saveUninitialized: false,
  })
);
app.use(flash());

//connectdb
connectdb();
//data get object
// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));

//css image link
app.use(express.static("public"));

//ejs setup
app.set("view engine", "ejs");

//route load
app.use("/", web);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
