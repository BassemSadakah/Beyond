exports.exec = function(req, res) {
  var question_id = req.body.question_id;
  var user_answer = req.body.answer;

  if (question_id && (user_answer == '1' || user_answer == '2' || user_answer == '3' || user_answer == '4' || user_answer == '5' || user_answer == '6' || user_answer == '7' || user_answer == '8')) {
    question_id.replace(/\'/g, "");
    server.redirect.exec(req, res, submit_answer, 'signin', {
      question_id: question_id,
      user_answer: user_answer
    }, {}, 0, 1);
  } else {
    res.send("Something Went Wrong");
  };

  function submit_answer(data, user_data, req, res) {
    var question_id = data.question_id;
    var user_answer = data.user_answer;
    if (question_id) {
      question_id = question_id.replace(/\'/g, "");
    }
    if (user_answer) {
      user_answer = user_answer.replace(/\'/g, "");
    }
    client.query("SELECT answer,ans_num from questions where id=" + question_id, function(err, RES) {
      if (err) {
        console.log(err);
      } else {
        var answer = RES.rows[0].answer;
        var ans_num = RES.rows[0].ans_num;
        var total_answers = 0;
        var answers_percent = [];
        var answers = [0,0,0,0,0,0,0,0];
        var max_index = 0;
        var max_temp = 0;
        client.query("SELECT * FROM users_answers WHERE user_id=" + user_data.id + " AND question_id=" + question_id + "", function(err, RES) {
          if (err) {
            console.log(err);
          } else {
            var answers_length = RES.rows.length;
            var percent_query = "SELECT (SELECT count(user_answer) from users_answers WHERE user_answer='1' AND question_id=" + question_id + ") as ans_1";
            for (var i = 1; i < ans_num; i++) {
              percent_query += ",(SELECT count(user_answer) from users_answers WHERE user_answer='" + (i + 1) + "'  AND question_id=" + question_id + ") as ans_" + (i + 1)
            }
            // console.log(percent_query)
            client.query("SELECT user_answer,COUNT(user_id) from users_answers where question_id=" + question_id + " GROUP BY user_answer ORDER BY user_answer", function(err, RES) {
              if (err) {
                console.log(err);
              } else {
                for (var i = 0; i < RES.rows.length; i++) {
                  answers[(RES.rows[i].user_answer - 1)] = Number(RES.rows[i].count)
                  total_answers += Number(RES.rows[i].count);
                }
                for (var i = 0; i < ans_num; i++) {
                  if (total_answers == 0) {
                    answers_percent.push(0);
                  } else {
                    var percent = (answers[i] / total_answers) * 100;
                    answers_percent.push(percent);
                    if (percent > max_temp) {
                      max_temp = percent;
                      max_index = i;
                    }
                  }
                }
                console.log(answers)
                console.log(answers_percent)
                console.log(max_index)
                if (Number(answer)) {
                  if (answers_length == 0) {
                    client.query("INSERT INTO users_answers (user_id,question_id,user_answer,question_answer,user_result,user_points) VALUES(" + user_data.id + "," + question_id + ",'" + user_answer + "','" + answer + "','" + ((answer == user_answer) ? "right',10)" : "wrong',0)"), function(err, RES) {
                      if (err) {
                        console.log(err)
                      }
                    });
                  }
                  if (answer == user_answer) {
                    res.send({
                      result: 'right',
                      ans_num: ans_num,
                      answered: true,
                      answer: answer,
                      points: ((answers_length == 0)?10:0),
                      answers: answers,
                      answers_percent: answers_percent,
                      total_answers:total_answers,
                      max_index: max_index
                    });
                  } else {
                    res.send({
                      result: 'wrong',
                      ans_num: ans_num,
                      answered: true,
                      answer: answer,
                      points: 0,
                      answers: answers,
                      answers_percent: answers_percent,
                      total_answers:total_answers,
                      max_index: max_index
                    });
                  }
                } else {
                  var points = 0;
                  if (total_answers < (2 * ans_num)) {
                    points = 1;
                    res.send({
                      result: 'not enough users answers',
                      result_id:0,
                      ans_num: ans_num,
                      answered: false,
                      points: ((answers_length == 0) ? 1 : 0),
                      answers: answers,
                      answers_percent: answers_percent,
                      total_answers:total_answers,
                      max_index: max_index
                    });
                  }else if (answers_percent[max_index] == answers_percent[user_answer - 1]) {
                    res.send({
                      result: 'right',
                      result_id:2,
                      ans_num: ans_num,
                      answered: false,
                      points: ((answers_length == 0) ? 10 : 0),
                      answers: answers,
                      answers_percent: answers_percent,
                      total_answers:total_answers,
                      max_index: max_index
                    });

                  }  else if (answers_percent[max_index] - answers_percent[user_answer - 1] < 10) {
                    points = 5;
                    res.send({
                      result: 'range less than 10',
                      result_id:1,
                      ans_num: ans_num,
                      answered: false,
                      points: ((answers_length == 0) ? 5 : 0),
                      answers: answers,
                      answers_percent: answers_percent,
                      total_answers:total_answers,
                      max_index: max_index
                    });

                  } else {
                    res.send({
                      result: 'wrong',
                      result_id:3,
                      ans_num: ans_num,
                      answered: false,
                      points: 0,
                      answers: answers,
                      answers_percent: answers_percent,
                      total_answers:total_answers,
                      max_index: max_index
                    });
                  }
                  if (answers_length == 0) {
                    client.query("INSERT INTO users_answers (user_id,question_id,user_answer,question_answer,user_points) VALUES(" + user_data.id + "," + question_id + ",'" + user_answer + "','" + answer + "'," + points + ")", function(err, RES) {
                      if (err) {
                        console.log(err)
                      }
                    });
                  }

                }
              }
            });

          }
        });
      }
    });
  };

}
