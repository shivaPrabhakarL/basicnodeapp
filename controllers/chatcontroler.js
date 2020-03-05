const db = require('../config/database');
const server = require('socket.io').listen(4000);
const { auth } = require("../controllers/auth");
const socket  = server.sockets;
const cookie = require('cookie');
//const connect = require('connect');
const expressSession = require('express-session');
//var redisAdapter = require('socket.io-redis');
const config = require('../config/key');
//var ConnectRedis = require('connect-redis')(expressSession);
//var redisSession = new ConnectRedis({host: '127.0.0.1', port: '4000'});




db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('Connected');
});

//const pChat = server.of('/chat');

const Chat = require('../DBSchemas/chat');
const User = require('../DBSchemas/user');

Chat.find({},function(err,dat){
    if(err) throw err;
    //console.log("chat data = ",dat);
})

module.exports = function(app){

    function authenticate(socket, data, callback) {
        var username = data.username;
        var password = data.password;
        
        User.findOne({username:username}, function(err, user) {
          if (err || !user) return callback(new Error("User not found"));
          return callback(null, user.password == password);
        });
      }
        
      function postAuthenticate(socket, data) {
        var username = data.username;
       
        User.findOne({username:username}, function(err, user) {
            
          socket.client.user = user;
        });
      }

      function disconnect(socket) {
        console.log(socket.client.user,"=== user");
        console.log(socket.id + ' disconnected');
      }

      require('socketio-auth')(server, {
        authenticate: authenticate,
        postAuthenticate: postAuthenticate,
        disconnect: disconnect,
        timeout: 1000
      });

    server.on('connect',function(socket){
        console.log("<<<<<<<< server socket connected >>>>>..");
        bindSocketEvents(socket);
    });

    sendStatus = function(s){
        socket.emit('status', s);
   }

    function bindSocketEvents(socket) {
        socket.on('input', inputEvent);

        // Handle clear
        socket.on('clear', clearEvent);
        socket.on('disconnect', function() {
            console.log('discoennnnnnn');
            unbindSocketEvents(socket);
        })
    }
    function unbindSocketEvents(socket) {
        console.log('off caleddd....');
        socket.removeAllListeners('input');

        // Handle clear
        socket.removeAllListeners('clear');
        console.log('off caleddd....end');
    }
   
    function inputEvent(data){
        let id = data.name.toString();
        let message = data.message;

        console.log("id",id);
        User.findOne({_id:id},function(err,user){
            console.log("<<<<<<<<<<,user user>>>>>>>>>>>.")
            if(err) throw err;
            name = user.name;
            // console.log("name in user",user.name);
            // console.log("name in name=  ",name);
            if(name == '' || message == ''){
                // Send error status
                sendStatus('Please enter a name and message');
            } else {
                // Insert message
                let chat = new Chat({
                    sender:name,
                    message:message,
                    reciever:'',

                });
                Chat.insert(chat,function(err,data){
                    if(err) throw err;
                    console.log("=====================insert=========================");
                    server.emit('output', [data]);

                    // Send status object
                    sendStatus({
                        message: 'Message sent',
                        clear: true
                    });
                });
            }
        });
    }

    function clearEvent(){
        // Remove all chats from collection
        Chat.remove({}, function(){
            // Emit cleared
            socket.emit('cleared');
        });
    }


    app.get('/chat',auth,function(req,res){
        res.cookie("w_auth", req.user.token);
        res.cookie("w_auth", req.user.token);
        

       

        
       
        console.log("socket connection ");
       // console.log(req.user);
      
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