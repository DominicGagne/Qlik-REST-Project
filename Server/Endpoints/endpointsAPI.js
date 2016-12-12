//several endpoints to be used by our API, some of which are protected (ie, '/protected').
//Such proctected enpoints require a user to be authenticated via our 
//local strategy in order to gain access to those routes.

var endpointsAPI  = function(app, database, rootDir) {
         
    app.get('/', function (req, res) {
        res.sendFile(rootDir + '../Public/index.html');
    });   


    /**
     * [API endpoint for POST /message.]
     * Params: Body must contain two strings, 'username' and 'message'.
     * @return {[HTTP 200 on success, HTTP 400 on bad fields, HTTP 503 on database failure.]}
     */
    app.post('/message', function (req, res) {
        if(! req.body.username || ! req.body.message) {
            return res.status(400).send("Badly formatted request. Missing username or message.");
        } else {
            //request is properly formatted and contains all required info, insert to database.
            database.insertOrUpdate("INSERT INTO Message (UserID, Contents) VALUES ((SELECT UserID FROM User WHERE Username = ?),?)", [req.body.username, req.body.message], onMessageCallback);
        }  

        /**
        * [Callback function for initial message insert.]
        * Params: Error flag from database, insertID of successfully inserted message.
        * @return {[HTTP 200 on success.]}
        */
        function onMessageCallback(err, insertID) {
            if(err) {
                console.log("User does not yet exist.");
                database.insertOrUpdate("INSERT INTO User (Username) VALUES (?)", [req.body.username], onNewUserCallback);
            } else {
                console.log("User existed, success.");
                return res.status(200).send();
            }
        }

        /**
        * [Callback function for new user insert.]
        * Params: Error flag from database, insertID of successfully inserted User.
        * @return {[HTTP 503 on database failure.]}
        */
        function onNewUserCallback(err, insertID) {
            if(err) {
                return res.status(503).send("Unable to insert new user information.");
            } else {
                database.insertOrUpdate("INSERT INTO Message (UserID, Contents) VALUES (?,?)", [insertID, req.body.message], onNewUserMessageInsert);
            }
        }

        /**
        * [Callback function for message insert after a user has been created. TODO: is this function now redundant?]
        * Params: Error flag from database, insertID of successfilly inserted message.
        * @return {[HTTP 200 on success, HTTP 503 on database failure.]}
        */
        function onNewUserMessageInsert(err, insertID) {
            if(err) {
                return res.status(503).send("Unable to insert new user message.");
            } else {
                return res.status(200).send();
            }
        }
    });



    
};

//allow this entire module to be exported to application.js 
module.exports = endpointsAPI;
