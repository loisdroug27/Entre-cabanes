<!DOCTYPE html>
<HTML>
<HEAD>
    <TITLE>ici / here</TITLE>

    <!-- <meta http-equiv="refresh" content="300">  -->
    <meta charset="utf-8" />
    <meta name="Loïs Drouglazet" content="www.entre-cabanes.net" />
    <meta name="viewport" content="width=device-width, user-scalable=no">

    <link rel="stylesheet" href="css/style.css" />
    <link rel="stylesheet" href="css/jquery.mmenu.all.css" />
    <link rel="stylesheet" href="css/font-awesome.min.css" />
    <style type="text/css">
    .mm-menu.mm-theme-white {
        background: #F0DC23;
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

    <script type="text/javascript" src="js/jquery-3.1.1.min.js"></script>
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
                        "<a class='fa fa-instagram fa-2x' href='http://urlgeni.us/instagram/cabanes'></a>",
                        "<a class='fa fa-facebook fa-2x' href='http://urlgeni.us/facebook/cabanes'></a>"
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
      <li><a href="./ailleurs.php"><span style="color: #1D0E4A;">ailleurs /</span><span style="color:#023CEB;"> elsewhere</span></a></li>
      </ul>
</nav>

<div class="site-wrap">
<header>
       
       <div class="titre"><span style="color: #1D0E4A;">ici /</span><span style="color:#023CEB;"> here</span> 
       </div>
       <div class="menuicon" style="cursor: pointer ";><img src="img/hamb.png" id="my-button" ;> </div>
       

 

</header>


<div id="folderimg">
<?php 
      $file = array_reverse (glob('timelapse/ici/*', GLOB_ONLYDIR)) ;
      unset($file[1]);
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
 
          
      $rest = substr($filename, 14);  
      // $rest =  str_replace("_","/<br>",$rest);
      $rest =  str_replace(array('_') , array('/</span><span style="color:#023CEB;"><br>'),$rest);
      

     
      echo "<a class=\"boxici\" href='$filename'><span>".$rest."</span>\n";
      echo "<img src=\"img/cabane.png\">\n";
      echo "</a>\n";
     
      }
       
    ?>

</div>

<div class="menu">
<a href="./index.php"><span style="color: #F0DC23;">maintenant /</span><span style="color:#C8C8B9;"> now</span></a>
<a href="./ailleurs.php"><span style="color: #F0DC23;">ailleurs /</span><span style="color:#C8C8B9;"> elsewhere</span></a>
</div>

   


<footer>
<ul>
    <li>suivez les cabanes / follow the cabins </li>
<li><a class='fa fa-facebook fa-2x' href="https://www.facebook.com/entrecabanes"></a></li>
<li><a class='fa fa-instagram fa-2x' href="https://www.instagram.com/deschateauxenlair"></a></li>
</footer>

</div>

</BODY>
</HTML>

