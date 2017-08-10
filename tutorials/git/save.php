<!doctype html>
<html>
<head>
  <meta charset="utf-8"/>
  <title>Writter</title>
  <script src="./marked.js"></script>
  <link href="https://fonts.googleapis.com/css?family=Lato" rel="stylesheet">
    <link rel="stylesheet" href="https://manglekuo.com/i-v/styles.css?v=1">
<!--   <link rel="stylesheet" href="css/normalize.css?v=1">
  <link rel="stylesheet" href="css/skeleton.css?v=3"> -->

  <style>
  </style>
  <script type="text/x-mathjax-config">
  MathJax.Hub.Config({
      tex2jax: {
          inlineMath: [ ["\[","\]"] ],
          displayMath: [ ['$$','$$'], ["\\[","\\]"] ],
          processEscapes: false,
      }
  });
  </script>
  <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.1/MathJax.js">
  </script> 
</head>
<body>
  <div class="container"><div class="row"><div class="twelve columns" id="output"></div></div></div>
  <script src="https://code.jquery.com/jquery-3.2.1.min.js"></script>
  <script>

    $.get('./git.md', function(text) {
        var outputHTML = marked( text );
        $("#output").html(outputHTML);
    }, 'text');

  </script>
</body>
</html>