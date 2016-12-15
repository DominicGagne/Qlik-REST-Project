var QlikAudition = angular.module('QlikAudition', ['ngRoute', 'ngMaterial', 'QlikAudition.controllers'])

//function runs when app has been initialized and has started
.run(function(){
	console.log("Project has started.");
})

//Configuration function. Here we define which templates are 
//linked to which controllers.
.config(function($routeProvider, $locationProvider, $mdThemingProvider) {
	$routeProvider

	.when('/welcome', {
		templateUrl: "Public/www/templates/welcome.html",
		controller: "WelcomeCtrl"
	})

    //default catch-all
	.otherwise({
		redirectTo: '/welcome'
	});

	$locationProvider.html5Mode(false);

	var mainColourQlik = $mdThemingProvider.extendPalette('green', {
        '500': '#00802b',
        'contrastDefaultColor': 'light'
    });
    
    $mdThemingProvider.definePalette('qlikGreen', mainColourQlik);
    
    $mdThemingProvider.theme('default')
    .primaryPalette('qlikGreen');
});