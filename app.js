const express = require('express');
const request = require('request');

let app = express();
let PORT = process.env.PORT || 8888;

app.use(express.static(__dirname + '/public'))
    .use(express.urlencoded({ extended: true }))
    .use(express.json());
    

require('./routes/html_routes')(app);
require('./routes/api_routes/auth')(app);
require('./routes/api_routes/add_playlists')(app);
require('./routes/api_routes/device')(app);
require('./routes/error_handling')(app);

console.log('Listening on ' + PORT);
app.listen(PORT);

