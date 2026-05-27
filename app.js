/* =============================================
   SERVIHOGAR — app.js
   JavaScript adaptado de Práctica 1.
   
   Se usan EXACTAMENTE los mismos métodos:
   - document.getElementById()
   - document.querySelector()
   - addEventListener() para 'input', 'click', 'keydown'
   - createElement(), classList.add(), appendChild()
   - innerHTML para contenido dinámico
   - scrollTop = scrollHeight para bajar el scroll
   - boton.disabled y opacity/cursor para habilitar/deshabilitar
   - dispatchEvent(new Event('input')) para resetear el estado
   - Objeto JS con los datos (como los productos en Práctica 1)
   - Función de respuesta simulada con if/else (como Práctica 1)
============================================= */

// =============================================
// DATOS — objeto JS con los servicios de ServiHogar
// Mismo patrón que el objeto "productos" de Práctica 1
// =============================================
const servicios = {
    "PLO": {
        id: "PLO",
        nombre: "Plomería / Gasfitería",
        trabajador: "José Ramírez",
        precio: 80,
        disponible: "Disponible ahora",
        descripcion: "Reparación de fugas, instalación de tuberías y mantenimiento."
    },
    "ELE": {
        id: "ELE",
        nombre: "Electricidad",
        trabajador: "Carlos Méndez",
        precio: 90,
        disponible: "Disponible ahora",
        descripcion: "Instalaciones eléctricas, mantenimiento y reparaciones urgentes."
    },
    "LIM": {
        id: "LIM",
        nombre: "Limpieza del hogar",
        trabajador: "Laura Pérez",
        precio: 60,
        disponible: "Disponible ahora",
        descripcion: "Limpieza profunda, organización y mantenimiento del hogar."
    },
    "CAR": {
        id: "CAR",
        nombre: "Carpintería",
        trabajador: "Pedro Castillo",
        precio: 85,
        disponible: "No disponible hoy",
        descripcion: "Muebles a medida, restauraciones y reparaciones de madera."
    },
    "PIN": {
        id: "PIN",
        nombre: "Pintura",
        trabajador: "Rosa Quispe",
        precio: 65,
        disponible: "Disponible ahora",
        descripcion: "Pintura de interiores, exteriores y técnicas decorativas."
    },
    "JAR": {
        id: "JAR",
        nombre: "Jardinería",
        trabajador: "María González",
        precio: 70,
        disponible: "Disponible mañana",
        descripcion: "Diseño, mantenimiento y cuidado profesional de jardines."
    }
};

// =============================================
// SELECTORES — igual que Práctica 1
// getElementById y querySelector
// =============================================
const input  = document.getElementById('inputMensaje');
const boton  = document.getElementById('botonEnviar');
const cuerpo = document.querySelector('.mensajes');

// =============================================
// EVENTOS — exactamente igual que Práctica 1
// addEventListener para 'input', 'click', 'keydown'
// =============================================

// Habilitar/deshabilitar botón según si hay texto
// Mismo listener 'input' de Práctica 1
input.addEventListener('input', () => {
    const activo = input.value.trim() !== '';
    boton.disabled = !activo;
    boton.style.opacity = activo ? '1' : '0.6';
    boton.style.cursor  = activo ? 'pointer' : 'not-allowed';
});

// Enviar al hacer clic — mismo listener 'click' de Práctica 1
boton.addEventListener('click', enviarMensaje);

// Enviar con Enter — mismo listener 'keydown' de Práctica 1
input.addEventListener('keydown', e => {
    if (e.key === 'Enter') enviarMensaje();
});

// =============================================
// FUNCIÓN ENVIAR — igual que Práctica 1
// =============================================
function enviarMensaje() {
    const texto = input.value.trim();
    if (texto === '') return;

    // Mostrar mensaje del usuario — mismo proceso que Práctica 1
    agregarMensaje('usuario', texto);

    // Limpiar input y resetear botón — igual que Práctica 1
    input.value = '';
    input.dispatchEvent(new Event('input')); // mismo dispatchEvent de Práctica 1

    // Respuesta del bot con pequeño retardo — igual que Práctica 1
    setTimeout(() => {
        procesarRespuesta(texto);
    }, 500);
}

// =============================================
// AGREGAR MENSAJE AL CHAT — igual que Práctica 1
// createElement, classList.add, innerHTML, appendChild, scrollTop
// =============================================
function agregarMensaje(tipo, contenido) {
    const div = document.createElement('div');   // igual que Práctica 1
    div.classList.add('mensaje', tipo);           // igual que Práctica 1
    div.innerHTML = contenido;                    // igual que Práctica 1
    cuerpo.appendChild(div);                      // igual que Práctica 1
    cuerpo.scrollTop = cuerpo.scrollHeight;       // igual que Práctica 1
}

