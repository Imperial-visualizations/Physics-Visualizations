$('.container').hide();

      $(window).on('load', function() {
          $('#spinner').hide();
          $('.container').show();//show container after loading finishes
      })
      // JQuery functionality to allow hiding/showing vectors and also causes text to glow to draw user's attention to the interactive element
      $( "#Centrifugal_text" ).click(function() {
        $( "#Centrifugal_force" ).fadeToggle("slow", "linear");
        });
      $( "#Centrifugal_text" ).hover(function() {
        $("#Centrifugal_text").addClass("glow")
        }, function() {
          $("#Centrifugal_text").removeClass("glow")
      });

      $( "#Coriolis_text" ).click(function() {
        $( "#Coriolis_force").fadeToggle(500, "linear");
        });
      $( "#Coriolis_text" ).hover(function() {
        $("#Coriolis_text").addClass("glow")
        },function() {
        $("#Coriolis_text").removeClass("glow")
      });

      $( "#Euler_text" ).click(function() {
        $( "#Euler_force" ).fadeToggle(500, "linear");
        });
      $( "#Euler_text" ).hover(function() {
        $("#Euler_text").addClass("glow")
        },
      function() {
        $("#Euler_text").removeClass("glow");
      });
    let pages = ["1Derivation.html", "1Euler Force.html", "1Centrifugal Force.html"];