const express = require('express');
const app = express();

const port = process.env.PORT;

const sendFile = (res, path) => {
    res.sendFile(path, { root: __dirname + '/../..' });
}

app.get('/bundle.js', (req, res) => {
    sendFile(res, 'dist/bundle.js');
})

app.get('*', (req, res) => {
    sendFile(res, 'index.html');
})

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
