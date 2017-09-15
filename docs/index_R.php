<!doctype html>
<html lang="en">

<?php include "head.php"; ?>

<body id="bso">

  <?php
  $loggedIn = 0;
  ?>

  <?php include "header.php"; ?>


  <div id="content">

    <div id="intro" class="jumbotron jumbotron-fluid cover grad-blue-purple">
      <div class="container">
        <div class="row">

          <div class="col">
            <h1 class="display-4">Imperial Visualisations</h1>
            <p class="lead">Visualisations designed to enhance your understanding of abstract concepts.</p>
          </div>

          <div class="col login">
            <form class="form-signin">
              <h4 class="form-signin-heading">Please log in</h4>
              <label for="CID" class="sr-only">College ID</label>
              <input type="text" id="CID" class="form-control" placeholder="College ID" required="" autofocus="">
              <label for="inputPassword" class="sr-only">Password</label>
              <input type="password" id="inputPassword" class="form-control" placeholder="Password" required="">
              <!-- <button class="btn btn-outline-primary btn-block" type="submit">Log in</button> -->
              <a href="visualisations-physics_R.php" class="btn btn-outline-primary btn-block">Log in</a>
            </form>
          </div>

        </div>
      </div>
    </div>

  </div>


  <footer class="footer">

    <div class="container">
      <span class="text-muted">&copy; 2017 Imperial College London</span>
    </div>

  </footer>

</body>
</html>
