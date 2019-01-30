const express = require("express");
const app = express();
const project_root = { root: "." };
const uuidv1 = require("uuidv1");
var shortid = require('shortid');
const nodemailer = require('nodemailer');
const request = require('request');
const sha256 = require('crypto-js/sha256');
const helmet = require('helmet');

app.use(helmet());

const CAPTCHA_SECRET = '6LfvHo0UAAAAAAJkQCBbiZPfoX597UyOrNko3tlx';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'noreply.immulistes@gmail.com',
    pass: 'T8kBcyhboSLJAYtvLZzN'
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
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(function (req, res, next) {
  for (i in req.query) {
    req.query[i] = req.query[i].replace(/'/g, "''");
  }
  next();
});

app.use((req, res, next) => {
  console.log('\tCALL :', req.url);
  next();
})

// app.use((req, res, next) => {
//   let new_query = Object.keys(req.query).reduce((acc, v) => {
//     acc[v] = 'iiii'
//   }, {})
//   console.log(new_query)
//   console.log(req);
//   next();
// })

app.get("/pages", (req, res) => {
  res.redirect("/pages/commande");
});

app.get("/", (req, res) => {
  res.redirect("/pages/commande");
});

app.get("/pages/suivi/:token", (req, res) => {
  db_client.query(
    `select * from commandes where id like $1`,
    [req.params.token],
    (err, quer_res) => {
      if (err) console.error(err);
      else if (quer_res.rows.length === 0) return;
      else {
        // console.log(quer_res.rows);
        // console.log(['sos_type', 'delivery_hour', 'additional_informations', 'state', 'decline_reason', 'email'].reduce((acc, val) => {
        //   acc[val] = quer_res.rows[0][val];
        //   return acc;
        // }, {}))
        const rows = ['sos_type', 'delivery_hour', 'additional_informations', 'state', 'decline_reason', 'email', 'delivery_adress', 'amount'].reduce((acc, val) => {
          acc[val] = quer_res.rows[0][val];
          return acc;
        }, {});
        console.log(quer_res.rows[0]);
        res.render("suivi.ejs", { rows });
      }
    }
  );
});

app.get('/pages/commande', (req, res) => {
  res.render('commande.ejs');
})

app.get('/pages/admin', (req, res) => {
  res.redirect('/pages/admin/list');
})

app.get('/pages/admin/:page', (req, res) => {
  cookies = parseCookies(req.headers.cookie);
  if (typeof (cookies['auth_token']) !== 'undefined') {
    let query = `select * from admin_tokens where token like $1`;
    db_client.query(query, [cookies['auth_token']], (err, res_db) => {
      if (err) console.error(err);
      if (res_db.rows.length > 0) {
        query = `select * from commandes`;
        db_client.query(query, (err, res_db) => {
          if (err) console.error(err);
          // console.log(res_db.rows)
          res.render('admin_' + req.params.page + '.ejs', { commands: res_db.rows })
        })
      } else {
        res.end('erreur d\'authentification')
      }
    });
    //temp
    // res.end();
  } else {
    res.render('admin_login.ejs')
  }
});

app.get("/js/:file", (req, res) => {
  res.sendFile("js_front/" + req.params.file, project_root);
});

app.get('/css/:file', (req, res) => {
  res.sendFile('css/' + req.params.file, project_root);
})

app.get('/fonts/:file', (req, res) => {
  res.sendFile('fonts/' + req.params.file, project_root);
})

let MAX_ID = '0';
db_client.query('select id from commandes', (err, res) => {
  MAX_ID = Math.max(...res.rows.map(v => {
    return parseInt(v.id);
  }));
})

app.get("/submit_command", (req, res) => {
  let params = req.query;
  // input format check
  const wrong_inputs = checkInputFormats(params);
  if(wrong_inputs.length !== 0) {
    return res.json({
      wrong_inputs,
    });
  }

  //required inputs check
  const required_inputs = [
    'sos_choice',
    'adress_choice',
    'phone_choice',
  ]

  const unfilled_required = required_inputs.reduce((acc, v) => (params[v] === undefined || params[v] === '' ? [...acc, v] : acc), []);
  if (unfilled_required.length !== 0) {
    return res.json({
      missing: unfilled_required,
    });
  }

  // console.log(params);
  let captcha_result;
  const verification_url = `https://www.google.com/recaptcha/api/siteverify?secret=${CAPTCHA_SECRET}&response=${params.captcha_response}`;
  request(verification_url, (err, res_captcha, body) => {
    if (err) console.error(err);
    else {
      body = JSON.parse(body);
      console.log('BODY ', body)
      if (body.success !== undefined && !body.success) {
        captcha_result = 'Failed captcha verification';
        res.json({
          captcha_failed: true
        });
      } else {
        captcha_result = 'Successful captcha verification !';

        const id = shortid.generate();

        if (params.email_choice !== '') {
          const mail_params = {
            // from: "Foo from jul@bar.com <donotreply@bar.com>",
            to: params.email_choice,
            subject: "ta nouvelle commande",
            text: "tu viens de commander un sos de type " + params.sos_choice + "\n\npour le voir, clique ici : http://localhost:3000/pages/commande?add_sos=" + id,
          };

          transporter.sendMail(mail_params, (err, info) => {
            if (err) console.error(err);
            else console.log('mail sent ! ' + info.response);
          });
        }

        const query = `insert into commandes (id, sos_type, delivery_hour, delivery_adress, additional_informations, state, email, amount, phone) values ($1, $2, $3, $4, $5, 'waiting', $6, $7::numeric, $8)`;

        // console.log(query);
        // console.log(params);
        db_client.query(query,
          [
            id,
            params.sos_choice,
            params.time_choice,
            params.adress_choice,
            params.additionnal_informations,
            params.email_choice,
            params.amount_choice === '' ? null : parseInt(params.amount_choice),
            params.phone_choice
          ],
          (err, res) => {
            if (err) console.log(err);
            // db_client.end();
          });

        res.json({
          id,
          captcha_result,
          // params.
        });
      }
    }

  })
});

app.get('/submit_admin_password', (req, res) => {
  // req.query.password
  console.log(sha256(req.query.password).toString())
  // TODO: stronger password
  const password_query = `select * from authentification where hash like $1`;
  db_client.query(password_query, [sha256(req.query.password).toString()], (err, res_db) => {
    if (err) console.log(err);
    console.log(res_db.rows)
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
  const decline_reason = typeof (req.query.reason) === 'undefined' ? '' : req.query.reason;
  const query = `update commandes set state = $1, decline_reason = $2 where id like $3`;
  // console.log(req.query);
  db_client.query(query, [
    req.query.new_state,
    decline_reason,
    req.query.command_id
  ], (err, res_db) => {
    if (err) console.error(err);
    res.end('')
    if (req.query.command_email) {
      const mail_params = {
        to: req.query.command_email,
        subject: "Mise à jour de ta commande",
        text: "Un koh'steau ou une koh'lette a modifié l'état de ta commande. son nouvel état est " + req.query.new_state + "\nPour la voir, clique ici : http://localhost:3000/pages/commande?add_sos=" + req.query.command_id,
      };

      transporter.sendMail(mail_params, (err, info) => {
        if (err) console.error(err);
        else console.log('mail sent ! ' + info.response);
      })
    }
  });
});

app.get('/get_command', (req, res) => {
  const query = `select * from commandes where id like $1`;
  db_client.query(query, [req.query.id], (err, res_db) => {
    if (err) console.error(err);
    else {
      // console.log(res_db.rows)
      if (res_db.rows.length === 1) {
        res.json({
          id: res_db.rows[0]['id'],
          sos_type: res_db.rows[0]['sos_type']
        });
      }
    }
  });
});

app.get('*', (req, res) => {
  res.render('404.ejs');
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

app.listen('3000');

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

function checkInputFormats(inputs) {
  console.log(inputs)
  return Object.keys(inputs).reduce((acc, k) => {
    // console.log('val :', k)
    if (inputs[k] !== undefined) {
      switch (k) {
        case 'amount_choice':
          // console.log('typeof :', inputs[k] === '')
          if (/^\d+$/.test(inputs[k]) || inputs[k] === '') return acc;
          else return [...acc, k]
          break;

        case 'email_choice':
          const email_regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          if (email_regex.test(inputs[k]) || inputs[k] === '') return acc;
          else return [...acc, k];
          break;

        case 'phone_choice':
          const phone_regex = /^(?:(?:\+|00)33[\s.-]{0,3}(?:\(0\)[\s.-]{0,3})?|0)[1-9](?:(?:[\s.-]?\d{2}){4}|\d{2}(?:[\s.-]?\d{3}){2})$/;
          if(phone_regex.test(inputs[k]) || inputs[k] === '') return acc;
          else return [...acc, k];
          break;

        default:
          return acc;
          break;
      }
    }
  }, []);
}