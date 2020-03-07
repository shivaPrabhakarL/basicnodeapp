//const {main} = require('../controllers/MainControler');
const {app}  = require('../index');
const {loginVerification} = require('../controllers/formControler');
const {dbConnect} = require('../config/database');
const {chatcontroler} = require('../controllers/chatcontroler');
const req = require('supertest');
const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.resolve(__dirname,'../views/loginf.ejs'),'utf8');
const indexhtml = fs.readFileSync(path.resolve(__dirname,'../views/index.ejs'),'utf8');

jest.dontMock('fs');

beforeAll(()=>{
   dbConnect();

 });

 test('Login Verification',function(){
    loginVerification("prabha_79","prabha_7",function(err,data){
        expect(data.name).toBe('shivai7sdfg');
    });
 });

 test('Login get url',async function(){
      var res = await req(app).get('/login');
      expect(res.text).toBe(html);
 });

 test('Login post url',async function(){
   var res = await req(app).post('/login')
   .send({logusername: 'prabha_79',logpassword:'prabha_7'});
   
expect(res.text).toBe("Found. Redirecting to /chat");
});

 

 test('Register get url', async function(){
    var res = await req(app).get('/register');
    expect(res.text).toBe(indexhtml);
 });



 test('Register post url', function(){
  
   setTimeout(async () => {
      var res = await  req(app).post('/register')
      .send({name: 'shiva prasad',email:'prasad7@gmail.com',usernmae:'prasad_7',password:'prasad-7',password2:'prasad-7'});    
      expect(res.text).toBe(html);
   },6000);
   
 });

 
//  beforeEach(async function(){
//       var res = await req(app).post('/login')
//       .send({logusername: 'prabha_79',logpassword:'prabha_7'});
//       var token;
//       loginVerification("prabha_79","prabha_7",function(err,data){
//          token = data.token;
//       });
//       Object.defineProperty(window.document, 'cookie', {
//          writable: true,
//          value: 'w_auth='+token,
//      });
//       res.send();
//      // expect(res.text).toBe("Found. Redirecting to /chat");
//  });

//  test('Chat get url',async function(){
//     var data1 ;
    
//    var res = await req(app).get('/chat');
//    expect(res.text).toBe(chatHtml);
 
// });


// it('should save cookies', function(done) {
//    loginVerification("prabha_79","prabha_7",function(err,data){
//       expect(data.name).toBe('shivai7sdfg');
//    agent
//    .get('/login')
//    .expect('set-cookie', 'express.sid=s%3A7JgHgkXGUdI324IyR7vQVFru1y-Ik5MK.g5d2Pn2Thf5bGZFRDN%2BGC93bCGwQhS0adtyXQQdPyy8; Path=/', done);
//  });
// });
