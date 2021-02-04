const express = require('express');
const cors = require('cors');
const request = require('request');

let app = express();
app.use(express.static(__dirname + '/public'))
    .use(cors())
    .use(express.urlencoded({ extended: true }))
    .use(express.json());
    

require('./Components/htmlRoutes')(app);
require('./Components/auth')(app);
require('./Components/get_playlists')(app);

console.log('Listening on 8888');
app.listen(8888);

