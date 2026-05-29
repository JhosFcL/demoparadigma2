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