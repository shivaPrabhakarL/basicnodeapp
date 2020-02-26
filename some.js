// var express = require('express');
// var app = express();
// var http = require('http').createServer(app);
// var io = require('socket.io').listen(http).sockets;
// var mongo = require('mongodb').MongoClient;

// var users = [];
// var connections = [];

// mongo.connect('mongodb://localhost:27017/chat', function(err, db){
//     if(err) throw err;
//     console.log("connected");

//     io.on('connection', function(){
//         let chat = db.collection('chats');

//         sendStatus = function(s){
//             socket.emit('status',s);
//         }
//         //chat.

//         chat.find().limit(100).sort({_id:1}).toArray(function(err,res){
//             if(err) throw err;
//             socket.emit('output',res);
//         });

//         socket.on('input',function(data){
           
//             let name = data.name;
//             let message = data.message;

//             if(name == '' || message == ''){
//                 sendStatus('please enter name and message!');
//             }else{
//                 chat.insert({name:name, message:message}, function(){
//                     io.emit('output',[data]);

//                     sendStatus({
//                         message : 'message sent',
//                         clear : true
//                     });


//                 });
//             }
//         });

//         socket.on('clear', function(){
//             chat.remove({},function(){
//                 socket.emit('cleared');
//             })
//         });

//     });
// })

// http.listen(3000);

// // app.get('/', function(req,res){
// //     res.sendFile(__dirname+'/views/index.html');
// // });

// // io.sockets.on('connection', function(socket){
// //     connections.push(socket);
// //     console.log('connected to %s sockets',connections.length);

// //     connections.splice(connections.indexOf(socket),1);
// //     console.log(" ")
// // });




