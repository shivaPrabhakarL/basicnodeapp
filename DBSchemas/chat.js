const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chatSchema = mongoose.Schema({
    message: {
        type:String,
    },
    sender: {
        type: String ,
       ref: 'User'
    },
   
}, {timestamps: true});



const Chat = module.exports = mongoose.model('Chat', chatSchema);

module.exports.insert = function(chat,callback){
    let  newChat = new Chat(chat);
    newChat.save(callback);
}