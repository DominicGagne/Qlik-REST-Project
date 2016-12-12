//several endpoints to be used by our API, some of which are protected (ie, '/protected').
//Such proctected enpoints require a user to be authenticated via our 
//local strategy in order to gain access to those routes.

var endpointsAPI  = function(app, database, rootDir) {
         
    app.get('/', function (req, res) {
        res.sendFile(rootDir + '../Public/index.html');
    });   

    app.post('/register', function(req, res) {
        if(!req.body.username || !req.body.password) {
            res.status(400).send("Badly formatted request.");
        } else {
            //request is properly formatted and contains all required info.
            registerUser(res, req);
        }
    }); 
};
 
//allow this entire file  to be exported to application.js 
module.exports = endpointsAPI;
