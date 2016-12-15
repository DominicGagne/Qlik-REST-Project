var QlikAudition = angular.module('QlikAudition.controllers',[])

.controller('WelcomeCtrl',function($scope, $http, $route, $location, $mdDialog, $mdMedia, UsernameService) {

    $scope.username = '';
    $scope.selectedIndex = 0;
    $scope.messages = [];
    $scope.highlightedMsg = -1;

    $scope.submitUsername = function() {
        $scope.selectedIndex++;
    }

    $scope.submitMessage = function() {
        if($scope.message && $scope.message.length) {
            $http.post('/messages', {"username":$scope.username, "message":$scope.message}).then(postMessageSuccess, postMessageFail);
            //reset message so they may make more.
            $scope.message = '';
        }
    }

    $scope.getMessages = function() {
        $http.get('/messages').then(getMessagesSuccess, getMessagesFail);
    }

    $scope.deleteMessage = function(messageID) {
        $http.delete('/messages/' + messageID).then(messageDeleteSuccess, messageDeleteFail);
        $scope.highlightedMsg = -1;
    }

    $scope.moreInfo = function(index) {
        $scope.highlightedMsg = index;
    }

    function postMessageSuccess(serverResponse) {
        console.log("success");
        //again, calling $scope function from controller
        //a little weird, but better than having two
        //functions that do the same thing.
        $scope.highlightedMsg = -1;
        $scope.getMessages();
    }

    function postMessageFail(serverResponse) {
        //TODO: handle this error. mddialog?
        console.log("fail");
    }

    function messageDeleteSuccess(serverResponse) {
        console.log("success.");
        $scope.getMessages();
    }

    function messageDeleteFail(serverResponse) {
        //TODO: handle this more appropriately.
        console.log("fail.");
    }
    
    function getMessagesSuccess(serverResponse) {
        console.log("success.");
        $scope.messages = serverResponse.data;
        console.log("messages: ", $scope.messages);
    }

    function getMessagesFail(serverResponse) {
        //TODO: handle this error.
        console.log("failure.");
    }

    function init() {
        //unwieldly to call a $scope function from the controller,
        //but we will make an exception for the init.
        $scope.getMessages();
    }

    init();
});

