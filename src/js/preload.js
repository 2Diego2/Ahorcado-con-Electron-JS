// src/js/preload.js
const { contextBridge, ipcRenderer } = require("electron")

console.log("preload cargado (src/js/preload.js)")

contextBridge.exposeInMainWorld("electronAPI", {
  leerDatos: () => ipcRenderer.invoke("leer-palabras"),
  guardarDatos: (datos) => ipcRenderer.invoke("guardar-datos", datos),
  abrirGestor: () => ipcRenderer.invoke("abrir-gestor"),
  actualizarEstadisticas: (datosPartida) => ipcRenderer.invoke("actualizar-estadisticas", datosPartida),
  abrirEstadisticas: () => ipcRenderer.invoke("abrir-estadisticas"),
})
