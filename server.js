var express = require('express');
const pg = require('pg');
var requireDir = require('require-dir');
global.server = requireDir('./server');
var cookieParser = require('cookie-parser')
global.crypto = require("crypto");
const passport = require('passport');
var app = express();
const PORT = process.env.PORT || 80;
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());
global.bodyParser = require('body-parser');
app.use(bodyParser.json({
  limit: '10mb',
  extended: true
}))
app.use(bodyParser.urlencoded({
  limit: '10mb',
  extended: true
}));
passport.serializeUser(function(user, done) {
  done(null, user);
});
// passport.deserializeUser(function(user, done) {
//   done(null, user);
// });
const FacebookStrategy = require('passport-facebook').Strategy;
passport.use(new FacebookStrategy({
  clientID: process.env.clientID,
  clientSecret: process.env.clientSecret,
  callbackURL: 'https://beyond-project.herokuapp.com/auth/facebook/redirect',
  profileFields: ['id', 'emails', 'name', 'photos']
}, (accessToken, refreshToken, profile, done) => {
  done(null, profile);
  // console.log(profile);
}));
global.client = new pg.Client(process.env.DATABASE_URL);
client.connect();
/*
//ALTER TO ADD TIMESTAMP DEFAULT TO NOW() in questions, users_answers,users
ALTER TABLE users ADD COLUMN time TIMESTAMP;
ALTER TABLE users ALTER COLUMN time SET DEFAULT now();

ALTER TABLE questions ADD COLUMN seen INT;
ALTER TABLE questions ALTER COLUMN seen SET DEFAULT 0;

CREATE TABLE users (
   id serial PRIMARY KEY,
   first_name VARCHAR(50) NOT NULL,
   last_name VARCHAR(50) NOT NULL,
   email VARCHAR(150) UNIQUE,
   password VARCHAR (50),
   profile_pic TEXT,
   isfb INT,
   fb_id TEXT
  );

CREATE TABLE sessions (
   user_id INT NOT NULL,
   session_id VARCHAR(100) UNIQUE NOT NULL, //changed to be not unique due to unknown bug
   exp_time VARCHAR(100) NOT NULL
);



CREATE TABLE questions (
id serial PRIMARY KEY,
user_id INT,
question TEXT ,
question_img TEXT,
answer_img TEXT,
question_type TEXT,
ans_num INT,
ans_a TEXT,
ans_b TEXT,
ans_c TEXT,
ans_d TEXT,
ans_e TEXT,
ans_f TEXT,
ans_g TEXT,
ans_h TEXT,
answer TEXT,
isapproved INT,
answer_exp TEXT,
seen INT DEFAULT 0 NOT NULL
);

CREATE TABLE users_answers(
id serial PRIMARY KEY,
user_id INT NOT NULL,
question_id INT NOT NULL,
user_answer VARCHAR(250) NOT NULL,
question_answer VARCHAR(250),
user_result VARCHAR(250),
user_points INT
);

CREATE TABLE comments(
id serial PRIMARY KEY,
user_id INT NOT NULL,
question_id INT NOT NULL,
comment TEXT NOT NULL,
seen INT DEFAULT 0 NOT NULL
);

CREATE TABLE comments_notifications(
id serial PRIMARY KEY,
user_id INT NOT NULL,
question_id INT NOT NULL,
commenter_id INT NOT NULL,
seen INT DEFAULT 0 NOT NULL
);

*/
// ###################################################################
// app.get('*', function(req, res) {
//   res.render('under')
// });
app.get('/', function(req, res) {
  server.redirect.exec(req, res, 'signed/home', 'home', {}, {}, 0, 0);
});
app.get('/admin', function(req, res) {
  res.render('admin')
  // res.redirect('/')
});
app.get('/api/approval/get_questions', function(req, res) {
  var offset = req.query.offset;
  if (!Number(offset) && Number(offset) != 0) {
    res.send({
      err: 1
    });
    console.log(offset);
  } else {
    offset = offset * 10;
    client.query("SELECT users.first_name,users.last_name,questions.id,questions.user_id,questions.question,questions.question_img,questions.answer_img,questions.answer,questions.question_type,questions.ans_num,questions.ans_a,questions.ans_b,questions.ans_c,questions.ans_c,questions.ans_d,questions.ans_e,questions.ans_f,questions.ans_g,questions.ans_h FROM questions LEFT JOIN users on users.id=questions.user_id where isapproved=0 LIMIT 10 OFFSET " + offset, function(err, RES) {
      if (err) {
        console.log(err);
      } else {
        res.send(RES.rows);
      }
    });
  }
});
app.get('/signup', function(req, res) {
  server.redirect.exec(req, res, '/', 'signup', {}, {}, 1);
});
app.get('/signin', function(req, res) {
  var err = {};
  if (req.query.errmsg) {
    err = {
      err: 1,
      errmsg: req.query.errmsg
    }
  }
  if (req.query.redirectURL) {
    var redirectURL = req.query.redirectURL;
    server.redirect.exec(req, res, redirectURL, 'signin', {}, Object.assign({
      redirectURL: redirectURL
    }, err), 1, 0);
  } else {
    server.redirect.exec(req, res, '/', 'signin', {}, err, 1);
  }
});
app.get('/gallery', function(req, res) {
  server.redirect.exec(req, res, 'signed/gallery', 'gallery', {}, {});
});
app.get('/about', function(req, res) {
  server.redirect.exec(req, res, 'signed/about', 'about', {}, {});
});
app.get('/questions', function(req, res) {
  server.redirect.exec(req, res, 'signed/questions', 'signin?redirectURL=questions', {}, {}, 0, 1);
});
app.get('/x', function(req, res) {
  res.render('x')
});
app.get('/logout', function(req, res) {
  server.logout.exec(req, res);
});
app.get('/admin', function(req, res) {
  res.render('admin')
});
app.get('/simulations', function(req, res) {
  server.redirect.exec(req, res, 'signed/simulations', 'simulations', {}, {});
});
app.get('/home/signed', function(req, res) {
  res.render('signed/home')
});
app.get('/settings', function(req, res) {
  server.redirect.exec(req, res, 'signed/settings', 'signin?redirectURL=settings', {}, {}, 0, 1);
});
app.get('/upload', function(req, res) {
  server.redirect.exec(req, res, 'signed/upload', 'upload', {}, {}, 0, 1);
});
app.get('/auth/facebook', passport.authenticate('facebook', {
  scope: ['email']
}));
app.get('/auth/facebook/redirect', passport.authenticate('facebook'), (req, res) => {
  server.fb_login.exec(req, res);
});
app.post('/api/get_questions', function(req, res) {
  server.redirect.exec(req, res, server.get_questions.exec, '/signin', {}, {}, 0, 1);
});
app.get('/api/dashboard', function(req, res) {
  server.redirect.exec(req, res, server.dashboard.exec, '/signin', {}, {}, 0, 1);
});
app.get('/api/user_questions', function(req, res) {
  server.redirect.exec(req, res, server.user_questions.exec, '/signin', {}, {}, 0, 1);
});
app.get('/show_question', function(req, res) {
  var question_id = (req.query.id) ? req.query.id.replace(/\'/g, "") : '';
  if (!Number(question_id)) {
    res.send("<h3>Question not found</h3>");
  } else {
    client.query("SELECT users.first_name,users.last_name,questions.id,questions.user_id,questions.question,questions.question_img,questions.answer_img,questions.question_type,questions.ans_num,questions.ans_a,questions.ans_b,questions.ans_c,questions.ans_c,questions.ans_d,questions.ans_e,questions.ans_f,questions.ans_g,questions.ans_h FROM questions LEFT JOIN users on users.id=questions.user_id WHERE questions.id=" + question_id, function(err, RES) {
        if (err) {
          console.log(err);
          res.send("<h3>Question not found</h3>");
        } else {
          server.redirect.exec(req, res, 'signed/show_question', 'show_question', { question_data: RES.rows[0]}, { question_data: RES.rows[0]}, 0, 0);
           }
        });
    }


  });

app.post('/api/get_statistics', function(req, res) {
  server.get_statistics.exec(req, res);
});
// ************************************************************************************

app.post('/api/comments', function(req, res) {
  var question_id = (req.body.question_id) ? req.body.question_id.replace(/\'/g, "") : '';
  if (!Number(question_id)) {
    res.send({
      err: 1
    })
  } else {
    client.query("SELECT comments.*,users.first_name,users.last_name,users.profile_pic from comments LEFT JOIN users on users.id=comments.user_id where question_id=" + question_id, function(err, RES) {
      if (err) {
        res.send({
          err: 1
        })
      } else {
        res.send({
          err: 0,
          comments_num: RES.rows.length,
          comments: RES.rows
        })
      }
    });
  }
});

app.post('/api/post_comment', function(req, res) {
  server.redirect.exec(req, res, post_comment, '/signin', {}, {}, 0, 1);

  function post_comment(data, user_data, req, res) {
    var question_id = (req.body.question_id) ? req.body.question_id.replace(/\'/g, "") : '';
    var comment = (req.body.comment) ? req.body.comment.replace(/\'/g, "''") : '';
    if (!Number(question_id || !comment)) {
      res.send({
        err: 1
      })
    } else {
      client.query("INSERT INTO comments (user_id,question_id,comment) VALUES(" + user_data.id + "," + question_id + ",'" + comment + "')", function(err, RES) {
        if (err) {
          res.send({
            err: 1
          })
        } else {
          res.send({
            err: 0
          });
          client.query("SELECT DISTINCT user_id from comments where question_id=" + question_id + "AND user_id<>" + user_data.id, function(err, RES) {
            if (err) {
              console.log(err);
            } else {
              console.log(RES.rows.length);
              for (var i = 0; i < RES.rows.length; i++) {
                client.query("INSERT INTO comments_notifications (user_id,question_id,commenter_id) VALUES (" + RES.rows[i].user_id + "," + question_id + "," + user_data.id + ")", function(err, RES) {
                  if (err) {
                    console.log(err);
                  }
                });
              }
            }
          })

        }
      });
    }
  }

});

app.get('/api/notifications', function(req, res) {
  server.redirect.exec(req, res, notifications, '/signin', {}, {}, 0, 1);

  function notifications(data, user_data, req, res) {
    var notifications = [];
    client.query("SELECT id,question,question_img from questions where user_id=" + user_data.id + " AND seen<>2 AND isapproved=1", function(err, RES) {
      if (err) {
        console.log(err);
        res.send({
          err: 1
        });
      } else {
        client.query("UPDATE questions SET seen=1 where user_id=" + user_data.id + " AND seen<>2 AND isapproved=1", function(err, RES) {
          if (err) {
            console.log(err);
          }
        });
        notifications = notifications.concat(RES.rows);
        res.send({
          notifications_num: notifications.length,
          notfication_type: 1,
          notifications: notifications
        })
      }
    });
  }
});
app.get('/api/notifications_seen', function(req, res) {
  server.redirect.exec(req, res, notifications_seen, '/signin', {}, {}, 0, 1);

  function notifications_seen(data, user_data, req, res) {
    client.query("UPDATE questions SET seen=2 where user_id=" + user_data.id + " AND seen<>2 AND isapproved=1", function(err, RES) {
      if (err) {
        console.log(err);
        res.send({
          err: 1
        });
      } else {
        res.send({
          err: 0
        })
      }
    });
  }
});
// ####################################################################################################
app.post('/signup', function(req, res) {
  server.signup.exec(req, res);
});
app.post('/signin', function(req, res) {
  server.signin.exec(req, res);
});
app.post('/settings', function(req, res) {
  server.redirect.exec(req, res, 'signed/settings', 'signin?redirectURL=settings', {}, {}, 0, 1);
});
app.post('/admin', function(req, res) {
  if (req.body.password == 'admin' && req.body.username=='admin') {
    server.redirect.exec(req, res, 'signed/upload', 'upload', {}, {}, 0, 1);
  } else {
    res.redirect('/admin')
  }
});
app.post('/admin/upload', function(req, res) {
  server.admin_upload.exec(req, res);
});
app.post('/upload/question', function(req, res) {
  server.upload_question.exec(req, res);
});
app.post('/api/submit_answer', function(req, res) {
  server.submit_answer.exec(req, res);
});
app.post('/api/approval/approve_question', function(req, res) {
  server.approve_question.exec(req, res);
});
app.post('/api/approval/disapprove_question', function(req, res) {
  server.disapprove_question.exec(req, res);
});
app.post('/api/approval/undo_approve_question', function(req, res) {
  server.undo_approve_question.exec(req, res);
});
app.post('/upload', function(req, res) {
  server.upload_question.exec({},{id:1},req,res)
});
app.get('/about_us', function(req, res) {
  res.render('about_us')
});
app.get('/privacy_policy', function(req, res) {
  res.render('privacy')
});
app.get('/terms_and_conditions', function(req, res) {
  res.render('terms_and_conditions')
});
app.post('/api/registered_users', function(req, res) {
  client.query("SELECT COUNT(*) FROM users", function(err, RES) {
    if (err) {
      console.log(err)
    } else {
      var users_count = RES.rows[0].count;
      res.send(users_count);
    }
  })
})
// ############################################################################
app.listen(PORT, function() {
  console.log('Server Started')
})
