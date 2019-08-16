exports.exec = function(req, res) {
  var first_name = req.body.first_name.replace(/\'/g, "").replace(/\ /g, "");
  var last_name = req.body.last_name.replace(/\'/g, "").replace(/\ /g, "");
  var email = req.body.email.replace(/\'/g, "").replace(/\ /g, "").toLowerCase();
  var password = req.body.password.replace(/\'/g,"''");
  console.log(password);
  if (!first_name || !last_name|| !email || !password) {
    res.render('signup', {
      err: 1,
      errmsg: "Check your inputs",
      first_name: first_name,
      last_name: last_name,
      email: email
    });
  } else if (password.length < 6) {
    res.render('signup', {
      err: 1,
      errmsg: "password is too short",
      first_name: first_name,
      last_name: last_name,
      email: email
    });
  }else if (first_name.length > 15) {
    res.render('signup', {
      err: 1,
      errmsg: "First name is too long",
      first_name: first_name,
      last_name: last_name,
      email: email
    });
  } else if (last_name.length > 15) {
    res.render('signup', {
      err: 1,
      errmsg: "Last name is too long",
      first_name: first_name,
      last_name: last_name,
      email: email
    });
  }else if (email.length > 50) {
    res.render('signup', {
      err: 1,
      errmsg: "Email is too long",
      first_name: first_name,
      last_name: last_name,
      email: email
    });
  } else {
    client.query("INSERT INTO users (first_name,last_name,email,password) VALUES ('" + first_name + "','" + last_name + "','" + email + "','" + password + "')", function(err, RES) {
      console.log(RES);
      if (err) {
        console.log(err);
        var errmsg = "Something went wrong"
        if (err.code = '23505') {
          errmsg = "Email already in use <a href=\"signin\">Sign in</a>"
        }
        res.render('signup', {
          err: 1,
          errmsg: errmsg,
          first_name: first_name,
          last_name: last_name,
          email: email
        });
      } else {
        client.query("SELECT id FROM users where email='" + email + "'", (err, RES) => {
          // console.log(RES);
          if (err) {
            console.log(err);
            var errmsg = "Something went wrong";
            res.render('signup', {
              err: 1,
              errmsg: errmsg,
              first_name: first_name,
              last_name: last_name,
              email: email
            });
          } else {

            var user_id=RES.rows[0].id;
            var exp_time = Date.now() + (5 * 60 * 60 * 1000);
            var session_id = crypto.randomBytes(20).toString('HEX');
            res.cookie('session_id', session_id);
            client.query("insert into sessions (user_id, session_id,exp_time) VALUES(" + user_id + ",'" + session_id + "','" + exp_time + "')", (err, RES) => {
              if (err) {
                console.log(err);
                error = 1;
                res.render('signup', {
                  err: 1,
                  errmsg: "Something Went Wrong"
                });
              }else{
                res.redirect('/');
              }
            });
          }
        });
      }

    });
  }
}
