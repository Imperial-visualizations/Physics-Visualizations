<header>

  <nav id="nav" class="navbar navbar-light navbar-expand-sm bg-light nav-pills fixed-top">
    <div class="container-fluid p-0">

      <a class="navbar-brand" href="#">Imperial Visualisations</a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <?php if ($loggedIn): ?>
        <ul class="navbar-nav mr-auto">
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" id="navbarDeptDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              Department of <?php echo $usrDepartment; ?>
            </a>
            <div class="dropdown-menu" aria-labelledby="navbarDeptDropdown">
              <a class="dropdown-item" href="#">Physics</a>
              <a class="dropdown-item" href="#">Maths</a>
              <a class="dropdown-item" href="#">Chemistry</a>
            </div>
          </li>
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" id="navbarYearDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              Year <?php echo $usrYear; ?>
            </a>
            <div class="dropdown-menu" aria-labelledby="navbarYearDropdown">
              <a class="dropdown-item" href="#">Year 1</a>
              <a class="dropdown-item" href="#">Year 2</a>
            </div>
          </li>
        </ul>
      <?php endif; ?>

        <ul class="navbar-nav ml-auto">
          <!-- <div class="navbar-divider"></div> -->
          <li class="nav-item">
            <a class="nav-link" href="#">About</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">Help</a>
          </li>
        </ul>
      </div>

    </div>
  </nav>

</header>
