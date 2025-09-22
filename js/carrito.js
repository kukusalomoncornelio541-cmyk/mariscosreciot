class CarritoCompras {
    constructor() {
        this.carrito = JSON.parse(localStorage.getItem('carrito')) || [];
        this.init();
    }

    init() {
        this.actualizarCarrito();
        this.setupEventListeners();
    }

    mostrarNotificacion(mensaje, tipo = 'info') {
        const notificacion = document.createElement('div');
        notificacion.className = `notification ${tipo}`;
        notificacion.innerHTML = `
            <div class="notification-content">
                <i class="fas ${tipo === 'error' ? 'fa-exclamation-circle' : 'fa-check-circle'}"></i>
                <span>${mensaje}</span>
            </div>`;
        document.body.appendChild(notificacion);
        setTimeout(() => notificacion.remove(), 3000);
    }
    
    agregarAlCarrito(productoId) {
        const producto = productos.find(p => p.id === productoId);
        if (!producto) return;

        const itemExistente = this.carrito.find(item => item.id === productoId);
        
        if (itemExistente) {
            itemExistente.cantidad++;
        } else {
            this.carrito.push({ ...producto, cantidad: 1 });
        }

        this.actualizarCarrito();
        this.mostrarNotificacion('Producto añadido al carrito');
        this.guardarCarrito();
    }

    eliminarDelCarrito(index) {
        const item = this.carrito[index];
        if (item.cantidad > 1) {
            item.cantidad--;
        } else {
            this.carrito.splice(index, 1);
        }
        this.actualizarCarrito();
        this.mostrarNotificacion('Producto eliminado del carrito');
        this.guardarCarrito();
    }

    vaciarCarrito() {
        if (confirm('¿Está seguro de que desea vaciar el carrito?')) {
            this.carrito = [];
            this.actualizarCarrito();
            this.mostrarNotificacion('Carrito vaciado');
            this.guardarCarrito();
        }
    }

    calcularTotales() {
        const subtotal = this.carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
        const iva = subtotal * 0.21;
        const total = subtotal + iva;
        return { subtotal, iva, total };
    }

    actualizarCarrito() {
        const carritoItems = document.getElementById('cart-items');
        const { subtotal, iva, total } = this.calcularTotales();
        
        if (!carritoItems) return;

        carritoItems.innerHTML = this.carrito.map((item, index) => `
            <div class="carrito-item">
                <img src="${item.imagen}" alt="${item.nombre}" class="carrito-item-imagen">
                <div class="carrito-item-detalles">
                    <h4>${item.nombre}</h4>
                    <div class="carrito-item-controles">
                        <button onclick="carritoCompras.modificarCantidad(${index}, -1)">-</button>
                        <span>${item.cantidad}</span>
                        <button onclick="carritoCompras.modificarCantidad(${index}, 1)">+</button>
                    </div>
                    <span class="carrito-item-precio">${(item.precio * item.cantidad).toFixed(2)}€</span>
                </div>
                <button onclick="carritoCompras.eliminarDelCarrito(${index})" class="remove-item">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');

        this.actualizarTotales(subtotal, iva, total);
        this.actualizarContador();
    }

    actualizarTotales(subtotal, iva, total) {
        document.getElementById('cart-subtotal').textContent = `Subtotal: ${subtotal.toFixed(2)}€`;
        document.getElementById('cart-iva').textContent = `IVA (21%): ${iva.toFixed(2)}€`;
        document.getElementById('cart-total').textContent = `Total: ${total.toFixed(2)}€`;
    }

    actualizarContador() {
        const contador = this.carrito.reduce((sum, item) => sum + item.cantidad, 0);
        document.getElementById('cart-count').textContent = contador;
    }

    modificarCantidad(index, cambio) {
        const item = this.carrito[index];
        if (!item) return;

        item.cantidad += cambio;
        
        if (item.cantidad <= 0) {
            this.carrito.splice(index, 1);
        }

        this.actualizarCarrito();
        this.guardarCarrito();
    }

    async procesarCompra() {
        if (!this.validarCompra()) return;

        try {
            const datosUsuario = await this.obtenerDatosUsuario();
            const { subtotal, iva, total } = this.calcularTotales();

            await this.guardarPedido(datosUsuario, total);
            this.mostrarFactura(datosUsuario, subtotal, iva, total);
            
            this.finalizarCompra();
        } catch (error) {
            console.error('Error al procesar la compra:', error);
            this.mostrarNotificacion('Error al procesar la compra', 'error');
        }
    }

    validarCompra() {
        if (this.carrito.length === 0) {
            this.mostrarNotificacion('El carrito está vacío', 'error');
            return false;
        }

        if (!document.querySelector('.usuario-nombre')) {
            this.mostrarNotificacion('Debe iniciar sesión para realizar la compra', 'error');
            window.location.href = 'login.php';
            return false;
        }

        return true;
    }

    async obtenerDatosUsuario() {
        const response = await fetch('obtener_datos_usuario.php');
        return await response.json();
    }

    async guardarPedido(datosUsuario, total) {
        const response = await fetch('api/guardar_pedido.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                productos: this.carrito,
                total: total,
                usuario: datosUsuario
            })
        });

        const resultado = await response.json();
        if (!resultado.success) {
            throw new Error(resultado.mensaje);
        }
    }

    mostrarFactura(datosUsuario, subtotal, iva, total) {
        this.mostrarDatosCliente(datosUsuario);
        this.mostrarProductosFactura();
        this.mostrarTotalesFactura(subtotal, iva, total);
        this.toggleModales();
    }

    mostrarDatosCliente(datosUsuario) {
        document.getElementById('factura-datos-cliente').innerHTML = `
            <p><strong>Cliente:</strong> ${datosUsuario.nombre}</p>
            <p><strong>Dirección:</strong> ${datosUsuario.direccion}</p>
            <p><strong>Ciudad:</strong> ${datosUsuario.ciudad}</p>
            <p><strong>Teléfono:</strong> ${datosUsuario.telefono}</p>
            <p><strong>Email:</strong> ${datosUsuario.email}</p>
            <p><strong>Fecha:</strong> ${new Date().toLocaleDateString()}</p>
        `;
    }

    mostrarProductosFactura() {
        document.getElementById('factura-productos').innerHTML = this.carrito.map(item => `
            <div class="factura-item">
                <span>${item.nombre} x${item.cantidad}</span>
                <span>${(item.precio * item.cantidad).toFixed(2)}€</span>
            </div>
        `).join('');
    }

    mostrarTotalesFactura(subtotal, iva, total) {
        document.getElementById('factura-subtotal').textContent = `Subtotal: ${subtotal.toFixed(2)}€`;
        document.getElementById('factura-iva').textContent = `IVA (21%): ${iva.toFixed(2)}€`;
        document.getElementById('factura-total').textContent = `Total: ${total.toFixed(2)}€`;
    }

    toggleModales() {
        document.getElementById('cart-modal').style.display = 'none';
        document.getElementById('factura-modal').style.display = 'block';
    }

    finalizarCompra() {
        this.carrito = [];
        this.actualizarCarrito();
        this.guardarCarrito();
    }

    guardarCarrito() {
        localStorage.setItem('carrito', JSON.stringify(this.carrito));
    }

    setupEventListeners() {
        const cartIcon = document.querySelector('.cart-icon');
        if (cartIcon) {
            cartIcon.addEventListener('click', (e) => {
                e.preventDefault();
                document.getElementById('cart-modal').style.display = 'block';
            });
        }

        document.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', () => {
                document.getElementById('cart-modal').style.display = 'none';
                document.getElementById('factura-modal').style.display = 'none';
            });
        });

        window.onclick = (event) => {
            if (event.target.classList.contains('modal')) {
                event.target.style.display = 'none';
            }
        };
    }
}

// Inicializar carrito
const carritoCompras = new CarritoCompras();

// Funciones auxiliares para la factura
function cerrarFactura() {
    document.getElementById('factura-modal').style.display = 'none';
    carritoCompras.mostrarNotificacion('¡Gracias por su compra!');
}

function imprimirFactura() {
    window.print();
}