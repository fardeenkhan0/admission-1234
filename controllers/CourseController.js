const CourseModel = require("../models/course");

class CourseController {z
  static courseInsert = async (req, res) => {
    try {
      // console.log(req.body);
      const { name, email, phone, dob, address, gender, education, course } =
        req.body;
      //console.log(result)
      const result = new CourseModel({
        name: name,
        email: email,
        phone: phone,
        dob: dob,
        address: address,
        gender: gender,
        education: education,
        course: course,
        user_id: req.userdata._id,
      });
      await result.save();
      res.redirect("/course_display");
    } catch (error) {
      console.log(error);
    }
  };

  static courseDisplay = async (req, res) => {
    try {
      const { name, image } = req.userdata;
      const data = await CourseModel.find({ user_id: req.userdata._id });
      // console.log(data);
      res.render("course/display", {
        d: data,
        n: name,
        i: image,
        msg: req.flash("success"),
      });
    } catch (error) {
      console.log(error);
    }
  };

  static courseview = async (req, res) => {
    try {
      const { name, image } = req.userdata;
      //console.log(req.params.id);
      const data = await CourseModel.findById(req.params.id);
      //console.log(data);
      res.render("course/view", { d: data, n: name, i: image });
    } catch (error) {
      console.log(error);
    }
  };
  static courseEdit = async (req, res) => {
    try {
      const { name, image } = req.userdata;
      //console.log(req.params.id);
      const data = await CourseModel.findById(req.params.id);
      //console.log(data);
      res.render("course/edit", { d: data, n: name, i: image });
    } catch (error) {
      console.log(error);
    }
  };
  static courseDelete = async (req, res) => {
    try {
      await CourseModel.findByIdAndDelete(req.params.id);
      //console.log(data);
      req.flash("success", "Course Delete Successfully");
      res.redirect("/course_display");
    } catch (error) {
      console.log(error);
    }
  };

  static courseUpdate = async (req, res) => {
    try {
      const { name, email, phone, dob, address, gender, education, cousre } =
        req.body;
      await CourseModel.findByIdAndUpdate(req.params.id, {
        name: name,
        email: email,
        phone: phone,
        dob: dob,
        address: address,
        gender: gender,
        education: education,
        cousre: cousre,
      });
      //console.log(data);
      req.flash("success", "Course Update Successfully");
      res.redirect("/course_display");
    } catch (error) {
      console.log(error);
    }
  };
}
module.exports = CourseController;
