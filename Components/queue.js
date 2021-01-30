
const request = require('request');
const shuffle = require('./shuffle');

// Takes two arrays of tracks and creates a big shuffled list out of them.
// In final queue: A song from one playlist is followed by a song from the other playlist.
function createQueue(tracks) {
    let queue = [];
    let [playlist_1, playlist_2] =[tracks[0], tracks[1]];
    let length;
    playlist_1.length < playlist_2.length ? length = playlist_1.length : length = playlist_2.length;
    [playlist_1, playlist_2] = [shuffle(playlist_1), shuffle(playlist_2)];
    for (let i = 0; i < length; i++) {
        queue.push(playlist_1[i]);
        queue.push(playlist_2[i]);
    }
    return queue;
}

function addToQueue(queue, token) {
    let options = {
        url: '',
        headers: { 'Authorization': 'Bearer ' + token },
        json: true
    };
    // Figure out a way to add to queue in parallel while maintaining order. 
    for (let i = 0; i < queue.length; i++) {
        let track = queue[i];
        options.url = `https://api.spotify.com/v1/me/player/queue?uri=${track}`;
        request.post(options, function(error, response, body) {
            
        })
    }
}

module.exports = {
    createQueue: createQueue, 
    addToQueue: addToQueue
}

