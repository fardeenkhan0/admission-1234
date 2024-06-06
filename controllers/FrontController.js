const UserModel = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary").v2;
const CourseModel = require("../models/course");
const randomstring = require("randomstring");
const nodemailer = require("nodemailer");

cloudinary.config({
  cloud_name: "dmhos5nnv",
  api_key: "635444285841289",
  api_secret: "PJX7WiOOCe1p5AntC-l0OTmnUFc",
});

class FrontController {
  static login = async (req, res) => {
    try {
      res.render("login", {
        msg: req.flash("success"),
        error: req.flash("error"),
      });
    } catch (error) {
      console.log(error);
    }
  };
  static about = async (req, res) => {
    try {
      const { name, image } = req.userdata;
      res.render("about", { n: name, i: image });
    } catch (error) {
      console.log(error);
    }
  };
  static contact = async (req, res) => {
    try {
      const { name, image } = req.userdata;
      res.render("contact", { n: name, i: image });
    } catch (error) {
      console.log(error);
    }
  };

  static register = async (req, res) => {
    try {
      res.render("register", { msg: req.flash("error") });
    } catch (error) {
      console.log(error);
    }
  };

  static home = async (req, res) => {
    try {
      const { name, image, email, id } = req.userdata;
      const btech = await CourseModel.findOne({ user_id: id, course: "btech" });
      const bca = await CourseModel.findOne({ user_id: id, course: "bca" });
      const mca = await CourseModel.findOne({ user_id: id, course: "mca" });
      //console.log(btech);

      //console.log(name);
      res.render("home", {
        n: name,
        i: image,
        e: email,
        b: btech,
        bca: bca,
        mca: mca,
      });
    } catch (error) {
      console.log(error);
    }
  };

