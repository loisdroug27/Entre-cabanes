<!DOCTYPE html>
<HTML>
<HEAD>
<meta charset="utf-8" />
        <link rel="stylesheet" href="style.css" />
        <meta name="viewport" content="width=device-width, initial-scale=1">

<TITLE>Entre_Cabanes</TITLE>

</HEAD>

<BODY>

<li>
        <a href="#">Movies <span class="arrow">&#9660;</span></a>

<ul class="sub-menu">
<?php 
      foreach(glob('SITE/AILLEUR/*', GLOB_ONLYDIR) as $filename){
      $rest = substr($filename, 13);    
      echo "<li><a href='$filename'>".$rest."</a></li>";
      }
    ?>
</ul>
 </li>

</BODY>


</HTML>
    



