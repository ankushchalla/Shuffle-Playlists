const express = require('express'); 
const getToken = require('./Components/auth');
const getTrackList = require('./Components/get_playlists');
const {createQueue, addToQueue} = require('./Components/queue');


let app = express();
app.use(express.static(__dirname + '/public/'));

require('./Components/htmlRoutes')(app);

async function main() {
    let scope = 'user-modify-playback-state playlist-read-private';
    let token = await getToken(app, scope);
    let tracks = await getTrackList(token);
    let queue = createQueue(tracks);
    addToQueue(queue, token);
}

console.log('Listening on 8888');
app.listen(8888);

