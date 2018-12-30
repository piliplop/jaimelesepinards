const express = require('express');
const app = express();
const project_root = { root: '..' };
const uuidv1 = require('uuidv1');

const { Client } = require('pg');
const db_client = new Client({
    user: 'jul',
    host: 'localhost',
    database: 'site_immulistes',
    password: 'yasuo',
    port: 5432,
});


db_client.connect();
// db_client.connect();

// db_client.query('SELECT * from test', (err, res) => {
//     console.log(err, res)
//     db_client.end()
// });


app.get('/pages/:title', (req, res) => {
    res.sendFile('client/pages/' + req.params.title + '.html', project_root);
});

app.get('/js/:file', (req, res) => {
    res.sendFile('client/js/' + req.params.file, project_root);
});

app.get('/submit', (req, res) => {
    const params = req.query;
    console.log(params);

    // todo: change id, treat sql injections
    const query = `insert into commandes values ('${uuidv1()}', '${params.date_choice}', '${params.time_choice}', '${params.adress_choice}', '${params.additionnal_informations}', '${params.sos_choice}')`;
    // console.log(query);
    db_client.query(query, (err, res) => {
        if (err) console.log(err);
        // db_client.end();
    })
    res.end();
})



app.listen('3000');

console.log('http://localhost:3000');