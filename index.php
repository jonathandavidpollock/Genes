
<?php

  getContent("PICST_49658");

  function getContent($gene) {
    echo "You successfully ran php.";
    $domain = "http://www.genome.jp/dbget-bin/www_bget?pic";
    $char = ":";
    $ext = strtoupper($gene);
    $url = $domain . $char . $ext;
    $notFound = "No such data.";

    $document = file_get_contents($url);
    if (strpos($document, $notFound) == 0){
      $firstSplit = "(RefSeq) ";
      if (strpos($document, $firstSplit)!==False) {
        $defArray = explode($firstSplit, $document);
        $def = explode("<br>", $defArray[1]);
        $defintion = $def[0];
        echo $document;
        echo $defintion;
      }
    }
    // $defintion = "No definition Given";


  }


?>
