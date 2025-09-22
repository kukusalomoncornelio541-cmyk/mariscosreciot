<?php

define('ENVIRONMENT', 'development');
// Database configuration constants
define('DB_HOST', 'localhost');
define('DB_NAME', 'mariscosrecio');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_CHARSET', 'utf8mb4');

try {
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS);

    // Crear base de datos si no existe
    $conn->query("CREATE DATABASE IF NOT EXISTS " . DB_NAME . " CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
    
    // Seleccionar la base de datos
    $conn->select_db(DB_NAME);
    
    // Establecer charset
    $conn->set_charset(DB_CHARSET);
    
    // Crear tabla usuarios si no existe
    $conn->query("CREATE TABLE IF NOT EXISTS usuarios (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");

    // Test connection
    $conn->query('SELECT 1');

} catch(Exception $e) {
    $error_log = date('Y-m-d H:i:s') . " - Database connection error: " . $e->getMessage() . "\n";
    
    if (!file_exists(__DIR__ . '/../logs')) {
        mkdir(__DIR__ . '/../logs', 0755, true);
    }
    
    error_log($error_log, 3, __DIR__ . '/../logs/db_errors.log');
    
    if(defined('ENVIRONMENT') && ENVIRONMENT === 'development') {
        die("Connection Error Details: " . $e->getMessage());
    } else {
        die("Error de conexión a la base de datos. Por favor, inténtelo más tarde.");
    }
}
?>