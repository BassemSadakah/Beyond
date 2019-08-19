$('#add').on('click', function () {
  if ($('#all input').length == 8) {
    $('#add h1').text('Only 8 choices are allowed');
    $('#add h1').css('font-size', '20px');
    $('#add').addClass('animated shake bg-danger');
  } else {
    $('#all').append('<input type="search" value=" " class="choice_in answer answer_border form-control xxx">')
    console.log($('#all input').length);
    document.getElementsByClassName("choice_in")[$('#all input').length - 3].addEventListener("search", function (event) {
      this.remove();
      if ($('#add').hasClass('bg-danger')) {
        $('#add h1').css('font-size', '40px');
        $('#add h1').text('+');
        $('#add').removeClass('animated shake bg-danger');
      }
    });
    document.getElementsByClassName("choice_in")[$('#all input').length - 3].addEventListener("input", function (event) {
      if (this.value == "") {
        this.value = " ";
      }
    });

  }
});
// $('.exam_type').on('click',function(){
//     $('.item_question').attr('hidden',false);
//     $('.item_question').addClass('animated fadeInLeft');
// });








$('#btn_upload').on('click', function () {
  if (!$('#question_txt').val() && !$('#question_image')[0].src.startsWith('blob')) {
    $('#err_alert').text("You have to enter your question or upload an image instead");
    $('#err_alert').prop('hidden', false);
    document.getElementById('err_alert').scrollIntoView(true);
  } else if (!$('#all input')[0].value || !$('#all input')[1].value) {
    $('#err_alert').text("You have to enter at least 2 choices for your question ");
    $('#err_alert').prop('hidden', false);
    document.getElementById('err_alert').scrollIntoView(true);
  }


  else if ($('#btn_upload').html() == 'Next') {

    $('#question_div').attr('hidden', true);
    $('#preview_div').attr('hidden', false);
    $('#preview_div').addClass('animated fadeInRight');
    if ($('#question_txt').val()) {
      $('#question_text').html(escapeHtml($('#question_txt').val()));
    } else {
      $('#question_text').html('');
    }


    if ($('#question_image')[0].src.startsWith('blob')) {
      $('.question_image').prepend(`<div class="item_question_img item_question_del">
        <img id="item_question_img" src="">
        </div>
          <hr class="item_question_del"> `)
      $('#item_question_img')[0].src = $('#question_image')[0].src;
    }

    if ($('#answer_image')[0].src.startsWith('blob')) {
      $('#choices').before(`
        <div class="item_answer">
          <div class="item_answer_img item_answer_del">
            <img id="item_answer_img" src="">
          </div>
        </div>
        <hr class="item_answer_del">
        `)
      $('#item_answer_img')[0].src = $('#answer_image')[0].src;
    }
    for (var i = 0; i < $('#all input').length; i++) {
      if ($('#all input')[i].value.replace(/\ /g, "") != '') {
        $('#choices').append('<div class="answer_preview answer_border answer_hover hide" value="' + (i + 1) + '">' + escapeHtml( $('#all input')[i].value) + '<div id="background"></div> </div>');
      } else {
        $('#all input')[i].remove();
      }
    }
    $('#choices').append('<div hidden class="answer_preview answer_border answer_hover hide" value="0">I don\'t Know the answer<div id="background"></div> </div>');

    // *****************************COPIED FROM js/home_signed.js *******************
    $('.answer_preview').on('click', function () {
      console.log('ssss');
      $('.answer_preview').removeClass('answer_active');
      $('.answer_preview').addClass('answer_border');
      $(this).addClass('answer_active');
      $(this).removeClass('answer_border');
      $(this).parent().next().children().attr('disabled', false);
    });

    // *****************************COPIED FROM js/home_signed.js *******************
  }
});

function upload_back() {
  $('#preview_div').attr('hidden', true);
  $('#question_div').attr('hidden', false);
  $('#question_div').addClass('animated fadeInLeft');
  $('.item_question_del').remove();
  $('.item_answer_del').remove();
  $('#choices').html('');

}
function ans_yes() {
  $('#btn_upload').html('Next');
}

function ans_no() {
  $('#btn_upload').html('Upload');
}

$('#question_img_btn').bind('click', function () {
  $('#question_img').click();
});
$('#answer_img_btn').bind('click', function () {
  $('#answer_img').click();
});

function question_img_upload() {
  var file = $('#question_img')[0];
  $('#question_image')[0].src = window.URL.createObjectURL(file.files[0]);
  var reader = new FileReader();
  reader.onload = function () {
    var dataURL = reader.result;
    var output = document.getElementById('question_base64');
    output.value = dataURL;
  }
  reader.readAsDataURL(file.files[0]);
}

function answer_img_upload() {
  var file = $('#answer_img')[0];
  $('#answer_image')[0].src = window.URL.createObjectURL(file.files[0]);
  var reader = new FileReader();
  reader.onload = function () {
    var dataURL = reader.result;
    var output = document.getElementById('answer_base64');
    output.value = dataURL;
  }
  reader.readAsDataURL(file.files[0]);
}

$('#submit').on('click', function () {
  var choices = [];
  for (var i = 0; i < $('.answer_preview').length - 1; i++) {
    choices.push($('.answer_preview')[i].textContent.trim(' '))
  }

  $('#submit').html(' <span class="spinner-border text-light" style="height:20px;width:20px;" role="status"></span>')
  $('#submit').prop('disabled',true)



  $.ajax({
    type: "POST",
    url: "/upload",
    data: {
      question_type: $('.exam_type input:checked').val(),
      question_img: $('input[name="question_base64"]').val(),
      question_text: $('#question_txt').val(),
      answer_img: $('input[name="answer_base64"]').val(),
      choices: choices,
      correct_ans: $('.answer_active').attr('value')
    },
    success: function (data) {
      // $('#preview_div').html('<div ><img id="check_sign" src="img/checkk.gif"><br><h2 style="text-align:center;color:#50c37c; margin-top:-75px;">Question Uploaded</h2> <br><center><div style="margin-bottom:20px;"><small style="text-align:center;font-weight:100;opacity:0.7;">We are redirecting you</small><br><img style="width:40%" src="img/loading.gif"></center></div></div>')
      $('#preview_div').attr('hidden',true);
      $('#success_div').attr('hidden',false);
      setTimeout(function(){
          window.location.href='/';
      },2750)

    },

    error: function (jqXHR, textStatus, err) {

    }
  });
})


function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
