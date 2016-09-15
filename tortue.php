<!DOCTYPE html>
<html lang="en">
<head>

  <!-- Basic Page Needs
  –––––––––––––––––––––––––––––––––––––––––––––––––– -->
  <meta charset="utf-8">
  <title>Entre Cabanes</title>

  <!-- Php Code to read and create xml
  –––––––––––––––––––––––––––––––––––––––––––––––––– -->
  <?php
ob_start() ;

  $path = 'images/'; //dossier ou se trouve les images à charger

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

  $firstFile = $files[0];

  $for_player_img = $for_player->addChild('for_player_img', $firstFile); //IMAGE DE PREVIEW
  $target_enabled = $for_player->addChild('target_enabled', '0');
  $width = $for_player->addChild('width', '640');
  $height = $for_player->addChild('height', '480');
  $autoplay = $for_player->addChild('autoplay', '0');
  $looping = $for_player->addChild('looping', '0');

  $xml->asXML('data.xml');

ob_clean() ; 

?>

  <meta name="description" content="">
  <meta name="author" content="">

  <!-- Mobile Specific Metas
  –––––––––––––––––––––––––––––––––––––––––––––––––– -->
  <meta name="viewport" content="width=device-width, initial-scale=1">

  <!-- FONT
  –––––––––––––––––––––––––––––––––––––––––––––––––– -->
  <link href="//fonts.googleapis.com/css?family=Raleway:400,300,600" rel="stylesheet" type="text/css">

  <!-- CSS
  –––––––––––––––––––––––––––––––––––––––––––––––––– -->
  <link rel="stylesheet" href="css/normalize.css">
  <link rel="stylesheet" href="css/skeleton.css">

  <!-- Favicon
  –––––––––––––––––––––––––––––––––––––––––––––––––– -->
  <link rel="icon" type="image/png" href="images/favicon.png">

<!-- Javascript for jpgplayer
  –––––––––––––––––––––––––––––––––––––––––––––––––– -->

  <script type="text/javascript" src="jpg_player.js"></script>

  <SCRIPT language="JavaScript" type="text/javascript">



function load_player() {
    mov = jpgMovieFactory( 'movie_div', 'jpgMovieFramelessSliderPlayer', "<?php echo $width ?>", "<?php echo $height ?>" );
    mov.loadFromUrlOnDemand( "<?php echo $firstFile ?>", 'data.xml' );
}

</SCRIPT>

</head>
<BODY onLoad="load_player();">

  <!-- Primary Page Layout
  –––––––––––––––––––––––––––––––––––––––––––––––––– -->
  <div class="container">
    <div class="row">
      <div class="one-half column" style="margin-top: 0%" ; ID="movie_div">
        <h4>Entre Cabanes</h4>
        <p>This index.html page is a placeholder with the CSS, font and favicon. It's just waiting for you to add some content! If you need some help hit up the <a href="http://www.getskeleton.com">Skeleton documentation</a>.</p>
      </div>
    </div>
  </div>

<!-- End Document
  –––––––––––––––––––––––––––––––––––––––––––––––––– -->
</body>
</html>
