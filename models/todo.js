const mongoose = require("mongoose");

const {Schema,model}=require("mongoose")

const todoSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  dueDate: {
    type: Date,
    required: true
  },
  priority: {
    type: String,
    enum: ["Low", "Medium", "High"],
    default: "Low"
  },
  completed: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

const todoModels= mongoose.model("Todo", todoSchema);

module.exports =todoModels;