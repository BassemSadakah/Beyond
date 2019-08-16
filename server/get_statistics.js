exports.exec = function(req, res) {
  var question_id = req.body.question_id.replace(/\'/g, "");
  if (!Number(question_id) && Number(question_id)!=0) {
    res.send({
      err: 1
    });
  } else {
    client.query("SELECT user_answer,COUNT(user_id) from users_answers where question_id=" + question_id + " GROUP BY user_answer ORDER BY user_answer", function(err, RES) {
      if (err) {
        res.send({
          err: 1
        });
      } else {
        var answers_percent = [];
        var answers = [0, 0, 0, 0, 0, 0, 0, 0];
        var total_answers = 0;
        for (var i = 0; i < RES.rows.length; i++) {
          answers[(RES.rows[i].user_answer - 1)] = Number(RES.rows[i].count)
          total_answers += Number(RES.rows[i].count);
        }
        for (var i = 0; i < 8; i++) {
          answers_percent.push(((answers[i] / total_answers) * 100))
        }

        res.send({
          err: 0,
          answers_percent: answers_percent,
          total_answers: total_answers
        });
        console.log(RES.rows)
        console.log(total_answers)
      }
    });
  }
}
