/*
    Module gets device id of user's current active device.
*/


const request = require('request');
const querystring = require('querystring');

module.exports = (app) => {
    app.get('/device/:access_token', (req, res) => {
        let options = {
            method: "GET",
            url: 'https://api.spotify.com/v1/me/player/devices',
            headers: { 'Authorization': 'Bearer ' + req.params.access_token },
            json: true
        };
        request.get(options).on('response', function (response) {
            let devices = response.devices;
            for (let i = 0; i < devices.length; i++) {
                // active = chosen device. Doesn't have to be playing. If open but not chosen, active = false.
                if (devices[i].is_active) {
                    res.redirect('some url', querystring.stringify({
                        access_token: body.access_token,
                        id: devices[i].id
                    }));
                }
            }
        });
    })
    
}


