// Gets songs in the two playlists user selects.
 
const request = require('request');

module.exports = (app) => {
    app.post('/queue', async (req, res) => {
        let playlistData = req.body.playlists;
        let access_token = req.body.access_token;
        let allTracks = await getTracks(playlistData[0], playlistData[1], access_token);
        console.log("allTracks", allTracks);
    })
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

async function getTrackList(access_token) {
    let [playlist_1, playlist_2] = await getUserPlaylists(access_token);
    let tracks = await getTracks(playlist_1, playlist_2, access_token);
    return tracks;
}
