const path = require('path');

module.exports = (app) => {
    app.get('/error/:error_type', (req, res) => {
        if (req.params.error_type === "non_premium") {
            res.sendFile(path.join(__dirname, '../public/error_pages/non_premium.html'))
        }
    });
}