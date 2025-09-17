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
                    <img src="${producto.imagen}" alt="${producto.nombre}" 
                         class="producto-img" loading="lazy">
                    <span class="categoria-badge">${producto.categoria}</span>
                </div>
                <div class="producto-info">
                    <h3>${producto.nombre}</h3>
                    <p class="descripcion">${producto.descripcion}</p>
                    <div class="producto-footer">
                        <p class="precio">${producto.precio.toFixed(2)}€</p>
                        <button onclick="productosManager.agregarAlCarrito(${producto.id})" 
                                class="add-to-cart">
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

        // Verificar si el usuario está logueado
        if (!document.querySelector('.usuario-nombre')) {
            this.mostrarNotificacion('Debe iniciar sesión para añadir productos al carrito', 'error');
            setTimeout(() => window.location.href = 'login.php', 2000);
            return;
        }

        // Usar la instancia del carrito definida globalmente
        carritoCompras.agregarAlCarrito(productoId);
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
async function cargarProductos() {
    try {
        const response = await fetch('api/obtener_productos.php');
        const productos = await response.json();
        mostrarProductos(productos);
    } catch (error) {
        console.error('Error al cargar productos:', error);
    }
}

function mostrarProductos(productos) {
    const container = document.getElementById('productos-container');
    container.innerHTML = '';
    
    productos.forEach(producto => {
        const productoElement = crearElementoProducto(producto);
        container.appendChild(productoElement);
    });
}

function crearElementoProducto(producto) {
    const div = document.createElement('div');
    div.className = 'producto-card';
    div.innerHTML = `
        <img src="${producto.imagen}" alt="${producto.nombre}">
        <h3>${producto.nombre}</h3>
        <p>${producto.descripcion}</p>
        <p class="precio">${producto.precio}€</p>
        <button onclick="agregarAlCarrito(${producto.id})">
            <i class="fas fa-cart-plus"></i> Añadir al carrito
        </button>
    `;
    return div;
}

