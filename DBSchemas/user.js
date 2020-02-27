const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var passportLocalMongoose = require('passport-local-mongoose'); 
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


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
  },
  token : {
    type: String,
},
tokenExp :{
    type: Number
}
});

UserSchema.set('toObject', { virtuals: true });

const User = module.exports = mongoose.model('User', UserSchema);

UserSchema.plugin(uniqueValidator);
UserSchema.plugin(passportLocalMongoose); 

module.exports.comparePassword = function(plainPassword, hash, callback){
  //console.log(plainPassword);
  bcrypt.compare(plainPassword, hash, function(err, isMatch){
    if(err) throw err;
    // if(isMatch){
    //   return done(null, user);
    // } else {
    //   console.log('Wrong password');
    //   return done(null, false, {message: 'Wrong password'});
    // }
    callback(null,isMatch);
  });
}

module.exports.getUserById = function(id,callback){
  User.findById(id,callback);
}

module.exports.getUserByUsername = function(username,callback){
  User.find({username: username},callback);
}

module.exports.createUser = function(newUser,callback){
  bcrypt.genSalt(10, function(err, salt){
    if(err) throw err;
    bcrypt.hash(newUser.password, salt, function(err, hash){
    if(err){
        console.log(err);
    }
    newUser.password = hash;
    newUser.save(callback);
  }) 
  })
}


///const User = module.exports = mongoose.model('User', UserSchema);