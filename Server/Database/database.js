var databaseModule = function(mysql) {

    process.stdout.write("Initializing Database Module...");

    var self = this;

    var fs = require('fs'), ini = require('ini');

    //parse our databse configuration file.
    var config = ini.parse(fs.readFileSync('./Config/config.ini', 'utf-8'));
    
    //config object for the database.
    var connection = mysql.createConnection({
        host: config.database.host,
        database: config.database.database,
        user: config.database.user,
        password: config.database.password,
    });  

    /**
     * [Acquires a connection to the database.'connection' object will be able to interact with
     * the database if this function succeeds.]
     * Params: None.
     * @return {[None.]}
     */
    self.acquireConnection = function() {
        connection.connect(function(err) {
            if(err) {
                console.log("Could not connect to database, exiting.");
                process.exit(0);
            }
        });    
    };

    /**
     * [Fetches all rows matching a particular query.]
     * Params: Query string for the database, array of arguments for the database, callback function.
     * @return {[An array containing the matched records]} 
     */
    self.fetchAll = function(queryString, args, callback) {
        connection.query(queryString, args, function(err, rows, fields) {
            if(err) {
                callback(err, null);
            } else {
                callback(false, rows);
            }
        });
    };

    /**
     * [Fetches the first row matching a particular query.]
     * Params: Query string for the database, array of arguments for the database, callback function.
     * @return {[An array containing the matched records on success, null on failure.]} 
     */
    self.fetchFirst = function(queryString, args, callback) {
        connection.query(queryString, args, function(err, rows, fields) {
            if(err) {
                callback(err, null);
            } else {
                //success
                callback(false, rows[0]);
            }
        });
    };

    /**
     * [Performs an insert or update on the database.]
     * Params: Query string for the database, array of arguments for the database, callback function.
     * @return {[InsertID of inserted or updated row on success, null on failure.]} 
     */
    self.insertOrUpdate = function(queryString, args, callback) {
        connection.query(queryString, args, function(err, rows, fields) {
            if(err) {
                //throw error, callback will see insert or update failed.
                callback(err, null);
            } else {
                //no error, do not set error flag.
                callback(false, rows.insertId);
            }
        });
    };


    console.log("done.");
};


//allow functions in this module to be accessible from other files in this codebase.
module.exports = databaseModule;