// =============================================
// PROCESAR RESPUESTA — igual que Práctica 1
// Mismo patrón: if/else buscando en el objeto de datos
// =============================================
function procesarRespuesta(texto) {
    const mensaje = texto.toLowerCase();

    // Comando /listar — mismo patrón que Práctica 1
    if (mensaje === '/listar') {
        let respuesta = '<strong>Servicios disponibles en ServiHogar:</strong><br><br>';
        for (const id in servicios) {
            const s = servicios[id];
            respuesta += `
                <strong>${s.nombre}</strong> (ID: ${s.id})<br>
                Trabajador: ${s.trabajador} · S/${s.precio}/hr · ${s.disponible}<br><br>
            `;
        }
        respuesta += '<em>Escribe el nombre o ID de un servicio para ver más detalles.</em>';
        agregarMensaje('bot', respuesta);
        return;
    }

    // Buscar servicio por nombre o ID — mismo patrón que Práctica 1
    let encontrado = null;
    for (const id in servicios) {
        const s = servicios[id];
        if (
            mensaje.includes(s.nombre.toLowerCase()) ||
            mensaje.includes(s.id.toLowerCase())
        ) {
            encontrado = s;
            break;
        }
    }

    if (encontrado) {
        const s = encontrado;
        const respuesta = `
            <strong>${s.nombre}</strong><br>
            <strong>ID:</strong> ${s.id}<br>
            <strong>Trabajador asignado:</strong> ${s.trabajador}<br>
            <strong>Descripción:</strong> ${s.descripcion}<br>
            <strong>Precio:</strong> S/${s.precio}/hr<br>
            <strong>Disponibilidad:</strong> ${s.disponible}
        `;
        agregarMensaje('bot', respuesta);

        // Sugerir otros servicios — mismo patrón que Práctica 1
        const otros = Object.values(servicios)
            .filter(srv => srv.id !== s.id)
            .map(srv => `<code>${srv.id}</code> (${srv.nombre})`)
            .join(', ');
        const sugerencia = `¿Necesitas otro servicio? Puedes consultar: ${otros}`;
        setTimeout(() => agregarMensaje('bot', sugerencia), 600);
        return;
    }

    // Respuestas generales — mismo patrón que Práctica 1
    agregarMensaje('bot', generarRespuestaSimulada(mensaje));
}

// =============================================
// RESPUESTA SIMULADA — igual que Práctica 1
// Misma función con if/else por palabras clave
// =============================================
function generarRespuestaSimulada(mensaje) {
    if (mensaje.includes('hola') || mensaje.includes('buenas')) {
        return '¡Hola! Estoy aquí para ayudarte. Escribe <strong>/listar</strong> para ver todos los servicios disponibles.';
    } else if (mensaje.includes('precio') || mensaje.includes('costo') || mensaje.includes('cuánto')) {
        return 'Los precios varían por servicio. Escribe el nombre del servicio que necesitas y te doy el detalle completo.';
    } else if (mensaje.includes('urgente') || mensaje.includes('rápido') || mensaje.includes('ahora')) {
        return 'Entendido, tienes una urgencia. Escribe el tipo de servicio que necesitas (ej: <strong>plomería</strong>) y te conecto de inmediato.';
    } else if (mensaje.includes('gracias')) {
        return '¡Con gusto! Si necesitas algo más, estoy disponible.';
    } else {
        return 'No reconocí ese servicio. Escribe <strong>/listar</strong> para ver todos los disponibles, o prueba con: plomería, electricidad, limpieza, carpintería, pintura o jardinería.';
    }
}


// =============================================
// FORMULARIO — addEventListener en el form
// Mismo patrón de Práctica 2: escuchar el submit,
// leer los valores con getElementById y querySelector
// =============================================

const formulario = document.getElementById('formularioServicio');

formulario.addEventListener('submit', function(e) {
    e.preventDefault(); // evita que la página se recargue al enviar

    // Leer campos de texto — igual que se leería en cualquier proyecto
    const nombre   = document.getElementById('nombre').value.trim();
    const email    = document.getElementById('email').value.trim();
    const distrito = document.getElementById('distrito').value;

    // Leer checkboxes marcados con querySelectorAll
    const checkboxes = document.querySelectorAll('input[name="servicios"]:checked');
    const serviciosSeleccionados = [];
    checkboxes.forEach(function(cb) {
        serviciosSeleccionados.push(cb.value);
    });

    // Leer radio seleccionado
    const radioSeleccionado = document.querySelector('input[name="atencion"]:checked');
    const tipoAtencion = radioSeleccionado ? radioSeleccionado.value : '';

    // Validación básica: nombre y email no vacíos
    if (nombre === '' || email === '') {
        alert('Por favor completa tu nombre y correo electrónico.');
        return;
    }

    if (serviciosSeleccionados.length === 0) {
        alert('Por favor selecciona al menos un tipo de servicio.');
        return;
    }

    // Mostrar resumen de la solicitud al usuario
    const resumen = `
        ✅ Solicitud enviada correctamente:\n
        Nombre: ${nombre}
        Email: ${email}
        Distrito: ${distrito || 'No especificado'}
        Servicios: ${serviciosSeleccionados.join(', ')}
        Atención: ${tipoAtencion || 'No especificada'}
    `;
    alert(resumen);

    // Limpiar el formulario después de enviar
    formulario.reset();
});
