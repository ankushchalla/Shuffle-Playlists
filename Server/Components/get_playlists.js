// Gets songs in the two playlists user selects.
 
const request = require('request');

// Get names and track references of user playlists. 
function getUserPlaylists(token) {
    return new Promise((resolve) => {
        let options = {
            url: 'https://api.spotify.com/v1/me/playlists',
            headers: { 'Authorization': 'Bearer ' + token },
            json: true
        };
        request.get(options, function (req, res) {
            let allPlaylists = res.body.items.map(playlist => {
                return {
                    name: playlist.name,
                    tracks: playlist.tracks.href
                };
            })
            // Returning first two playlists just for server-side developing.
            // Actual application will return user selected playlists.
            resolve([allPlaylists[1], allPlaylists[2]])
        })
    })
}

function getTracks(playlist_1, playlist_2, token) {
    let options_1 = {
        url: playlist_1.tracks,
        headers: { 'Authorization': 'Bearer ' + token },
        json: true
    };
    let options_2 = {
        url: playlist_2.tracks,
        headers: { 'Authorization': 'Bearer ' + token },
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

async function getTrackList(token) {
    let [playlist_1, playlist_2] = await getUserPlaylists(token);
    let tracks = await getTracks(playlist_1, playlist_2, token);
    return tracks;
}

module.exports = getTrackList;