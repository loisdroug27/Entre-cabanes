<!DOCTYPE html>
<HTML>
<HEAD>
    <TITLE>ailleurs / elsewhere</TITLE>
    <!-- <meta http-equiv="refresh" content="300">  -->
    <meta charset="utf-8" />
    <meta name="Loïs Drouglazet" content="www.entre-cabanes.net" />
    <meta name="viewport" content="width=device-width, user-scalable=no">

    <link rel="stylesheet" href="css/style.css" />
    <link rel="stylesheet" href="css/jquery.mmenu.all.css" />
    <link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/font-awesome/4.1.0/css/font-awesome.min.css" />
    <style type="text/css">
    .mm-menu.mm-theme-white {
        background: #FCD14A;
        border-color:rgba( 0, 0, 0, 0.4 );
              }
      .mm-listview li > a,
      .mm-listview > li > a,
      .mm-listview > li > span {
        font-size: 20px;
        text-align:center;
        font-family: 'naivbold_text';
      }
      .mm-listview > li > a:hover {
       background: rgba( 24, 15, 42, 0.3 );
        
      }
      .mm-listview .mm-inset {
        padding-left: 50px;
      }
      .mm-navbar-bottom {
        height:60px;
      }
      .mm-navbar {
        font-family: 'naivbold_text';
        font-size: 20px;
      }
      .mm-menu.mm-theme-white .mm-navbar a{
        color:rgba( 0, 0, 0, 0.8 );
      }
      .mm-hasnavbar-bottom-1 .mm-panels{
        bottom:60px;
      }

      .mm-listview {
            line-height: 60px;
          }
      </style>

    <script type="text/javascript" src="http://code.jquery.com/jquery-2.2.0.js"></script>
    <script type="text/javascript" src="js/jquery.mmenu.all.min.js" ></script>


<script type="text/javascript">
   $(document).ready(function() {
      $("#my-menu").mmenu({
      navbars: [
                  {
                     "position": "top"
                  },
                  {
                     "position": "bottom",
                     "content": [
                        "<a class='fa fa-instagram fa-2x' href='https://www.instagram.com/deschateauxenlair'></a>",
                        "<a class='fa fa-facebook fa-2x' href='https://www.facebook.com/deschateaux.enlair'></a>"
                     ]
                  }
               ],
      extensions  : [ "border-none", "theme-white", "pagedim-black" ],
      offCanvas  : { position  : "right" },
                          }, 

         {
           classNames: {
            vertical: "expand"
         }
      });
      var API = $("#my-menu").data( "mmenu" );
      
      $("#my-button").click(function() {
         API.open();
      });
   });
</script>
</HEAD>



<BODY>

<nav id="my-menu">
   <ul class="vertical">
      <li><a href="./index.php"><span style="color: #1D0E4A;">maintenant /</span><span style="color:#023CEB;"> now</span></a></li>
      <li><a href="./ici.php"><span style="color: #1D0E4A;">ici /</span><span style="color:#023CEB;"> here</span></a></li>
      </ul>
</nav>

<div class="site-wrap">
<header>
       
       <div class="titre"><span style="color: #1D0E4A;">ailleurs /</span><span style="color:#023CEB;"> elsewhere</span> 
       </div>
       <div class="menuicon" style="cursor: pointer ";><img src="img/hamb.png" id="my-button" ;> </div>
       

 

</header>



<div id="folderimg">
<?php 
      $file = glob('timelapse/ailleurs/*', GLOB_ONLYDIR) ;
      
      $pair = $file;
      $impair = $file;

            $i = 1;
            foreach ($pair as $key => $row) {
             if($i%2 == '0')
             {
               unset($pair[$key]);
             }
             $i++;
              }
            $i = 1;
            foreach ($impair as $key => $row) {
             if($i%2 == '1')
            {
              unset($impair[$key]);
             }
              $i++;
              }

              
      $fichiers = array_merge($pair, $impair);

      foreach($fichiers as  $filename){
 
          
      $rest = substr($filename, 19);  
      

     
      echo "<a class=\"box\" href='$filename'><span>".$rest."</span>\n";
      echo "<img src=\"img/cabane_jaune.png\">\n";
      echo "</a>\n";
     
      }
       
    ?>

</div>

<div class="menu">
<a href="./index.php"><span style="color: #FCD14A;">maintenant /</span><span style="color:#C8C8B9;"> now</span></a>
<a href="./ici.php"><span style="color: #FCD14A;">ici /</span><span style="color:#C8C8B9;"> here</span></a>
</div>

   


<footer>
<ul>
    <li>suivez les cabanes / follow the cabins </li>
<li><a href="https://www.facebook.com/deschateaux.enlair"><img src="img/facebook.png" /></a></li>
<li><a href="https://www.instagram.com/deschateauxenlair"><img src="img/instagram.png" /></a></li>
</footer>

</div>

</BODY>
</HTML>

