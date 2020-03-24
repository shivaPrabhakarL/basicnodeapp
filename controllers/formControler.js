const bodyParser = require('body-parser');
const server = require('socket.io')();
const urlEncodedParser = bodyParser.urlencoded({extended: false});
const { auth } = require("../controllers/auth");
const User = require('../DBSchemas/user');
const passport = require('passport');

console.log(typeof(User));

function loginVerification(username,password,callback){
    User.getUserByUsername(username,function(err,user){
        console.log("232144324");
        if(err) throw err;
        if(user.length === 0){
            return ({Login: false, message:'No such user found'});   
        }
         var user1 = user[0];
        User.comparePassword(password,user1,function(err,data){
            console.log("dunewdiubnewbfewidqu1w1`w");
            callback(err,data);                        
        });
    });
}

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

User.find({}).distinct("email",(err,data) =>{
    if(err) throw err;
    data.forEach((id) =>{
        console.log(id);
    })
})

 function fromcontroler(app){

  
  

    app.get('/',function(req,res){
        res.redirect('/api/register');
    })

    app.get('/api/register', function(req,res){
        res.render('index');    
    });

    app.post('/api/register', urlEncodedParser ,function(req,res){
       
        formValidation(req,function(result){
           //// console.log(result.isEmpty());
            if (!result.isEmpty()) {
                var errors = result.array().map(function (elem) {
                    return elem.msg;
                });
               // console.log('There are following validation errors: ' + errors.join(' && '));
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

    app.get('/api/login', function(req, res){
        res.render('loginf');
    });

    app.post('/api/login', urlEncodedParser ,function(req, res ){
        console.log("req cookie",req.cookie);
       if(req.cookie !== undefined  ){
           if(req.cookie.w_auth !== '')
                res.redirect('/api/chat');
       }
       if(req.cookie !== undefined ){
           if(req.cookie.w_authExp !== '')
                res.redirect('/api/chat');
       }
        loginVerification(req.body.logusername,req.body.logpassword,function(err,data){
            // console.log("bdjdbsbch");
            // console.log(req.body.logpasswor,"111d");
            if(err) throw err;
            if(data !== "error" ){
                res.cookie("w_authExp", data.token);
                res.cookie("w_auth",data.token);
                res.redirect('/api/chat');
            } else{
                return res.json({Login: false, message:'Password doesn\'t match.'});
            }
        });
    });


    console.log("udsgvubfcew");

    app.get('/auth/google',
  passport.authenticate('google', { scope: [ 'https://www.googleapis.com/auth/plus.login',
  , 'https://www.googleapis.com/auth/plus.profile.emails.read' ]  }),function(req,res){
      console.log("hello");
     
  });

  app.get( '/auth/google/callback', 
  passport.authenticate( 'google', { 
      
      failureRedirect: '/auth/google/failure'
}),function(req,res){
    console.log("req = ",req._passport.session.user);
    let user = req._passport.session.user;
    res.cookie("w_authExp", user);
    res.cookie("w_auth",user);
    res.redirect('/api/chat');
});
    

      app.get("/api/logout", auth, (req, res) => {
          console.log(req.cookies.w_auth);
        User.findOneAndUpdate({ token: req.cookies.w_auth }, { token: "", tokenExp: "" }, (err, doc) => {
            if (err) return res.json({ success: false, err });
            server.on('disconnect', function() {
                console.log("<<<<<<<<<<<<<<<<<<<<disconected>>>>>>>>>>>>>>")
            });
            res.cookie("w_auth","");
            res.cookie("w_authExp","");
            console.log(res.cookie);
            res.redirect('/api/login');
        });
    });

   
    }

    module.exports = {loginVerification,fromcontroler};