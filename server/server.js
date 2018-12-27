const express = require('express');
const app = express();
const project_root = {root: '..'};

app.get('/pages/:title', (req, res) => {
    res.sendFile('pages/'+req.params.title, project_root);
})

app.get('/js/:file', (req, res) => {
    res.sendFile('client/js/'+req.params.file, project_root);
})

app.listen('3000');

console.log('http://localhost:3000');