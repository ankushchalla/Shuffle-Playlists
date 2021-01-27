// Module that gets authorization token needed for Spotify API calls. 

const client_id = 'f8c1c68915eb4329be5b05bf7c7c61d4'; // Your client id
const client_secret = '41517c14f1314f9d9eae45ffbf789edb'; // Your secret
const redirect_uri = 'http://localhost:8888/callback'; // Your redirect uri

const request = require('request'); // "Request" library
const querystring = require('querystring');

function getToken(app, scope) {
    return new Promise((resolve) => {
        app.get('/login', function (req, res) {
            let queries = querystring.stringify({
                'client_id': client_id,
                'response_type': 'code',
                // The user is redirected to the below URI after granting/denying permission.
                'redirect_uri': redirect_uri,
                'scope': scope
            });
            res.redirect('https://accounts.spotify.com/authorize?' + queries);
        })

        app.get('/callback', function (req, res) {
            // The redirect's request is the previous call's response! We get the code returned by Spotify's
            // API in the previous call.
            let code = req.query.code;

            let authOptions = {
                url: 'https://accounts.spotify.com/api/token',
                form: {
                    code: code,
                    redirect_uri: redirect_uri,
                    grant_type: 'authorization_code',
                    client_id: client_id,
                    client_secret: client_secret
                },
                json: true
            }

            request.post(authOptions, function (error, response, body) {
                // We finally have the access token needed to make calls to the Spotify API.
                let token = body.access_token;
                resolve(token);
            });
        });
    });
}

module.exports = getToken;