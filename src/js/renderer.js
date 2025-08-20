// src/js/renderer.js

// Función auxiliar para no escribir document.getElementById todo el tiempo
function id(str) {
  return document.getElementById(str);
}

// ---- LÓGICA DEL JUEGO ----
let palabrita = '';
let cant_errores = 0;
let cant_aciertos = 0;
let palabras_juego = []; // Array para guardar las palabras cargadas

const btn_jugar = id('jugar');
const imagen = id('imagen');
const btn_letras = document.querySelectorAll("#letras button");
const btn_gestor = id('abrir-gestor-btn'); // Botón para abrir el gestor

// Carga inicial de datos cuando la ventana está lista
window.onload = async function() {
  try {
    // ---- CORRECCIÓN CLAVE: Usar window.electronAPI ----
    const datosCargados = await window.electronAPI.leerDatos();

    // Aseguramos que lo que recibimos sea un array de objetos con 'palabra'
    if (Array.isArray(datosCargados) && datosCargados.length > 0) {
      palabras_juego = datosCargados;
    } else {
      console.warn("No se cargaron palabras o el formato es incorrecto. Usando palabras por defecto.");
      palabras_juego = [
        { palabra: "manzana", pista: "Fruta que cae del árbol." },
        { palabra: "electron", pista: "Framework para crear esta app." }
      ];
    }
  } catch (error) {
    console.error("Error fatal al cargar las palabras:", error);
  }

  // Habilitamos el botón de jugar solo si tenemos palabras
  if (palabras_juego.length > 0) {
    btn_jugar.disabled = false;
  }
};

// Listener para el botón de jugar
btn_jugar.addEventListener('click', iniciar);

// Listener para el botón de abrir gestor
btn_gestor.addEventListener('click', () => {
  window.electronAPI.abrirGestor();
});


function iniciar(event) {
  imagen.src = '../assets/images/Inicio.png';
  btn_jugar.disabled = true;
  cant_errores = 0;
  cant_aciertos = 0;

  const parrafo = id('palabra_a_adivinar');
  parrafo.innerHTML = '';

  id('resultado').innerHTML = '';

  // Seleccionar una palabra al azar del array cargado
  const valor_al_azar = Math.floor(Math.random() * palabras_juego.length);
  palabrita = palabras_juego[valor_al_azar].palabra.toLowerCase();
  // const pista = palabras_juego[valor_al_azar].pista; // La pista no se usa, pero así se obtendría

  for (let i = 0; i < btn_letras.length; i++) {
    btn_letras[i].disabled = false;
  }

  for (let i = 0; i < palabrita.length; i++) {
    const span = document.createElement('span');
    parrafo.appendChild(span);
  }
}

for (let i = 0; i < btn_letras.length; i++) {
  btn_letras[i].addEventListener('click', click_letras);
}

function click_letras(event) {
  const spans = document.querySelectorAll('#palabra_a_adivinar span');
  const button = event.target;
  button.disabled = true;

  const letra = button.innerHTML.toLowerCase();
  let acerto = false;

  for (let i = 0; i < palabrita.length; i++) {
    if (letra == palabrita[i]) {
      spans[i].innerHTML = letra;
      cant_aciertos++;
      acerto = true;
    }
  }

  if (acerto == false) {
    cant_errores++;
    const source = `../assets/images/Error${cant_errores}.png`;
    imagen.src = source;
  }

  if (cant_errores == 7) {
    id('resultado').innerHTML = '¡Perdiste! La palabra era: ' + palabrita;
    game_over();
  } else if (cant_aciertos == palabrita.length) {
    id('resultado').innerHTML = '¡Ganaste!';
    game_over();
  }
}

function game_over() {
  for (let i = 0; i < btn_letras.length; i++) {
    btn_letras[i].disabled = true;
  }
  btn_jugar.disabled = false;
}

// Deshabilitar los botones al inicio hasta que se presione "Jugar"
game_over();
btn_jugar.disabled = true; // El botón se activará en window.onload si hay palabras