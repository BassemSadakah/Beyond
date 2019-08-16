var stop = 0;
var first_time = 1
var questions = [];
var is_follow_us_fb_shown=false;
var done = 0;
// var correct_color='rgba(0,255,0,0.2)';
// var correct_color='#76ff5ddb';
var correct_color = '#3eec34';
// var wrong_color='rgba(255,0,0,0.2)';
var wrong_color = '#ff000063';

function get_questions() {
  $('.xxxxx').append(`
    <div class="loading">
      <center>
        <div style="margin:` + ((first_time) ? '50px ' : '') + `20px;">
        <small style="text-align:center;font-weight:100;opacity:0.7;">Loading...</small>
      <!--  <br><img style="width:15%" src="img/loading.gif"> -->
      </center>
    </div>
`);
  $.ajax({
    type: "POST",
    data: {
      questions: questions
    },
    url: "/api/get_questions",
    success: function(data) {
      if (data.length == 0) {done++;} else {done = 0;}
      $('.loading').remove();
      for (var i = 0; i < data.length; i++) {questions.push(data[i].id);var choices = '';var array = [data[i].ans_a, data[i].ans_b, data[i].ans_c, data[i].ans_d, data[i].ans_e, data[i].ans_f, data[i].ans_g, data[i].ans_h];
        for (var x = 0; x < data[i].ans_num; x++) {
          var letter = array[x];
          choices += `<div class="answer answer_border answer_hover hide" value='` + (x + 1) + `'>` + escapeHtml(letter) + `<div id="background"></div></div>`;
        }
        $('.xxxxx').append(`
  <div class="item">
    <div class="item_nav_top">
      <div class="nav_float_right">
        <div class="nav_close"></div>
        <div class="nav_minimize"></div>
        <div class="nav_idk"></div>
      </div>
      <div class="nav_float_left">
        <img
          src="` + ((data[i].profile_pic) ? data[i].profile_pic : '/img/default_profile_pic.png') + `">
        <small>uploaded by ` + escapeHtml(data[i].first_name) + ' ' + ((data[i].last_name) ? escapeHtml(data[i].last_name) : '') + `
        </small>
      </div>
    </div>

    <div class="item_question">` +
          ((data[i].question_img) ? `<div class="item_question_img"> <img src="` + data[i].question_img + `"> </div>  <hr>` : '') +

          `<p id="question_text" style="font-family: Righteous;color: rgba(0, 0, 0, 0.5);margin-top:10px;margin-left: 10px">` +
          ((data[i].question) ? escapeHtml(data[i].question) : '') + `</p>
      <hr>
    </div>` +

          ((data[i].answer_img) ? `<div class="item_answer">  <div class="item_answer_img"> <img src="` + (data[i].answer_img) + `">   </div>  </div>  <hr>` : '') +
          `
    <div id="choices" class="choices_` + data[i].id + `">` +

          choices

          +
          ` </div>
        <center>
          <button disabled style="height: 38px;width:76px" class="btn btn-success" onclick="submit_answer(` + data[i].id + `,this)">Submit</button>

    </center>
  </div>

        `);
      }

      $('.answer').on('click', function() {
        $('.answer').removeClass('answer_active');
        $('.answer').addClass('answer_border');
        $(this).addClass('answer_active');
        $(this).removeClass('answer_border');
        $(this).parent().next().children().attr('disabled', false);

      });
      if (!first_time) {
        stop = 0;
      } else {
        first_time = 0;
      }
      if (!is_follow_us_fb_shown){

        append_follow_us();
      }

    },
    error: function(jqXHR, textStatus, err) {
      // alert('text status ' + textStatus + ', err ' + err) //Remove in production
    }
  });
}
// #####################################################################
get_questions();
$.ajax({
  type: "GET",
  url: "/api/dashboard",
  success: function(data) {
    for (var i = 0; i < data.length; i++) {
      $('.side_bar_in').append(`
        <div class="item_score" >
              <div class="item_score_img">
                <img src="` + ((data[i].profile_pic) ? data[i].profile_pic : '/img/default_profile_pic.png') + `" onerror="this.src='/img/default_profile_pic.png'" alt="top profile_pic">
              </div>
                <p class='item_name'>` + (data[i].first_name ? escapeHtml(data[i].first_name) : '') + ' ' + (data[i].last_name ? escapeHtml(data[i].last_name) : '') + `</p>
              <div class="item_score_score" style='display:inline;float:right;font-family:righteous;margin-top:2px;'>
                <small>` + data[i].user_points + `</small>
              </div>
        </div>

        `);
    }
  },
  error: function(jqXHR, textStatus, err) {
    // alert('text status ' + textStatus + ', err ' + err) //Remove in production
  }
});




window.onscroll = function() {
  var winScroll = document.body.scrollTop || document.documentElement.scrollTop;
  var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  var scrolled = (winScroll / height) * 100;
  if (scrolled > 90 && !stop && done < 3) {
    stop = 1;
    get_questions();
  }
  // console.log(scrolled);
};


// $('.answer').on('click', function() {
//   $('.answer').removeClass('answer_active');
//   $('.answer').addClass('answer_border');
//   $(this).addClass('answer_active');
//   $(this).removeClass('answer_border');
//   $(this).parent().next().children().attr('disabled', false);
//
// });

