exports.exec = function(req, res) {
  var question_id = Number(req.body.question_id);
  if (!question_id) {
    res.send({
      err: 1
    });
  } else {
    client.query("UPDATE questions SET isapproved=1 where id=" + question_id, function(err, RES) {
      if (err) {
        console.log(err);
        res.send({
          err: 1
        });
      } else {
        res.send({
          err: 0
        });
      }
    });
  }
}
