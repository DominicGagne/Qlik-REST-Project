//several endpoints to be used by our API, some of which are protected (ie, '/protected').
//Such proctected enpoints require a user to be authenticated via our 
//local strategy in order to gain access to those routes.

var endpointsAPI  = function(app, database, rootDir) {
         
    app.get('/', function (req, res) {
        res.sendFile(rootDir + '../Public/index.html');
    });   

    app.post('/message', function(req, res) {
        console.log(req.body);
        if(! req.body.username || ! req.body.message) {
            res.status(400).send("Badly formatted request. Missing username or message.");
        } else {
            //request is properly formatted and contains all required info.
            console.log("username: ", req.body.username, " message: ", req.body.message);
            database.insertOrUpdate("INSERT INTO Message (UserID, Contents) VALUES ((SELECT UserID FROM User WHERE Username = ?),?)", [req.body.username, req.body.message], function(err, insertID) {
                //console.log("Err: ", err, " insertID: ", insertID);
                if(err) {
                    console.log("User does not yet exist.");
                    addNewUser(req.body.username, req.body.message);
                } else {
                    console.log("User existed, success.");
                }
                res.status(200).send();
            });
        }
    }); 

    function addNewUser(username, message) {
        
    }
};

//allow this entire file  to be exported to application.js 
module.exports = endpointsAPI;
