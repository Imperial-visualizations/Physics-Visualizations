$('.container').hide();

$(window).on('load', function() {
    $('#spinner').hide();
    $('.container').show();//show container after loading finishes
});
// Changes svg arrow depending on whether div is being hidden or shown
$('.derivationButton.row').on('click', function() {
    $(this).siblings('.hide-on-click').toggle()

    if ($(this).find("polygon").attr("points") === "0,0 38,16 0,32") {
        $(this).find("polygon").attr("points", "0,0 38,0 18,32")
    } else {
        $(this).find("polygon").attr("points", "0,0 38,16 0,32")
    }
});
let pages = ["1Derivation.html", "1Euler Force.html", "1Centrifugal Force.html"];