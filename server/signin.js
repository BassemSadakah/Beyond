  exports.exec = function(req, res) {
    var email = (req.body.email)?req.body.email.replace(/\'/g, "").toLowerCase():'';
    var password = (req.body.password)?req.body.password.replace(/\'/g, "''"):'';
    var remember_me = req.body.remember_me;
    var error = 0;
    // console.log(email + '   ' + password + '   ' + remember_me);
    client.query("SELECT id FROM users where isfb IS NULL AND email='" + email + "' AND password='" + password + "'", (err, RES) => {
      if (err) {
        console.log(err);
        error = 1;
        res.render('signin', {
          err: 1,
          errmsg: "Something Went Wrong"
        })
      } else if (RES.rows.length == 0) {
        error = 1;
        res.render('signin', {
          err: 1,
          errmsg: "Incorrect Email or Password"
        });
      } else {
        var user_id = RES.rows[0].id;
        var session_id = crypto.randomBytes(20).toString('HEX');
        var exp_time = Date.now();
        if (remember_me == 'on') {
          exp_time += (30 * 24 * 60 * 60 * 1000);
          res.cookie('session_id', session_id, {
            maxAge: (30 * 24 * 60 * 60 * 1000)
          });
        } else {
          exp_time += (5 * 60 * 60 * 1000);
          res.cookie('session_id', session_id);
        }
        client.query("SELECT * FROM sessions where user_id=" + user_id, (err, RES) => {
          if (err) {
            console.log(err);
            error = 1;
            res.render('signin', {
              err: 1,
              errmsg: "Something Went Wrong"
            });
          } else if (RES.rows.length != 0) {
              client.query("update sessions set session_id='" + session_id + "',exp_time='" + exp_time + "' where user_id=" + user_id, (err, RES) => {
              if (err) {
                console.log(err);
                error = 1;
                res.render('signin', {
                  err: 1,
                  errmsg: "Something Went Wrong"
                });
              } else {
                console.log(req.query.redirectURL);
                if (req.query.redirectURL) {
                  var redirectURL = req.query.redirectURL;
                  res.redirect(redirectURL);
                } else {
                  res.redirect('/');
                }
              }
            });
          } else {

            client.query("insert into sessions (user_id, session_id,exp_time) VALUES(" + user_id + ",'" + session_id + "','" + exp_time + "')", (err, RES) => {
              if (err) {
                console.log(err);
                error = 1;
                res.render('signin', {
                  err: 1,
                  errmsg: "Something Went Wrong"
                });
              } else {
                if (req.query.redirectURL) {
                  var redirectURL = req.query.redirectURL;
                  res.redirect(redirectURL);
                } else {
                  res.redirect('/');
                }
              }
            });

          }
        });

      }
    });
  };
