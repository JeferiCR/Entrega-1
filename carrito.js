// Función para mostrar los productos en la página
function mostrarProductos() {
    const contenedorProductos = document.getElementById('productos-lista'); // Contenedor de productos

    // Verificar que el contenedor de productos existe en el DOM
    if (!contenedorProductos) {
        console.error('El contenedor de productos no se encuentra en el DOM');
        return;
    }

    // Limpiar el contenedor antes de agregar productos
    contenedorProductos.innerHTML = '';

    const productos = [
        { nombre: 'Metal Gear Solid 1', imagen: '/img/mgs1.jpeg', descripcionCorta: 'Juego icónico de espionaje ver más...', descripcionLarga: 'La primera entrega de la saga Metal Gear Solid, lanzada en 1998.', precio: 59.99 },
        { nombre: 'Metal Gear Solid 2', imagen: '/img/mgs2.jpeg', descripcionCorta: 'Secuela impresionante ver más...', descripcionLarga: 'Una obra maestra del sigilo lanzada en 2001.', precio: 49.99 },
        { nombre: 'Metal Gear Solid 3', imagen: '/img/mgs3.jpeg', descripcionCorta: 'Acción en la selva ver más...', descripcionLarga: 'Metal Gear Solid 3: Snake Eater redefine el sigilo en la selva.', precio: 39.99 },
        { nombre: 'Metal Gear Solid 4', imagen: '/img/metal-4.png', descripcionCorta: 'El final de Snake ver más...', descripcionLarga: 'El final épico de la saga Solid Snake.', precio: 69.99 },
        { nombre: 'Metal Gear Solid 5', imagen: '/img/mgs5.jpg', descripcionCorta: 'Sigilo en mundo abierto ver más...', descripcionLarga: 'El mundo abierto llega a Metal Gear en The Phantom Pain.', precio: 79.99 }
    ];

    productos.forEach((producto, index) => {
        // Crear la estructura de la card
        const productoDiv = document.createElement('div');
        productoDiv.classList.add('card'); // Añadir clase 'card'

        // Crear el contenido de la card (imagen, texto, descripción y botón "Añadir al carrito")
        productoDiv.innerHTML = `
            <img src="${producto.imagen}" alt="portada-${producto.nombre}">
            <div class="contenido-card">
                <h3>${producto.nombre}</h3>
                <p class="descripcion" data-corta="${producto.descripcionCorta}" data-larga="${producto.descripcionLarga}">
                    ${producto.descripcionCorta}
                </p>
                <p>Precio: $${producto.precio}</p>
                <button class="btn btn-primary add-to-cart" data-id="${index}" data-nombre="${producto.nombre}" data-precio="${producto.precio}">Añadir al carrito</button>
            </div>
        `;

        // Agregar el producto al contenedor
        contenedorProductos.appendChild(productoDiv);
    });

    // Agregar eventos de clic a las descripciones para alternar entre corta y larga
    const descripciones = document.querySelectorAll('.descripcion');
    descripciones.forEach(descripcion => {
        descripcion.addEventListener('click', function() {
            const descripcionCorta = descripcion.getAttribute('data-corta');
            const descripcionLarga = descripcion.getAttribute('data-larga');

            // Alternar entre la descripción corta y larga
            if (descripcion.textContent === descripcionCorta) {
                descripcion.textContent = descripcionLarga;
            } else {
                descripcion.textContent = descripcionCorta;
            }
        });
    });

    // Agregar clic al botón "Añadir al carrito"
    const botonesAddToCart = document.querySelectorAll('.add-to-cart');
    botonesAddToCart.forEach(boton => {
        boton.addEventListener('click', function() {
            const producto = {
                nombre: boton.getAttribute('data-nombre'),
                precio: parseFloat(boton.getAttribute('data-precio')),
                cantidad: 1 // Inicialmente con cantidad 1
            };
            agregarAlCarrito(producto); // Llamar a la función para agregar al carrito
        });
    });
}

