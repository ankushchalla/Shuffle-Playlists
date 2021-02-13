
const path = require('path');

// You must specify absolute, not relative paths, when sending files. 
module.exports = (app) => {
    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, '../public/home.html'))
    });

    app.get('/playlists', (req, res) => {
        // playlists.html is where the user selects playlists and sends them to the server. See scripts/playlists.js
        res.sendFile(path.join(__dirname, '../public/playlists.html'));
    });

    app.get('/device', (req, res) => {
        res.sendFile(path.join(__dirname, '../public/device.html'));
    });

}
