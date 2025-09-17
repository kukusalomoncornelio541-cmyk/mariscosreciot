<?php
session_start();
require_once 'config/db_config.php';

// Mejorar verificación de conexión y sistema
try {
    // Verificar conexión
    if (!$mysql) {
        throw new Exception("Error de conexión: " . mysqli_connect_error());
    }

    // Verificar base de datos
    if (!mysqli_select_db($mysql, DB_NAME)) {
        throw new Exception("Error: No se pudo conectar a la base de datos");
    }

    // Verificar tablas necesarias
    $tablas_requeridas = ['usuarios', 'productos', 'pedidos', 'categorias'];
    foreach ($tablas_requeridas as $tabla) {
        $result = mysqli_query($mysql, "SHOW TABLES LIKE '$tabla'");
        if (mysqli_num_rows($result) == 0) {
            throw new Exception("Error: Tabla '$tabla' no encontrada");
        }
    }

    // Cargar productos destacados
    $query = "SELECT * FROM productos WHERE destacado = 1 LIMIT 6";
    $productos_destacados = mysqli_query($mysql, $query);

} catch (Exception $e) {
    error_log("Error en el sistema: " . $e->getMessage());
    die("Error del sistema. Por favor, contacte al administrador.");
}

// Verificar mensajes de sesión
$mensaje = '';
if (isset($_SESSION['mensaje'])) {
    $mensaje = $_SESSION['mensaje'];
    unset($_SESSION['mensaje']);
}

// Verificar tiempo de inactividad (30 minutos)
if (isset($_SESSION['ultimo_acceso'])) {
    $inactividad = 1800; // 30 minutos
    if (time() - $_SESSION['ultimo_acceso'] > $inactividad) {
        session_unset();
        session_destroy();
        header("Location: login.php?mensaje=sesion_expirada");
        exit;
    }
}
$_SESSION['ultimo_acceso'] = time();
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Mariscos Recio - El mejor pescado fresco y marisco de la zona">
    <title>Mariscos Recio - El Mar al Mejor Precio</title>
    <link rel="icon" type="image/png" href="assets/img/favicon.png">
    <link rel="stylesheet" type="text/css" href="assets/css/styles.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</head>
