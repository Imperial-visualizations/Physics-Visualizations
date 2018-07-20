$('.graphSlider').on('click',function(){
    let text = $($(this).children('.showhide')[0]).is(":hidden")? ["Hide",180]:["Show",0];
    $($(this).children('.showhide')[0]).slideToggle(400);
    $($(this).children("span")[0]).html(text[0]);
    $($(this).children("svg")[0]).css("transform","rotate("+text[1]+"deg)");
});
$(window).on('load', function() {
   $('.graphSlider').each(function(){
      $($(this).children('.showhide')[0]).hide();
   });
   $('.sliderContainer').each(function(){
       let marker = $(this).children('.marker');
       let input = $(this).children('input');
       $($(this).children('span')[0]).html(input.attr('min')+"eV");
       $($(this).children('span')[1]).html(input.attr('max')+"eV");
       marker.html(Math.floor(input.val())+"eV");
       //Movement Code
       let pptick = parseFloat(input.css('width').slice(0,-2))/(parseFloat(input.attr('max')) - parseFloat(input.attr('min')));
       marker.css('left',(pptick-2) * parseFloat(input.val()) - parseFloat(marker.css('width').slice(0,-2))/2);
       marker.css('top',-2*parseFloat(input.css('height').slice(0,-2)) - parseFloat(marker.css('padding-top').slice(0,-2)));
   });
});
$('.sliderContainer input[type=range]').on('input',function(){
    let marker = $(this).siblings('.marker');
    marker.html(Math.floor($(this).val())+"eV");

    //Movement Code
    let pptick = parseFloat($(this).css('width').slice(0,-2))/(parseFloat($(this).attr('max')) - parseFloat($(this).attr('min')));
    marker.css('left',(pptick-2) * parseFloat($(this).val()) - parseFloat(marker.css('width').slice(0,-2))/2);
});
$('.sliderContainer').hover(function(){
    let marker = $(this).children('.marker');
    marker.css('top',-5);
},function (){
    let marker = $(this).children('.marker');
    marker.css('top',-2*parseFloat($(this).children('input').css('height').slice(0,-2)) - parseFloat(marker.css('padding-top').slice(0,-2)));
});
