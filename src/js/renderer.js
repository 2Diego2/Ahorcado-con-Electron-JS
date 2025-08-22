// Función auxiliar para no escribir document.getElementById todo el tiempo
function id(str) {
  return document.getElementById(str)
}

// ---- LÓGICA DEL JUEGO ----
let palabrita = ""
let cant_errores = 0
let cant_aciertos = 0
let palabras_juego = [] // Array para guardar las palabras cargadas
let tiempoInicio = 0

const btn_jugar = id("jugar")
const imagen = id("imagen")
const btn_letras = document.querySelectorAll("#letras button")
const btn_gestor = id("abrir-gestor-btn") // Botón para abrir el gestor
const btn_estadisticas = id("ver-estadisticas-btn") // Botón para abrir estadísticas

console.log("Elementos encontrados:")
console.log("btn_jugar:", btn_jugar)
console.log("btn_gestor:", btn_gestor)
console.log("btn_estadisticas:", btn_estadisticas)
console.log("electronAPI disponible:", !!window.electronAPI)

// Carga inicial de datos cuando la ventana está lista
window.onload = async () => {
  console.log("Iniciando carga de datos...")
  console.log("electronAPI:", window.electronAPI)

  // Verificar si electronAPI está disponible
  if (!window.electronAPI || !window.electronAPI.leerDatos) {
    console.error("electronAPI no está disponible. Usando datos por defecto.")
    palabras_juego = [
      { palabra: "manzana", pista: "Fruta que cae del árbol." },
      { palabra: "electron", pista: "Framework para crear esta app." },
    ]
    if (btn_jugar) {
      btn_jugar.disabled = false
      console.log("Juego listo con palabras por defecto")
    }
    return
  }

  try {
    const datosCargados = await window.electronAPI.leerDatos()
    console.log("Datos cargados:", datosCargados)

    // Verificar si recibimos un objeto con estructura {palabras: [], estadisticas: {}}
    if (datosCargados && datosCargados.palabras && Array.isArray(datosCargados.palabras)) {
      palabras_juego = datosCargados.palabras
      console.log("Palabras extraídas del objeto:", palabras_juego.length)
    }
    // O si recibimos directamente un array (formato original)
    else if (Array.isArray(datosCargados) && datosCargados.length > 0) {
      palabras_juego = datosCargados
      console.log("Palabras recibidas como array:", palabras_juego.length)
    } else {
      console.warn("No se cargaron palabras o el formato es incorrecto. Usando palabras por defecto.")
      palabras_juego = [
        { palabra: "manzana", pista: "Fruta que cae del árbol." },
        { palabra: "electron", pista: "Framework para crear esta app." },
      ]
    }
  } catch (error) {
    console.error("Error fatal al cargar las palabras:", error)
    palabras_juego = [
      { palabra: "manzana", pista: "Fruta que cae del árbol." },
      { palabra: "electron", pista: "Framework para crear esta app." },
    ]
  }

  // Habilitamos el botón de jugar solo si tenemos palabras
  if (palabras_juego.length > 0) {
    btn_jugar.disabled = false
    console.log("Juego listo con", palabras_juego.length, "palabras")
    console.log("Botón jugar habilitado:", !btn_jugar.disabled)
  } else {
    console.error("No hay palabras disponibles, botón permanece deshabilitado")
  }
}

// Listener para el botón de jugar
if (btn_jugar) {
  btn_jugar.addEventListener("click", iniciar)
} else {
  console.error("Botón jugar no encontrado")
}

// Listener para el botón de abrir gestor
if (btn_gestor) {
  btn_gestor.addEventListener("click", () => {
    console.log("Abriendo gestor de palabras...")
    try {
      if (window.electronAPI && window.electronAPI.abrirGestor) {
        window.electronAPI.abrirGestor()
        console.log("Comando abrirGestor enviado")
      } else {
        console.error("electronAPI.abrirGestor no disponible")
      }
    } catch (error) {
      console.error("Error al abrir gestor:", error)
    }
  })
} else {
  console.error("Botón gestor no encontrado")
}

