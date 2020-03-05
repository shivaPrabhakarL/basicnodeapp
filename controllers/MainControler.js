const db = require('../config/database');
const fromcontroler = require('../controllers/formControler');
const chatcontroler = require('../controllers/chatcontroler');

module.exports = function(app){
    db();
    fromcontroler(app);
    chatcontroler(app);
}