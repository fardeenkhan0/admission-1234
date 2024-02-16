const mongoose = require("mongoose");
const Live_URL =
  "mongodb+srv://fardeenkhan1041:fardeenkhan1041@cluster0.opq9dqn.mongodb.net/admissionPortal?retryWrites=true&w=majority";
//const Local_URL = "mongodb://127.0.0.1:27017/admission1234";
const connectdb = () => {
  return mongoose
    .connect(Live_URL)
    .then(() => {
      console.log("connecting succes");
    })
    .catch((error) => {
      console.log(error);
    });
};
module.exports = connectdb;
