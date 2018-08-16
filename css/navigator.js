let hovercolor = "rgba(244, 75, 66, 1)"


let title = $("title").html()
let pagenames = [],
navbar = $("<div class='navbar' id='navbar'></div>"),
navtitle = $(`<p>${title}</p>`);
navtitle.css({"color": "white", "font-size": "3.2vw", "text-align": "center"});

let navicon = $("<object type='image/svg+xml' data='https://rawgit.com/Imperial-visualizations/Physics-Visualizations/master/css/navicon.svg' class='navicon' id='navicon'></object>");
let mousediv=$("<div class='mousediv' id='mousediv'></div>");
let dropdown=$("<div id='dropdown'' class='dropdown'> </div>");

$("body").append(navbar);
$("#navbar").append(navtitle);

$("#navbar").append(navicon);
$("body").append(mousediv);
$("body").append(dropdown);

function get_pagename(htmlname){
    htmlname=htmlname.slice(1, htmlname.length-5)
    htmlname = htmlname.replace("-"," ")
    return(htmlname)
}

for (let i = 0; i < pages.length; i++) {
    pagenames[i]=get_pagename(pages[i])
}

let newelement = $(`<div class='pagetitle' id='Dropdowntitle'>${title}</div>`);
newelement.css({"height": (60/pages.length).toString()+"vh" , "top": (8).toString()+"vh","font-size": 2.5+"vw","text-align":"center"})
$("#mousediv").append(newelement);

for (let i = 0; i < pages.length; i++) {
    let difference= 70/pages.length, height = difference*i +25
    let newelement = $("<div class='pagetitle' id='pagetitle'>" + (i+1).toString() +". " + pagenames[i]+"</div>");
    let newbackground = $("<div></div>");
    newelement.attr("name",pages[i])
    newelement.css({"height": (difference).toString()+"vh" , "top": (height).toString()+"vh","font-size": (2).toString()+"vw","line-height": (difference).toString()+"vh"})
    newbackground.css({"transition-delay": "0s","transition-duration": "0s","height": (difference).toString()+"vh" ,"width": "30vw", "top": (height).toString()+"vh","border-top": "1px solid rgb(252, 252, 252)","border-bottom":"1px solid rgb(252, 252, 252)","position": "absolute","background-color":"rgba(255, 255, 255,0.2)",})
    $("#mousediv").append(newelement);
    $("#dropdown").append(newbackground);
}

$("#mousediv").mouseover(function(){

    $("#dropdown").animate({width: "30vw"}, 0, "linear");
    $("#mousediv").animate({width: "30vw", height: "100vh"},0,"linear");
    $(".pagetitle").animate({width: "30vw"},0,"linear");
})

$("#mousediv").mouseout(function(){

    $("#dropdown").animate({width: "0vw"}, 0, "linear")
    $(".pagetitle").animate({width: "0vw"},0,"linear")
    $("#mousediv").animate({height: "5vh",width: "5vw"},0,"linear")
})

$(".pagetitle").mouseover(function() {
    if ($(this).attr("id").toString() != "Dropdowntitle") {
    $(this).css({"background-color": hovercolor})
}
})

$(".pagetitle").mouseout(function(){
    $(this).css({"background-color": "rgba(244, 75, 66, 0)"})
})

$(".pagetitle").on("click",function(){
    window.location.href = $(this).attr("name");
})

function flexAdjust() {
	$('.flexyHold').each(function() {
		let elemHeight = 0;
		$($(this).children(':not(flexy)')).each(function() {
			elemHeight += parseFloat($(this).css('height').slice(0, -2));
			elemHeight += parseFloat($(this).css('margin-top').slice(0, -2));
			elemHeight += parseFloat($(this).css('margin-bottom').slice(0, -2));
		})
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
