<?php

class Api {
    private $conn;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function addRecord($table, $data) {
        $columns = implode(", ", array_keys($data));
        $placeholders = ":" . implode(", :", array_keys($data));
        
        $query = "INSERT INTO $table ($columns) VALUES ($placeholders)";

        try{

          $stmt = $this->conn->prepare($query);

          foreach ($data as $key => &$val) {
              $stmt->bindParam(":$key", $val);
          }

          if ($stmt->execute()) {
              return array("message" => "Record added successfully.");
          } else {
              return array("message" => "Failed to add record.");
          }
        }catch (Exception $e){
          return array("error" => $e, "message" => "Failed to add record.");
        }
    }
}
?>
