
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const expressvalidator = require('express-validator');
const db = require('../validate/database');


const urlEncodedParser = bodyParser.urlencoded({extended: false});




db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('Connected');
});

const User = require('../DBSchemas/user');

// User.deleteMany({username:'shivaI7'},function(err){
//     if(err) throw err;
// });

module.exports = function(app){

    app.use(expressvalidator());

    app.get('/register', function(req,res){
        res.render('index');    
    });

    app.post('/register', urlEncodedParser ,function(req,res){

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
              return;
            }
        });
        req.checkBody('username', 'Username is required').notEmpty();
        User.findOne({username:username}, function(err, user){
            if(err) throw err;
            if(user){
              req.flash('failure','Username already exists');
              return;
            }
        });
        req.checkBody('password', 'Password is required').notEmpty();
        req.checkBody('password2', 'Passwords do not match').equals(req.body.password);
        //console.log(req.body);
        // User(req.body).save(function(err,data){
        //     if(err) throw err;
        // });
        // var msg = "login to continue";
        // res.json({message : msg});
        console.log("after username and email validation");
         req.getValidationResult().then(function(errors){
        if(!errors.isEmpty()){
            console.log("errors = ",errors);
            throw errors;
            // res.render('index', {
            //   errors:errors
            // });
          } 
        else {
                let newUser = new User({
                name:name,
                email:email,
                username:username,
                password:password
                });

                bcrypt.genSalt(10, function(err, salt){
                    bcrypt.hash(newUser.password, salt, function(err, hash){
                    if(err){
                        console.log(err);
                    }
                    newUser.password = hash;
                    newUser.save(function(err){
                        if(err){
                        if(err.errors.email){
                            console.log(err.errors.email.message);
                        }  
                        else if(err.errors.username){
                            console.log("error = ",err.errors.username.message);
                        }   
                    }                  
                         else {
                        req.flash('success','You are now registered and can log in');
                        res.redirect('/login');
                        }
                    });
                    });
                });
            }
        });
    });

    app.get('/login', function(req, res){
        res.render('loginf');
    });

    app.post('/login', urlEncodedParser ,function(req, res, next){
        //console.log(req.body);
        let username = req.body.logusername;
        let password = req.body.logpassword;
        let query = {username:username};
        // User.findOne(query, function(err, user){
        //     if(err) throw err;
        //     if(!user){
        //       console.log('No user found');
        //       res.redirect('/login');
        //     }
        //     bcrypt.compare(password, user.password, function(err, isMatch){
        //         if(err) throw err;
        //         if(isMatch){
        //           res.redirect('/chat');
        //         } else {
        //           console.log('Wrong password');
        //           res.redirect('/login');
        //         }
        //       });
        //     });
        
        passport.authenticate('local', { successRedirect:'/chat',
            failureRedirect:'/login',
            failureFlash: true
          })(req, res, next);
      });

   
    }