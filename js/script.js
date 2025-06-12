// 🏬 Alaska Tech - Tienda de Tecnología
// ✅ IMPORTANTE: ¿Cuándo usar DOMContentLoaded?
// Usá este evento si tu script está en el <head> o si accedés a elementos del DOM
// que todavía no se cargaron (como botones, secciones, divs).

// "Esperá a que el HTML esté completamente cargado antes de manipularlo."
// Si el <script src="..."> está al final del <body>, NO hace falta usarlo.
//
// Recomendación: si vas a acceder al DOM, asegurate que todo el HTML esté cargado.
document.addEventListener("DOMContentLoaded", () => {
  // 🛒 Lista de productos disponibles en tu tienda Alaska Tech
  const productos = [
    {
      id: 1,
      nombre: "AirPods Gen 2",
      precio: 89999,
      imagen: "img/AirPods.png",
      cantidad: 1,
    },
    {
      id: 2,
      nombre: "AirPods Max",
      precio: 13999,
      imagen: "img/AirPodsMax.png",
      cantidad: 1,
    },
    {
      id: 3,
      nombre: "Proyector UltraHD",
      precio: 5999,
      imagen: "img/ProyectorUltra.png",
      cantidad: 1,
    },
    {
      id: 4,
      nombre: "SmartWatch",
      precio: 20000,
      imagen: "img/SmartWatch.png",
      cantidad: 1,
    },
    {
      id: 5,
      nombre: "BatteryPack",
      precio: 10000,
      imagen: "img/BatteryPack.png",
      cantidad: 1,
    },
    {
      id: 6,
      nombre: "GameStick",
      precio: 35000,
      imagen: "img/GameStick.png",
      cantidad: 1,
    },
    {
      id: 7,
      nombre: "Lampara G-Led",
      precio: 23000,
      imagen: "img/Lampara GLed.png",
      cantidad: 1,
    },
    {
      id: 8,
      nombre: "Cargador Celular",
      precio: 15000,
      imagen: "img/CargadorCelular.png",
      cantidad: 1,
    },
  ];

  // 🔗 Obtenemos elementos del HTML
  const contenedor = document.getElementById("contenedor-productos");
  const listaCarrito = document.getElementById("lista-carrito");
  const totalCarrito = document.getElementById("total-carrito");
  const buscadorProductos = document.getElementById("buscador-productos");
  const btnComprar = document.getElementById("btn-comprar");
  const btnFinalizar = document.getElementById("btn-finalizar");
  const btnToggleCarrito = document.getElementById("btn-toggle-carrito");
  const carritoSidebar = document.getElementById("carrito");
  const btnVaciar = document.getElementById("vaciar-carrito");
  const btnCerrarCarrito = document.getElementById("btn-cerrar-carrito");

  // 🧠 Inicializamos el carrito
  let carrito = [];
  const carritoGuardado = localStorage.getItem("carrito");
  if (carritoGuardado) {
    carrito = JSON.parse(carritoGuardado);
    actualizarCarrito();
  }

  // 📦 Mostrar/Ocultar el carrito
  btnToggleCarrito.addEventListener("click", () => {
    carritoSidebar.classList.toggle("translate-x-full");
  });

  // ❌ Cerrar el carrito
  btnCerrarCarrito.addEventListener("click", () => {
    carritoSidebar.classList.add("translate-x-full");
  });
  

  // 🛍️ Mostrar productos
  function generarProductos(productos) {
    contenedor.innerHTML = "";

    productos.forEach((producto) => {
      const div = document.createElement("div");
      div.className =
        "bg-white shadow-md rounded-lg p-4 flex flex-col items-center text-center hover:shadow-xl transform hover:scale-105 transition duration-300";

      div.innerHTML = `
        <img src="${producto.imagen}" alt="${
        producto.nombre
      }" class="w-full max-w-[200px] h-[200px] object-contain mb-2 bg-white rounded shadow"/>
        <h3 class="text-lg font-semibold">${producto.nombre}</h3>
        <p class="text-blue-600 font-bold mb-2">$${producto.precio.toLocaleString()}</p>
        <button onclick="agregarAlCarrito(${producto.id})"
          class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded">
          Agregar al carrito
        </button>
      `;
      contenedor.appendChild(div);
    });
  }

  generarProductos(productos); // 👈 Mostrar al cargar

  // ➕ Agregar al carrito
  window.agregarAlCarrito = function (id) {
    // Buscamos el producto original en la lista de productos
    const producto = productos.find((p) => p.id === id);

    // Buscamos si ya está en el carrito
    const existente = carrito.find((p) => p.id === id);

    if (existente) {
      // Si ya está, le sumamos 1 a la cantidad
      existente.cantidad++;
    } else {
      // Si no está, lo agregamos con cantidad: 1
      carrito.push({ ...producto, cantidad: 1 });
    }
    const toast = document.createElement("div");
    toast.innerText = `${producto.nombre} agregado al carrito`;
    toast.className = `
                  fixed bottom-4 right-4
                  bg-gradient-to-r from-green-500 to-green-600
                  text-white px-4 py-2
                  rounded shadow-lg z-50
                  animate__animated animate__fadeInUp
                  transition-opacity duration-300
                  `;
    toast.style.opacity = "0.9"; // 🕶️ Le damos un poco de opacidad

    document.body.appendChild(toast);
    setTimeout(() => {
         toast.classList.remove("animate__fadeInUp");
        toast.classList.add("animate__fadeOutDown");
        setTimeout(() => toast.remove(), 500); // ⏳ Esperamos que termine de desaparecer
      }, 2500);
    actualizarCarrito();
  };

  function actualizarCarrito() {
    listaCarrito.innerHTML = ""; // 🔄 Limpiamos el contenido anterior del carrito
    let total = 0; // 🧮 Inicializamos el total a 0

    // 🔁 Recorremos todos los productos del carrito
    carrito.forEach((producto, index) => {
      const li = document.createElement("li"); // Creamos un <li> para cada producto

      // 🧱 Le damos estilos con Tailwind para que quede ordenado
      li.className =
        "flex items-center justify-between bg-gray-100 px-4 py-2 rounded mb-2";

      // 🧩 Le damos el contenido al <li>: nombre, controles de cantidad, y subtotal
      li.innerHTML = `
      <!-- 🏷️ Nombre del producto -->
      <div class="w-1/3">${producto.nombre}</div>

      <!-- 🔢 Controles para aumentar/disminuir cantidad -->
      <div class="flex items-center gap-2">
        <button onclick="restarCantidad(${index})" class="bg-red-500 hover:bg-red-600 text-white px-2 rounded">➖</button>
        <span id="cantidad-${index}" class="min-w-[20px] text-center">x${
        producto.cantidad
      }</span>
        <button onclick="sumarCantidad(${index})" class="bg-green-600 hover:bg-green-700 text-white px-2 rounded">➕</button>
      </div>

      <!-- 💰 Subtotal del producto (precio * cantidad) -->
      <div class="w-1/3 text-right font-bold">
        $${(producto.precio * producto.cantidad).toLocaleString()}
      </div>
    `;

      // 👉 Lo agregamos al contenedor del carrito en el HTML
      listaCarrito.appendChild(li);

      // ➕ Sumamos el subtotal al total general
      total += producto.precio * producto.cantidad;
    });

    // 💬 Mostramos el total final del carrito abajo
    totalCarrito.innerText = `Total: $${total.toLocaleString()}`;

    // 💾 Guardamos el carrito actualizado en localStorage
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }

  // ➕ Aumentar cantidad de un producto en el carrito
  window.sumarCantidad = function (index) {
    if (carrito[index]) {
      carrito[index].cantidad++;
      actualizarCarrito(); // Volvemos a mostrar todo actualizado
    }
  };

  // ➖ Disminuir cantidad o eliminar si es 1
  window.restarCantidad = function (index) {
    if (carrito[index].cantidad > 1) {
      carrito[index].cantidad--;
    } else {
      carrito.splice(index, 1); // Elimina el producto si tiene solo 1 unidad
    }
    actualizarCarrito(); // Volvemos a mostrar todo actualizado
  };

  window.eliminarDelCarrito = function (index) {
    const producto = carrito[index];
    if (index < 0 || index >= carrito.length) return; // Validar índice
    if (producto.cantidad > 1) {
      // 👇 Si hay más de una unidad, restamos una
      producto.cantidad--;
    } else {
      // 👇 Si queda una sola unidad, lo eliminamos del array
      carrito.splice(index, 1);
    }
    // 🔄 Actualizamos la vista y guardamos cambios
    actualizarCarrito();
  };
  // 🧹 Vaciar carrito
  btnVaciar.addEventListener("click", () => {
    carrito = [];
    localStorage.removeItem("carrito");
    actualizarCarrito();
  });

  // ✅ Finalizar compra
  btnFinalizar.addEventListener("click", () => {
    if (carrito.length === 0) {
      Swal.fire({
        title: "Carrito vacío",
        text: "Agregá productos antes de finalizar.",
        icon: "warning",
        confirmButtonText: "Ok",
      });
    } else {
      Swal.fire({
        title: "¡Compra finalizada!",
        text: "Gracias por confiar en Alaska Tech.",
        icon: "success",
        confirmButtonText: "Aceptar",
      });
      carrito.length = 0;
      localStorage.removeItem("carrito");
      actualizarCarrito();
    }
  });

  // 🔍 Buscador de productos
  buscadorProductos.addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase();

    if (query === "") {
      generarProductos(productos); // Mostramos todo si está vacío
      return;
    }

    const productosFiltrados = productos.filter((p) =>
      p.nombre.toLowerCase().includes(query)
    );

    if (productosFiltrados.length === 0) {
      contenedor.innerHTML =
        "<p class='text-red-500'>No se encontraron productos.</p>";
    } else {
      generarProductos(productosFiltrados);
    }
  });

  // 📲 Comprar por WhatsApp
  btnComprar?.addEventListener("click", () => {
    if (carrito.length === 0) {
      alert("El carrito está vacío");
      return;
    }

    const mensaje = carrito
      .map((p) => `- ${p.nombre}: $${p.precio}`)
      .join("%0A");
    const total = carrito.reduce((acc, p) => acc + p.precio, 0);
    const whatsappURL = `https://wa.me/549XXXXXXXXXX?text=Hola! Quiero comprar:%0A${mensaje}%0ATotal: $${total}`;

    window.open(whatsappURL, "_blank");
  });
});
