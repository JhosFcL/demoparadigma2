// ── perfil.js ── Carga datos del usuario en la pantalla de perfil

document.addEventListener("DOMContentLoaded", function () {
    const sesion = JSON.parse(localStorage.getItem("servihogar_sesion") || "null");
    if (!sesion) { window.location.href = "login.html"; return; }

    const iniciales = (sesion.nombre[0] + (sesion.apellido ? sesion.apellido[0] : "")).toUpperCase();

    document.getElementById("perfil-avatar").textContent = iniciales;
    document.getElementById("perfil-nombre").textContent = sesion.nombre + " " + (sesion.apellido || "");
    document.getElementById("perfil-tipo").textContent = sesion.tipo === "trabajador" ? "Trabajador" : "Cliente";
    document.getElementById("perfil-tipo2").textContent = sesion.tipo === "trabajador" ? "Trabajador" : "Cliente";
    document.getElementById("perfil-correo").textContent = sesion.correo || "—";
    document.getElementById("perfil-telefono").textContent = sesion.telefono || "—";
    document.getElementById("perfil-distrito").textContent = sesion.distrito || "—";

    document.getElementById("btn-cerrar-sesion").addEventListener("click", function () {
        if (confirm("¿Cerrar sesión?")) {
            localStorage.removeItem("servihogar_sesion");
            window.location.href = "index.html";
        }
    });
});
