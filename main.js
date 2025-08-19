//Enlazar index.html con main.js
//src/main.js
const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');

let win;

function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'src','js', 'preload.js')
    }
  });

  win.loadFile(path.join(__dirname, 'src', 'index.html'));
}

// 1. Construye la ruta correctamente
const rutaDatos = path.join(app.getPath('userData'), 'datos.json');

// 2. Escucha una petición desde el renderer para leer los datos
ipcMain.handle('leer-datos', () => {
    try {
        // Intenta leer el archivo
        return fs.readFileSync(rutaDatos, 'utf-8');
    } catch (error) {
        // Si no existe o hay un error, devuelve null o un objeto por defecto
        return null;
    }
});



app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
