<!DOCTYPE html>
<HTML>
<HEAD>
    <TITLE>ici / here</TITLE>

    <?php
ob_start() ;

  $path = ''; //dossier ou se trouve les images à charger

  $xml = new SimpleXMLElement('<?xml version="1.0" encoding="ISO-8859-1"?><JPGMOVIE/>'); // ajout d'un entete au fichier xml ainsi que son nom

  $version = $xml->addChild('version','1.1.3'); // ajout de la version au fichier xml
  $interval = $xml->addChild('interval','100'); // ajout de la durée entre les images au fichier xml
 

  $files = glob("$path{*.jpg,*.JPG,*.png,*.jpeg}", GLOB_BRACE ); //Compte le nombre de JPG dans le dossier

  if ( $files !== false )
  {
    $filecount = count( $files );
  }

  $cFrames = $xml->addChild('cFrames', $filecount); // ajoute le nombre d'image trouvée dans le dossier
  
  $cFramesUntilPlayable = $xml->addChild('cFramesUntilPlayable', ($filecount/2)); // donne le nombre de frame avant que le lecteur soit playable (total/2)

  $default_target = $xml->addChild('default_target', 'http://www.entre-cabanes.net'); // cible par défault du lecteur image


      $frames = $xml->addChild('frames');
      $i = 0;
   
      foreach ( $files as $file ) {
          $name = 'frame_'.$i;
          $frame = $frames->addChild($name, $file);
          $i++;
      }


  $for_player = $xml->addChild('for_player');

  $firstFile = '../../../img/cabane640.png';

  $for_player_img = $for_player->addChild('for_player_img', $firstFile); //IMAGE DE PREVIEW
  $target_enabled = $for_player->addChild('target_enabled', '0');
  $width = $for_player->addChild('width', '640');
  $height = $for_player->addChild('height', '480');
  $autoplay = $for_player->addChild('autoplay', '0');
  $looping = $for_player->addChild('looping', '0');

  $xml->asXML('data.xml');

ob_clean() ; 

?>  

    <!-- <meta http-equiv="refresh" content="300">  -->
    <meta charset="utf-8" />
    <meta name="Loïs Drouglazet" content="www.entre-cabanes.net" />
    <meta name="viewport" content="width=device-width, user-scalable=no">

    <link rel="stylesheet" href="../../../css/style.css" />
    <link rel="stylesheet" href="../../../css/jquery.mmenu.all.css" />
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

   <script type="text/javascript" src="../../../js/jpg_player.js"></script>

    <SCRIPT language="JavaScript" type="text/javascript">
function load_player() {
    mov = jpgMovieFactory( 'movie_div', 'jpgMovieFramelessSliderPlayer', "<?php echo $width ?>", "<?php echo $height ?>" );
    mov.loadFromUrlOnDemand( "<?php echo $firstFile ?>", 'data.xml' );
}
</SCRIPT>


    <script type="text/javascript" src="http://code.jquery.com/jquery-2.2.0.js"></script>

    <script type="text/javascript" src="../../../js/jquery.mmenu.all.min.js" ></script>


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



<BODY onLoad="load_player();">

<nav id="my-menu">
   <ul class="vertical">
      <li><a href="../../../index.php"><span style="color: #1D0E4A;">maintenant /</span><span style="color:#023CEB;"> now</span></a></li>
      <li><a href="../../../ailleurs.php"><span style="color: #1D0E4A;">ailleurs /</span><span style="color:#023CEB;"> elsewhere</span></a></li>
      </ul>
</nav>

<div class="site-wrap">
<header>
       
       <div class="titre"><span style="color: #1D0E4A;">ici /</span><span style="color:#023CEB;"> here</span> 
       </div>
       <div class="menuicon" style="cursor: pointer ";><img src="../../../img/hamb.png" id="my-button" ;> </div>
       

 

</header>

<DIV class="lecteurjpg" ; ID="movie_div"></DIV>


<div class="menu">
<a href="../../../index.php"><span style="color: #FCD14A;">maintenant /</span><span style="color:#C8C8B9;"> now</span></a>
<a href="../../../ailleurs.php"><span style="color: #FCD14A;">ailleurs /</span><span style="color:#C8C8B9;"> elsewhere</span></a>
</div>

   


<footer>
<ul>
    <li>suivez les cabanes / follow the cabins </li>
<li><a href="https://www.facebook.com/deschateaux.enlair"><img src="../../../img/facebook.png" /></a></li>
<li><a href="https://www.instagram.com/deschateauxenlair"><img src="../../../img/instagram.png" /></a></li>
</footer>

</div>

</BODY>
</HTML>