// Función para agregar productos al carrito en localStorage
function agregarAlCarrito(producto) {
    let carrito = JSON.parse(localStorage.getItem('cart')) || []; // Obtener carrito del localStorage

    // Verificar si el producto ya está en el carrito
    const productoExistente = carrito.find(item => item.nombre === producto.nombre);

    if (productoExistente) {
        // Si ya existe, aumentar la cantidad
        productoExistente.cantidad += 1;
    } else {
        // Si no existe, agregar el producto con cantidad 1
        carrito.push(producto);
    }

    // Guardar el carrito actualizado en localStorage
    localStorage.setItem('cart', JSON.stringify(carrito));

    console.log('Producto añadido al carrito:', producto);
}

// Función para mostrar el contenido del carrito en la tabla
function mostrarCarrito() {
    const contenedorCarrito = document.getElementById('carrito-lista'); // Contenedor de carrito
    if (!contenedorCarrito) {
        console.error('El contenedor del carrito no se encuentra en el DOM');
        return;
    }

    const carrito = JSON.parse(localStorage.getItem('cart')) || [];

    // Limpiar el contenedor antes de mostrar el carrito
    contenedorCarrito.innerHTML = '';

    if (carrito.length === 0) {
        contenedorCarrito.innerHTML = '<tr><td colspan="5">El carrito está vacío</td></tr>';
    } else {
        // Crear la tabla de carrito
        carrito.forEach((producto, index) => {
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>${producto.nombre}</td>
                <td>$${producto.precio.toFixed(2)}</td>
                <td>
                    <input type="number" value="${producto.cantidad}" min="1" class="cantidad" data-index="${index}">
                </td>
                <td>$${(producto.precio * producto.cantidad).toFixed(2)}</td>
                <td>
                    <button class="btn btn-danger eliminar-producto" data-index="${index}">Eliminar 1 unidad</button>
                </td>
            `;
            contenedorCarrito.appendChild(fila);
        });

        // Mostrar total
        const total = carrito.reduce((acc, producto) => acc + (producto.precio * producto.cantidad), 0);
        const totalElemento = document.getElementById('total');
        if (totalElemento) {
            totalElemento.textContent = total.toFixed(2);
        }

        // Agregar eventos para eliminar 1 unidad de productos
        const botonesEliminar = document.querySelectorAll('.eliminar-producto');
        botonesEliminar.forEach(boton => {
            boton.addEventListener('click', function() {
                const index = boton.getAttribute('data-index');
                eliminarUnidad(index);
            });
        });

        // Agregar eventos para editar la cantidad de los productos
        const inputsCantidad = document.querySelectorAll('.cantidad');
        inputsCantidad.forEach(input => {
            input.addEventListener('input', function() {
                const index = input.getAttribute('data-index');
                const nuevaCantidad = parseInt(input.value);
                editarCantidad(index, nuevaCantidad);
            });
        });
    }
}

// Función para eliminar una unidad de un producto del carrito
function eliminarUnidad(index) {
    let carrito = JSON.parse(localStorage.getItem('cart')) || [];
    if (carrito[index].cantidad > 1) {
        carrito[index].cantidad -= 1; // Reducir la cantidad de producto
    } else {
        carrito.splice(index, 1); // Eliminar el producto si la cantidad es 1
    }
    localStorage.setItem('cart', JSON.stringify(carrito)); // Guardar el carrito
    mostrarCarrito(); // Actualizar la vista del carrito
}

// Función para editar la cantidad de un producto en el carrito
function editarCantidad(index, cantidad) {
    let carrito = JSON.parse(localStorage.getItem('cart')) || [];
    if (cantidad <= 0) {
        cantidad = 1; // No permitir cantidades negativas o cero
    }
    carrito[index].cantidad = cantidad; // Actualizar la cantidad del producto
    localStorage.setItem('cart', JSON.stringify(carrito)); // Guardar el carrito actualiado
    mostrarCarrito(); // Actualizar la vista del carrito
}

// Función para limpiar el carrito (volver al inicio)
document.getElementById('limpiar-carrito')?.addEventListener('click', function() {
    localStorage.removeItem('cart'); // Limpiar el carrito en localStorage
    mostrarCarrito(); // Actualizar la vista del carrito
});

// Llamar a las funciones al cargar el DOM
document.addEventListener('DOMContentLoaded', function() {
    mostrarProductos(); // Mostrar los productos

    // Verificar si el contenedor del carrito existe antes de mostrarlo
    const carritoLista = document.getElementById('carrito-lista');
    if (carritoLista) {
        mostrarCarrito(); // Mostrar el carrito si estamos en la página del carrito
    }
});
