const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var passportLocalMongoose = require('passport-local-mongoose'); 

// User Schema
const UserSchema = mongoose.Schema({
  name:{
    type: String,
    required: true
  },
  email:{
    type: String,
    required: true,
    unique: true 
  },
  username:{
    type: String,
    required: true,
    unique: true 
  },
  password:{
    type: String,
    required: true
  }
});



UserSchema.plugin(uniqueValidator);
UserSchema.plugin(passportLocalMongoose); 

const User = module.exports = mongoose.model('User', UserSchema);