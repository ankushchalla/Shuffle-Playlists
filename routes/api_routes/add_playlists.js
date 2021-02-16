
// The main route basically ends here.
// Gets songs in the two playlists user selects.
 
const request = require('request');
const {createQueue, addToQueue} = require('../../Components/queue');

module.exports = (app) => {
    // Uses playlist data to add songs to queue of user. See queue.js for queue-creating details.
    app.post('/add_playlists', async (req, res) => {
        let {playlists, length, access_token, deviceId} = req.body;
        let allTracks = await getTracks(playlists[0], playlists[1], access_token);
        let queue = createQueue(allTracks, length);
        let status = await addToQueue(queue, access_token, deviceId);
        res.sendStatus(status);
    });
}

// Returns two arrays containing track_uri's of inputted playlists respectively. 
function getTracks(playlist_1, playlist_2, access_token) {
    let options_1 = {
        url: playlist_1.tracks,
        headers: { 'Authorization': 'Bearer ' + access_token },
        json: true
    };
    let options_2 = {
        url: playlist_2.tracks,
        headers: { 'Authorization': 'Bearer ' + access_token },
        json: true
    };
    let promise_1 = new Promise(resolve => {
        request.get(options_1, function (req, res) {
            let track_uris = res.body.items.map(trackObject => {
                return trackObject.track.uri;
            });
            resolve(track_uris);
        })
    });
    let promise_2 = new Promise(resolve => {
        request.get(options_2, function (req, res) {
            let track_uris = res.body.items.map(trackObject => {
                return trackObject.track.uri;
            });
            resolve(track_uris);
        })
    });
    return Promise.all([promise_1, promise_2]);
}

