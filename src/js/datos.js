// src/js/datos.js

export async function leerDatos() {
  try {
    const datosRecibidos = await window.electronAPI.leerDatos();
    if (!datosRecibidos) {
      return { palabras: [], estadisticas: { ganadas: 0, perdidas: 0 } };
    }
    if (typeof datosRecibidos === 'string') {
      return JSON.parse(datosRecibidos);
    }
    return datosRecibidos;
  } catch (err) {
    console.error('Error en leerDatos:', err);
    return { palabras: [], estadisticas: { ganadas: 0, perdidas: 0 } };
  }
}

export async function guardarDatos(objDatos) {
  try {
    const respuesta = await window.electronAPI.guardarDatos(objDatos);
    return respuesta === undefined ? true : Boolean(respuesta);
  } catch (err) {
    console.error('Error en guardarDatos:', err);
    return false;
  }
}
