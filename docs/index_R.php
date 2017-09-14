<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta/css/bootstrap.min.css" integrity="sha384-/Y6pD6FV/Vv2HJnA6t+vslU6fwYXjCFtcEpHbNJ0lyAFsXTsjBbfaDjzALeQsN6M" crossorigin="anonymous">
  <link rel="stylesheet" href="style_R.css">

  <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.11.0/umd/popper.min.js" integrity="sha384-b/U6ypiBEHpOf/4+1nzFpr53nxSS+GLCkfwBdFNTxtclqqenISfwAzpKaMNFNmj4" crossorigin="anonymous"></script>
  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta/js/bootstrap.min.js" integrity="sha384-h0AbiXch4ZDo7tp9hKZ4TsHbi047NrKGLO3SEJAg45jXxnGIfYzk4Si90RDIqNm1" crossorigin="anonymous"></script>
  <script src="script_R.js"></script>
</head>

<body id="bso" data-spy="scroll" data-target="#nav" data-offset="20">

  <header>

    <nav id="nav" class="navbar navbar-light bg-light nav-pills nav-justified justify-content-end fixed-top">
      <div class="container">
        <a class="navbar-brand" href="#">Imperial Visualisations</a>
        <div class="row">
          <a class="nav-item nav-link" href="#">About</a>
          <a class="nav-item nav-link" href="#">Help</a>
        </div>
      </div>
    </nav>

  </header>


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
              <a href="visualisations-physics_R.html" class="btn btn-outline-primary btn-block">Log in</a>
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
