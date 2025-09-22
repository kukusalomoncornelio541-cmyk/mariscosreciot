class ProductosManager {
    constructor() {
        this.productos = productos;
        this.filtroActual = '';
        this.categoriaActual = '';
        this.init();
    }

    init() {
        this.cargarProductos();
        this.setupEventListeners();
    }

    setupEventListeners() {
        const buscarInput = document.getElementById('buscar-producto');
        const categoriaSelect = document.getElementById('categoria-filter');

        if (buscarInput) {
            buscarInput.addEventListener('input', (e) => {
                this.filtroActual = e.target.value.toLowerCase();
                this.filtrarProductos();
            });
        }

        if (categoriaSelect) {
            categoriaSelect.addEventListener('change', (e) => {
                this.categoriaActual = e.target.value;
                this.filtrarProductos();
            });
        }
    }

    filtrarProductos() {
        let productosFiltrados = this.productos;

        if (this.categoriaActual) {
            productosFiltrados = productosFiltrados.filter(p => 
                p.categoria === this.categoriaActual
            );
        }

        if (this.filtroActual) {
            productosFiltrados = productosFiltrados.filter(p => 
                p.nombre.toLowerCase().includes(this.filtroActual) ||
                p.descripcion.toLowerCase().includes(this.filtroActual)
            );
        }

        this.mostrarProductos(productosFiltrados);
    }

    mostrarProductos(productosAMostrar) {
        const container = document.getElementById('productos-container');
        if (!container) return;

        if (productosAMostrar.length === 0) {
            container.innerHTML = `
                <div class="no-productos">
                    <i class="fas fa-search"></i>
                    <p>No se encontraron productos</p>
                </div>`;
            return;
        }

        container.innerHTML = productosAMostrar.map(producto => this.crearTarjetaProducto(producto)).join('');
    }

    crearTarjetaProducto(producto) {
        return `
            <div class="producto-card" data-categoria="${producto.categoria}">
                <div class="producto-imagen-container">
                    <img src="${producto.imagen}" alt="${producto.nombre}" class="producto-img" loading="lazy">
                    <span class="categoria-badge">${producto.categoria}</span>
                </div>
                <div class="producto-info">
                    <h3>${producto.nombre}</h3>
                    <p class="descripcion">${producto.descripcion}</p>
                    <div class="producto-footer">
                        <p class="precio">${producto.precio.toFixed(2)}€</p>
                        <button onclick="productosManager.agregarAlCarrito(${producto.id})" class="add-to-cart">
                            <i class="fas fa-cart-plus"></i>
                            Añadir al carrito
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    agregarAlCarrito(productoId) {
        const producto = this.productos.find(p => p.id === productoId);
        if (!producto) return;

        if (!document.querySelector('.usuario-nombre')) {
            this.mostrarNotificacion('Debe iniciar sesión para añadir productos al carrito', 'error');
            setTimeout(() => window.location.href = 'login.php', 2000);
            return;
        }

        carritoCompras.agregarAlCarrito(productoId);
        this.mostrarNotificacion('Producto añadido al carrito', 'success');
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

    cargarProductos() {
        this.mostrarProductos(this.productos);
    }
}

const productos = [
    {
        id: 1,
        nombre: "Gambas Rojas",
        descripcion: "Gambas rojas frescas de Huelva, calidad superior",
        precio: 24.99,
        imagen: "img/productos/gambas.jpg",
        categoria: "mariscos"
    },
    // ... rest of the products array ...
    {
        id: 40,
        nombre: "Bonito del Norte",
        descripcion: "Bonito del norte salvaje",
        precio: 26.99,
        imagen: "img/productos/bonito.jpg",
        categoria: "pescados"
    }
];

// Initialize products manager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.productosManager = new ProductosManager();
});