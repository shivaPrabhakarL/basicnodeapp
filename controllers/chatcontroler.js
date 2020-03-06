const { auth } = require("../controllers/auth");
const {socketConnect} = require('./socketEventFunctions');


module.exports = function(app){

    socketConnect();

    app.get('/chat',auth,function(req,res){
        res.cookie("w_auth", req.user.token);
        res.cookie("w_auth", req.user.token);
        console.log("socket connection ");
        res.render('chat',{
            _id: req.user._id,
            isAuth: true,
            email: req.user.email,
            name: req.user.name,
            username: req.user.username,
            password: req.user.password
       });
        
    });

}