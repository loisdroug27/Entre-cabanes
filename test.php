
<?php

$pathlast = array_reverse (glob('timelapse/ici/*', GLOB_ONLYDIR)) ;


  $path = "$pathlast[1]/"; //dossier ou se trouve les images à charger

  echo $path;

?>
