const bodyParser = require('body-parser');
const server = require('socket.io')();
const urlEncodedParser = bodyParser.urlencoded({extended: false});
const { auth } = require("../controllers/auth");
const User = require('../DBSchemas/user');

module.exports = function(app){

    function formValidation(req ,callback){
        req.checkBody('name', 'Name is required').notEmpty();
        req.checkBody('email', 'Email is required').notEmpty();
        req.checkBody('email', 'Email is not valid').isEmail();
        User.findOne({email:req.body.email}, function(err, user){
            if(err) throw err;
            if(user){
             //req.flash('failure','Email already exists');
             console.log("email exits");
             // return ;
            }
        });
        req.checkBody('username', 'Username is required').notEmpty();
        User.findOne({username:req.body.username}, function(err, user){
            if(err) throw err;
            if(user){
              //req.flash('failure','Username already exists');
              console.log("username exits");
            //   return ;
            }
        });
        req.checkBody('password', 'Password is required').notEmpty();
        req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

        req.getValidationResult().then(function(result){
            callback(result);
        });

    }

    function loginVerification(username,password,callback){
        User.getUserByUsername(username,function(err,user){
            if(err) throw err;
            if(user.length === 0){
                return res.json({Login: false, message:'No such user found'});   
            }
             var user1 = user[0];
            User.comparePassword(password,user1,function(err,data){
                callback(err,data);                        
            });
        });
    }

    app.get('/',function(req,res){
        res.redirect('/register');
    })

    app.get('/register', function(req,res){
        res.render('index');    
    });

    app.post('/register', urlEncodedParser ,function(req,res){
       
        formValidation(req,function(result){
            console.log(result.isEmpty());
            if (!result.isEmpty()) {
                var errors = result.array().map(function (elem) {
                    return elem.msg;
                });
                console.log('There are following validation errors: ' + errors.join(' && '));
                req.flash('failure', errors.join(' && ') );
            } 
        else {          
                var user =  {
                    name:req.body.name, 
                    email:req.body.email, 
                    username:req.body.username, 
                    password:req.body.password, 
                    token:"",
                    tokenExp : ""
                }           
                User.createUser({ user : user},function(err,user){
                    if(err){
                        return res.json({Signup: false, message:'User is not registered', errors: err.message});
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
       if(req.cookie !== undefined  ){
           if(req.cookie.w_auth !== '')
                res.redirect('/chat');
       }
       if(req.cookie !== undefined ){
           if(req.cookie.w_authExp !== '')
                res.redirect('/chat');
       }
        loginVerification(req.body.logusername,req.body.logpassword,function(err,data){
            if(err) throw err;
            if(data !== "error" ){
                console.log("loginverfy");
                res.cookie("w_authExp", data.token);
                res.cookie("w_auth",data.token);
                res.redirect('/chat');
            } else{
                return res.json({Login: false, message:'Password doesn\'t match.'});
            }
        });
    });
    

      app.get("/logout", auth, (req, res) => {
        User.findOneAndUpdate({ _id: req.user._id }, { token: "", tokenExp: "" }, (err, doc) => {
            if (err) return res.json({ success: false, err });
            server.on('disconnect', function() {
                console.log("<<<<<<<<<<<<<<<<<<<<disconected>>>>>>>>>>>>>>")
            });
            res.cookie("w_auth","");
            res.cookie("w_authExp","");
            res.redirect('/login');
        });
    });

   
    }