const {dbConnect} = require('../config/database');
const {fromcontroler} = require('../controllers/formControler');
const {chatcontroler} = require('../controllers/chatcontroler');

module.exports = function(app){
    dbConnect();
    fromcontroler(app);
    chatcontroler(app);
}