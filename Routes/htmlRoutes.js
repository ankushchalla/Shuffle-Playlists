
const path = require('path');


module.exports = (app) => {
    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, '../public/home.html'))
    })

    app.get('/playlists', (req, res) => {
        res.sendFile(path.join(__dirname, '../public/playlists.html'));
    })

}