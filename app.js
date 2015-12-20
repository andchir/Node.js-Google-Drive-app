
/**
 * Application - Google Drive listing
 */
/** Define API settings */
var GOOGLE_CLIENT_ID = '561323866387-5b3j02fhq5ktfa6inhbrje534u0sm9bb.apps.googleusercontent.com',
    GOOGLE_CLIENT_SECRET = '1gyR6RLwVAnXiFXH8yDJsSuk',
    REDIRECT_URL = 'http://127.0.0.1:3000/auth/google/return';

var express = require('express'),
    DriveLib = require('./libs/drive');

var app = express(),
    driveLib = new DriveLib(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, REDIRECT_URL);

/**
 * Configuration
 */
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.static(__dirname + '/public'));

/**
 * Routes
 */
app.get('/', driveLib.routes.index);
app.get('/auth/google', driveLib.routes.auth);
app.get('/auth/google/return', driveLib.routes.auth_return);
app.get('/folders/:folderId', driveLib.routes.folders);
app.get('/logout', driveLib.routes.logout);

/**
 * Start server
 */
var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;
    
    console.log('App listening at http://%s:%s', host, port);
});
