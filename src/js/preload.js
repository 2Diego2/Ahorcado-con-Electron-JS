// En preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    // La función que tu interfaz podrá llamar
    leerDatos: () => ipcRenderer.invoke('leer-datos')
});