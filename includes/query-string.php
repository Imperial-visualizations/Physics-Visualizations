<?php

$deptList = array("Physics", "Maths", "Chemistry");
$yearList = array("1", "2");

parse_str($_SERVER["QUERY_STRING"], $queryStr);
// check if dept and year are valid
if ( !isset($queryStr["dept"]) || !in_array($queryStr["dept"], $deptList) ) {
  $usrDepartment = "Physics";
} else {
  $usrDepartment = $queryStr["dept"];
}
if ( !isset($queryStr["year"]) || !in_array($queryStr["year"], $yearList) ) {
  $usrYear = "1";
} else {
  $usrYear = $queryStr["year"];
}

?>
