// src/js/gestorPalabras.js

// Objeto para almacenar los datos del juego.
// 'palabras' ahora será un array de objetos: [{palabra: '...', pista: '...'}, ...]
let datosJuego = {
  palabras: [],
  estadisticas: { ganadas: 0, perdidas: 0 },
}

// Referencias a los elementos del DOM
const listaPalabrasUl = document.getElementById("lista-palabras")
const nuevaPalabraInput = document.getElementById("nueva-palabra-input")
const agregarPalabraBtn = document.getElementById("agregar-palabra-btn")

// --- (Este botón probablemente no debería estar aquí, sino en index.html, pero se deja por si acaso) ---
const btn = document.getElementById("abrir-gestor-btn")
if (btn) {
  btn.addEventListener("click", async () => {
    if (window.electronAPI && window.electronAPI.abrirGestor) {
      await window.electronAPI.abrirGestor()
    } else {
      console.warn("Función de abrir gestor no disponible.")
    }
  })
} else {
  console.log("Botón abrir-gestor-btn no encontrado en gestorPalabras.js (esto es normal)")
}

// ---- CAMBIO 1: La función ahora recibe un objeto de palabra ----
function crearLi(palabraObj, index) {
  const li = document.createElement("li")
  li.dataset.index = index

  const span = document.createElement("span")
  span.textContent = palabraObj.palabra // Muestra solo la propiedad 'palabra'

  const botonesDiv = document.createElement("div")
  botonesDiv.className = "botones-palabra"

  const btnEditar = document.createElement("button")
  btnEditar.textContent = "Editar"
  btnEditar.className = "btn-editar"

  const btnEliminar = document.createElement("button")
  btnEliminar.textContent = "Eliminar"
  btnEliminar.className = "btn-eliminar"

  botonesDiv.appendChild(btnEditar)
  botonesDiv.appendChild(btnEliminar)

  li.appendChild(span)
  li.appendChild(botonesDiv)

  return li
}

// Renderiza la lista completa de palabras
function renderizarLista() {
  listaPalabrasUl.innerHTML = ""
  datosJuego.palabras.forEach((palabraObj, index) => {
    // Itera sobre objetos
    listaPalabrasUl.appendChild(crearLi(palabraObj, index))
  })
}

// ---- CAMBIO 2: La edición lee y actualiza solo la propiedad 'palabra' ----
function iniciarEdicion(li, index) {
  const span = li.querySelector("span")
  // Obtiene el valor original de la propiedad 'palabra' del objeto
  const original = datosJuego.palabras[index].palabra

  const input = document.createElement("input")
  input.type = "text"
  input.value = original
  input.className = "edit-input"

  const saveBtn = document.createElement("button")
  saveBtn.textContent = "Guardar"

  const cancelBtn = document.createElement("button")
  cancelBtn.textContent = "Cancelar"

  li.innerHTML = ""
  li.appendChild(input)
  const btns = document.createElement("div")
  btns.className = "botones-palabra"
  btns.appendChild(saveBtn)
  btns.appendChild(cancelBtn)
  li.appendChild(btns)
  input.focus()
  input.select()

  function guardarEdicion() {
    const nuevoValor = input.value.trim().toLowerCase()
    if (!nuevoValor) {
      alert("La palabra no puede quedar vacía.")
      return
    }
    // Comprueba si la palabra ya existe en otro objeto de la lista
    const existeEnOtro = datosJuego.palabras.some((p, i) => p.palabra === nuevoValor && i !== index)
    if (existeEnOtro) {
      alert("Esa palabra ya existe en la lista.")
      return
    }
    // Actualiza solo la propiedad 'palabra', manteniendo la pista intacta
    datosJuego.palabras[index].palabra = nuevoValor
    guardarYRenderizar()
  }

  saveBtn.addEventListener("click", guardarEdicion)
  cancelBtn.addEventListener("click", renderizarLista)

  input.addEventListener("keyup", (e) => {
    if (e.key === "Enter") guardarEdicion()
    if (e.key === "Escape") renderizarLista()
  })
}

