const { app, BrowserWindow, ipcMain } = require("electron")
const path = require("path")
const fs = require("fs").promises

let mainWindow
let gestorWindow
let estadisticasWindow

// Ruta al archivo de datos
const DATOS_PATH = path.join(__dirname, "src", "data", "palabras.json")

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "src", "js", "preload.js"),
    },
  })

  mainWindow.loadFile("src/index.html")
}

function createGestorWindow() {
  if (gestorWindow) {
    gestorWindow.focus()
    return
  }

  gestorWindow = new BrowserWindow({
    width: 800,
    height: 600,
    parent: mainWindow,
    modal: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "src", "js", "preload.js"),
    },
  })

  gestorWindow.loadFile("src/gestorPalabras.html")

  gestorWindow.on("closed", () => {
    gestorWindow = null
  })
}

function createEstadisticasWindow() {
  if (estadisticasWindow) {
    estadisticasWindow.focus()
    return
  }

  estadisticasWindow = new BrowserWindow({
    width: 900,
    height: 700,
    parent: mainWindow,
    modal: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "src", "js", "preload.js"),
    },
  })

  estadisticasWindow.loadFile("src/estadisticas.html")

  estadisticasWindow.on("closed", () => {
    estadisticasWindow = null
  })
}

// Handler para leer datos
ipcMain.handle("leer-palabras", async () => {
  try {
    console.log("Leyendo datos desde:", DATOS_PATH)
    const data = await fs.readFile(DATOS_PATH, "utf8")
    const parsedData = JSON.parse(data)

    console.log("Datos leídos exitosamente, tipo:", Array.isArray(parsedData) ? "array" : "objeto")

    // Si es un array (formato original), retornarlo en la estructura esperada
    if (Array.isArray(parsedData)) {
      return {
        palabras: parsedData,
        estadisticas: { ganadas: 0, perdidas: 0 },
      }
    }

    // Si ya es un objeto con la estructura correcta, retornarlo tal como está
    return parsedData
  } catch (error) {
    console.error("Error leyendo datos:", error)
    return {
      palabras: [
        { palabra: "manzana", pista: "Fruta que cae del árbol." },
        { palabra: "electron", pista: "Framework para crear esta app." },
      ],
      estadisticas: { ganadas: 0, perdidas: 0 },
    }
  }
})

// Handler para guardar datos
ipcMain.handle("guardar-datos", async (event, datos) => {
  try {
    console.log("Guardando datos:", datos)

    // Asegurar que el directorio existe
    const dir = path.dirname(DATOS_PATH)
    await fs.mkdir(dir, { recursive: true })

    // Guardar los datos
    await fs.writeFile(DATOS_PATH, JSON.stringify(datos, null, 2), "utf8")
    console.log("Datos guardados exitosamente en:", DATOS_PATH)

    return { success: true }
  } catch (error) {
    console.error("Error guardando datos:", error)
    return { success: false, error: error.message }
  }
})

// Handler para abrir ventana del gestor
ipcMain.handle("abrir-gestor", () => {
  createGestorWindow()
})

// Handler para abrir ventana de estadísticas
ipcMain.handle("abrir-estadisticas", () => {
  createEstadisticasWindow()
})

// Handler para actualizar estadísticas
ipcMain.handle("actualizar-estadisticas", async (event, datosPartida) => {
  try {
    console.log("Actualizando estadísticas:", datosPartida)

    // Leer datos actuales
    const data = await fs.readFile(DATOS_PATH, "utf8")
    let datos = JSON.parse(data)

    // Si es un array, convertir a objeto
    if (Array.isArray(datos)) {
      datos = {
        palabras: datos,
        estadisticas: {
          partidasJugadas: 0,
          partidasGanadas: 0,
          partidasPerdidas: 0,
          porcentajeExito: 0,
          tiempoTotalJugado: 0,
        },
        estadisticasPorPalabra: {},
        historial: [],
      }
    }

    // Inicializar estructuras si no existen
    if (!datos.estadisticas) {
      datos.estadisticas = {
        partidasJugadas: 0,
        partidasGanadas: 0,
        partidasPerdidas: 0,
        porcentajeExito: 0,
        tiempoTotalJugado: 0,
      }
    }
    if (!datos.estadisticasPorPalabra) datos.estadisticasPorPalabra = {}
    if (!datos.historial) datos.historial = []

    // Actualizar estadísticas globales
    datos.estadisticas.partidasJugadas++
    datos.estadisticas.tiempoTotalJugado += datosPartida.tiempoJugado

    if (datosPartida.gano) {
      datos.estadisticas.partidasGanadas++
    } else {
      datos.estadisticas.partidasPerdidas++
    }

    // Calcular porcentaje de éxito
    datos.estadisticas.porcentajeExito = Math.round(
      (datos.estadisticas.partidasGanadas / datos.estadisticas.partidasJugadas) * 100,
    )

    // Actualizar estadísticas por palabra
    const palabra = datosPartida.palabra.toLowerCase()
    if (!datos.estadisticasPorPalabra[palabra]) {
      datos.estadisticasPorPalabra[palabra] = {
        vecesJugada: 0,
        vecesGanada: 0,
        porcentajeExito: 0,
        promedioErrores: 0,
        tiempoPromedio: 0,
        totalErrores: 0,
        tiempoTotal: 0,
      }
    }

    const statsPalabra = datos.estadisticasPorPalabra[palabra]
    statsPalabra.vecesJugada++
    statsPalabra.totalErrores += datosPartida.errores
    statsPalabra.tiempoTotal += datosPartida.tiempoJugado

    if (datosPartida.gano) {
      statsPalabra.vecesGanada++
    }

    // Calcular promedios
    statsPalabra.porcentajeExito = Math.round((statsPalabra.vecesGanada / statsPalabra.vecesJugada) * 100)
    statsPalabra.promedioErrores = Math.round((statsPalabra.totalErrores / statsPalabra.vecesJugada) * 10) / 10
    statsPalabra.tiempoPromedio = Math.round(statsPalabra.tiempoTotal / statsPalabra.vecesJugada)

    // Agregar al historial
    datos.historial.unshift({
      fecha: datosPartida.fecha,
      palabra: datosPartida.palabra,
      gano: datosPartida.gano,
      errores: datosPartida.errores,
      tiempoJugado: datosPartida.tiempoJugado,
    })

    // Mantener solo las últimas 50 partidas
    if (datos.historial.length > 50) {
      datos.historial = datos.historial.slice(0, 50)
    }

    // Guardar datos actualizados
    await fs.writeFile(DATOS_PATH, JSON.stringify(datos, null, 2), "utf8")
    console.log("Estadísticas actualizadas correctamente")

    return { success: true }
  } catch (error) {
    console.error("Error actualizando estadísticas:", error)
    return { success: false, error: error.message }
  }
})

app.whenReady().then(createWindow)

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit()
  }
})

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
