//const db = require('../config/database');
const server = require('socket.io').listen(4000);
const { auth } = require("../controllers/auth");
const socket  = server.sockets;
const cookie = require('cookie');
const config = require('../config/key');
const Chat = require('../DBSchemas/chat');
const User = require('../DBSchemas/user');

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
        socket.on('previousChat',previousChat);
        socket.on('clear', clearEvent);
        socket.on('disconnect', function() {
            console.log('discoennnnnnn');
            unbindSocketEvents(socket);
        })
    }
    function unbindSocketEvents(socket) {
        console.log('off caleddd....');
        socket.removeAllListeners('input');
        socket.removeAllListeners('previousChat');
        socket.removeAllListeners('clear');
        console.log('off caleddd....end');
    }
   
    function inputEvent(data){
        let id = data.name.toString();
        let message = data.message;
        console.log("id",id);
        User.findOne({_id:id},function(err,user){
            if(err) throw err;
            name = user.name;
          if(name == '' || message == ''){
                sendStatus('Please enter a name and message');
            } else {
                let chat = {
                    sender:name,
                    message:message,
                };
                Chat.insert(chat,function(err,data){
                    if(err) throw err;
                    server.emit('output', [data]);
                    sendStatus({
                        message: 'Message sent',
                        clear: true
                    });
                });
            }
        });
    }

    function previousChat(data){
        Chat.find({},function(err,chatdata){
            if(err) throw err;
            server.emit('output', [chatdata]);
            sendStatus({
                message: 'Previous Message sent',
                clear: true
            });
        })
    }

    function clearEvent(){
        Chat.deleteMany({}, function(){
            socket.emit('cleared');
        });
    }


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