document.addEventListener('DOMContentLoaded', cargarProductos);
// Mantener el array de productos original
const productos = [
    // ... tu array de productos actual ...
    {
        id: 1,
        nombre: "Gambas Rojas",
        descripcion: "Gambas rojas frescas de Huelva, calidad superior",
        precio: 24.99,
        imagen: "https://images.unsplash.com/photo-1565680018434-b583b12be0d3",
        categoria: "mariscos"
    },
    {
        id: 2,
        nombre: "Almejas Gallegas",
        descripcion: "Almejas finas de las rías gallegas",
        precio: 19.99,
        imagen: "https://images.unsplash.com/photo-1610725663727-08569f89aef4",
        categoria: "mariscos"
    },
    {
        id: 3,
        nombre: "Salmón Noruego",
        descripcion: "Salmón fresco de Noruega",
        precio: 22.99,
        imagen: "https://images.unsplash.com/photo-1574781330855-d0db8cc6a79c",
        categoria: "pescados"
    },
    {
        id: 4,
        nombre: "Lubina",
        descripcion: "Lubina salvaje del Cantábrico",
        precio: 28.99,
        imagen: "https://images.unsplash.com/photo-1534043464124-3be32fe000c9",
        categoria: "pescados"
    },
    {
        id: 5,
        nombre: "Bogavante",
        descripcion: "Bogavante fresco del Cantábrico",
        precio: 45.99,
        imagen: "https://images.unsplash.com/photo-1569493086584-33e0b36f3145",
        categoria: "mariscos"
    },
    {
        id: 6,
        nombre: "Salmón Ahumado",
        descripcion: "Salmón ahumado artesanal",
        precio: 15.99,
        imagen: "https://images.unsplash.com/photo-1585545335512-1e43f40d4999",
        categoria: "ahumados"
    },
    {
        id: 7,
        nombre: "Mejillones",
        descripcion: "Mejillones frescos de las rías gallegas",
        precio: 13.99,
        imagen: "https://images.unsplash.com/photo-1625943553852-781c6dd46faa",
        categoria: "mariscos"
    },
    {
        id: 8,
        nombre: "Pulpo Gallego",
        descripcion: "Pulpo gallego cocido",
        precio: 32.99,
        imagen: "https://images.unsplash.com/photo-1565680018392-43c40a2d4f82",
        categoria: "mariscos"
    },
    {
        id: 9,
        nombre: "Lomot",
        descripcion: "Pez espada original de GE",
        precio: 52.00,
        imagen: "https://images.unsplash.com/photo-1574781330855-d0db8cc6a79c",
        categoria: "pescados"
    },
    {
        id: 10,
        nombre: "Cangrejo",
        descripcion: "Cangrejos marinos rojos",
        precio: 43.99,
        imagen: "https://images.unsplash.com/photo-1569493086584-33e0b36f3145",
        categoria: "mariscos"
    },
    {
        id: 11,
        nombre: "Chicharro",
        descripcion: "Chicharro ahumado",
        precio: 67.85,
        imagen: "https://images.unsplash.com/photo-1585545335512-1e43f40d4999",
        categoria: "ahumados"
    },
    {
        id: 12,
        nombre: "Cigala",
        descripcion: "Cigala para una cena muy fina",
        precio: 24.99,
        imagen: "https://images.unsplash.com/photo-1565680018434-b583b12be0d3",
        categoria: "mariscos"
    },
    {
        id: 13,
        nombre: "Pez Globo",
        descripcion: "Pez globo fresco del Pacífico",
        precio: 18.99,
        imagen: "https://images.unsplash.com/photo-1534043464124-3be32fe000c9",
        categoria: "pescados"
    },    
        {
            id: 14,
            nombre: "Dorada Salvaje",
            descripcion: "Dorada fresca del Mediterráneo",
            precio: 26.99,
            imagen: "https://images.unsplash.com/photo-1534043464124-3be32fe000c9",
            categoria: "pescados"
        },
        {
            id: 15,
            nombre: "Langostinos Tigre",
            descripcion: "Langostinos tigre extra grandes",
            precio: 35.99,
            imagen: "https://images.unsplash.com/photo-1565680018434-b583b12be0d3",
            categoria: "mariscos"
        },
        {
            id: 16,
            nombre: "Atún Rojo",
            descripcion: "Atún rojo de almadraba",
            precio: 42.99,
            imagen: "https://images.unsplash.com/photo-1574781330855-d0db8cc6a79c",
            categoria: "pescados"
        },
        {
            id: 17,
            nombre: "Percebes Gallegos",
            descripcion: "Percebes frescos de Galicia",
            precio: 89.99,
            imagen: "https://images.unsplash.com/photo-1610725663727-08569f89aef4",
            categoria: "mariscos"
        },
        {
            id: 18,
            nombre: "Bacalao Ahumado",
            descripcion: "Bacalao ahumado noruego",
            precio: 28.99,
            imagen: "https://images.unsplash.com/photo-1585545335512-1e43f40d4999",
            categoria: "ahumados"
        },
        {
            id: 19,
            nombre: "Rodaballo",
            descripcion: "Rodaballo salvaje del Cantábrico",
            precio: 34.99,
            imagen: "https://images.unsplash.com/photo-1534043464124-3be32fe000c9",
            categoria: "pescados"
        },
        {
            id: 20,
            nombre: "Navajas Gallegas",
            descripcion: "Navajas frescas de las rías",
            precio: 23.99,
            imagen: "https://images.unsplash.com/photo-1610725663727-08569f89aef4",
            categoria: "mariscos"
        },
        {
            id: 21,
            nombre: "Trucha Ahumada",
            descripcion: "Trucha ahumada artesanal",
            precio: 19.99,
            imagen: "https://images.unsplash.com/photo-1585545335512-1e43f40d4999",
            categoria: "ahumados"
        },
        {
            id: 22,
            nombre: "Rape",
            descripcion: "Rape del Cantábrico",
            precio: 32.99,
            imagen: "https://images.unsplash.com/photo-1534043464124-3be32fe000c9",
            categoria: "pescados"
        },
        {
            id: 23,
            nombre: "Zamburiñas",
            descripcion: "Zamburiñas frescas gallegas",
            precio: 26.99,
            imagen: "https://images.unsplash.com/photo-1610725663727-08569f89aef4",
            categoria: "mariscos"
        },
        {
            id: 24,
            nombre: "Sushi Dragon Roll",
            descripcion: "Roll especial con tempura de langostino y aguacate",
            precio: 18.99,
            imagen: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c",
            categoria: "especial"
        },
        {
            id: 25,
            nombre: "Sushi Rainbow Roll",
            descripcion: "Roll especial con variedad de pescado crudo",
            precio: 21.99,
            imagen: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c",
            categoria: "especial"
        },
        {
            id: 26,
            nombre: "Merluza del Cantábrico",
            descripcion: "Merluza fresca del norte",
            precio: 25.99,
            imagen: "https://images.unsplash.com/photo-1534043464124-3be32fe000c9",
            categoria: "pescados"
        },
        {
            id: 27,
            nombre: "Sardinas",
            descripcion: "Sardinas frescas del día",
            precio: 12.99,
            imagen: "https://images.unsplash.com/photo-1574781330855-d0db8cc6a79c",
            categoria: "pescados"
        },
        {
            id: 28,
            nombre: "Carabineros",
            descripcion: "Carabineros rojos gigantes",
            precio: 95.99,
            imagen: "https://images.unsplash.com/photo-1565680018434-b583b12be0d3",
            categoria: "mariscos"
        },
        {
            id: 29,
            nombre: "Angulas",
            descripcion: "Angulas del Norte",
            precio: 180.00,
            imagen: "https://images.unsplash.com/photo-1610725663727-08569f89aef4",
            categoria: "pescados"
        },
        {
            id: 30,
            nombre: "Caballa Ahumada",
            descripcion: "Caballa ahumada artesanal",
            precio: 16.99,
            imagen: "https://images.unsplash.com/photo-1585545335512-1e43f40d4999",
            categoria: "ahumados"
        },
        {
            id: 31,
            nombre: "Besugo",
            descripcion: "Besugo fresco del Cantábrico",
            precio: 38.99,
            imagen: "https://images.unsplash.com/photo-1534043464124-3be32fe000c9",
            categoria: "pescados"
        },
        {
            id: 32,
            nombre: "Centollo",
            descripcion: "Centollo gallego",
            precio: 42.99,
            imagen: "https://images.unsplash.com/photo-1569493086584-33e0b36f3145",
            categoria: "mariscos"
        },
        {
            id: 33,
            nombre: "Anchoas Ahumadas",
            descripcion: "Anchoas ahumadas en aceite de oliva",
            precio: 22.99,
            imagen: "https://images.unsplash.com/photo-1585545335512-1e43f40d4999",
            categoria: "ahumados"
        },
        {
            id: 34,
            nombre: "Lenguado",
            descripcion: "Lenguado fresco del Mediterráneo",
            precio: 36.99,
            imagen: "https://images.unsplash.com/photo-1534043464124-3be32fe000c9",
            categoria: "pescados"
        },
        {
            id: 35,
            nombre: "Ostras",
            descripcion: "Ostras francesas premium",
            precio: 32.99,
            imagen: "https://images.unsplash.com/photo-1610725663727-08569f89aef4",
            categoria: "mariscos"
        },
        {
            id: 36,
            nombre: "Palometa Ahumada",
            descripcion: "Palometa ahumada artesanal",
            precio: 24.99,
            imagen: "https://images.unsplash.com/photo-1585545335512-1e43f40d4999",
            categoria: "ahumados"
        },
        {
            id: 37,
            nombre: "Pez Espada",
            descripcion: "Pez espada fresco del Mediterráneo",
            precio: 29.99,
            imagen: "https://images.unsplash.com/photo-1574781330855-d0db8cc6a79c",
            categoria: "pescados"
        },
        {
            id: 38,
            nombre: "Langosta",
            descripcion: "Langosta azul del Mediterráneo",
            precio: 89.99,
            imagen: "https://images.unsplash.com/photo-1569493086584-33e0b36f3145",
            categoria: "mariscos"
        },
        {
            id: 39,
            nombre: "Arenque Ahumado",
            descripcion: "Arenque ahumado al estilo nórdico",
            precio: 18.99,
            imagen: "https://images.unsplash.com/photo-1585545335512-1e43f40d4999",
            categoria: "ahumados"
        },
        {
            id: 40,
            nombre: "Bonito del Norte",
            descripcion: "Bonito del norte salvaje",
            precio: 26.99,
            imagen: "https://images.unsplash.com/photo-1574781330855-d0db8cc6a79c",
            categoria: "pescados"
        } 
    ];


// Inicializar el gestor de productos
const productosManager = new ProductosManager();