   <?php



  $xml = new SimpleXMLElement('<?xml version="1.0" encoding="ISO-8859-1"?><JPGMOVIE/>'); // ajout d'un entete au fichier xml ainsi que son nom

  $version = $xml->addChild('version','1.1.3'); // ajout de la version au fichier xml
  $interval = $xml->addChild('interval','100'); // ajout de la durée entre les images au fichier xml

 $Directory = new RecursiveDirectoryIterator('../../');
  $Iterator = new RecursiveIteratorIterator($Directory);
  $files = new RegexIterator($Iterator, '/^.+(.jpe?g|.png)$/i', RecursiveRegexIterator::GET_MATCH);

    $filecount=iterator_count( $files );
 

  $cFrames = $xml->addChild('cFrames', $filecount); // ajoute le nombre d'image trouvée dans le dossier
  
  $cFramesUntilPlayable = $xml->addChild('cFramesUntilPlayable', ($filecount/2)); // donne le nombre de frame avant que le lecteur soit playable (total/2)

  $default_target = $xml->addChild('default_target', 'http://www.entre-cabanes.net'); // cible par défault du lecteur image


      $frames = $xml->addChild('frames');
      $i = 0;
   
      foreach ( $files as $file => $files) {
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



?>  