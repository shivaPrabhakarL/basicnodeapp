$(document).ready(function(){
    $('#su-form').on('submit', function(){

        var name = $('#name');
        var username = $('#username');
        var email = $('#email');
        var password = $('#password');
        var password2 = $('#password2');
        
        var userData = {name: name.val(), username: username.val(), email: email.val(), password: password.val(), password2: password2.val()};
        
  
        $.ajax({
          type: 'POST',
          url: '/register',
          data: userData,
          success: function(data){
            //do something with the data via front-end framework
            location.reload();
          }
        });
  
        return false;
  
    });


    $('#li-form').on('submit', function(){

        
        var username = $('#logusername');
        var password = $('#logpassword');
        
        var loginData = {user:{username: username.val(), password: password.val()}};
  
        $.ajax({
          type: 'POST',
          url: '/login',
          data: loginData,
          success: function(data){
            //do something with the data via front-end framework
            console.log("success");
          }
        });
  
        return false;
  
    });


});
