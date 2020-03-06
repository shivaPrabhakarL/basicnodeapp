const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
const config = require('../config/key');

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

UserSchema.pre('save', function( next ) {
  var user = this;
  
  if(user.isModified('password')){    

      bcrypt.genSalt(10, function(err, salt){
          if(err) return next(err);
  
          bcrypt.hash(user.password, salt, function(err, hash){
              if(err) return next(err);
              user.password = hash 
              next()
          })
      })
  } else {
      next()
  }
});



UserSchema.plugin(uniqueValidator);

const User = module.exports = mongoose.model('User', UserSchema);

module.exports.comparePassword = function(plainPassword, user, callback){  
  console.log("in compare");
    bcrypt.compare(plainPassword, user.password, function(err, isMatch){
        console.log("comparing");
        if(err) throw err;
        if(isMatch){
          console.log("matched");
          var id = user._id;
          var token = jwt.sign({_id:id},config.secret,{expiresIn : 6000000 });
          User.findOneAndUpdate({ _id: user._id }, { token: token },{new : true},function(err,data){
            console.log("user update");
            callback(err,data);
          });
        }else{
          console.log("password doesn't match");
          callback(err,"error");
        }
    });
}

module.exports.getUserById = function(id,callback){
  User.findById(id,callback);
}



module.exports.getUserByUsername = function(username,callback){
  User.find({username: username},callback);
}



module.exports.createUser = function(newUser,callback){
  let nUser = new User(newUser.user);
  bcrypt.genSalt(10, function(err, salt){
    if(err) throw err;
    bcrypt.hash(nUser.password, salt, function(err, hash){
    if(err){
        console.log(err);
    }
    bcrypt.compare(nUser.password,hash,function(err, isMatch){
      if(err) throw err;
      console.log(isMatch);
    })
    nUser.password = hash;
    nUser.save(callback);
  }) 
  })
}



module.exports.findByToken = function (token, callback) {
  var user = this;
  jwt.verify(token,'yoursecret',function(err, decode){
    if(err) throw err;
      user.findOne({"_id":decode}, function(err, user){
          if(err) {
            console.log(err);
            return callback(err);
          }
          callback(null, user);
      })
  })
}
