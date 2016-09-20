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



<div id="folderimg">
<?php 

      foreach(glob('SITE/AILLEUR/*', GLOB_ONLYDIR) as $filename){
     
     
 $rest = substr($filename, 13);  
      
     
      echo "<a href='$filename'>\n";
      echo "<img src=\"img/cabane_jaune.png\">\n";
      echo "</a>\n";
      echo "<p>".$rest."</p>\n";
      
     // echo "</div>\n";
      
      //echo "<figcaption>".$rest."</figcaption\n";
      
      //echo "<a href='$filename'>".$rest."</a></li>";

     
      }
    ?>

</div>
<header>
<div class="titre"><span style="color: #1D0E4A;">ailleurs /</span><span style="color:#023CEB;"> elsewhere</span></div>


</header>
<footer></footer>
</BODY>
</HTML>

