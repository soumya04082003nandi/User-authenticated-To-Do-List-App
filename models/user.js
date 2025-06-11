const mongoose = require("mongoose");
const {Schema,model}=require("mongoose");


const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  }
}, { timestamps: true });


const userModels = mongoose.model("User", userSchema);

module.exports=userModels;
