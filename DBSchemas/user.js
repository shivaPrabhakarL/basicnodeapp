const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var passportLocalMongoose = require('passport-local-mongoose'); 
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

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

//UserSchema.set('toObject', { virtuals: true });

//UserSchema.pre('save', function( next ) {
//   var user = this;
  
//   if(user.isModified('password')){    

//       bcrypt.genSalt(10, function(err, salt){
//           if(err) return next(err);
  
//           bcrypt.hash(user.password, salt, function(err, hash){
//               if(err) return next(err);
//               user.password = hash 
//               next()
//           })
//       })
//   } else {
//       next()
//   }
// });



UserSchema.plugin(uniqueValidator);
UserSchema.plugin(passportLocalMongoose); 

const User = module.exports = mongoose.model('User', UserSchema);

module.exports.comparePassword = function(plainPassword, hash, callback){
  //console.log(plainPassword);
  // console.log(plainPassword);
  
  //   console.log(hash);

    
  bcrypt.compare(plainPassword, hash, function(err, isMatch){
    
    if(err) throw err;
   // console.log(isMatch);
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
    bcrypt.compare(newUser.password,hash,function(err, isMatch){
      if(err) throw err;
      console.log(isMatch);
    })
    newUser.password = hash;
    newUser.save(callback);
  }) 
  })
}

module.exports.findByToken = function (token, callback) {
  var user = this;
  //console.log("token in find = ",token);
  jwt.verify(token,'yoursecret',function(err, decode){
    if(err) throw err;
   // console.log("docode = ",decode);
      user.findOne({"_id":decode}, function(err, user){
          if(err) {
            console.log(err);
            return callback(err);
          }
          callback(null, user);
      })
  })
}


///const User = module.exports = mongoose.model('User', UserSchema);