const express = require('express');
const cors = require('cors');

let app = express();
app.use(express.static(__dirname + '/public'))
    .use(cors());

require('./Routes/htmlRoutes')(app);
require('./Components/auth')(app);

console.log('Listening on 8888');
app.listen(8888);