// ---- CAMBIO 3: El mensaje de confirmación usa la propiedad 'palabra' ----
function eliminarPalabraIndex(index) {
  // Muestra la propiedad 'palabra' en el mensaje
  if (!confirm(`¿Eliminar "${datosJuego.palabras[index].palabra}"?`)) return

  datosJuego.palabras.splice(index, 1)
  guardarYRenderizar()
}

// ---- CAMBIO 4: Se agrega un objeto nuevo en lugar de un string ----
function agregarPalabra() {
  const nuevaPalabra = nuevaPalabraInput.value.trim().toLowerCase()
  if (!nuevaPalabra) {
    alert("Ingresa una palabra.")
    return
  }
  // Comprueba si la propiedad 'palabra' ya existe en algún objeto
  if (datosJuego.palabras.some((p) => p.palabra === nuevaPalabra)) {
    alert("La palabra ya existe.")
    return
  }
  // Crea un nuevo objeto para agregar al array
  const nuevoObjeto = {
    palabra: nuevaPalabra,
    pista: "", // Se agrega con una pista vacía por defecto
  }

  datosJuego.palabras.push(nuevoObjeto)
  nuevaPalabraInput.value = ""
  guardarYRenderizar()
}

// Llama a las funciones del preload para guardar y luego renderiza
async function guardarYRenderizar() {
  try {
    if (!window.electronAPI || !window.electronAPI.guardarDatos) {
      console.error("electronAPI.guardarDatos no disponible")
      alert("Error: No se puede guardar. electronAPI no disponible.")
      return
    }

    const resultado = await window.electronAPI.guardarDatos(datosJuego)
    console.log("Resultado del guardado:", resultado)

    if (!resultado || !resultado.success) {
      alert("Error guardando los datos. Revisa la consola.")
      console.error("Error en guardado:", resultado?.error || "Respuesta inválida")
    } else {
      console.log("Datos guardados exitosamente")
    }
  } catch (error) {
    console.error("Error al guardar:", error)
    alert("Error guardando los datos. Revisa la consola.")
  }

  renderizarLista()
}

// Carga los datos iniciales usando la API del preload
async function cargarDatosIniciales() {
  try {
    if (!window.electronAPI || !window.electronAPI.leerDatos) {
      console.error("electronAPI.leerDatos no disponible")
      // Usar datos por defecto
      datosJuego = {
        palabras: [],
        estadisticas: { ganadas: 0, perdidas: 0 },
      }
      renderizarLista()
      return
    }

    const datos = await window.electronAPI.leerDatos()
    console.log("Datos cargados:", datos)

    if (datos) {
      // Asegurar que tenemos la estructura correcta
      if (datos.palabras && Array.isArray(datos.palabras)) {
        datosJuego = datos
      } else if (Array.isArray(datos)) {
        // Si recibimos un array directamente, convertir al formato esperado
        datosJuego = {
          palabras: datos,
          estadisticas: { ganadas: 0, perdidas: 0 },
        }
      }
    }

    // Asegurar que la estructura mínima exista
    datosJuego.palabras = datosJuego.palabras || []
    datosJuego.estadisticas = datosJuego.estadisticas || { ganadas: 0, perdidas: 0 }

    console.log("Datos finales cargados:", datosJuego)
    renderizarLista()
  } catch (error) {
    console.error("Error cargando datos iniciales:", error)
    // Usar datos por defecto en caso de error
    datosJuego = {
      palabras: [],
      estadisticas: { ganadas: 0, perdidas: 0 },
    }
    renderizarLista()
  }
}

// Delegación de eventos para los botones de la lista
listaPalabrasUl.addEventListener("click", (e) => {
  const li = e.target.closest("li")
  if (!li) return
  const idx = Number(li.dataset.index)
  if (e.target.classList.contains("btn-eliminar")) {
    eliminarPalabraIndex(idx)
  } else if (e.target.classList.contains("btn-editar")) {
    iniciarEdicion(li, idx)
  }
})

// Event listeners para agregar una nueva palabra
agregarPalabraBtn.addEventListener("click", agregarPalabra)
nuevaPalabraInput.addEventListener("keyup", (e) => {
  if (e.key === "Enter") agregarPalabra()
})

// Cargar los datos cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", cargarDatosIniciales)
