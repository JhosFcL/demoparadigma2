document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("intercambi");
  const inputImagen = document.getElementById("intermagen");
  const preview = document.getElementById("vistaPrevia");

  inputImagen.addEventListener("change", function () {
    const archivo = this.files[0];

    if (archivo) {
      const lector = new FileReader();
      lector.onload = function (e) {
        preview.innerHTML = `
          <h3>Vista previa:</h3>
          <img src="${e.target.result}" alt="Vista previa">
        `;
      };
      lector.readAsDataURL(archivo);
    }
  });

  // Manejo del envío del formulario
  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const nombre = document.getElementById("nombrintercambio").value.trim();
    const imagen = inputImagen.files[0];
    const descripcion = document.getElementById("desintercion").value.trim();
    const categoria = document.getElementById("categoria").value;

    if (!nombre || !imagen || !descripcion) {
      alert("⚠️ Completa todos los campos antes de continuar.");
      return;
    }

    // Simulación de registro
    const nuevoObjeto = {
      nombre,
      categoria,
      descripcion,
      imagenURL: preview.querySelector("img")?.src || null
    };

    console.log("📦 Artículo registrado:", nuevoObjeto);
    
    alert("✅ Artículo agregado correctamente!");

    // Resetear formulario
    form.reset();
    preview.innerHTML = "";
  });
});

//GAMIFICACIÓN//
let puntos = parseInt(localStorage.getItem("puntosUsuario")) || 0;

function actualizarPerfil() {
    const puntosText = document.getElementById("puntos-usuario");
    const nivelText = document.getElementById("nivel-usuario");
    const bar = document.getElementById("barra-progreso-fill");

    if (!puntosText || !nivelText) return;

    puntosText.textContent = puntos;

    let nivel = "";
    let progreso = 0;

    if (puntos < 50) {
        nivel = "Semilla 🌱";
        progreso = (puntos / 50) * 100;
    } else if (puntos < 150) {
        nivel = "Brote 🌿";
        progreso = ((puntos - 50) / 100) * 100;
    } else if (puntos < 350) {
        nivel = "Árbol 🌳";
        progreso = ((puntos - 150) / 200) * 100;
    } else {
        nivel = "Guardián Verde 💎";
        progreso = 100;
    }

    nivelText.textContent = nivel;
    bar.style.width = progreso + "%";
}

actualizarPerfil();

function sumarDonacion() {
    puntos += 10;
    localStorage.setItem("puntosUsuario", puntos);
    actualizarPerfil();
}

function sumarIntercambio() {
    puntos += 5;
    localStorage.setItem("puntosUsuario", puntos);
    actualizarPerfil();
}