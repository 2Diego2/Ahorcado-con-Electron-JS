export async function leerDatos() {
  try {
    const datosRecibidos = await window.electronAPI.leerDatos()
    if (!datosRecibidos) {
      return { palabras: [], estadisticas: { ganadas: 0, perdidas: 0 } }
    }
    if (typeof datosRecibidos === "string") {
      return JSON.parse(datosRecibidos)
    }
    return datosRecibidos
  } catch (err) {
    console.error("Error en leerDatos:", err)
    return { palabras: [], estadisticas: { ganadas: 0, perdidas: 0 } }
  }
}

export async function guardarDatos(objDatos) {
  try {
    const respuesta = await window.electronAPI.guardarDatos(objDatos)
    console.log("Respuesta de guardarDatos:", respuesta)

    // La respuesta ahora es un objeto con success: boolean
    return respuesta && respuesta.success
  } catch (err) {
    console.error("Error en guardarDatos:", err)
    return false
  }
}

export async function obtenerEstadisticas() {
  try {
    const datos = await leerDatos()
    console.log("Datos obtenidos para estadísticas:", datos)

    // Estructura de estadísticas con valores por defecto
    const estadisticasDefault = {
      partidasJugadas: 0,
      partidasGanadas: 0,
      partidasPerdidas: 0,
      porcentajeExito: 0,
      tiempoTotalJugado: 0,
    }

    return {
      globales: datos.estadisticas || estadisticasDefault,
      porPalabra: datos.estadisticasPorPalabra || {},
      historial: datos.historial || [],
    }
  } catch (error) {
    console.error("Error obteniendo estadísticas:", error)
    return {
      globales: {
        partidasJugadas: 0,
        partidasGanadas: 0,
        partidasPerdidas: 0,
        porcentajeExito: 0,
        tiempoTotalJugado: 0,
      },
      porPalabra: {},
      historial: [],
    }
  }
}

export async function actualizarEstadisticas(resultado) {
  try {
    const respuesta = await window.electronAPI.actualizarEstadisticas(resultado)
    return respuesta && respuesta.success
  } catch (error) {
    console.error("Error actualizando estadísticas:", error)
    return false
  }
}
