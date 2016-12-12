var palindromeModule  = function() {
    var self = this;
    
    /**
    * [Function to determine whether or not a given string is a palindrome.]
    * Params: The string to be tested.
    * @return {[True if string is palindrome, false if it is not.]}
    */
    self.isPalindrome = function(stringToTest) {
        var len = stringToTest.length;
        for(var i = 0; i < len; i++) {
            if(stringToTest[i] != stringToTest[len - (i+1)]) {
                //no palindrome here.
                return false;
            }
        }
        //it is a palindrome.
        return true;
    };
};

//allow this entire module to be exported to other modules
module.exports = palindromeModule;
