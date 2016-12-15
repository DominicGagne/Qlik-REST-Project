QlikAudition.service('UsernameService', function(){
   
    var username = null;

    this.getUsername = function() {
    	return username;
    };

    this.setUsername = function(nameToSet) {
    	username = nameToSet;
    };
});