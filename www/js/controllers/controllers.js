app.controller('mainController', ['$scope', '$http', 'MyService', '$location', '$window', '$rootScope', function($scope, $http, MyService, $location, $window, $rootScope){


  $scope.view = {};
  $scope.view.checkmessage = function(id){
    console.log('hi im checkmessage');
    MyService.messageRooms(id).then(function(data){
      $rootScope.room = data.data[0]['roomname'];
    })
  }
    MyService.findUsers().then(function (data){
      $scope.view.users = data.data;
      var usersobjs = $scope.view.users;
      var mybands = $scope.view.mylistbands;
      comparebands();
      function comparebands(){
        for (var i = 0; i < mybands.length; i++) {
          for (var j = 0; j < usersobjs.length; j++) {
            var usersbandslist = usersobjs[j]['bandlist']
            for (var k = 0; k < usersbandslist.length; k++) {
              if (mybands[i] == usersbandslist[k]) {
                usersobjs[j]['count']++;
                // console.log('hey match!!', usersobjs[j]['username'], usersobjs[j]['count'], usersbandslist[k]);
              }
            }
          }
        }
        // console.log($scope.view.users);
      }
      // console.log($scope.view.users);
    })
  $scope.view.grabchatusername = function(userid){
    // console.log($rootScope.user.id, userid);
    MyService.makeRoom($rootScope.user.id, userid).then(function(data){
      $rootScope.room = data.data;
      console.log($rootScope.room)
    })
    $location.path('/chat');
  }
  $scope.view.sendmsg = function(){
    console.log($rootScope.room);
    var socket=io();
     $('#chatting').submit(function(){
       socket.emit('chat message', {userschat: $rootScope.room, msg: $('#m').val()});
       $('#m').val('');
       return false;
     });
     socket.on('new_msg', function(msg){
       console.log('hi')
       $('#messages').append($('<li>').text(msg))
     })
  }
  $scope.view.userlat = localStorage.lat;
  $scope.view.userlong = localStorage.long;


  MyService.myBands().then(function(data){

    $scope.view.mylistbands = data.data;
  })

  $scope.view.addmyband = function(id){
    MyService.findBands(id, $scope.view.myband).then(function(data){
      $scope.view.bands = data.data;
    })
  }

  $scope.view.logIn = function() {
    MyService.logIn($scope.view.username, $scope.view.password).then(function (res) {
      if(res.data.errors){
        $scope.view.error = res.data.errors;
      }
      else{
        localStorage.jwt = res.data.token;
        $location.path('/landing');
        $window.location.reload();
      }
    });
  }

  $scope.view.signup = function(){
    MyService.signup($scope.view.usernamesignup, $scope.view.passwordsignup, $scope.view.userlat, $scope.view.userlong).then(function(res){
      if(res.data.errors){
        $scope.view.error = res.data.errors;
      } else {
        localStorage.jwt = res.data.token;
        $location.path('/landing');
        $window.location.reload();
      }
    })
  }
  $scope.view.logout = function() {
    console.log('hi please work');
    localStorage.clear();
    $location.path('/');
    $window.location.reload();
  }
}]);
