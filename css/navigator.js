let hovercolor = "rgba(244, 75, 66, 1)"

let pages = ["1First-Page.html","2Second-Page.html","3Third-Page.html","4Fourth-Page.html"]

let pagenames = [],
navbar = $("<div class='navbar' id='navbar'></div>"),
navtitle = $("<p>Title of your html</p>");
navtitle.css({"color": "white", "font-size": "3.2vw", "text-align": "center"});
let logo = $("<img src= 'https://raw.githubusercontent.com/Imperial-visualizations/Physics-Visualizations/master/css/logo.png'>");
logo.css({"right": "1vw", "top": "1vh", "position": "absolute","height": "6vh"});

let navicon = $("<object type='image/svg+xml' data='https://rawgit.com/Imperial-visualizations/Physics-Visualizations/master/css/navicon.svg' class='navicon' id='navicon'></object>");
let mousediv=$("<div class='mousediv' id='mousediv'></div>");
let dropdown=$("<div id='dropdown'' class='dropdown'> </div>");

$("body").append(navbar);
$("#navbar").append(navtitle);
$("#navbar").append(logo);
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

let newelement = $("<div class='pagetitle' id='Dropdowntitle'>Electrostatics</div>");
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