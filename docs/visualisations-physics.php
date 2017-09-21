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
          <a href="#maths" class="nav-link active">Maths</a>
          <a href="#mechanics" class="nav-link">Mechanics/V&amp;W</a>
          <a href="#em" class="nav-link">Electromagnetism</a>
        </nav>
      </div>

      <div class="col-10 ml-auto">

        <?php
        require_once "includes/templater.php";

        $mathsCards = new Template();
        $mathsCards->visualisations = array(
          array(
            "title" => "Visualisation 1",
            "imgSrc" => "boundary.png",
            "openLinks" => array(
              "web" => "#",
              "ipynb" => "#"
            ),
            "downloadLinks" => array(
              "ipynb" => "#"
            )
          ),
          array(
            "title" => "Visualisation 2",
            "imgSrc" => "boundary.png",
            "openLinks" => array(
              "web" => "#",
              "ipynb" => "#"
            ),
            "downloadLinks" => array(
              "ipynb" => "#",
              "py" => "#"
            )
          ),
          array(
            "title" => "Visualisation 3",
            "imgSrc" => "boundary.png",
            "openLinks" => array(
              "web" => "#",
              "ipynb" => "#"
            ),
            "downloadLinks" => array(
              "ipynb" => "#",
              "py" => "#"
            )
          ),
          array(
            "title" => "Visualisation 4",
            "imgSrc" => "boundary.png",
            "openLinks" => array(
              "web" => "#",
              "ipynb" => "#"
            ),
            "downloadLinks" => array(
              "ipynb" => "#",
              "py" => "#"
            )
          )
        );

        $mechanicsCards = new Template();
        $mechanicsCards->visualisations = array(
          array(
            "title" => "Visualisation 1",
            "imgSrc" => "boundary.png",
            "openLinks" => array(
              "web" => "#",
              "ipynb" => "#"
            ),
            "downloadLinks" => array(
              "ipynb" => "#"
            )
          ),
          array(
            "title" => "Visualisation 2",
            "imgSrc" => "boundary.png",
            "openLinks" => array(
              "web" => "#",
              "ipynb" => "#"
            ),
            "downloadLinks" => array(
              "ipynb" => "#",
              "py" => "#"
            )
          ),
          array(
            "title" => "Visualisation 3",
            "imgSrc" => "boundary.png",
            "openLinks" => array(
              "web" => "#",
              "ipynb" => "#"
            ),
            "downloadLinks" => array(
              "ipynb" => "#",
              "py" => "#"
            )
          ),
          array(
            "title" => "Visualisation 4",
            "imgSrc" => "boundary.png",
            "openLinks" => array(
              "web" => "#",
              "ipynb" => "#"
            ),
            "downloadLinks" => array(
              "ipynb" => "#",
              "py" => "#"
            )
          )
        );
        ?>


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
