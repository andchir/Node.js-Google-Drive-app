
/**
 * Application - Google Drive listing
 */

var express = require('express'),
    routes = require(__dirname + '/routes');

var app = express();

/**
 * Configuration
 */
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.static(__dirname + '/public'));

/**
 * Routes
 */
app.get('/', routes.index);
app.get('/auth/google', routes.auth);
app.get('/auth/google/return', routes.auth_return);
app.get('/folders/:folderId', routes.folders);
app.get('/logout', routes.logout);

/**
 * Start server
 */
var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;
    
    console.log('App listening at http://%s:%s', host, port);
});
