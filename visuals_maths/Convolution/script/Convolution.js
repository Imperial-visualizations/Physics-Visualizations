var resolution=1000;
var L = 5;
var x=numeric.linspace(-L,L,resolution);

var s =[0,1,2,3,4,5];
alert(s.reverse());

function initCarte(type){
    return;
}



// convert string to numbers
function converting(string){
    f = eval(string);
    return f;
}


function main() {
    /*Jquery*/ //NB: Put Jquery stuff in the main not in HTML
    $("input[type=range]").each(function () {
        /*Allows for live update for display values*/
        $(this).on('input', function(){
            //Displays: (FLT Value) + (Corresponding Unit(if defined))
            $("#"+$(this).attr("id") + "Display").text( $(this).val() + $("#"+$(this).attr("id") + "Display").attr("data-unit"));
            //NB: Display values are restricted by their definition in the HTML to always display nice number.
            updatePlot(); //Updating the plot is linked with display (Just My preference)
        });

    });

    /*Tabs*/
    $(function() {
        $('ul.tab-nav li a.button').click(function() {
            var href = $(this).attr('href');
            $('li a.active.button', $(this).parent().parent()).removeClass('active');
            $(this).addClass('active');
            $('.tab-pane.active', $(href).parent()).removeClass('active');
            $(href).addClass('active');

            initCarte(href); //re-initialise when tab is changed
            return false;
        });
    });



    //The First Initialisation - I use 's' rather than 'z' :p
    initCarte("#maths");
}
$(document).ready(main); //Load main when document is ready.