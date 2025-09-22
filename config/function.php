<?php
function sanitizeInput($data) {
    return htmlspecialchars(strip_tags(trim($data)));
}

function formatPrice($price) {
    return number_format($price, 2, ',', '.') . '€';
}

function isLoggedIn() {
    return isset($_SESSION['usuario_id']);
}

function getUserRole() {
    return isset($_SESSION['role']) ? $_SESSION['role'] : 'guest';
}

function validateEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL);
}

function generateRandomString($length = 10) {
    return bin2hex(random_bytes($length));
}

function redirectTo($path) {
    header("Location: $path");
    exit();
}

function getCartItemCount() {
    if(isset($_SESSION['carrito'])) {
        return array_sum(array_column($_SESSION['carrito'], 'cantidad'));
    }
    return 0;
}

function checkDatabaseConnection() {
    global $pdo;
    try {
        $pdo->query('SELECT 1');
        return true;
    } catch(PDOException $e) {
        return false;
    }
}
?>