  //data insert reg
  static insertReg = async (req, res) => {
    try {
      //console.log(req.files.image);
      const file = req.files.image;
      //image upload
      const uploadImage = await cloudinary.uploader.upload(file.tempFilePath, {
        folder: "profile",
      });
      //console.log(uploadImage);
      //console.log("insert data");
      //console.log(req.body);
      const { n, e, p, cp } = req.body;
      const user = await UserModel.findOne({ email: e });
      //console.log(user);
      if (user) {
        req.flash("error", "Email alreday exit");
        res.redirect("/register");
      } else {
        if (n && e && p && cp) {
          if (p == cp) {
            const hashpassword = await bcrypt.hash(p, 10);
            const result = new UserModel({
              name: n,
              email: e,
              password: hashpassword,
              image: {
                public_id: uploadImage.public_id,
                url: uploadImage.secure_url,
              },
            });
            await result.save();
            req.flash("success", "Register Success plz Login!");
            res.redirect("/"); //route url
          } else {
            req.flash("error", "Password and cpassword Not Same");
            res.redirect("/register");
          }
        } else {
          req.flash("error", "All Field req");
          res.redirect("/register");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  static vlogin = async (req, res) => {
    try {
      // console.log(req.body)
      const { e, p } = req.body;
      if (e && p) {
        const user = await UserModel.findOne({ email: e });
        if (user != null) {
          const isMatched = await bcrypt.compare(p, user.password);
          if (isMatched) {
            if (user.role == "admin") {
              //token
              let token = jwt.sign({ ID: user.id }, "pninfosys34566sddgfgh55");
              //console.log(token);
              res.cookie("token", token);

              res.redirect("/admin/dashboard");
            } else {
              //token
              let token = jwt.sign({ ID: user.id }, "pninfosys34566sddgfgh55");
              //console.log(token);
              res.cookie("token", token);

              res.redirect("/home");
            }
          } else {
            req.flash("error", "Email or Password is not valid");
            res.redirect("/");
          }
        } else {
          req.flash("error", "You are not a registred user");
          res.redirect("/");
        }
      } else {
        req.flash("error", "All Firlds Required");
        res.redirect("/");
      }
    } catch (error) {
      console.log(error);
    }
  };
  static logout = async (req, res) => {
    try {
      res.clearCookie("token");
      res.redirect("/");
    } catch (error) {
      console.log(error);
    }
  };

  static profile = async (req, res) => {
    try {
      const { name, image, email } = req.userdata;
      res.render("profile", { n: name, i: image, e: email });
    } catch (error) {
      console.log(error);
    }
  };
  static updateProfile = async (req, res) => {
    try {
      const { id } = req.userdata;
      const { name, image, email } = req.body;
      //console.log(req.files.image);
      if (req.files) {
        const user = await UserModel.findById(id);
        const imageID = user.image.public_id;
        //console.log(imageID);

        //deleting
        await cloudinary.uploader.destroy(imageID);

        //new image
        const imagefile = req.files.image;
        const imageupload = await cloudinary.uploader.upload(
          imagefile.tempFilePath,
          {
            folder: "profileImage",
          }
        );
        var data = {
          name: name,
          email: email,
          image: {
            public_id: imageupload.public_id,
            url: imageupload.secure_url,
          },
        };
      } else {
        var data = {
          name: name,
          email: email,
        };
      }
      await UserModel.findByIdAndUpdate(id, data);
      // req.flash("success", "update Profile successfully");
      res.redirect("/profile");
    } catch (error) {
      console.log(error);
    }
  };
  static changepassword = async (req, res) => {
    try {
      const { op, np, cp } = req.body;
      const { id } = req.userdata;
      if (op && np && cp) {
        const user = await UserModel.findById(id);
        const isMatched = await bcrypt.compare(op, user.password);
        console.log(isMatched);
        if (!isMatched) {
          req.flash("error", "current password is incorrect");
          res.redirect("/profile");
        } else {
          if (np != cp) {
            req.flash("error", "password does not match");
            res.redirect("/profile");
          } else {
            const newHashPassword = await bcrypt.hash(np, 10);
            await UserModel.findByIdAndUpdate(id, {
              password: newHashPassword,
            });
            req.flash("success", "password updated successfully");
            res.redirect("/");
          }
        }
      } else {
        req.flash("error", "all fields are required");
        res.redirect("/profile");
      }
    } catch (error) {
      console.log(error);
    }
  };

  static forgotpass = async (req, res) => {
    try {
      res.render("forgotpass", {
        msg: req.flash("success"),
        error: req.flash("error"),
      });
    } catch (error) {
      console.log(error);
    }
  };

  // static forgotverify = async (req, res) => {
  //   try {
  //     const email = req.body.email;
  //     //console.log(req.body);
  //     const userdata = await UserModel.findOne({ email: email });
  //     //console.log(userdata);
  //     if (userdata) {
  //       if (userdata) {
  //         const randomstring = randomstring.generate();
  //         //console.log(randoms);
  //         const updatedata = await UserModel.updateOne(
  //           { email: email },
  //           { $set: { token: randomstring } }
  //         );
  //         this.sendEmail(userdata.name, userdata.email, randomstring);
  //         req.flash("error", "plz cheak your mail to reset your password");
  //         res.redirect("/forgotpass");
  //       } else {
  //         req.flash("error", "plz verify your mail");
  //         res.render("/forgotpass");
  //       }
  //     } else {
  //       req.flash("error", "user email is incorrect");
  //       res.redirect("/forgotpass");
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  static forgotverify = async (req, res) => {
    try {
      const { email } = req.body;
      const userData = await UserModel.findOne({ email: email });
      //console.log(userData)
      if (userData) {
        const randomString = randomstring.generate();
        await UserModel.updateOne(
          { email: email },
          { $set: { token: randomString } }
        );
        this.sendEmail(userData.name, userData.email, randomString);
        req.flash("success", "Plz Check Your mail to reset Your Password!");
        res.redirect("/forgotpass");
      } else {
        req.flash("error", "You are not a registered Email");
        res.redirect("/forgotpass");
      }
    } catch (error) {
      console.log(error);
    }
  };

  static sendEmail = async (name, email, token) => {
    // console.log(name,email,status,comment)
    // connenct with the smtp server

    let transporter = await nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,

      auth: {
        user: "fardeenkhan1041@gmail.com",
        pass: "mxbomaqyosormrnu",
      },
    });
    let info = await transporter.sendMail({
      from: "test@gmail.com", // sender address
      to: email, // list of receivers
      subject: "Reset Password", // Subject line
      text: "heelo", // plain text body
      html:
        "<p>Hii " +
        name +
        ',Please click here to <a href="http://localhost:3000/reset-password?token=' +
        token +
        '">Reset</a>Your Password.',
    });
  };

  static reset_Password = async (req, res) => {
    try {
      const token = req.query.token;
      const tokenData = await UserModel.findOne({ token: token });
      if (tokenData) {
        res.render("reset-password", { user_id: tokenData._id });
      } else {
        res.render("404");
      }
    } catch (error) {
      console.log(error);
    }
  };
  static reset_Password1 = async (req, res) => {
    try {
      const { password, user_id } = req.body;
      const newHashPassword = await bcrypt.hash(password, 10);
      await UserModel.findByIdAndUpdate(user_id, {
        password: newHashPassword,
        token: "",
      });
      req.flash("success", "Reset Password Updated successfully ");
      res.redirect("/");
    } catch (error) {
      console.log(error);
    }
  };
}
module.exports = FrontController;
