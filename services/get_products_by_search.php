<?php

// GET LIST OF PRODUCTS BY DEPARTMENT
$search = $_POST['search'];
$search = addslashes($search);

require_once("easy_groceries.class.php");

// create an object from the class of EasyGroceries
$oEasyGroceries = new EasyGroceries();

$data = $oEasyGroceries->getProductsBySearch($search);

header("Content-Type:application/json");

echo $data;

?>