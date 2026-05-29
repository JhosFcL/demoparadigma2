document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("form");

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const correo = form.querySelector('input[type="email"]').value.trim();
    const contraseña = form.querySelector('input[type="password"]').value.trim();

    if (!correo || !contraseña) {
      alert("Por favor, completa ambos campos.");
      return;
    }

    // Recuperar usuarios registrados desde localStorage
    const usuarios = JSON.parse(localStorage.getItem("servihogar_usuarios") || "[]");
    const usuario = usuarios.find(u => u.correo === correo && u.contraseña === contraseña);

    if (usuario) {
      localStorage.setItem("servihogar_sesion", JSON.stringify(usuario));
      alert("¡Bienvenido de nuevo, " + usuario.nombre + "!");
      setTimeout(() => { window.location.href = "app-inicio.html"; }, 400);
    } else {
      alert("Correo o contraseña incorrectos. ¿Ya tienes una cuenta? Si no, regístrate primero.");
    }
  });
});
