$('.graphSlider').on('click',function(){
    let text = $($(this).children('.showhide')[0]).is(":hidden")? ["Hide",180]:["Show",0];
    $($(this).children('.showhide')[0]).slideToggle(400);
    $($(this).children("span")[0]).html(text[0]);
    $($(this).children("svg")[0]).css("transform","rotate("+text[1]+"deg)");


});
$(window).on('load', function() {
   $('.graphSlider').each(function(){
       console.log($(this).children());
      $($(this).children('.showhide')[0]).hide();
   });
});
