const express = require('express');
const request = require('request');

let app = express();
app.use(express.static(__dirname + '/public'))
    .use(express.urlencoded({ extended: true }))
    .use(express.json());
    

require('./routes/htmlRoutes')(app);
require('./routes/api_routes/auth')(app);
require('./routes/api_routes/add_playlists')(app);
require('./routes/api_routes/device')(app);

console.log('Listening on 8888');
app.listen(8888);

