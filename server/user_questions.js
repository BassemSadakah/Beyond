exports.exec = function(data, user_data, req, res) {
  var offset = req.query.offset * 10;
  if (!Number(offset) && Number(offset)!=0) {
    res.send({
      err: 1
    });
  } else {
    client.query("SELECT questions.id,questions.user_id,questions.question,questions.question_img,questions.answer_img,questions.question_type,questions.ans_num,questions.ans_a,questions.ans_b,questions.ans_c,questions.ans_c,questions.ans_d,questions.ans_e,questions.ans_f,questions.ans_g,questions.ans_h FROM questions where isapproved=1 AND user_id=" + user_data.id + " LIMIT 10 OFFSET " + offset, function(err, RES) {
      if (err) {
        console.log(err);
      } else {
        res.send(RES.rows);
      }
    });
  }
}
