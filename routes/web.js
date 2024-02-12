const express = require("express");
const FrontController = require("../controllers/FrontController");
const route = express.Router();
const checkUserAuth = require("../middleware/auth");
const CourseController = require("../controllers/CourseController");
const AdminController = require("../controllers/AdminController");

//route
route.get("/", FrontController.login);
route.get("/register", FrontController.register);
route.get("/home", checkUserAuth, FrontController.home);
route.get("/about", checkUserAuth, FrontController.about);
route.get("/contact", checkUserAuth, FrontController.contact);

//datainsert
route.post("/insertreg", FrontController.insertReg);
route.post("/vlogin", FrontController.vlogin);
route.get("/logout", FrontController.logout);
route.get("/profile", checkUserAuth, FrontController.profile);
route.post("/updateProfile", checkUserAuth, FrontController.updateProfile);
route.post("/changepassword", checkUserAuth, FrontController.changepassword);

//courseController
route.post("/courseInsert", checkUserAuth, CourseController.courseInsert);
route.get("/course_display", checkUserAuth, CourseController.courseDisplay);
route.get("/course_view/:id", checkUserAuth, CourseController.courseview);
route.get("/course_edit/:id", checkUserAuth, CourseController.courseEdit);
route.get("/course_delete/:id", checkUserAuth, CourseController.courseDelete);
route.post("/course_update/:id", checkUserAuth, CourseController.courseUpdate);

//adminController
route.get("/admin/dashboard", checkUserAuth, AdminController.dashboard);
route.post("/admin/update_status/:id", checkUserAuth, AdminController.update_status);

module.exports = route;
