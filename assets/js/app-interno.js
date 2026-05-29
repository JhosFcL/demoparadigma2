// ── ServiHogar · app-interno.js ──
// Carga datos de sesión en todas las pantallas internas

document.addEventListener("DOMContentLoaded", function () {
    const sesion = JSON.parse(localStorage.getItem("servihogar_sesion") || "null");

    // Si no hay sesión, redirigir al login
    if (!sesion) {
        window.location.href = "login.html";
        return;
    }

    // Iniciales para el avatar
    const iniciales = (sesion.nombre[0] + (sesion.apellido ? sesion.apellido[0] : "")).toUpperCase();

    // Rellenar avatar topbar
    const topAvatar = document.getElementById("topbar-avatar");
    if (topAvatar) topAvatar.textContent = iniciales;

    // Rellenar sidebar usuario
    const sidebarName = document.getElementById("sidebar-name");
    const sidebarType = document.getElementById("sidebar-type");
    const sidebarInitials = document.getElementById("sidebar-initials");

    if (sidebarName) sidebarName.textContent = sesion.nombre + " " + (sesion.apellido || "");
    if (sidebarType) sidebarType.textContent = sesion.tipo === "trabajador" ? "Trabajador" : "Cliente";
    if (sidebarInitials) sidebarInitials.textContent = iniciales;

    // Botón cerrar sesión
    const btnSalir = document.getElementById("btn-salir");
    if (btnSalir) {
        btnSalir.addEventListener("click", function (e) {
            e.preventDefault();
            localStorage.removeItem("servihogar_sesion");
            window.location.href = "index.html";
        });
    }

    // Pills de categoría (buscar)
    document.querySelectorAll(".pill").forEach(pill => {
        pill.addEventListener("click", function () {
            document.querySelectorAll(".pill").forEach(p => p.classList.remove("active"));
            this.classList.add("active");
        });
    });

    // Tabs (historial)
    document.querySelectorAll(".tab").forEach(tab => {
        tab.addEventListener("click", function () {
            document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
            this.classList.add("active");
        });
    });

    // Like en posts del feed
    document.querySelectorAll(".post-action.like-btn").forEach(btn => {
        btn.addEventListener("click", function () {
            this.classList.toggle("liked");
            const count = this.querySelector(".like-count");
            if (count) {
                let n = parseInt(count.textContent);
                count.textContent = this.classList.contains("liked") ? n + 1 : n - 1;
            }
        });
    });

    // Chat: enviar mensaje
    const chatForm = document.getElementById("chat-form");
    const chatInput = document.getElementById("chat-input");
    const chatMessages = document.getElementById("chat-messages");

    if (chatForm && chatInput && chatMessages) {
        chatForm.addEventListener("submit", function (e) {
            e.preventDefault();
            const text = chatInput.value.trim();
            if (!text) return;

            const now = new Date();
            const hora = now.getHours().toString().padStart(2, "0") + ":" + now.getMinutes().toString().padStart(2, "0");

            const msgEl = document.createElement("div");
            msgEl.className = "msg sent";
            msgEl.innerHTML = `
                <div>
                    <div class="msg-bubble">${text}</div>
                    <div class="msg-time">${hora}</div>
                </div>
            `;
            chatMessages.appendChild(msgEl);
            chatInput.value = "";
            chatMessages.scrollTop = chatMessages.scrollHeight;

            // Respuesta automática demo
            setTimeout(() => {
                const resp = document.createElement("div");
                resp.className = "msg";
                resp.innerHTML = `
                    <div class="msg-avatar">C</div>
                    <div>
                        <div class="msg-bubble">Entendido, te confirmo en un momento. 👍</div>
                        <div class="msg-time">${hora}</div>
                    </div>
                `;
                chatMessages.appendChild(resp);
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }, 1200);
        });
    }

    // Chat: seleccionar conversación
    document.querySelectorAll(".chat-item").forEach(item => {
        item.addEventListener("click", function () {
            document.querySelectorAll(".chat-item").forEach(i => i.classList.remove("active"));
            this.classList.add("active");
            // Quitar badge de no leído
            const badge = this.querySelector(".chat-unread");
            if (badge) badge.remove();
        });
    });

    // Reservar de nuevo en historial
    document.querySelectorAll(".btn-reservar").forEach(btn => {
        btn.addEventListener("click", function () {
            alert("Redirigiendo a Buscar para encontrar al mismo trabajador...");
            window.location.href = "app-buscar.html";
        });
    });
});

// ── Buscar ──
const trabajadores = [
    { nombre:"Carlos Quispe", categoria:"gasfitería", emoji:"🔧", rating:"4.9", trabajos:42, distrito:"Miraflores" },
    { nombre:"Ana Torres", categoria:"limpieza", emoji:"🧹", rating:"4.8", trabajos:87, distrito:"San Isidro" },
    { nombre:"Pedro Mamani", categoria:"electricidad", emoji:"⚡", rating:"5.0", trabajos:31, distrito:"San Borja" },
    { nombre:"Rosa Flores", categoria:"limpieza", emoji:"🧹", rating:"4.7", trabajos:65, distrito:"Surco" },
    { nombre:"Juan Huanca", categoria:"mudanza", emoji:"📦", rating:"4.8", trabajos:19, distrito:"La Molina" },
    { nombre:"Luis Cárdenas", categoria:"electricidad", emoji:"⚡", rating:"4.9", trabajos:53, distrito:"Lince" },
];

