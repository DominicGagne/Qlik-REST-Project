//several endpoints to be used by our API, some of which are protected (ie, '/protected').
//Such proctected enpoints require a user to be authenticated via our 
//local strategy in order to gain access to those routes.

var endpointsAPI  = function(app, database, rootDir) {

    var path = require('path');

    var palindromeFile = require('../HelperModules/palindromeModule.js');
    var palindromeModule = new palindromeFile();
         
    app.get('/', function (req, res) {
        res.sendFile(path.resolve('./Public/www/index.html'));
    });   


    /**
     * [API endpoint for POST /messages.]
     * Params: Body must contain two strings, 'username' and 'message'.
     * @return {[HTTP 200 on success, HTTP 400 on bad fields, HTTP 503 on database failure.]}
     */
    app.post('/messages', function (req, res) {
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
                //User does not yet exist.
                database.insertOrUpdate("INSERT INTO User (Username) VALUES (?)", [req.body.username], onNewUserCallback);
            } else {
                //User existed, success.
                res.json({"msgID":insertID});
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
        * Params: Error flag from database, insertID of successfully inserted message.
        * @return {[HTTP 200 on success, HTTP 503 on database failure.]}
        */
        function onNewUserMessageInsert(err, insertID) {
            if(err) {
                return res.status(503).send("Unable to insert new user message.");
            } else {
                res.json({"msgID":insertID});
                return res.status(200).send();
            }
        }
    });


    /**
     * [API endpoint for GET /messages.]
     * Params: None.
     * @return {[HTTP 200 on success, along with array of all message objects. HTTP 503 on database failure.]}
     */
    app.get('/messages', function (req, res) {
        database.fetchAll("SELECT Message.MessageID, Message.Contents AS Msg, Message.UpdateTime AS Time, User.Username AS Author FROM Message INNER JOIN User ON Message.UserID = User.UserID", [], onAllMessages);
    
        /**
        * [Callback function for retrieval of all messages in the database.]
        * Params: Error flag from database, array of all messages in the database.
        * @return {[HTTP 200 on success, HTTP 503 on database failure.]}
        */
        function onAllMessages(err, allMessages) {
            if(err) {
                return res.status(503).send("Unable to retrieve messages from database.");
            } else {
                return res.status(200).send(allMessages);
            }
        }
    });


    /**
     * [API endpoint for DELETE /messages.]
     * Params: The MessageID of the message to delete.
     * @return {[HTTP 200 on success, HTTP 400 on badly submitted MessageID, and HTTP 404 on no MessageID found.]}
     */
    app.delete('/messages/:messageID', function (req, res) {
        //regex to match a string that only contains digits. Will immediately filter out bad/malicious input.
        if(req.params.messageID.match(/^([0-9]+)$/)) {
            database.delete("DELETE FROM Message WHERE MessageID = ?", [req.params.messageID], onDeleteCallback);
        } else {
            //badly formed request.
            return res.status(400).send();
        }

        /**
        * [Callback function for confirmation of message deletion success.]
        * Params: Error flag from database, number of rows affected by query.
        * @return {[HTTP 200 on success, HTTP 404 on no MessageID found.]}
        */
        function onDeleteCallback(err, rowsAffected) {
            if(rowsAffected > 0) {
                return res.status(200).send();
            } else {
                return res.status(404).send("Could not find a message with that MessageID");
            }
        }
    });


    /**
     * [API endpoint for GET /messages/messageID/palindrome.]
     * Params: The MessageID of the message to evaluate as a palindrome.
     * @return {[HTTP 200 on success, HTTP 400 on badly submitted MessageID, and HTTP 404 on no MessageID found.]}
     */
    app.get('/messages/:messageID/palindrome', function(req, res) {
        //regex to match a string that only contains digits. Will immediately filter out bad/malicious input.
        if(req.params.messageID.match(/^([0-9]+)$/)) {
            database.fetchFirst("SELECT * FROM Message WHERE MessageID = ?", [req.params.messageID], messageFetchCallback);
        } else {
            //badly formed request.
            return res.status(400).send();
        }

        /**
        * [Callback function for confirmation of message retrieval.]
        * Params: Error flag from database, the contents of the record fetched.
        * @return {[HTTP 200 on success, HTTP 404 on no MessageID found.]}
        */
        function messageFetchCallback(err, messageRecord) {
            if(err || ! messageRecord) {
                return res.status(404).send("Could not find a message with that MessageID.");
            } else {
                return res.status(200).send(palindromeModule.isPalindrome(messageRecord.Contents));
            }
        }
    });

    
};

//allow this entire module to be exported to application.js 
module.exports = endpointsAPI;
