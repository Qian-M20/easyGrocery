<?php

// require_once("inc/connect_pdo.php");
date_default_timezone_set('America/Toronto');

class EasyGroceries {

    // decalre a property called "dbo", public means other methods can access this property outside of the class scope 
    public $dbo = "";

    // define constructor
    public function __construct()
    {
        require_once("./inc/connect_pdo.php");
        // ->works like period in js
        $this->dbo = $dbo;
    }

    // get list of departments

    public function getDepartments(){
        $errorCode = 0;
        $errorMessage = "";

        try {
            $query="SELECT id,name
            FROM ea_category
            ORDER BY name";
            foreach($this->dbo->query($query) as $row) {
                $id = stripslashes($row[0]);
                $name = stripslashes($row[0]);
                $department["id"] = $id;
                $department["name"] = $name;

                $departments[] = $department;
            }
        } catch (PDOException $e) {
            $errorCode = -1;
            $errorMessage = "PDOException for getDepartments.";
        }

        $error["id"]=$errorCode;
        $error["message"]=$errorMessage;

        $data["error"]=$error;
        $data["departments"]=$departments;
        $data["query"]=$query;

        $data = json_encode($data);

        return $data;
    }
    // get image path
    public function getImagePath($upc){
        $query= "SELECT file
        FROM ea_images
        WHERE upc='$upc' ";
        foreach($this->dbo->query($query) as $row) {
            $file = stripslashes($row[0]);
            $folder = substr ( $upc ,0,4);
            $path = "./uploads/$folder/$file";
        }

        return $path;
    }

    // get list of products by department

    public function getProductsByDepartment($department_id){
        $errorCode = 0;
        $errorMessage = "";

        try {
            $query="SELECT ea_product.id,upc,brand,product_name,product_description, avg_price, name
            FROM ea_product,ea_category
            WHERE ea_product.category_id = ea_category.id
            AND category_id ='$department_id'
            ORDER BY avg_price";

            foreach($this->dbo->query($query) as $row) {
                $id = stripslashes($row[0]);
                // $upc = stripslashes($row[1]);

                $upc = strval(stripslashes($row[1]));
                $brand = stripslashes($row[2]);
                $product_name = stripslashes($row[3]);
                $product_description = stripslashes($row[4]);
                $avg_price = stripslashes($row[5]);
                $department_name = stripslashes($row[6]);
                
                $product["id"]=$id;
                $product["upc"]=$upc;
                $product["brand"]=$brand;
                $product["product_name"]=$product_name;
                $product["product_description"]=$product_description;
                $product["avg_price"]=$avg_price;
                $product["department_name"]=$department_name;
                $data["department_search"]=$department_name;
                $product["image_path"]=$this->getImagePath($upc);

                $products[] = $product;
            }
        } catch (PDOException $e) {
            $errorCode = -1;
            $errorMessage = "PDOException for getProductsByDepartment.";
        }

        $error["id"]=$errorCode;
        $error["message"]=$errorMessage;

        $data["error"]=$error;
        $data["products"]=$products;
        $data["query"]=$query;

        $data = json_encode($data);

        return $data;
    }

     // get list of products by search

    public function getProductsBySearch($search){
        $words = explode('',$search);
        $regex = implode('|',$words);

        $errorCode = 0;
        $errorMessage = "";

        if(!empty($search)){
            try {
                $query="SELECT ea_product.id,upc,brand,product_name,product_description, avg_price, name
                FROM ea_product,ea_category
                WHERE ea_product.category_id = ea_category.id
                AND (upc REGEXP '{$regex}'
                OR brand REGEXP '{$regex}'
                OR name REGEXP '{$regex}'
                OR product_name REGEXP '{$regex}')
                ORDER BY avg_price";

                print ("$query");
    
                foreach($this->dbo->query($query) as $row) {
                    $id = stripslashes($row[0]);
                    // $upc = stripslashes($row[1]);
    
                    $upc = strval(stripslashes($row[1]));
                    $brand = stripslashes($row[2]);
                    $product_name = stripslashes($row[3]);
                    $product_description = stripslashes($row[4]);
                    $avg_price = stripslashes($row[5]);
                    $department_name = stripslashes($row[6]);
                    
                    $product["id"]=$id;
                    $product["upc"]=$upc;
                    $product["brand"]=$brand;
                    $product["product_name"]=$product_name;
                    $product["product_description"]=$product_description;
                    $product["avg_price"]=$avg_price;
                    $product["department_name"]=$department_name;
                    $product["image_path"]=$this->getImagePath($upc);
    
                    $products[] = $product;
                }
            } catch (PDOException $e) {
                $errorCode = -1;
                $errorMessage = "PDOException for getProductsBySearch.";
            }
        }else {
            $errorCode = -2;
            $errorMessage = "PDOException for no search data.";
        }

        

        $data["department_search"]=$search;

        $error["id"]=$errorCode;
        $error["message"]=$errorMessage;

        $data["error"]=$error;
        $data["products"]=$products;
        $data["query"]=$query;

        $data = json_encode($data);

        return $data;
    }
}

?>