exports.exec = function(req, res, redirect, err_redirect, red_var, err_red_var, red, err_red) {
  var session_id = req.cookies['session_id']; //don't remove the single quote undefined
  if (session_id != undefined) {
    session_id = req.cookies['session_id'].replace(/\'/g, "");
    client.query("SELECT * FROM sessions where session_id='" + session_id + "'", (err, RES) => {
      if (err) {
        console.log(err);
        res.clearCookie("session_id");
        if (err_red) {
          res.redirect(err_redirect);
        } else {
          res.render(err_redirect, err_red_var);
          }
        } else {
          if (RES.rows.length == 0) {
            res.clearCookie("session_id");
            if (err_red) {
              res.redirect(err_redirect);
            } else {
              res.render(err_redirect, err_red_var);
            }
          } else if (RES.rows[0].exp_time < Date.now()) {
            res.clearCookie("session_id");
            if (err_red) {
              res.redirect(err_redirect);
            } else {
              res.render(err_redirect, err_red_var);
            }
          } else {
            var user_id = RES.rows[0].user_id;
            // client.query("select users.*,(SUM(users_answers.user_points)) as user_points FROM users LEFT JOIN users_answers ON users.id=users_answers.user_id GROUP BY users.id HAVING users.id="+user_id, (err, RES) => {
            client.query(" SELECT ( CASE WHEN (SELECT SUM(user_points) from users_answers GROUP BY user_id HAVING user_id="+user_id+") is NULL THEN 0 ELSE (SELECT SUM(user_points) from users_answers GROUP BY user_id HAVING user_id="+user_id+") END + CASE WHEN ((SELECT COUNT(*)  from questions where user_id="+user_id+")*10) is NULL THEN 0 ELSE ((SELECT COUNT(*)  from questions where user_id="+user_id+")*10) END  ) AS user_points,* from users where id="+user_id, (err, RES) => {
              if (err) {
                console.log(err);
                res.clearCookie("session_id");
                if (err_red) {
                  res.redirect(err_redirect);
                } else {
                  res.render(err_redirect, err_red_var);
                }
              } else if (RES.rows.length == 0) {
                res.clearCookie("session_id");
                if (err_red) {
                  res.redirect(err_redirect);
                } else {
                  res.render(err_redirect, err_red_var);
                }
              } else {
                if(!RES.rows[0].user_points){
                  RES.rows[0].user_points=0;
                }
                if (typeof redirect == 'function') {
                  redirect(red_var, RES.rows[0], req, res);
                } else {
                  if (red) {
                    res.redirect(redirect);
                  } else {
                    if (typeof red_var == 'function') {
                      res.render(redirect, Object.assign({
                        signed: 1,
                        data: RES.rows[0]
                      }, red_var()));
                    } else {
                      res.render(redirect, Object.assign({
                        signed: 1,
                        data: RES.rows[0]
                      }, red_var));
                    }
                  }
                }
              }
            });
          }
        }
      });
    } else {
      if (err_red) {
        res.redirect(err_redirect);
      } else {
        res.render(err_redirect, err_red_var);
      }
    }
}
