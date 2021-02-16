const fs = require('fs');
// Module that gets authorization token needed for Spotify API calls. 
const client_id = 'f8c1c68915eb4329be5b05bf7c7c61d4'; 

//Poor man's devlopement enviroment.
if (fs.existsSync('client_secret.txt')) {
    client_secret = fs.readFileSync('client_secret.txt', 'utf-8');
}
else {
    client_secret = process.env.CLIENT_SECRET;
}
const redirect_uri = process.env.CALLBACK || 'http://localhost:8888/callback';

const request = require('request'); // "Request" library
const querystring = require('querystring');

module.exports = (app) => {
    app.get('/login', function (req, res) {
        let queries = querystring.stringify({
            'client_id': client_id,
            'response_type': 'code',
            // The user is redirected to the below URI after granting/denying permission.
            'redirect_uri': redirect_uri,
            'scope': 'user-modify-playback-state playlist-read-private user-read-playback-state user-read-private'
        });
        res.redirect('https://accounts.spotify.com/authorize?' + queries);
    });

    app.get('/callback', function (req, res) {
        // The redirect's request is the previous call's response! We get the code returned by Spotify's
        // API in the previous call.
        let code = req.query.code;

        let authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            form: {
                code: code,
                // No actual redirection happening. Compares to uri given at code request for validation. 
                redirect_uri: redirect_uri,
                grant_type: 'authorization_code',
                client_id: client_id,
                client_secret: client_secret
            },
            json: true
        };

        request.post(authOptions, function (error, response, body) {
            // We now have the access token needed to make calls to the Spotify API.
            // Serve token to browser along with a choose-playlists page. See routes/htmlRoutes.js.
            res.redirect('/playlists/?' +
                querystring.stringify({
                    access_token: body.access_token
                })
            );
        });

    });
};