<body>
    <?php if($mensaje): ?>
    <div class="mensaje-flash" id="mensaje-flash">
        <?php echo htmlspecialchars($mensaje); ?>
    </div>
    <?php endif; ?>

    <nav class="navbar">
        <div class="logo">
            <img src="assets/img/logo.png" alt="Logo Mariscos Recio" class="logo-img">
            <h1>Mariscos Recio</h1>
        </div>
        <div class="nav-links">
            <a href="#inicio" class="nav-link active">Inicio</a>
            <a href="#productos" class="nav-link">Productos</a>
            <a href="#sobre-nosotros" class="nav-link">Sobre Nosotros</a>
            <a href="#contacto" class="nav-link">Contacto</a>
            <div class="cart-wrapper">
                <a href="#carrito" class="cart-icon" id="cart-button">
                    <i class="fas fa-shopping-cart"></i>
                    <span id="cart-count" class="cart-badge">0</span>
                </a>
            </div>
            <div class="user-menu">
                <?php if(isset($_SESSION['usuario_id'])): ?>
                    <div class="dropdown">
                        <span class="usuario-nombre">
                            <i class="fas fa-user"></i>
                            <?php echo htmlspecialchars($_SESSION['usuario_nombre']); ?>
                        </span>
                        <div class="dropdown-content">
                            <a href="mi-cuenta.php">Mi Cuenta</a>
                            <a href="mis-pedidos.php">Mis Pedidos</a>
                            <a href="logout.php">Cerrar Sesión</a>
                        </div>
                    </div>
                <?php else: ?>
                    <a href="login.php" class="login-btn">Iniciar Sesión</a>
                    <a href="registro.php" class="register-btn">Registrarse</a>
                <?php endif; ?>
            </div>
        </div>
        <button class="menu-toggle" id="menu-toggle">
            <i class="fas fa-bars"></i>
        </button>
    </nav>

    <section class="hero" id="inicio">
        <div class="hero-content">
            <h1>Mariscos Recio</h1>
            <div class="welcome-text">
                <p class="welcome-header">BIENVENIDOS A LA PESCADERÍA MARISCOS RECIO</p>
                <p>La empresa Mariscos Recio les da una calurosa bienvenida a la página 
                   web oficial de su nuevo y mejorado sistema informático. 
                   Aquí podrá realizar los pedidos que desee para su nevera, 
                   chiringuito o congelador. Disponemos de una variedad de 
                   productos del mar como sardinas, salmones, bogavantes y 
                   otros productos más. Esperamos que disfrute de su compra.</p>
            </div>
            <a href="#productos" class="cta-button">Ver Productos</a>
        </div>
        <div class="hero-image">
            <img src="assets/img/hero-image.png" alt="Mariscos Frescos" class="hero-img">
        </div>
    </section>

    <section id="productos" class="productos-section">
        <h2>Nuestros Productos</h2>
        <div class="filtros-productos">
            <select id="categoria-filter">
                <option value="">Todas las categorías</option>
                <option value="pescados">Pescados</option>
                <option value="mariscos">Mariscos</option>
                <option value="congelados">Congelados</option>
            </select>
            <div class="search-box">
                <input type="text" id="buscar-producto" placeholder="Buscar productos...">
                <i class="fas fa-search"></i>
            </div>
        </div>
        <div id="productos-container" class="productos-grid"></div>
        <div id="loading-spinner" class="spinner hidden"></div>
    </section>

    <section id="sobre-nosotros" class="sobre-nosotros-section">
        <h2>Sobre Nosotros</h2>
        <div class="sobre-nosotros-content">
            <div class="sobre-nosotros-text">
                <p>Mariscos Recio es una empresa familiar dedicada a la venta de productos frescos del mar. 
                   Con años de experiencia en el sector, nos enorgullece ofrecer la mejor calidad a nuestros 
                   clientes. Gracias por la confianza depositada en nosotros.</p>
                <p>UN IMPERIO CREADO DESDE CERO</p>
            </div>
            <div class="sobre-nosotros-image">
                <img src="assets/img/local.jpg" alt="Nuestro Local">
            </div>
        </div>
    </section>

    <section id="contacto" class="contacto-section">
        <h2>Contacto</h2>
        <div class="contacto-container">
            <div class="contacto-info">
                <h3>Información de Contacto</h3>
                <p><i class="fas fa-map-marker-alt"></i> San Valentín, Malabo</p>
                <p><i class="fas fa-phone"></i> +240 555 363 628</p>
                <p><i class="fas fa-envelope"></i> info@mariscosrecio.com</p>
                <div class="horario">
                    <h4>Horario de Atención</h4>
                    <p>Lunes a Viernes: 8:00 - 20:00</p>
                    <p>Sábados: 9:00 - 14:00</p>
                </div>
            </div>
            <form id="contacto-form" class="contacto-form">
                <input type="text" name="nombre" placeholder="Nombre" required>
                <input type="email" name="email" placeholder="Email" required>
                <textarea name="mensaje" placeholder="Mensaje" required></textarea>
                <button type="submit">Enviar Mensaje</button>
            </form>
        </div>
    </section>

    <div id="cart-modal" class="modal">
        <div class="modal-content">
            <?php if(!isset($_SESSION['usuario_id'])): ?>
                <div class="error-message">
                    <i class="fas fa-exclamation-circle"></i>
                    <p>Por favor, inicie sesión para realizar una compra.</p>
                    <a href="login.php" class="btn-login">Iniciar Sesión</a>
                </div>
            <?php else: ?>
                <div class="modal-header">
                    <h2>Carrito de Compras</h2>
                    <span class="close-modal">&times;</span>
                </div>
                <div id="cart-items" class="cart-items"></div>
                <div class="cart-summary">
                    <div id="cart-subtotal">Subtotal: 0.00€</div>
                    <div id="cart-iva">IVA (21%): 0.00€</div>
                    <div id="cart-total" class="cart-total">Total: 0.00€</div>
                </div>
                <div class="cart-buttons">
                    <button onclick="vaciarCarrito()" class="btn-vaciar">
                        <i class="fas fa-trash"></i> Vaciar Carrito
                    </button>
                    <button onclick="procesarCompra()" class="btn-comprar">
                        <i class="fas fa-check"></i> Finalizar Compra
                    </button>
                </div>
            <?php endif; ?>
        </div>
    </div>

    <div id="factura-modal" class="modal">
        <div class="modal-content factura-container">
            <div class="modal-header">
                <h2>Factura de Compra</h2>
                <span class="close-modal" onclick="cerrarFactura()">&times;</span>
            </div>
            <div class="factura-content">
                <div class="factura-header">
                    <div class="empresa-info">
                        <h3>Mariscos Recio</h3>
                        <p>San Valentín, Malabo</p>
                        <p>Tel: +240 555 363 628</p>
                    </div>
                    <div id="factura-datos-cliente"></div>
                </div>
                <div class="factura-items">
                    <h3>Productos Comprados</h3>
                    <div id="factura-productos"></div>
                </div>
                <div class="factura-resumen">
                    <div id="factura-subtotal"></div>
                    <div id="factura-iva"></div>
                    <div id="factura-total"></div>
                </div>
            </div>
            <div class="factura-footer">
                <button onclick="imprimirFactura()" class="print-button">
                    <i class="fas fa-print"></i> Imprimir Factura
                </button>
                <button onclick="descargarFactura()" class="download-button">
                    <i class="fas fa-download"></i> Descargar PDF
                </button>
            </div>
        </div>
    </div>

    <footer>
        <div class="footer-content">
            <div class="footer-section">
                <h3>Contacto</h3>
                <p><i class="fas fa-envelope"></i> info@mariscosrecio.com</p>
                <p><i class="fas fa-phone"></i> +240 555 363 628</p>
                <p><i class="fas fa-map-marker-alt"></i> San Valentín, Malabo</p>
            </div>
            <div class="footer-section">
                <h3>Síguenos</h3>
                <div class="social-links">
                    <a href="#"><i class="fab fa-whatsapp"></i></a>
                    <a href="#"><i class="fab fa-tiktok"></i></a>
                    <a href="#"><i class="fab fa-telegram"></i></a>
                    <a href="#"><i class="fab fa-facebook"></i></a>
                    <a href="#"><i class="fab fa-instagram"></i></a>
                    <a href="#"><i class="fab fa-twitter"></i></a>
                </div>
            </div>
            <div class="footer-section">
                <h3>Enlaces Rápidos</h3>
                <a href="politica-privacidad.php">Política de Privacidad</a>
                <a href="terminos-condiciones.php">Términos y Condiciones</a>
                <a href="preguntas-frecuentes.php">Preguntas Frecuentes</a>
            </div>
        </div>
        <div class="footer-bottom">
            <p>&copy; 2025 Mariscos Recio - El Mar al Mejor Precio. Todos los derechos reservados.</p>
        </div>
    </footer>

    <script src="js/productos.js"></script>
    <script src="js/carrito.js"></script>
    <script src="assets/js/main.js"></script>
</body>
</html>