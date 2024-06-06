const express = require("express");
const FrontController = require("../controllers/FrontController");
const route = express.Router();
const checkUserAuth = require("../middleware/auth");
const adminRole = require("../middleware/adminrole");
const CourseController = require("../controllers/CourseController");
const AdminController = require("../controllers/AdminController");
const isLogin = require("../middleware/isLogin");

//route
route.get("/", isLogin, FrontController.login);
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
route.get("/forgotpass", FrontController.forgotpass);
route.post("/forgotverify", FrontController.forgotverify);
route.get("/reset-password", FrontController.reset_Password);
route.post("/reset_Password1", FrontController.reset_Password1);

//courseController
route.post("/courseInsert", checkUserAuth, CourseController.courseInsert);
route.get("/course_display", checkUserAuth, CourseController.courseDisplay);
route.get("/course_view/:id", checkUserAuth, CourseController.courseview);
route.get("/course_edit/:id", checkUserAuth, CourseController.courseEdit);
route.get("/course_delete/:id", checkUserAuth, CourseController.courseDelete);
route.post("/course_update/:id", checkUserAuth, CourseController.courseUpdate);

//adminController
route.get(
  "/admin/dashboard",
  checkUserAuth,
  adminRole("admin"),
  AdminController.dashboard
);
route.post(
  "/admin/update_status/:id",
  checkUserAuth,
  AdminController.update_status
);

module.exports = route;
