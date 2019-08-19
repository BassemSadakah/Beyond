exports.exec=function(data,user_data,req,res){
  var top_students = [];
  var done = 0;
  var last_score = 0;
  var is_included = 0;
  client.query("SELECT users_sum.id,users_sum.first_name,users_sum.last_name,users_sum.profile_pic,(CASE WHEN((COUNT(questions.id)*10)) is null THEN 0  ELSE ((COUNT(questions.id)*10)) END)+(CASE WHEN(users_sum.sum) is null THEN 0  ELSE (users_sum.sum) END) as user_points  FROM (SELECT users.id,users.first_name,users.last_name,users.profile_pic,SUM(users_answers.user_points) from users LEFT JOIN users_answers ON users.id=users_answers.user_id GROUP BY users.id having users.id<>1) as users_sum LEFT JOIN questions ON questions.user_id=users_sum.id GROUP BY users_sum.id,users_sum.sum,users_sum.first_name,users_sum.last_name,users_sum.profile_pic ORDER BY user_points DESC LIMIT 50", function(err, RES) {
    if (err) {
      console.log(err);
    } else {
      var len = RES.rows.length;
      if (len < 60) {
        for (var i = 0; i < len; i++) {
          if (RES.rows[i].user_points != 0) {
            if (user_data.id == RES.rows[i].id) is_included = 1;
            top_students.push(RES.rows[i]);
            last_score = RES.rows[i].user_points;
          } else {
            done = 1;
            break;
          }
        }
        done = 1;
      }else{
        for (var i = 0; i < 60; i++) {
          if (RES.rows[i].user_points != 0) {
            if (user_data.id == RES.rows[i].id) is_included = 1;
            top_students.push(RES.rows[i]);
            last_score = RES.rows[i].user_points;
          } else {
            done = 1;
            break;
          }
        }
        if(len==60){
          done=1;
        }
      }
      if (!done) {
        for (var i = 60; i < len; i++) {
          if (RES.rows[i].user_points == last_score) {
            if (user_data.id == RES.rows[i].id) is_included = 1;
            top_students.push(RES.rows[i])
          }
        }
      }
      console.log('is_included:'+is_included)
      if(user_data.user_points==last_score && !is_included && last_score!=0){
        top_students.push({
          id:user_data.id,
          first_name:user_data.first_name,
          last_name:user_data.last_name,
          profile_pic:user_data.profile_pic,
          user_points:user_data.user_points
        });
      }
      res.send(top_students);
    }
  });

}
