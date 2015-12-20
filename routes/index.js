
/**
 * Routes
 *
 */

//Load model
var files = require('../models/files');

exports.auth = function(req, res){
    var url = files.auth.generateAuthUrl({
        access_type: 'online',
        scope: files.scopes
    });
    
    res.redirect(url);
};

exports.auth_return = function(req, res){
    if ( !req.query.code ) {
        res.status(500).send('Authorization failed.');
        return;
    }
    
    var authorizationCode = req.query.code;
    files.getNewToken(authorizationCode, function(){
        res.redirect('/');
    });
};

exports.index = function(req, res){
    var authorised = files.isAuthorised();
    
    if ( authorised ) {
        files.getList('root', function(files){
            res.render('index', {
                authorised: true,
                folderId: 'root',
                files: files
            });
        });
    }
    else {
        res.render('index', { authorised: false });
    }
};

exports.folders = function(req, res){
    var authorised = files.isAuthorised();
    if ( !authorised )
        res.redirect('/');
    
    var folderId = req.params.folderId
        ? req.params.folderId
        : 'root';
    
    files.getList(folderId, function(files){
        res.render('index', {
            authorised: true,
            folderId: folderId,
            files: files
        });
    });
};

exports.logout = function(req, res){
    files.auth.setCredentials({});
    res.redirect('/');
    //res.redirect('https://accounts.google.com/logout');
};
