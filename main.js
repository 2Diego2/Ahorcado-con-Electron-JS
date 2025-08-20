const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs').promises;

// Obtener la ruta del archivo donde se guardan los datos del juego
function getDatosFilePath() {
  return path.join(app.getPath('userData'), 'ahorcado_datos.json');
}

// Obtener la ruta del archivo de las palabras (palabras.json)
function getPalabrasFilePath() {
  return path.join(__dirname, 'src', 'data', 'palabras.json');
}
console.log('Ruta a palabras.json:', getPalabrasFilePath());



/* IPC: leer / guardar datos */
// Manejador para obtener las palabras desde palabras.json
ipcMain.handle('leer-palabras', async () => {
  try {
    const file = getPalabrasFilePath();
    try {
      await fs.access(file); // Verificar si el archivo existe
    } catch {
      console.error("El archivo palabras.json no existe.");
      return []; // Retorna un arreglo vacío si no se encuentra el archivo
    }

    const contenido = await fs.readFile(file, 'utf-8');
    return JSON.parse(contenido); // Parseamos el contenido JSON
  } catch (err) {
    console.error('Error leyendo palabras desde palabras.json:', err);
    return []; // Regresa un arreglo vacío como fallback
  }
});


ipcMain.handle('guardar-datos', async (event, datos) => {
  const rutaDatos = getDatosFilePath(); 
  try {
    // Usa fs.writeFile (promesa) en lugar de fs.writeFileSync
    await fs.writeFile(rutaDatos, JSON.stringify(datos, null, 2));
    return { success: true };
  } catch (error) {
    console.error('Error al guardar datos:', error);
    return { success: false, error: error.message };
  }
});



/* ---- Abrir ventana gestor bajo demanda ---- */
let winGestor = null;
function crearVentanaGestor() {
  if (winGestor && !winGestor.isDestroyed()) {
    winGestor.focus();
    return;
  }

  winGestor = new BrowserWindow({
    width: 700,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'src', 'js', 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  winGestor.loadFile(path.join(__dirname, 'src', 'gestorPalabras.html'));
  winGestor.on('closed', () => { winGestor = null; });
}

ipcMain.handle('abrir-gestor', async () => {
  if (!winGestor || winGestor.isDestroyed()) {
    crearVentanaGestor();  // Crear nueva ventana si no existe o está destruida
  } else {
    winGestor.focus();  // Solo hacer foco si la ventana ya está abierta
  }
  return true;
});


/* ---- Ventana principal (index.html) ---- */
let mainWin = null;
function createMainWindow() {
  mainWin = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'src', 'js', 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  mainWin.loadFile(path.join(__dirname, 'src', 'index.html'));
  mainWin.webContents.openDevTools(); // opcional para debug
  mainWin.on('closed', () => { mainWin = null; });
}

app.whenReady().then(() => {
  createMainWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
