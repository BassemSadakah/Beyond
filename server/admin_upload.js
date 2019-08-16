exports.exec = function(req, res) {
  var admin_name = req.body.admin_name;
  var question = req.body.question;
  var exam_type = req.body.quiz_type;
  var question_img = req.body.question_img;
  var answer_img = req.body.answer_img;
  var question_lang = 0;
  question_lang += (req.body.lang_en && req.body.lang_ar) ? 0 : (req.body.lang_en && req.body.lang_ar) ? 0 : (!req.body.lang_en && !req.body.lang_ar) ? 0 : (req.body.lang_en) ? 1 : 2;
  var ans_num = 0;
  var ans = [];
  ans[0] = ((req.body.ans_a == '') ? req.body.ans_a_img : req.body.ans_a);
  ans[1] = ((req.body.ans_b == '') ? req.body.ans_b_img : req.body.ans_b);
  ans[2] = ((req.body.ans_c == '') ? req.body.ans_c_img : req.body.ans_c);
  ans[3] = ((req.body.ans_d == '') ? req.body.ans_d_img : req.body.ans_d);
  ans[4] = ((req.body.ans_e == '') ? req.body.ans_e_img : req.body.ans_e);
  ans[5] = ((req.body.ans_f == '') ? req.body.ans_f_img : req.body.ans_f);
  ans[6] = ((req.body.ans_g == '') ? req.body.ans_g_img : req.body.ans_g);
  ans[7] = ((req.body.ans_h == '') ? req.body.ans_h_img : req.body.ans_h);
  answer = req.body.answer;
  var answer_exp = req.body.ans_exp;
  ans.forEach(function(ans) {
    if (ans) {
      ans_num++;
    }
  });
  if (answer != '1' && answer != '2' && answer != '3' && answer != '4' && answer != '5' && answer != '6' && answer != '7' && answer != '8' && answer) {
    res.render('upload_admin', {
      err: 1,
      msg: "Answer has to be from 1 to 8",
      msg_type: "alert-danger"
    });
  } else if (admin_name.toLowerCase() != 'fady' && admin_name.toLowerCase() != 'shady' && admin_name.toLowerCase() != 'bassem' && admin_name.toLowerCase() != 'amir' && admin_name.toLowerCase() != 'haidy') {
    res.render('upload_admin', {
      err: 1,
      msg: "Admin name not allowed",
      msg_type: "alert-danger"
    });
  } else if (2 == 5) {
    res.render('upload_admin', {
      err: 1,
      msg: "File excceded maxmium size",
      msg_type: "alert-danger"
    });
  } else if (exam_type != 'iq' && exam_type != 'math' && exam_type != 'science' && exam_type != 'english') {
    res.render('upload_admin', {
      err: 1,
      msg: "Exam type not supported",
      msg_type: "alert-danger"
    });
  } else if (ans_num < 2) {
    res.render('upload_admin', {
      err: 1,
      msg: "Choices have to be greater than or equal two",
      msg_type: "alert-danger"
    });
  } else if (!question && !question_img) {
    res.render('upload_admin', {
      err: 1,
      msg: "You can't leave the Question blank",
      msg_type: "alert-danger"
    });
  } else {
    var query = ("INSERT INTO questions (admin_name,question,question_img,answer_img,question_lang,ans_num,ans_a,ans_b,ans_c,ans_d,ans_e,ans_f,ans_g,ans_h,answer,answer_exp,exam_type) VALUES ('" + admin_name + "'," + ((!question) ? "NULL" : ("'" + question + "'")) + "," + ((!question_img) ? "NULL" : ("'" + question_img + "'")) + "," + ((!answer_img) ? "NULL" : ("'" + answer_img + "'")) + ",'" + question_lang + "','" + ans_num + "'," + ((!ans[0]) ? "NULL" : ("'" + ans[0] + "'")) + "," + ((!ans[1]) ? "NULL" : ("'" + ans[1] + "'")) + "," + ((!ans[2]) ? "NULL" : ("'" + ans[2] + "'")) + "," + ((!ans[3]) ? "NULL" : ("'" + ans[3] + "'")) + "," + ((!ans[4]) ? "NULL" : ("'" + ans[4] + "'")) + "," + ((!ans[5]) ? "NULL" : ("'" + ans[5] + "'")) + "," + ((!ans[6]) ? "NULL" : ("'" + ans[6] + "'")) + "," + ((!ans[7]) ? "NULL" : ("'" + ans[7] + "'")) + "," + ((!answer) ? "NULL" : ("'" + answer + "'")) + "," + ((!answer_exp) ? "NULL" : ("'" + answer_exp + "'")) + ",'" + exam_type + "')");
    client.query(query, (err, RES) => {
      if (err) {
        console.log(err);
        res.render('upload_admin', {
          err: 1,
          msg: "Something Went Wrong",
          msg_type: "alert-danger"
        });
      } else {
        res.render('upload_admin', {
          err: 1,
          msg: "Question uploaded",
          msg_type: "alert-success"
        });
      }
    });
  }
}
