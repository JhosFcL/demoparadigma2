const acciones = [
    { tipo: "Donación", objeto: "Libro", impacto: 17 },
    { tipo: "Intercambio", objeto: "Casaca", impacto: 20 },
    { tipo: "Donación", objeto: "Cuadernos", impacto: 10 }
];
const lista = document.getElementById("listaAcciones");

acciones.forEach(a => {
    const div = document.createElement("div");
    div.classList.add("accion-item");
    div.innerHTML = `
        <strong>${a.tipo}:</strong> ${a.objeto}  
        <br><span style="color:#2e7d32;">Impacto: ${a.impacto}%</span>
    `;
    lista.appendChild(div);
});

let totalImpacto = 0;

acciones.forEach(a => {
    totalImpacto += a.impacto;
});

const impactoFinal = Math.min(totalImpacto, 100);

document.getElementById("impactoPorcentaje").textContent = impactoFinal + "%";
document.getElementById("barraProgreso").style.width = impactoFinal + "%";


const mensaje = document.getElementById("mensajeMotivador");

if (impactoFinal < 25) {
    mensaje.textContent = "¡Buen inicio! Cada acción cuenta ";
} else if (impactoFinal < 50) {
    mensaje.textContent = "¡Vas por buen camino! Sigue ayudando";
} else if (impactoFinal < 75) {
    mensaje.textContent = "¡Increíble! Tu impacto ya es notable";
} else {
    mensaje.textContent = "¡Eres un héroe verde! Tu impacto es enorme ";
}