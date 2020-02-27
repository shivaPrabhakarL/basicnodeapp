const LocalStrategy = require('passport-local').Strategy;
//var passport = require('passport')
const User = require('../DBSchemas/user');
const db = require('./database');
//const config = require('../config/database');
const bcrypt = require('bcryptjs');
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secret;
// opts.issuer = 'accounts.examplesoft.com';
// opts.audience = 'yoursite.net';

db.once('open',function(){
  console.log("connected");
});

// User.find({},function(err,data){
//   console.log("data = ",data);
// })

module.exports = function(passport){
  // Local Strategy
  
  // passport.use(new LocalStrategy({usernameField: 'logusername',
  // passwordField: 'logpassword'},function(logusername, logpassword, done){
  //   // Match Username
   
  //   let query = {username:logusername};
  //   // User.findOne(query, function(err, user){
      
  //   //   if(err) throw err;
  //   //   if(!user){
  //   //     console.log('No user found');
  //   //     return done(null, false, {message: 'No user found'});
  //   //   }

  //   //   // Match Password
  //   //   // bcrypt.compare(logpassword, user.password, function(err, isMatch){
  //   //   //   if(err) throw err;
  //   //   //   if(isMatch){
  //   //   //     return done(null, user);
  //   //   //   } else {
  //   //   //     console.log('Wrong password');
  //   //   //     return done(null, false, {message: 'Wrong password'});
  //   //   //   }
  //   //   // });

  //   //   User.comparePassword(logpassword,(err, isMatch) => {
  //   //     if (!isMatch)
  //   //         return res.json({ loginSuccess: false, message: "Wrong password" });
  //   //   )

  //   // });
  //   User.findOne({ email: req.body.email }, (err, user) => {
  //     if (!user)
  //         return done(null, false, { loginSuccess: false,message: 'No user found'});

  //     user.comparePassword(req.body.password, (err, isMatch) => {
  //         if (!isMatch)
  //             return done(null, false, {loginSuccess: false, message: 'Wrong password'});

  //         user.generateToken((err, user) => {
  //             if (err) return err;
  //             res.cookie("w_authExp", user.tokenExp);
  //             res
  //                 .cookie("w_auth", user.token)
  //                 .status(200)
  //                 .json({
  //                     loginSuccess: true
  //                 });
  //         });
  //     });
  // });
  // }));

  passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    User.getUserById( jwt_payload.doc._id, function(err, user) {
        if (err) {
            return done(err, false);
        }
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
            // or you could create a new account
        }
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