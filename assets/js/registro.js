document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("form");

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const nombre = form.nombre.value.trim();
    const apellido = form.apellido.value.trim();
    const telefono = form.telefono.value.trim();
    const correo = form.correo.value.trim();
    const distrito = form.distrito.value.trim();
    const tipo = form.tipo.value;
    const contraseña = form.contraseña.value.trim();
    const confirmar = form.confirmar.value.trim();

    if (!nombre || !apellido || !telefono || !correo || !distrito || !tipo || !contraseña || !confirmar) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    if (contraseña !== confirmar) {
      alert("Las contraseñas no coinciden. Intenta de nuevo.");
      return;
    }

    // Guardar usuario en localStorage
    const usuarios = JSON.parse(localStorage.getItem("servihogar_usuarios") || "[]");

    const yaExiste = usuarios.find(u => u.correo === correo);
    if (yaExiste) {
      alert("Ya existe una cuenta con ese correo. Inicia sesión.");
      window.location.href = "login.html";
      return;
    }

    const nuevoUsuario = { nombre, apellido, telefono, correo, distrito, tipo, contraseña };
    usuarios.push(nuevoUsuario);
    localStorage.setItem("servihogar_usuarios", JSON.stringify(usuarios));
    localStorage.setItem("servihogar_sesion", JSON.stringify(nuevoUsuario));

    alert("¡Registro exitoso! Bienvenido/a, " + nombre + ".");
    setTimeout(() => { window.location.href = "index.html"; }, 400);
  });
});
