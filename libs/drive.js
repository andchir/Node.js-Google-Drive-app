
/**
 * Google Drive app library
 * 
 * @author Andchir andchir@gmail.com
 */
module.exports = function(client_id, client_secret, redirect_url) {
    
    var self = this;
    
    var google = require('googleapis'),
        OAuth2 = google.auth.OAuth2;
    
    this.auth = new OAuth2(client_id, client_secret, redirect_url);
    
    var SCOPES = [
            'https://www.googleapis.com/auth/drive.metadata.readonly'
        ],
        google = require('googleapis'),
        service_drive = google.drive({ version: 'v2', auth: self.auth });
    
    /**
     * Routes handlers
     */
    this.routes = {
        
        index: function(req, res){
            var authorised = self.isAuthorised();
            
            if ( authorised ) {
                self.getFilesList('root', function(files){
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
        },
        
        folders: function (req, res) {
            
            var authorised = self.isAuthorised();
            if ( !authorised )
                res.redirect('/');
            
            var folderId = req.params.folderId
                ? req.params.folderId
                : 'root';
                
            self.getFilesList(folderId, function(files){
                res.render('index', {
                    authorised: true,
                    folderId: folderId,
                    files: files
                });
            });
            
        },
        
        auth: function(req, res){
            
            var url = self.auth.generateAuthUrl({
                access_type: 'online',
                scope: SCOPES
            });
            
            res.redirect(url);
            
        },
        
        auth_return: function(req, res){
            
            if ( !req.query.code ) {
                res.status(500).send('Authorization failed.');
                return;
            }
            
            var authorizationCode = req.query.code;
            self.getNewToken(authorizationCode, function(){
                res.redirect('/');
            });
            
        },
        
        logout: function(req, res){
            self.auth.setCredentials({});
            res.redirect('/');
            //res.redirect('https://accounts.google.com/logout');
        }
        
    };
    
    /**
     * Check authorisation
     */
    this.isAuthorised = function(){
        return Object.keys(this.auth.credentials).length > 0;
    };
    
    /**
     * Get files list
     * 
     * @param {String} folderId
     * @param {Function} callback
     */
    this.getFilesList = function(folderId, callback){
        
        service_drive.files.list({
            auth: self.auth,
            q: "'" + folderId + "' in parents and trashed=false",
            orderBy: 'modifiedDate desc,title'
        }, function(err, response) {
            if (err) {
                return;
            }
            callback(response.items);
        });
        
    };
    
    /**
     * Get Service access token
     * 
     * @param {String} authorizationCode
     * @param {Function} callback
     */
    this.getNewToken = function( authorizationCode, callback ) {
        
        self.auth.getToken(authorizationCode, function(err, token) {
            if (err) {
                console.log('Error while trying to retrieve access token', err);
                return;
            }
            self.auth.credentials = token;
            callback();
        });
        
    };
    
};
