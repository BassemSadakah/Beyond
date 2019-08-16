exports.exec = function(data, user_data, req, res) {
var question = (req.body.question_text) ? (req.body.question_text.replace(/\'/g, "''")): '';
var question_type = (req.body.question_type) ? (req.body.question_type.replace(/\'/g, "")): '';
var question_img = (req.body.question_img) ? (req.body.question_img.replace(/\'/g, "")): '';
var answer_img = (req.body.answer_img) ? (req.body.answer_img.replace(/\'/g, "")): '';
var ans_num = req.body.choices.length;
var choices = req.body.choices;
var answer = (req.body.correct_ans) ? (req.body.correct_ans.replace(/\'/g, "")): '';

for (var i = (choices.length - 1); i < 8; i++) {
  choices.push('');
}
for (var i = 0; i < choices.length; i++) {
  choices[i]=choices[i].replace(/\'/g, "''");
}
if (Number(answer) > Number(ans_num) || Number(answer) < 0) {
  res.send({
    err: 1,
    msg: "Invalid Correct answer",
  });
} else if (2 == 5) {
  res.send({
    err: 1,
    msg: "File excceded maxmium size",
  });
} else if (question_type != 'iq' && question_type != 'math' && question_type != 'science' && question_type != 'english') {
  res.send({
    err: 1,
    msg: "Exam type not supported",
  });
} else if (ans_num < 2 || ans_num > 8) {
  res.send({
    err: 1,
    msg: "Choices have to be greater than or equal two",
  });
} else if (!question && !question_img) {
  console.log(question)
  console.log(question_img)
  res.send({
    err: 1,
    msg: "You can't leave the Question blank",
  });
} else {
  console.log('5')
  var query = ("INSERT INTO questions (user_id,question,question_img,answer_img,ans_num,ans_a,ans_b,ans_c,ans_d,ans_e,ans_f,ans_g,ans_h,answer,question_type,isapproved) VALUES (" + user_data.id + "," + ((!question) ? "NULL" : ("'" + question + "'")) + "," + ((!question_img) ? "NULL" : ("'" + question_img + "'")) + "," + ((!answer_img) ? "NULL" : ("'" + answer_img + "'")) + ",'" + ans_num + "'," + ((!choices[0]) ? "NULL" : ("'" + choices[0] + "'")) + "," + ((!choices[1]) ? "NULL" : ("'" + choices[1] + "'")) + "," + ((!choices[2]) ? "NULL" : ("'" + choices[2] + "'")) + "," + ((!choices[3]) ? "NULL" : ("'" + choices[3] + "'")) + "," + ((!choices[4]) ? "NULL" : ("'" + choices[4] + "'")) + "," + ((!choices[5]) ? "NULL" : ("'" + choices[5] + "'")) + "," + ((!choices[6]) ? "NULL" : ("'" + choices[6] + "'")) + "," + ((!choices[7]) ? "NULL" : ("'" + choices[7] + "'")) + "," + ((!answer) ? "NULL" : ("'" + answer + "'")) + ",'" + question_type + "',0)");
  client.query(query, (err, RES) => {
    if (err) {
      console.log(err);
      res.send({
        err: 1,
        msg: "Something Went Wrong",
      });
    } else {
      res.send({
        err: 0,
        msg: "Question uploaded",
      });
    }
  });
}
}