// Listener para el botón de estadísticas
if (btn_estadisticas) {
  btn_estadisticas.addEventListener("click", () => {
    console.log("Abriendo estadísticas...")
    try {
      if (window.electronAPI && window.electronAPI.abrirEstadisticas) {
        window.electronAPI.abrirEstadisticas()
        console.log("Comando abrirEstadisticas enviado")
      } else {
        console.error("electronAPI.abrirEstadisticas no disponible")
      }
    } catch (error) {
      console.error("Error al abrir estadísticas:", error)
    }
  })
} else {
  console.error("Botón estadísticas no encontrado")
}

function iniciar(event) {
  console.log("Iniciando nueva partida...")
  console.log("Palabras disponibles:", palabras_juego.length)

  imagen.src = "../assets/images/Inicio.png"
  btn_jugar.disabled = true
  cant_errores = 0
  cant_aciertos = 0
  tiempoInicio = Date.now()

  const parrafo = id("palabra_a_adivinar")
  parrafo.innerHTML = ""

  id("resultado").innerHTML = ""

  // Seleccionar una palabra al azar del array cargado
  const valor_al_azar = Math.floor(Math.random() * palabras_juego.length)
  palabrita = palabras_juego[valor_al_azar].palabra.toLowerCase()
  console.log("Palabra seleccionada:", palabrita)

  for (let i = 0; i < btn_letras.length; i++) {
    btn_letras[i].disabled = false
  }

  for (let i = 0; i < palabrita.length; i++) {
    const span = document.createElement("span")
    parrafo.appendChild(span)
  }

  console.log("Partida iniciada correctamente")
}

for (let i = 0; i < btn_letras.length; i++) {
  btn_letras[i].addEventListener("click", click_letras)
}

function click_letras(event) {
  const spans = document.querySelectorAll("#palabra_a_adivinar span")
  const button = event.target
  button.disabled = true

  const letra = button.innerHTML.toLowerCase()
  let acerto = false

  for (let i = 0; i < palabrita.length; i++) {
    if (letra == palabrita[i]) {
      spans[i].innerHTML = letra
      cant_aciertos++
      acerto = true
    }
  }

  if (acerto == false) {
    cant_errores++
    const source = `../assets/images/Error${cant_errores}.png`
    imagen.src = source
  }

  if (cant_errores == 7) {
    id("resultado").innerHTML = "¡Perdiste! La palabra era: " + palabrita
    console.log("Partida perdida, registrando estadísticas...")
    registrarPartida(false)
    game_over()
  } else if (cant_aciertos == palabrita.length) {
    id("resultado").innerHTML = "¡Ganaste!"
    console.log("Partida ganada, registrando estadísticas...")
    registrarPartida(true)
    game_over()
  }
}

async function registrarPartida(gano) {
  try {
    console.log("Iniciando registro de partida...")
    console.log("electronAPI disponible:", !!window.electronAPI)
    console.log("actualizarEstadisticas disponible:", !!window.electronAPI?.actualizarEstadisticas)

    if (!window.electronAPI || !window.electronAPI.actualizarEstadisticas) {
      console.warn("electronAPI.actualizarEstadisticas no disponible")
      return
    }

    const tiempoJugado = Math.round((Date.now() - tiempoInicio) / 1000) // en segundos

    const datosPartida = {
      palabra: palabrita,
      gano: gano,
      errores: cant_errores,
      tiempoJugado: tiempoJugado,
      fecha: new Date().toISOString(),
    }

    console.log("Datos de partida a enviar:", datosPartida)
    console.log("Llamando a actualizarEstadisticas...")

    const resultado = await window.electronAPI.actualizarEstadisticas(datosPartida)
    console.log("Resultado de actualizarEstadisticas:", resultado)

    if (resultado && resultado.success) {
      console.log("Estadísticas actualizadas correctamente")
    } else {
      console.error("Error en la respuesta:", resultado)
    }
  } catch (error) {
    console.error("Error al actualizar estadísticas:", error)
    console.error("Stack trace:", error.stack)
  }
}

function game_over() {
  for (let i = 0; i < btn_letras.length; i++) {
    btn_letras[i].disabled = true
  }
  btn_jugar.disabled = false
}

// Deshabilitar los botones al inicio hasta que se presione "Jugar"
game_over()
btn_jugar.disabled = true // El botón se activará en window.onload si hay palabras

console.log("Renderer.js cargado completamente")
