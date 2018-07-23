
$(".rightnav").on('click',function(){
    for (var i = 0; i < 10; i++){
        //note that window.location.href.slice(-6,-5) is the last character before .html in the url
        if(window.location.href.slice(-6,-5)== i.toString()) {
            window.location.href = window.location.href.slice(0,-6)+(i+1) + ".html"
        }
    }});

$(".rightnav").on("mouseenter", function() {
    $(".rightnav").css({"color":"#1a0433","font-size":"55px"})
}).on('mouseleave', function(){
    $(".rightnav").css({"color":"#330766","font-size":"50px"})
});

$(".leftnav").on('click',function(){
    for (var i = 0; i < 10; i++){
        //note that window.location.href.slice(-6,-5) is the last character before .html in the url
        if(window.location.href.slice(-6,-5)== i.toString()) {
            window.location.href = window.location.href.slice(0,-6)+(i-1) + ".html"
        }
    }});

$(".leftnav").on("mouseenter", function() {
    $(".leftnav").css({"color":"#1a0433","font-size":"55px"})
}).on('mouseleave', function(){
    $(".leftnav").css({"color":"#330766","font-size":"50px"})
});