function renderTrabajadores(lista) {
    const cont = document.getElementById("lista-trabajadores");
    if (!cont) return;
    cont.innerHTML = lista.map(t => `
        <div class="worker-card">
            <div style="display:flex;align-items:center;gap:12px;">
                <div class="worker-avatar">${t.emoji}</div>
                <div>
                    <div class="worker-name">${t.nombre}</div>
                    <div class="worker-cat">${t.categoria.charAt(0).toUpperCase()+t.categoria.slice(1)} · ${t.distrito}</div>
                </div>
            </div>
            <div class="worker-rating">⭐ ${t.rating} · ${t.trabajos} trabajos</div>
            <button class="btn-contactar" onclick="alert('Conectando con ${t.nombre}...')">Solicitar servicio</button>
        </div>
    `).join("");
}

function filtrar(cat) {
    document.querySelectorAll(".pill").forEach(p => p.classList.remove("active"));
    event.target.classList.add("active");
    const lista = cat === "todos" ? trabajadores : trabajadores.filter(t => t.categoria === cat);
    renderTrabajadores(lista);
}

const buscador = document.getElementById("buscador");
if (buscador) {
    buscador.addEventListener("input", function() {
        const q = this.value.toLowerCase();
        renderTrabajadores(trabajadores.filter(t =>
            t.nombre.toLowerCase().includes(q) || t.categoria.includes(q) || t.distrito.toLowerCase().includes(q)
        ));
    });
}

if (document.getElementById("lista-trabajadores")) renderTrabajadores(trabajadores);

// ── Historial ──
const historial = [
    { servicio:"Reparación de tubería", trabajador:"Carlos Quispe", emoji:"🔧", fecha:"12 may 2025", monto:"S/ 80", estado:"completado" },
    { servicio:"Limpieza del hogar", trabajador:"Ana Torres", emoji:"🧹", fecha:"05 may 2025", monto:"S/ 120", estado:"completado" },
    { servicio:"Instalación eléctrica", trabajador:"Pedro Mamani", emoji:"⚡", fecha:"28 abr 2025", monto:"S/ 150", estado:"completado" },
    { servicio:"Mudanza de oficina", trabajador:"Juan Huanca", emoji:"📦", fecha:"30 may 2025", monto:"S/ 200", estado:"pendiente" },
];

function renderHistorial(lista) {
    const cont = document.getElementById("lista-historial");
    if (!cont) return;
    cont.innerHTML = lista.length ? lista.map(h => `
        <div class="historial-card">
            <div style="display:flex;align-items:center;gap:14px;">
                <div style="font-size:1.8rem;">${h.emoji}</div>
                <div>
                    <div style="font-weight:600;font-size:15px;">${h.servicio}</div>
                    <div style="font-size:13px;color:#6b7280;">${h.trabajador} · ${h.fecha}</div>
                </div>
            </div>
            <div style="display:flex;align-items:center;gap:12px;">
                <span style="font-weight:600;">${h.monto}</span>
                <span class="badge-estado badge-${h.estado}">${h.estado.charAt(0).toUpperCase()+h.estado.slice(1)}</span>
                ${h.estado==='completado'?`<button class="btn-reservar">Repetir</button>`:''}
            </div>
        </div>
    `).join("") : `<div style="text-align:center;color:#9ca3af;padding:40px;">Sin servicios en esta categoría.</div>`;
}

function mostrarTab(filtro, btn) {
    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
    btn.classList.add("active");
    renderHistorial(filtro === "todos" ? historial : historial.filter(h => h.estado === filtro));
}

if (document.getElementById("lista-historial")) renderHistorial(historial);

// ── Chat: datos de conversaciones ──
const conversaciones = [
    { id:1, nombre:"Carlos Quispe", emoji:"🔧", mensajes:[
        {tipo:"recv",texto:"Hola, ¿en qué te puedo ayudar?"},
        {tipo:"sent",texto:"Necesito arreglar una tubería"},
        {tipo:"recv",texto:"Claro, ¿cuándo te viene bien?"}
    ]},
    { id:2, nombre:"Ana Torres", emoji:"🧹", mensajes:[
        {tipo:"recv",texto:"Buenos días, soy Ana para el servicio de limpieza"},
        {tipo:"sent",texto:"Perfecto, necesito el servicio el sábado"}
    ]},
    { id:3, nombre:"Pedro Mamani", emoji:"⚡", mensajes:[
        {tipo:"recv",texto:"¿En qué puedo ayudarte con la instalación eléctrica?"}
    ]},
];

let chatActual = null;

function renderChatList() {
    const lista = document.getElementById("chat-list");
    if (!lista) return;
    lista.innerHTML = conversaciones.map(c => `
        <div class="chat-item" onclick="abrirChat(${c.id})">
            <div class="chat-item-name">${c.emoji} ${c.nombre}</div>
            <div class="chat-item-last">${c.mensajes[c.mensajes.length-1].texto.substring(0,35)}...</div>
        </div>
    `).join("");
}

function abrirChat(id) {
    chatActual = conversaciones.find(c => c.id === id);
    document.getElementById("chat-header").textContent = chatActual.emoji + " " + chatActual.nombre;
    const msgs = document.getElementById("chat-messages");
    msgs.innerHTML = chatActual.mensajes.map(m => `
        <div class="msg ${m.tipo === 'sent' ? 'sent' : ''}">
            ${m.tipo === 'recv' ? `<div class="msg-avatar">${chatActual.emoji}</div>` : ''}
            <div><div class="msg-bubble">${m.texto}</div></div>
        </div>
    `).join("");
    msgs.scrollTop = msgs.scrollHeight;
    document.querySelectorAll(".chat-item").forEach((el,i) => el.classList.toggle("active", conversaciones[i].id === id));
}

if (document.getElementById("chat-list")) renderChatList();
