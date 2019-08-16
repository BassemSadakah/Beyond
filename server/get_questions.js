exports.exec = function(data, user_data, req, res) {
  var questions = req.body.questions;
  var filter_query = ' ';
  var issafe = 1;
  if (questions) {
    for (var i = 0; i < questions.length; i++) {
      if (!Number(questions[i])) {
        issafe = 0;
        break;
      }
      filter_query += (' AND questions.id <> ' + questions[i])
    }
  }
  if (issafe) {
    client.query("(SELECT questions_table.*,users.first_name,users.last_name,users.profile_pic from (SELECT questions.id,questions.user_id,questions.question,questions.question_img,questions.answer_img,questions.question_type,questions.ans_num,questions.ans_a,questions.ans_b,questions.ans_c,questions.ans_c,questions.ans_d,questions.ans_e,questions.ans_f,questions.ans_g,questions.ans_h,T1.count from (select questions1.id,COUNT(*) from (select questions.* from questions  LEFT JOIN (SELECT * from users_answers where user_id=" + user_data.id + ") as a ON questions.id=a.question_id where a.user_id is null AND questions.isapproved=1 " + filter_query + ") as questions1 LEFT JOIN users_answers on users_answers.question_id=questions1.id GROUP BY questions1.id) as T1 LEFT JOIN questions on questions.id=T1.id ORDER BY COUNT LIMIT 5 OFFSET RANDOM()*(CASE WHEN (select COUNT(questions.*) from questions  LEFT JOIN (SELECT * from users_answers where user_id=" + user_data.id + ") as a ON questions.id=a.question_id where a.user_id is null AND questions.isapproved=1 " + filter_query + ")<11 THEN 0  WHEN (select COUNT(questions.*) from questions  LEFT JOIN (SELECT * from users_answers where user_id=" + user_data.id + ") as a ON questions.id=a.question_id where a.user_id is null AND questions.isapproved=1 " + filter_query + ")<50 THEN ((select COUNT(questions.*) from questions  LEFT JOIN (SELECT * from users_answers where user_id=" + user_data.id + ") as a ON questions.id=a.question_id where a.user_id is null AND questions.isapproved=1 " + filter_query + ")-5)  ELSE 45 END)) as questions_table LEFT JOIN users ON questions_table.user_id=users.id) UNION (SELECT questions_table.*,users.first_name,users.last_name,users.profile_pic from (SELECT questions.id,questions.user_id,questions.question,questions.question_img,questions.answer_img,questions.question_type,questions.ans_num,questions.ans_a,questions.ans_b,questions.ans_c,questions.ans_c,questions.ans_d,questions.ans_e,questions.ans_f,questions.ans_g,questions.ans_h,T1.count from (select questions1.id,COUNT(*) from (select questions.* from questions  LEFT JOIN (SELECT * from users_answers where user_id=" + user_data.id + ") as a ON questions.id=a.question_id where a.user_id is null AND questions.isapproved=1 " + filter_query + ") as questions1 LEFT JOIN users_answers on users_answers.question_id=questions1.id GROUP BY questions1.id) as T1 LEFT JOIN questions on questions.id=T1.id ORDER BY COUNT LIMIT 10 OFFSET RANDOM()*(CASE WHEN (select COUNT(questions.*) from questions  LEFT JOIN (SELECT * from users_answers where user_id=" + user_data.id + ") as a ON questions.id=a.question_id where a.user_id is null AND questions.isapproved=1 " + filter_query + ")<11 THEN 5 WHEN (select COUNT(questions.*) from questions  LEFT JOIN (SELECT * from users_answers where user_id=" + user_data.id + ") as a ON questions.id=a.question_id where a.user_id is null AND questions.isapproved=1 " + filter_query + ")<21 THEN ((select COUNT(questions.*) from questions  LEFT JOIN (SELECT * from users_answers where user_id=" + user_data.id + ") as a ON questions.id=a.question_id where a.user_id is null AND questions.isapproved=1 " + filter_query + ")-10) ELSE ((select COUNT(questions.*) from questions LEFT JOIN (SELECT * from users_answers where user_id=" + user_data.id + ") as a ON questions.id=a.question_id where a.user_id is null AND questions.isapproved=1 " + filter_query + ")-10) END))  as questions_table LEFT JOIN users ON questions_table.user_id=users.id)", function(err, RES) {
      if (err) {
        console.log(err);
      } else {
        if (RES.rows.length < 10) {
          client.query("SELECT questions_table.*,users.first_name,users.last_name,users.profile_pic from (SELECT questions.id,questions.user_id,questions.question,questions.question_img,questions.answer_img,questions.question_type,questions.ans_num,questions.ans_a,questions.ans_b,questions.ans_c,questions.ans_c,questions.ans_d,questions.ans_e,questions.ans_f,questions.ans_g,questions.ans_h,T1.count from (select questions1.id,COUNT(*) from (select questions.* from questions  LEFT JOIN (SELECT * from users_answers where user_id=" + user_data.id + ") as a ON questions.id=a.question_id where a.user_id is not null AND questions.isapproved=1 " + filter_query + ") as questions1 LEFT JOIN users_answers on users_answers.question_id=questions1.id GROUP BY questions1.id) as T1  LEFT JOIN questions on questions.id=T1.id ORDER BY COUNT LIMIT " + (10 - RES.rows.length) + ") as questions_table LEFT JOIN users ON questions_table.user_id=users.id", function(err, RES2) {
            if (err) {
              console.log(err);
              res.send({
                err: 1
              });
            } else {
              res.send(RES.rows.concat(RES2.rows))
            }
          });
        } else {
          res.send(RES.rows.slice(0, 10));
        }
      }
    });
  } else {
    res.send({
      err: 1
    });
  }
}
