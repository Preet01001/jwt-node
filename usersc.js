const mongoose = require("mongoose");
let schema = new mongoose.Schema({
    username:String,
    password:String
})

let model = mongoose.model("users",schema);
module.exports = model;