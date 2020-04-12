<?php

// GET LIST OF PRODUCTS BY DEPARTMENT
$json = $_POST['json'];
// $json = addslashes($json);

require_once("easy_groceries.class.php");

// create an object from the class of EasyGroceries
$oEasyGroceries = new EasyGroceries();

$data = $oEasyGroceries->getProductsByCart($json);

header("Content-Type:application/json");

echo $data;

?>