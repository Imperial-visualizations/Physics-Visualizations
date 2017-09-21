<!doctype html>
<html>

<?php
$pageTitle = "Test";
$loggedIn = 1;

require "includes/head.php";
require "includes/query-string.php";
?>

<body id="bso">

  <?php include "includes/header.php"; ?>

  <div id="content">

    <div class="row">
      <div class="col">
        <div class="container">
          <?php
          require_once 'includes/templater.php';
          $t = new Template();
          $t->friends = array(
              'Rachel', 'Monica', 'Phoebe', 'Chandler', 'Joey', 'Ross'
          );
          $t->render('test.phtml');
          ?>
        </div>
      </div>
    </div>

  </div>

</body>
</html>
