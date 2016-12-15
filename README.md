# Qlik Audition Project - REST API
***
## Implementation Architecture
The system is running a MEAN stack on Ubuntu 14.04.5, and is currently deployed to Amazon Web Services.
* **M**ySQL v5.7 is being used as the database to store records.
* **E**xpress v4.13.3 used with Node to manage the API routes.
* **A**ngular v1.5.3 is being used as the front end JS framework.
* **N**odeJS on the server.


The web app can be reached via public DNS:

**ec2-52-15-65-41.us-east-2.compute.amazonaws.com:3000**

## Deployment
To deploy on Ubuntu, make sure these presequisite conditions are met:

1. npm/node are installed
2. mysql ^5.7 is installed and running

If these conditions are satisfied, the project may be deployed using the following commands:

`git clone https://github.com/DominicGagne/Qlik-REST-Project.git`

*Note:* You'll need to create your own config file named 'config.ini' in the Server/Config directory in order to login to your database using your credentials.

Navigate to the working directory, and create the database:

`mysql -u root -p < databaseCreate.sql`

Install node_modules using the command:

`npm install`

The project is now ready to run! Type:

`node applications.js`

I had planned on using Docker to deploy this app, but ran short on time.  Perhaps in the future.

## Testing
I used Mocha and Supertest to test this API.  The testing script can be found at `Test/supertest.js`
The testing suite is comprised of 16 different tests, which are outlined below:

image here

## REST API Documentation

### POST /messages
Params: Body must contain two strings, 'username' and 'message'.
Return: HTTP 200 on success, HTTP 400 on bad fields, HTTP 503 on database failure.

### GET /messages
Params: None.
Return: HTTP 200 on success, along with array of all message objects. HTTP 503 on database failure.

### DELETE /messages/messageid
Params: The MessageID of the message to delete.
Return: HTTP 200 on success, HTTP 400 on badly submitted MessageID, and HTTP 404 on no MessageID found.

### GET /messages/messageid/palindrome
Params: The MessageID of the message to evaluate as a palindrome.
Return: HTTP 200 on success, HTTP 400 on badly submitted MessageID, and HTTP 404 on no MessageID found.

