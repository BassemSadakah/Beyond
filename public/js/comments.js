$('.like').on('click',function(){
    $.ajax({
        type: "GET",
        url: "/",
        success: function (data) {
            $('.heart_icon,.like_text').css('color','red');
         },
        error: function (jqXHR, textStatus, err) { }
    });
})
$('.report').on('click',function(){
    $.ajax({
        type: "GET",
        url: "/",
        success: function (data) {
            $('.report_icon,.report_text').css('color','yellowgreen');
         },
        error: function (jqXHR, textStatus, err) { }
    });
})
autosize($('.comment_input'));
