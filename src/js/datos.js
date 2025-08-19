// En src/js/datos.js

export async function leerDatos() {
    // Llama a la función expuesta en el preload.js
    const datosJSON = await window.electronAPI.leerDatos();
    let datos;

    if (datosJSON) {
        // Si el archivo existía, lo parseamos
        datos = JSON.parse(datosJSON);
    } else {
        // Si no existía, creamos el objeto por defecto
        datos = {
            "palabras": [],
            "estadisticas": { "ganadas": 0, "perdidas": 0 }
        };
    }
    return datos;
}