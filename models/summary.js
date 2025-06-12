const mongoose = require('mongoose');
const {Schema,model}=require("mongoose")

const summarySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  summary: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  }
});


const summaryModels= mongoose.model('Summary', summarySchema);

module.exports=summaryModels;
