const User = require('../DBSchemas/user');
const passport = require('passport');
const googleStrategy = require('passport-google-oauth2').Strategy;
const authKeys = require('../config/authKeys');
const jwt = require('jsonwebtoken');
const config = require('../config/key')

function passportAuth(){
passport.use( 
   new googleStrategy( {
    clientID : authKeys.googleAuth.clientID,
    clientSecret : authKeys.googleAuth.clientSecret,
    callbackURL : authKeys.googleAuth.callback,
    passReqToCallback   : true
  }, (request,accessToken,refreshToken,profile,done) =>{

      User.findOne({googleId:profile.id},function(err,user){
        if(err) throw err;
        if(!user){
          var user =  {
            googleId : profile.id, 
            email:profile.sub, 
            name : profile.displayName,
            username:profile.sub, 
            password:"", 
            token:"",
            tokenExp : ""
        }           
          User.createUser({ user : user},function(err,user){
          User.findOneAndUpdate({ _id: user._id }, { token:request.cookies.w_auth  },{new : true},function(err,data){
            done(err,user);
          });
          })
        }else{
          User.findOneAndUpdate({ _id: user._id }, { token:request.cookies.w_auth  },{new : true},function(err,data){
          console.log("in in in",data);
          done(err,data);
          });
          
        }
       })
      })
  )
    }

    passport.serializeUser((user, cb) => {
      console.log("asdhbksbfk",user);
      var token = jwt.sign({_id:user._id},config.secret,{expiresIn : 6000000 });
      User.findOneAndUpdate({ _id: user._id }, { token: token },{new : true},function(err,data){
        cb(err,data.token);
      });
    })
    passport.deserializeUser((token, cb) => {
      console.log("token in de",token);
      User.findByToken({googleId : "",token : token},function(err,data){
        cb(null,data);
      })
    })

let auth = (req, res, next) => {
  console.log(req);
  var userReq = req.user;
  console.log(userReq);
  let token = req.cookies.w_auth;
  let token1 = req.cookies.w_authExp;
  console.log("token = ",token);
  console.log("token1 = ",token1);
  var gid = "";
  if(userReq.googleId !== ""){
      gid = userReq.googleId;
      token = req.user.token;
  }
  var data = {
    token : token,
    googleId : gid
  }
  User.findByToken(data, (err, user) => {
    console.log("user before err  ",user)
    if (err) throw err;
    if (!user)
      return res.json({
        isAuth: false,
        error: true
      });

    req.token = token;
    req.user = user;
    next();
  });
};

module.exports = { auth,passportAuth };