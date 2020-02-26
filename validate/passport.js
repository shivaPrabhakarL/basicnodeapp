const LocalStrategy = require('passport-local').Strategy;
//var passport = require('passport')
const User = require('../DBSchemas/user');
const db = require('../validate/database');
//const config = require('../config/database');
const bcrypt = require('bcryptjs');

db.once('open',function(){
  console.log("connected");
});

// User.find({},function(err,data){
//   console.log("data = ",data);
// })

module.exports = function(passport){
  // Local Strategy
  
  passport.use(new LocalStrategy({usernameField: 'logusername',
  passwordField: 'logpassword'},function(logusername, logpassword, done){
    // Match Username
   
    let query = {username:logusername};
    User.findOne(query, function(err, user){
      
      if(err) throw err;
      if(!user){
        console.log('No user found');
        return done(null, false, {message: 'No user found'});
      }

      // Match Password
      bcrypt.compare(logpassword, user.password, function(err, isMatch){
        if(err) throw err;
        if(isMatch){
          return done(null, user);
        } else {
          console.log('Wrong password');
          return done(null, false, {message: 'Wrong password'});
        }
      });
    });
  }));

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
}