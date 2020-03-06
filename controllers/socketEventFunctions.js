const Chat = require('../DBSchemas/chat');
const User = require('../DBSchemas/user');
const server = require('socket.io').listen(4000);
const socket  = server.sockets;


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
    console.log(socket.id + ' disconnected');
}



function unbindSocketEvents(socket) {
    console.log('off caleddd....');
    socket.removeAllListeners('input');
    socket.removeAllListeners('previousChat');
    socket.removeAllListeners('clear');
    console.log('off caleddd....end');
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

    require('socketio-auth')(server, {
        authenticate: authenticate,
        postAuthenticate: postAuthenticate,
        disconnect: disconnect,
        timeout: 1000
    });
    
function socketConnect(){
    server.on('connect',function(socket){
        console.log("<<<<<<<< server socket connected >>>>>..");
        bindSocketEvents(socket);
    });
}


sendStatus = function(s){
    socket.emit('status', s);
}



function inputEvent(data){
    let id = data.name.toString();
    let message = data.message;
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
    console.log("previousChat............................")
    Chat.find({},function(err,chatdata){
        if(err) throw err;
        console.log("previous find ///////////////////////////");
        console.log("chat data = ",chatdata);
        server.emit('previousChat', chatdata);
        sendStatus({
            message: 'Previous Message sent',
            clear: true
        });
    })
}

function clearEvent(){
    console.log("clear Event ,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,")
    Chat.deleteMany({}, function(err){
        if(err) throw err;
        console.log("delete .,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,")
        socket.emit('cleared');
    });
}


module.exports = {socketConnect};