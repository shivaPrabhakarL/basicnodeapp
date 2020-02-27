const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
//const passport = require('passport');
const expressvalidator = require('express-validator');
const db = require('../config/database');
const client = require('socket.io').listen(4000).sockets;


const urlEncodedParser = bodyParser.urlencoded({extended: false});

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('Connected');
});

const Chat = require('../DBSchemas/chat');
const User = require('../DBSchemas/user');

Chat.find({},function(err,dat){
    if(err) throw err;
    console.log("chat data = ",dat);
})

module.exports = function(app){
    app.get('/chat',function(req,res){

        //console.log(req);
        let userId = req.session.passport.user;
        //console.log(req.session);
        User.findById(userId,function(err,doc){
           var name1 = doc.name;
           // console.log(name);
       
       // console.log(name);
        client.on('connection', function(socket){
            // let chat = db.collection('chats');
    
            // Create function to send status
            sendStatus = function(s){
                socket.emit('status', s);
            }
    
            // Get chats from mongo collection
            // chat.find().limit(100).sort({_id:1}).toArray(function(err, res){
            //     if(err){
            //         throw err;
            //     }
    
            //     // Emit the messages
            //     socket.emit('output', res);
            // });
    
            // Handle input events
            socket.on('input', function(data){
                console.log("kdunfwiulrivaeifskd");
                console.log("ther");
                console.log(data);

                let name = data.name;
                let message = data.message;

                // Check for name and message
                if(name == '' || message == ''){
                    // Send error status
                    sendStatus('Please enter a name and message');
                } else {
                    // Insert message
                    Chat({sender: req.session.passport.user , message: message}).save(function(){
                        console.log("chatcontrol = ",[data]);
                        client.emit('output', [data]);
    
                        // Send status object
                        sendStatus({
                            message: 'Message sent',
                            clear: true
                        });
                    });
                }
            });
    
            // Handle clear
            // socket.on('clear', function(data){
            //     // Remove all chats from collection
            //     chat.remove({}, function(){
            //         // Emit cleared
            //         socket.emit('cleared');
            //     });
            // });
        });
        
        res.render('chat',{name : name1, id:req.session.passport.user});
    });
        //res.render('chat');
       
    })

}