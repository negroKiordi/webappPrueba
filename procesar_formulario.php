<?php

// Datos de conexión a la base de datos

$dbhost = 'localhost';
$dbuser = 'c2469337_Prueba1';
$dbpass = 'gi63VAgadi';
$dbname = 'c2469337_Prueba1';

$conn = new mysqli($dbhost, $dbuser, $dbpass, $dbname);

// Comprobar conexión
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

// Recibir los datos del formulario
$nombre = $_POST['nombre'];
$email = $_POST['email'];
$mensaje = $_POST['mensaje'];

// Preparar y ejecutar la consulta SQL
$sql = "INSERT INTO registros (nombre, email, mensaje) VALUES ('$nombre', '$email', '$mensaje')";

if ($conn->query($sql) === TRUE) {
    echo "Nuevo registro creado con éxito";
} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}

// Cerrar la conexión
$conn->close();
?>
