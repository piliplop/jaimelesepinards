const express = require("express");
const app = express();
const project_root = { root: "." };
const uuidv1 = require("uuidv1");

const { Client } = require("pg");
const db_client = new Client({
  user: "jul",
  host: "localhost",
  database: "site_immulistes",
  password: "yasuo",
  port: 5432
});

db_client.connect();

// db_client.query('SELECT * from test', (err, res) => {
//     console.log(err, res)
//     db_client.end()
// });

//redirect to the command page
app.get("/pages", (req, res) => {
  res.redirect("/pages/commande");
});

app.get("/", (req, res) => {
  res.redirect("/pages/commande");
});

app.get("/pages/suivi/:token", (req, res) => {
  db_client.query(
    `select * from commandes where id like '${req.params.token}'`,
    (err, quer_res) => {
      if (err) console.error(err);
      else console.log(quer_res.rows);
      res.render("suivi.ejs", { rows: quer_res.rows[0] });
    }
  );
});

// todo?: take care of each page separately to allow creating admin views
// app.get("/pages/:title", (req, res) => {
//   // res.sendFile('client/pages/' + req.params.title + '.html', project_root);
//   res.render(req.params.title + ".ejs");
// });

app.get('/pages/commande', (req, res) => {
  res.render('commande.ejs');
})

app.get('/pages/admin', (req, res) => {
  res.redirect('/pages/admin/list');
})

app.get('/pages/admin/list', (req, res) => {
  // if(req.query.auth_token){

  // }else{
    
  // res.render('admin_list.ejs')
  // }
  res.render('admin_list.ejs')
})

app.get("/js/:file", (req, res) => {
  res.sendFile("js_front/" + req.params.file, project_root);
});

app.get("/submit_command", (req, res) => {
  let params = req.query;
  for (i in params) {
    params[i] = params[i].replace(/'/g, "''");
  }
  console.log(params);
  // todo: change id, treat sql injections
  const id = uuidv1();
  const query = `insert into commandes (id, sos_type, delivery_hour, delivery_adress, additional_informations, delivery_date) values ('${id}', '${params.sos_choice}', '${params.time_choice}', '${params.adress_choice}', '${params.additionnal_informations}', '${params.date_choice}')`;
  console.log(query);
  db_client.query(query, (err, res) => {
    if (err) console.log(err);
    // db_client.end();
  });
  res.json({
    id
    // params.
  });
});

// todo: XSS and SQL injections protection
// todo: use hash for password
app.get('/submit_admin_password', (req, res) => {
  // req.query.password
  const password_query = `select * from authentification where password like '${req.query.password}'`
  db_client.query(password_query, (err, res_db) => {
    if (err) console.log(err);
    if (res_db.rows.length === 1) {
      const token = uuidv1();
      const insert_query = `insert into admin_tokens values ('${token}')`
      db_client.query(insert_query, (err, res_db) => {
        if (err) console.log(err);
        res.json({
          token
        })
      })
    }
  })
})

/**
 * @param {string} query
 * @returns {[{name_of_field: value}]}
 */
// function execSQL(query) {
//     let result = null;
//     console.log(db_client.query(query)
//         .then((data) => {
//             // console.log(data.rows)
//             result =  (data.rows)
//         }))
//     console.log(result)
// }

app.listen("3000");

console.log("http://localhost:3000");
