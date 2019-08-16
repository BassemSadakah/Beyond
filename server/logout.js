exports.exec=function(req,res){
  var session_id = req.cookies['session_id'];
  if (session_id == undefined) {
    res.redirect('signin');
  } else {
    session_id = req.cookies['session_id'].replace(/\'/g, "");
    res.clearCookie("session_id");
    client.query("delete from sessions where session_id='" + session_id + "'", (err, RES) => {
      if (err){
        console.log(err);
      }
    });
    res.redirect('/');
}
}
