const {dbConnect} = require('../config/database');
const {fromcontroler} = require('../controllers/formControler');
const {chatcontroler} = require('../controllers/chatcontroler');
const {promControler} = require('./prometheus-ex');
module.exports = function(app){
    dbConnect();
    fromcontroler(app);
    chatcontroler(app);
    promControler(app);
}