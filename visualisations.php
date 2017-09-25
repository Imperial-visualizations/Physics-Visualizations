<!doctype html>
<html lang="en">

<?php
$pageTitle = "Imperial Visualisations";
$loggedIn = 1;

require "includes/head.php";
require "includes/query-string.php";
?>

<body id="bso" data-spy="scroll" data-target="#sidebar-nav" data-offset="70">

  <?php include "includes/header.php"; ?>

  <div id="content" class="container-fluid">

<!--
    <div id="intro" class="jumbotron jumbotron-fluid">
      <div class="container">
        <h1 class="display-3">Physics</h1>
      </div>
    </div>
-->

    <div class="row">

      <div class="col-2 sidebar">
        <nav id="sidebar-nav" class="nav nav-pills flex-column">
          <form class="form">
            <input class="form-control form-control-sm" type="text" placeholder="Search..." aria-label="Search">
          </form>
          <a href="#em" class="nav-link">Electromagnetism</a>
          <a href="#maths" class="nav-link active">Maths</a>
          <a href="#mechanics" class="nav-link">Mechanics/V&amp;W</a>
        </nav>
      </div>

      <div class="col-10 ml-auto">

        <?php
        require_once "includes/templater.php";

        $mathsCards = new Template();
        $mathsCards->folder = "visuals_maths/";
        $mathsCards->visualisations = array(
          array(
            "title" => "2D Transformations <span class='badge badge-danger'>numeric</span>",
            "imgSrc" => "boundary.png",
            "openLinks" => array(
              "web" => "2D_Transformations/2D_Transformations.html"
            ),
            "downloadLinks" => array()
          ),
          array(
            "title" => "Green's Theorem <span class='badge badge-danger'>numeric</span>",
            "imgSrc" => "boundary.png",
            "openLinks" => array(
              "web" => "Green_Theorem/green.html"
            ),
            "downloadLinks" => array()
          ),
          array(
            "title" => "Linear Algebra Sphere <span class='badge badge-danger'>numeric</span>",
            "imgSrc" => "boundary.png",
            "openLinks" => array(
              "web" => "LA-Sphere/sphere.html"
            ),
            "downloadLinks" => array()
          ),
          array(
            "title" => "Parallelpiped",
            "imgSrc" => "boundary.png",
            "openLinks" => array(
              "web" => "PPed/plotpped.html"
            ),
            "downloadLinks" => array()
          ),
          array(
            "title" => "Triple Integration",
            "imgSrc" => "boundary.png",
            "openLinks" => array(
              "web" => "Triple%20Integration/tripleintegration.html"
            ),
            "downloadLinks" => array()
          ),
          array(
            "title" => "Vector Calculus Basis <span class='badge badge-danger'>numeric</span>",
            "imgSrc" => "boundary.png",
            "openLinks" => array(
              "web" => "VC-Basis/basis.html"
            ),
            "downloadLinks" => array()
          ),
          array(
            "title" => "Vector Calculus Polar <span class='badge badge-danger'>numeric</span>",
            "imgSrc" => "boundary.png",
            "openLinks" => array(
              "web" => "VC-Polar/polar.html"
            ),
            "downloadLinks" => array()
          ),
          array(
            "title" => "Vector Calculus &quot;Riley&quot; <span class='badge badge-danger'>numeric</span>",
            "imgSrc" => "boundary.png",
            "openLinks" => array(
              "web" => "VC-Riley/riley.html"
            ),
            "downloadLinks" => array()
          )
        );

        $mechanicsCards = new Template();
        $mechanicsCards->folder = "visuals_mechanics/";
        $mechanicsCards->visualisations = array(
          array(
            "title" => "Two Body Collisions",
            "imgSrc" => "boundary.png",
            "openLinks" => array(
              "web" => "mechanics_collisions/twoBody.html"
            ),
            "downloadLinks" => array()
          ),
          array(
            "title" => "Diatomic Molecules",
            "imgSrc" => "boundary.png",
            "openLinks" => array(
              "web" => "mechanics_diatomic/diatomic.html"
            ),
            "downloadLinks" => array()
          ),
          array(
            "title" => "Wave Dispersion <span class='badge badge-danger'>numeric</span>",
            "imgSrc" => "boundary.png",
            "openLinks" => array(
              "web" => "mechanics_dispersion/waves.html"
            ),
            "downloadLinks" => array()
          ),
          array(
            "title" => "Pulse At Interface",
            "imgSrc" => "boundary.png",
            "openLinks" => array(
              "web" => "mechanics_pulse_at_interface/pulse_anim.html"
            ),
            "downloadLinks" => array()
          )
        );

        $EMCards = new Template();
        $EMCards->folder = "visuals_EM/";
        $EMCards->visualisations = array(
          array(
            "title" => "Dielectric Boundary",
            "imgSrc" => "boundary.png",
            "openLinks" => array(
              "web" => "Dielectric%20Boundary/index.html"
            ),
            "downloadLinks" => array()
          ),
          array(
            "title" => "Planewave Dielectric Boundary",
            "imgSrc" => "boundary.png",
            "openLinks" => array(
              "web" => "Planewave%20Dielectric%20Boundary/index.html"
            ),
            "downloadLinks" => array()
          ),
          array(
            "title" => "Biot Savart Law",
            "imgSrc" => "boundary.png",
            "openLinks" => array(
              "web" => "BiotSavart/BiotSavartLaw.html"
            ),
            "downloadLinks" => array()
          ),
          array(
            "title" => "Cyclotron",
            "imgSrc" => "boundary.png",
            "openLinks" => array(
              "web" => "Cyclotron/index.html"
            ),
            "downloadLinks" => array()
          )
        )
        ?>

        <div id="em" class="vis-category container">
          <h2>Electromagnetism</h2>
          <?php $EMCards->render("card-deck.phtml"); ?>
        </div>

        <div id="maths" class="vis-category container">
          <h2>Maths</h2>
          <?php $mathsCards->render("card-deck.phtml"); ?>
        </div>

        <div id="mechanics" class="vis-category container">
          <h2>Mechanics and Vibrations &amp; Waves</h2>
          <?php $mechanicsCards->render("card-deck.phtml"); ?>
        </div>

      </div>

    </div>

  </div>


  <?php include "includes/footer.php"; ?>

</body>
</html>
