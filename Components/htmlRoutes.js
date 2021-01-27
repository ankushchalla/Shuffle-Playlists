
const path = require('path');

module.exports = (app) => {
    app.get('/playlists', (req, res) => {
        res.sendFile(path.join(__dirname, '../public/playlists.html'));
    })
}