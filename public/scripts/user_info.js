// This module contains methods used in scripts/playlists.js.
// Methods below get user device id and relevant playlist data.

// Some API calls only work if the user has a Spotify premium account.
function isPremium(access_token) {
    console.log("token", access_token);
    return new Promise(resolve => {
        let options = {
            method: "GET",
            url: 'https://api.spotify.com/v1/me',
            headers: { 'Authorization': 'Bearer ' + access_token },
            json: true
        };
        $.ajax(options).then(function (response) {
            resolve(response.product === "premium");
        });
    });
}

// Gets device id of user's current active device. The device id will be needed to add
// songs to the queue of a user's device.
function getDeviceId(access_token) {
    return new Promise((resolve, reject) => {
        let options = {
            method: "GET",
            url: 'https://api.spotify.com/v1/me/player/devices',
            headers: { 'Authorization': 'Bearer ' + access_token },
            json: true
        };
        $.ajax(options).then(function (response) {
            let devices = response.devices;
            if (devices.length == 1) {
                return resolve(devices[0].id)
            }
            else if (devices.length == 0) {
                reject(new ReferenceError("No devices found."));
            }
            for (let i = 0; i < devices.length; i++) {
                // active = playing...probably.
                if (devices[i].is_active) {
                    return resolve(devices[i].id);
                }
            }
        });
    });
}

// Returns array of objects, each object contains for each user playlist: Playlist name, href to playlist tracks,
// total number of songs in playlist.
function getUserPlaylists(access_token) {
    return new Promise((resolve, reject) => {
        let options = {
            method: "GET",
            url: 'https://api.spotify.com/v1/me/playlists?limit=50',
            headers: { 'Authorization': 'Bearer ' + access_token },
            json: true
        };
        $.ajax(options).then(function (res) {
            if (res.items.length === 0) reject(new RangeError("No playlists found."));
            let allPlaylists = res.items.map(playlist => {
                return {
                    name: playlist.name,
                    tracks: playlist.tracks.href, 
                    total: playlist.tracks.total
                };
            })
            resolve(allPlaylists);
        });
    });
}

export { isPremium, getDeviceId, getUserPlaylists };
