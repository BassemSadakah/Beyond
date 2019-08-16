exports.exec=function(req,res){
  var email;
  if(req.user.emails) {email=req.user.emails[0].value.replace(/\'/g, "").toLowerCase()};
  var first_name = req.user.name.givenName.replace(/\'/g, "");
  var last_name = (req.user.name.familyName) ? req.user.name.familyName.replace(/\'/g, "") :((req.user.name.middleName)?req.user.name.middleName.replace(/\'/g, ""):'');
  var profile_pic;
  if(req.user.photos){profile_pic=req.user.photos[0].value.replace(/\'/g, "")}
  var fb_id = req.user.id.replace(/\'/g, "");
  function signin_fb(fb_id, req, res,profile_pic) {
    client.query("SELECT *  FROM users where fb_id='" + fb_id + "'", (err, RES) => {
      if (err) {
        console.log(err);
        res.render('signin', {
          err: 1,
          errmsg: "Something went wrong"
        });
      } else {
        var user_id = RES.rows[0].id;
        var exp_time = Date.now() + (5 * 60 * 60 * 1000);
        var session_id = crypto.randomBytes(20).toString('HEX');
        res.cookie('session_id', session_id);
        client.query("insert into sessions (user_id, session_id,exp_time) VALUES(" + user_id + ",'" + session_id + "','" + exp_time + "')", (err, RES) => {
          if (err) {
            console.log(err);
            res.render('signin', {
              err: 1,
              errmsg: "Something Went Wrong"
            });
          } else {
            res.redirect('/');
          }
        });
        if(profile_pic){
        if(profile_pic!=RES.rows[0].profile_pic){
          client.query("update users set profile_pic='"+profile_pic+"' where fb_id='"+fb_id+"'", (err, RES) => {});
        }
      }
      }
    });
  }
  client.query("SELECT * FROM users where email='" + email + "' UNION SELECT * FROM users where fb_id='"+fb_id+"'", function(err, RES) {
    if (err) {
      console.log(err);
    } else {
      console.log(RES.rows);
      if (RES.rows.length == 0) {
        client.query("INSERT INTO users (first_name,last_name,email,profile_pic,isfb,fb_id) VALUES ('" + first_name + "'," +((last_name)?("'"+last_name+"'"):"NULL")  + "," + ((email)?("'"+email+"'"):"NULL") + ","+((profile_pic)?("'"+profile_pic+"'"):"NULL")+",1,'" + fb_id + "')", function(err, RES) {
          if (err) {
            console.log(err);
          } else {
            signin_fb(fb_id, req, res);
          }
        });
      } else {
        if (RES.rows[0].isfb) {
          signin_fb(fb_id, req,res,profile_pic);
        } else {
          res.render('signin', {
            err: 1,
            errmsg: "Sign in to continue"
          });
        }
      }
    }
  });
}