function submit_answer(question_id, btn) {
  $(btn).attr('disabled', true);
  var user_answer = $('.answer_active').attr('value');
  $(btn).html(' <span class="spinner-border text-light" style="height:20px;width:20px;" role="status"></span>')
  $.ajax({
    type: "POST",
    url: "/api/submit_answer",
    data: {
      question_id: question_id,
      answer: user_answer
    },
    success: function(data) {
      console.log(data);
      $(btn).html('Show Answers');
      $(btn).removeClass('btn-success');
      $(btn).addClass('btn-primary')
      $(btn).css({
        width: 'auto'
      });
      $(btn).attr('hidden', false);
      $(btn).prop(onclick, '');
      $(btn).attr("onclick", "");
      $(btn).bind('click', click_stats(question_id, data, btn));

      function click_stats(question_id, data, btn) {
        return function() {
          $(btn).attr('hidden', true);
          console.log(question_id);
          console.log(data);

          for (var i = 0; i < $('.choices_' + question_id + ' .answer').length; i++) {
            $('.choices_' + question_id + ' .answer').eq(i).css({
              background: "linear-gradient(90deg, " + ((data.answers_percent[i] > 49) ? 'rgb(196, 255, 192)' : (data.answers_percent[i] > 24) ? '#ade8ef' : '#fff0b9') + ' ' + data.answers_percent[i] + "%, #FFFFFF " + (data.answers_percent[i]) + "%)"
            });
          }
          $('.choices_' + question_id).children().unbind('click');
          $('.choices_' + question_id).children().removeClass('answer_hover answer_active not_active hide');
          $('.choices_' + question_id).children().addClass('answer_border');
          $('.choices_' + question_id).parent().children().children().eq(1).html('<center><small>Total answers: ' + data.total_answers + '</small></center>')

        }
      }
      // $(btn).bind('click', onclick(question_id,data));*/
      $(btn).attr('disabled', false);
      if (data.answered) {
        if (data.result == 'wrong') {
          $('.choices_' + question_id + ' [value=' + user_answer + ']').addClass('animated shake')
          $('.choices_' + question_id + ' [value=' + user_answer + ']').css('background', wrong_color)
          $('.choices_' + question_id + ' [value=' + data.answer + ']').css('background', correct_color)
          $('.choices_' + question_id).parent().children().children().eq(1).html('<center><small>Wrong</small></center>')
        } else {
          // $('.choices_' + question_id + ' [value=' + data.answer + ']').css('background', 'rgba(0,255,0,0.2)');
          $('.choices_' + question_id + ' [value=' + data.answer + ']').css('background', correct_color);
          $('.choices_' + question_id).parent().children().children().eq(1).html('<center><small>Right</small></center>')
        }
        $('.choices_' + question_id + ' [value=' + data.answer + ']').removeClass('hide');
        $('.choices_' + question_id + ' [value=' + user_answer + ']').removeClass('hide ');
        $('.choices_' + question_id).children().removeClass('answer_hover');
        $('.choices_' + question_id + ' .hide').addClass('not_active');
        $('#score_num').text(Number($('#score_num').text()) + data.points);
      } else {


        if (data.result_id == 0) {
          $('.choices_' + question_id + ' [value=' + user_answer + ']').css('background', '#ade8ef');
          $('.choices_' + question_id).parent().children().children().eq(1).html('<center><small>We Can\'t tell if this\'s a correct answer</small></center>')
        } else if (data.result_id == 1) {
          $('.choices_' + question_id).parent().children().children().eq(1).html('<center><small>We aren\'t sure if this\'s a wrong answer</small></center>')
          $('.choices_' + question_id + ' [value=' + user_answer + ']').css('background', '#ade8ef');
        } else if (data.result_id == 2) {
          $('.choices_' + question_id + ' [value=' + user_answer + ']').css('background', correct_color);
          $('.choices_' + question_id).parent().children().children().eq(1).html('<center><small>Right</small></center>')
          // $('.choices_' + question_id + ' [value=' + user_answer + ']').css('background', 'rgba(0,255,0,0.2)');
        } else if (data.result_id == 3) {
          $('.choices_' + question_id + ' [value=' + user_answer + ']').addClass('animated shake')
          $('.choices_' + question_id + ' [value=' + user_answer + ']').css('background', wrong_color)
          $('.choices_' + question_id).parent().children().children().eq(1).html('<center><small>Wrong</small></center>')
          $('.choices_' + question_id + ' [value=' + (data.max_index + 1) + ']').css('background', correct_color)
        }
        $('.choices_' + question_id + ' [value=' + data.answer + ']').removeClass('hide');
        $('.choices_' + question_id + ' [value=' + user_answer + ']').removeClass('hide ');
        $('.choices_' + question_id).children().removeClass('answer_hover');
        $('.choices_' + question_id + ' .hide').addClass('not_active');
        $('#score_num').text(Number($('#score_num').text()) + data.points);
      }
      // $('.choices_' + question_id).parent().children().children().eq(1).html('<center><small>Total answers: ' + data.total_answers + '</small></center>')

    },
    error: function(jqXHR, textStatus, err) {
      $(btn).attr('disabled', false);
      $(btn).html('Submit');

      // alert('text status ' + textStatus + ', err ' + err) //Remove in production
    }
  });
}
