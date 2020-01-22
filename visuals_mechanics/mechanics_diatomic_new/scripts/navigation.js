function flexAdjust() {
	$('.flexyHold').each(function() {
		let elemHeight = 0;
		$($(this).children(':not(.flexy)')).each(function() {
			elemHeight += parseFloat($(this).css('height').slice(0, -2));
			elemHeight += parseFloat($(this).css('margin-top').slice(0, -2));
			elemHeight += parseFloat($(this).css('margin-bottom').slice(0, -2));
		});
		$($(this).children('.flexy')).css('height', parseFloat($(this).css('height').slice(0, -2)) - elemHeight);
        $(this).attr('data-elemHeight',elemHeight);
	})
}

$('.graphSlider').on('click', function() {
	let text = $($(this).children('.showhide')[0]).is(":hidden") ? ["Hide " + $($(this).children('.showhide')).attr('label'), 180] : ["Show " + $($(this).children('.showhide')).attr('label'), 0];
	$($(this).children('.showhide')[0]).slideToggle(400);
	$($(this).children("span")[0]).html(text[0]);
	$($(this).children("svg")[0]).css("transform", "rotate(" + text[1] + "deg)");
});
$(document).ready(function() {
	flexAdjust();
	$(".container").hide();
	$('.graphSlider').each(function() {
		$($(this).children('.showhide')[0]).hide();
		$($(this).children('span')).html("Show " + $($(this).children('.showhide')).attr('label'));
	});
	$('.sliderContainer').each(function() {
		$($(this).children('.sliderMin')).html($(this).children('input').attr('min') + $($(this).children('input')).attr('data-unit'));
		$($(this).children('.sliderMax')).html($(this).children('input').attr('max') +  $($(this).children('input')).attr('data-unit'));
	});

});
$('.toggle').on('click',function(){
	if($(this).siblings('input').attr('type') === "range"){
		$(this).siblings('input').attr('type','number');
		$(this).siblings('span').hide();
		$(this).before("<span>"+$(this).siblings('input').attr('data-unit')+"</span>");
		$(this).siblings('input').removeAttr('max');
		$(this).html('Slider');
	}else{
		$(this).siblings('input').attr('type','range');
		$(this).prev().remove();
		$(this).siblings('input').attr('max','10');
		$(this).siblings('span').show();
		$(this).html("Text");
	}
});
