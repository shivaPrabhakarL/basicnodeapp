const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const expressvalidator = require('express-validator');
const db = require('../config/database');
const chat = require('../DBSchemas/chat');
const config = require('../config/key');
const server = require('socket.io')();
const urlEncodedParser = bodyParser.urlencoded({extended: false});
const { auth } = require("../controllers/auth");
const flash = require('flash');


db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('Connected');
});

const User = require('../DBSchemas/user');



module.exports = function(app){

    app.get('/register', function(req,res){
        res.render('index');    
    });

    app.post('/register', urlEncodedParser ,function(req,res){
       
        var sendData ;
        const name = req.body.name;
        console.log(name);
        const email = req.body.email;
        const username = req.body.username;
        const password = req.body.password;
        const password2 = req.body.password2;

        req.checkBody('name', 'Name is required').notEmpty();
        req.checkBody('email', 'Email is required').notEmpty();
        req.checkBody('email', 'Email is not valid').isEmail();
        User.findOne({email:email}, function(err, user){
            if(err) throw err;
            if(user){
             req.flash('failure','Email already exists');
             sendData = {Signup: false, message:'Email already exists'};
              return;
            }
        });
        req.checkBody('username', 'Username is required').notEmpty();
        User.findOne({username:username}, function(err, user){
            if(err) throw err;
            if(user){
              req.flash('failure','Username already exists');
              sendData = {Signup: false, message:'Username already exists'};
              return;
            }
        });
        req.checkBody('password', 'Password is required').notEmpty();
        req.checkBody('password2', 'Passwords do not match').equals(req.body.password);
        
        console.log("after username and email validation");
         req.getValidationResult().then(function(result){
            console.log(result.isEmpty());
            if (!result.isEmpty()) {
                var errors = result.array().map(function (elem) {
                    return elem.msg;
                });
                console.log('There are following validation errors: ' + errors.join('&&'));
                res.render('index', { errors: errors });
            } 
        else {
                let newUser = new User({
                name:name,
                email:email,
                username:username,
                password:password,
                token:"",
                tokenExp : ""
                });

               

                User.createUser(newUser,function(err,user){
                    if(err){
                        throw err;
                        return res.json({Signup: false, message:'User is not registered'});
                    }
                    else{
                        return res.render('loginf',{Signup: true, message:'User is registered'});
                      
                    }
                })
            }
        });
    });

    app.get('/login', function(req, res){
        res.render('loginf');
    });

    app.post('/login', urlEncodedParser ,function(req, res ){
       
        let username = req.body.logusername;
        let password = req.body.logpassword;
        let query = {username:username};
        // console.log("username = ",username);
        // console.log("password = ",password);
       if(req.cookie !== undefined  ){
           if(req.cookie.w_auth !== '')
                res.redirect('/chat');
       }
       if(req.cookie !== undefined ){
           if(req.cookie.w_authExp !== '')
                res.redirect('/chat');
       }


        User.getUserByUsername(username,function(err,user){
            if(err) throw err;
            if(user.length === 0){
                return res.json({Login: false, message:'No such user found'});   
            }
          
             var user1 = user[0];
            //console.log(user1);
            User.comparePassword(req.body.logpassword,user1.password,function(err,isMatch){
                if(err) throw err;
                if(isMatch){
                    var id = user1._id;
                    var token = jwt.sign({_id:id},config.secret,{expiresIn : 6000000 });
                 
                    User.findOneAndUpdate({ _id: user1._id }, { token: token },{new : true},function(err,data){
                        if(err) throw err;
                        // console.log("someone");
                        // console.log("data = ",data);
                       // res.header('Authorization','JWT '+token);
                        res.cookie("w_authExp", data.token);
                        res.cookie("w_auth",data.token);
                        
                        res.redirect('/chat');
                        

                    })
                    
                       // console.log("none");
                        
                    
                }else{
                    return res.json({Login: false, message:'Password doesn\'t match.'});
                }
            })
        })
      });

      app.get("/logout", auth, (req, res) => {
        User.findOneAndUpdate({ _id: req.user._id }, { token: "", tokenExp: "" }, (err, doc) => {
            if (err) return res.json({ success: false, err });
            server.on('disconnect', function() {
                console.log("<<<<<<<<<<<<<<<<<<<<disconected>>>>>>>>>>>>>>")
            });
            res.cookie("w_auth","");
            res.cookie("w_authExp","");
            chat.deleteMany({},function(err,data){
                if(err) throw err;
            })
            res.redirect('/login');
        });
    });

   
    }