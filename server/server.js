const express = require("express");
const app = express();
const project_root = { root: "." };
const uuidv1 = require("uuidv1");
var shortid = require('shortid');
const nodemailer = require('nodemailer');

// todo : change auth
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'jules.westersang@gmail.com',
    pass: 'westercamp'
  }
})

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

// escape all single quotes in query in case it is used for the database
app.use(function (req, res, next) {
  for (i in req.query) {
    req.query[i] = req.query[i].replace(/'/g, "''");
  }
  next();
});

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
      else {
        console.log(quer_res.rows);
        res.render("suivi.ejs", { rows: quer_res.rows[0] });
      }
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

app.get('/pages/admin/:page', (req, res) => {
  cookies = parseCookies(req.headers.cookie)
  // todo: fonction de vérification middleware ?
  if (typeof (cookies['auth_token']) !== 'undefined') {
    let query = `select * from admin_tokens where token like '${cookies['auth_token']}'`;
    db_client.query(query, (err, res_db) => {
      if (err) console.error(err);
      if (res_db.rows.length > 0) {
        query = `select * from commandes`;
        db_client.query(query, (err, res_db) => {
          if (err) console.error(err);
          // console.log(res_db.rows)
          res.render('admin_' + req.params.page + '.ejs', { commands: res_db.rows })
        })
      } else {
        // todo: destruction du cookie
        res.end('erreur d\'authentification')
      }
    })
    //temp
    // res.end();
  } else {
    res.render('admin_login.ejs')
  }
})

app.get("/js/:file", (req, res) => {
  res.sendFile("js_front/" + req.params.file, project_root);
});

app.get('/css/:file', (req, res) => {
  res.sendFile('css/' + req.params.file, project_root);
})

let MAX_ID = '0';
db_client.query('select id from commandes', (err, res) => {
  MAX_ID = Math.max(...res.rows.map(v => {
    return parseInt(v.id);
  }));
})

//todo champ bdd en autoincrement
app.get("/submit_command", (req, res) => {
  let params = req.query;
  // for (i in params) {
  //   params[i] = params[i].replace(/'/g, "''");
  // }
  console.log(params);
  // todo: change id, treat sql injections
  // const id = uuidv1();
  const id = shortid.generate();
  // const id = ++MAX_ID;
  const query = `insert into commandes (id, sos_type, delivery_hour, delivery_adress, additional_informations, delivery_date, state, email) values ('${id}', '${params.sos_choice}', '${params.time_choice}', '${params.adress_choice}', '${params.additionnal_informations}', '${params.date_choice}', 'waiting', '${params.email_choice}')`;
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
  const password_query = `select * from authentification where password like '${req.query.password}'`;
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
});

app.get('/change_command_state', (req, res) => {
  // console.log(req.query);
  // todo: check that req.query.new_state is valid
  // for (i in req.query) {
  //   req.query[i] = req.query[i].replace(/'/g, "''");
  // }
  const decline_reason = typeof(req.query.reason) === 'undefined' ? '' : req.query.reason;
  const query = `update commandes set state = '${req.query.new_state}', decline_reason = '${decline_reason}' where id like '${req.query.command_id}'`;
  db_client.query(query, (err, res_db) => {
    if (err) console.error(err);
    res.end('')
  });
});

app.get('/get_command', (req, res) => {
  const query = `select * from commandes where id like '${req.query.id}'`;
  db_client.query(query, (err, res_db) => {
    if (err) console.error(err);
    else {
      // console.log(res_db.rows)
      if (res_db.rows.length === 1) {
        res.json({
          id: res_db.rows[0]['id'],
          sos_type: res_db.rows[0]['sos_type']
        })
      }
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

function parseCookies(cookies) {
  let res = [];
  if (typeof (cookies) !== 'string') return [];
  cookies.split('; ').forEach(v => {
    if (typeof (v) !== 'string') return [];
    const sv = v.split('=');
    res[sv[0]] = sv[1];
  });
  return res;
}