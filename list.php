<!DOCTYPE html>
<HTML>
<HEAD>
    <!-- <meta http-equiv="refresh" content="300">  -->
    <meta charset="utf-8" />
        <link rel="stylesheet" href="style.css" />
        <meta name="viewport" content="width=device-width, user-scalable=no">

<TITLE>Entre_Cabanes</TITLE>
</HEAD>
<BODY>
<ul class="img-list">
<?php 

      foreach(glob('SITE/AILLEUR/*', GLOB_ONLYDIR) as $filename){
     
     
 $rest = substr($filename, 13);  
      echo "<div class=\"holder\">\n";
      echo "<li><a href='$filename'>\n";
      echo "<img src=\"img/cabane_jaune.png\">\n";
      echo "<span class=\"textcontent\"><span>".$rest."</span></span>\n";
     echo "</a>\n";
      echo "</li>\n";
       echo "</div>\n";
      //echo "<a href='$filename'>".$rest."</a></li>";
      }
    ?>

</ul>
</BODY>
</HTML>

