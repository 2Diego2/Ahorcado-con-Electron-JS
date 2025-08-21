import { obtenerEstadisticas } from "./datos.js"

window.onload = async () => {
  await cargarEstadisticas()
}

async function cargarEstadisticas() {
  try {
    console.log("[v0] Cargando estadísticas...")
    const stats = await obtenerEstadisticas()
    console.log("[v0] Estadísticas obtenidas:", stats)

    if (!stats || !stats.globales) {
      document.querySelector(".container").innerHTML = "<h2 class='no-data'>No hay estadísticas disponibles</h2>"
      return
    }

    mostrarEstadisticasGlobales(stats.globales)
    mostrarEstadisticasPorPalabra(stats.porPalabra)
    mostrarHistorial(stats.historial)
  } catch (error) {
    console.error("Error cargando estadísticas:", error)
    document.querySelector(".container").innerHTML = "<h2 class='no-data'>Error al cargar estadísticas</h2>"
  }
}

function mostrarEstadisticasGlobales(globales) {
  const container = document.getElementById("estadisticas-globales")

  const estadisticas = [
    { numero: globales.partidasJugadas || 0, label: "Partidas Jugadas" },
    { numero: globales.partidasGanadas || 0, label: "Partidas Ganadas" },
    { numero: globales.partidasPerdidas || 0, label: "Partidas Perdidas" },
    { numero: `${globales.porcentajeExito || 0}%`, label: "Porcentaje de Éxito" },
    { numero: `${Math.round((globales.tiempoTotalJugado || 0) / 60)}min`, label: "Tiempo Total Jugado" },
  ]

  container.innerHTML = estadisticas
    .map(
      (stat) => `
        <div class="stat-card">
            <div class="stat-number">${stat.numero}</div>
            <div class="stat-label">${stat.label}</div>
        </div>
    `,
    )
    .join("")
}

function mostrarEstadisticasPorPalabra(porPalabra) {
  const tbody = document.querySelector("#tabla-palabras tbody")

  if (!porPalabra || Object.keys(porPalabra).length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" class="no-data">No hay estadísticas por palabra disponibles</td></tr>'
    return
  }

  const palabrasOrdenadas = Object.entries(porPalabra).sort(
    ([, a], [, b]) => (b.vecesJugada || 0) - (a.vecesJugada || 0),
  )

  tbody.innerHTML = palabrasOrdenadas
    .map(
      ([palabra, stats]) => `
        <tr>
            <td><strong>${palabra}</strong></td>
            <td>${stats.vecesJugada || 0}</td>
            <td>${stats.vecesGanada || 0}</td>
            <td>${stats.porcentajeExito || 0}%</td>
            <td>${stats.promedioErrores || 0}</td>
            <td>${stats.tiempoPromedio || 0}s</td>
        </tr>
    `,
    )
    .join("")
}

function mostrarHistorial(historial) {
  const container = document.getElementById("historial-partidas")

  if (!historial || historial.length === 0) {
    container.innerHTML = "<p class='no-data'>No hay historial de partidas.</p>"
    return
  }

  container.innerHTML = historial
    .slice(0, 10)
    .map((partida) => {
      const fecha = new Date(partida.fecha).toLocaleString()
      const resultado = partida.gano ? "GANADA" : "PERDIDA"
      const claseResultado = partida.gano ? "resultado-ganado" : "resultado-perdido"

      return `
            <div class="historial-item">
                <div>
                    <strong>${partida.palabra}</strong> - 
                    <span class="${claseResultado}">${resultado}</span>
                </div>
                <div>
                    ${partida.errores} errores | ${partida.tiempoJugado}s | ${fecha}
                </div>
            </div>
        `
    })
    .join("")
}
