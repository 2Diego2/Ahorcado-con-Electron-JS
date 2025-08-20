const { app, BrowserWindow, ipcMain } = require("electron")
const path = require("path")
const fs = require("fs").promises

let mainWindow
let gestorWindow

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

// Handler para leer datos
ipcMain.handle("leer-palabras", async () => {
  try {
    console.log("Leyendo datos desde:", DATOS_PATH)
    const data = await fs.readFile(DATOS_PATH, "utf8")
    const parsedData = JSON.parse(data)

    // Si es un array (formato original), convertir al formato esperado
    if (Array.isArray(parsedData)) {
      return {
        palabras: parsedData,
        estadisticas: { ganadas: 0, perdidas: 0 },
      }
    }

    return parsedData
  } catch (error) {
    console.error("Error leyendo datos:", error)
    // Retornar estructura por defecto si hay error
    return {
      palabras: [],
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