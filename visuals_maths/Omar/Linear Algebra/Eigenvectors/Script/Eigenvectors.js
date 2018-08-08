var layout = {
    width: 450, height: 500,
    margin: {l:0, r:0, t:0, b:0},
    hovermode: "closest",
    showlegend: false,
    scene: {
        xaxis: {range: [-6, 6], zeroline: true, autorange: true,},
        yaxis: {range: [-6, 6], zeroline: true, autorange: true,},
        zaxis: {range: [-6, 10], zeroline: true, autorange: true,},
        aspectratio: {x:1, y:1, z:1},
    }
  }

  function initPlot() {
      Plotly.purge("graph");

      var data = [];
      var a = new Line2d([[2,2],[4,3]]);
      data.push(a.arrowHead(red,3));
      data.push(a)
      Plotly.newPlot("graph", data, layout);
      return;
  }
initPlot()


  function main() {
      /*Jquery*/ //NB: Put Jquery stuff in the main not in HTML
      $("input[type=range]").each(function () {
          var displayEl;
          /*Allows for live update for display values*/
          $(this).on('input', function(){
              //Displays: (FLT Value) + (Corresponding Unit(if defined))
              $("#"+$(this).attr("id") + "Display").text( $(this).val() + $("#"+$(this).attr("id") + "Display").attr("data-unit") );

              updatePlot(); //Updating the plot is linked with display (Just My preference)
          });

      });


      initPlot();

  }
  $(document).ready(main); //Load main when document is ready.
