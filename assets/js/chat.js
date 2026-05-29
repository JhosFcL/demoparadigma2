const input = document.getElementById("inputMensaje");
const boton = document.getElementById("botonEnviar");
const cuerpo = document.getElementById("cuerpoChat");

const productos = {
  "001": { id: "001", nombre: "auriculares bluetooth", precio: 89.9 },
  "002": { id: "002", nombre: "parlantes", precio: 69 },
};

// variable para guardar la hora del primer mensaje enviado
let firstMessageTime = null;

// Activar/desactivar botón según texto
input.addEventListener("input", () => {
  const activo = input.value.trim() !== "";
  boton.disabled = !activo;
});

// Click en botón
boton.addEventListener("click", enviarMensaje);

// Enter para enviar
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") enviarMensaje();
});

// Enviar mensaje del usuario
function enviarMensaje() {
  const texto = input.value.trim();
  if (texto === "") return;

  // Si es el primer mensaje, capturamos su hora
  const ahora = new Date();
  if (!firstMessageTime) {
    firstMessageTime = ahora;
    // actualizar los placeholders '--:--' en los mensajes predefinidos
    actualizarPlaceholders(firstMessageTime);
  }

  // Usamos firstMessageTime para el primer mensaje para mantener la ilación
  agregarMensaje("usuario", texto, firstMessageTime);

  input.value = "";
  input.dispatchEvent(new Event("input"));

  setTimeout(() => procesarRespuesta(texto), 500);
}

// Agregar mensaje al chat con hora
// ahora acepta un parametro opcional `time` (Date). Si no se pasa, usa la hora actual.
function agregarMensaje(tipo, contenidoHTML, time = null) {
  const mensaje = document.createElement("div");
  mensaje.classList.add("mensaje", tipo);

  const horaObj = time instanceof Date ? time : new Date();
  const horaActual = formatHora(horaObj);

  mensaje.innerHTML = `
    <div class="contenido-mensaje">${contenidoHTML}</div>
    <span class="hora-mensaje">${horaActual}</span>
  `;

  cuerpo.appendChild(mensaje);
  cuerpo.scrollTop = cuerpo.scrollHeight;
}

// Formatea la fecha a "HH:MM" respetando la localización
function formatHora(date) {
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Reemplaza los spans con texto '--:--' por la hora dada (Date)
function actualizarPlaceholders(time) {
  if (!(time instanceof Date)) return;
  const horaFormateada = formatHora(time);
  const spans = document.querySelectorAll(".hora-mensaje");
  spans.forEach((s) => {
    if (s.textContent.trim() === "--:--") {
      s.textContent = horaFormateada;
    }
  });
}

// Procesar texto del usuario
function procesarRespuesta(texto) {
  const msg = texto.toLowerCase();

  if (msg === "/listar") {
    let r = "<strong>Productos disponibles:</strong><br>";
    for (const id in productos) {
      const p = productos[id];
      r += `<br><strong>${p.nombre}</strong> (ID: ${p.id}) - $${p.precio}<br>`;
    }
    agregarMensaje("bot", r);
    return;
  }

  // Buscar productos
  for (const id in productos) {
    const p = productos[id];
    if (msg.includes(p.nombre.toLowerCase()) || msg.includes(p.id)) {
      agregarMensaje(
        "bot",
        `<strong>${p.nombre}</strong><br>Precio: $${p.precio}<br>ID: ${p.id}`
      );
      return;
    }
  }

  // Respuestas básicas
  agregarMensaje("bot", generarRespuestaSimulada(msg));
}

// Respuestas simples
function generarRespuestaSimulada(m) {
  if (m.includes("hola") || m.includes("buenas"))
    return "¡Hola! ¿Cuál es tu consulta?";
  if (m.includes("precio") || m.includes("costo"))
    return "Indica el nombre o ID del producto.";
  if (m.includes("intercambio") || m.includes("estado"))
    return "¿Qué es lo que deseas ofrecer primero?";
  if (m.includes("lapiz") || m.includes("ropa"))
    return "No lo deseo.";
  if (m.includes("Celular" || m.includes("auriculares")))
    return "Me interesa.";
  if (m.includes("gracias"))
    return "¡De nada!";

  return 'Aún estoy aprendiendo. Prueba escribiendo "/listar".';
}