<?php

// GET LIST OF DEPARTMENTS

require_once("easy_groceries.class.php");

// create an object from the class of EasyGroceries
$oEasyGroceries = new EasyGroceries();

$data = $oEasyGroceries->getDepartments();

header("Content-Type:application/json");

echo $data;

?>