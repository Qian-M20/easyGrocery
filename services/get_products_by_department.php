<?php

// GET LIST OF PRODUCTS BY DEPARTMENT

// POST ENCRYPTED INFROMATION PASSED TO THE BACKEND 
$department_id = $_POST['department_id'];
$department_id = addslashes($department_id);

require_once("easy_groceries.class.php");

// create an object from the class of EasyGroceries
$oEasyGroceries = new EasyGroceries();

$data = $oEasyGroceries->getProductsByDepartment($department_id);

header("Content-Type:application/json");

echo $data;

?>