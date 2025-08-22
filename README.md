# Ahorcado Interactivo

## Descripción

**Ahorcado Interactivo** es un juego del ahorcado multiplataforma, construido como una aplicación de escritorio utilizando el framework Electron. El proyecto va más allá de un simple juego y se enfoca en ofrecer una experiencia de usuario completa y extensible. La aplicación permite a los usuarios jugar, gestionar sus propias palabras y seguir sus estadísticas de juego, todo de manera local, sin necesidad de conexión a internet o servidores externos.

## Tabla de Contenido

- [Descripción](#descripción)
- [Funcionalidades Clave](#funcionalidades-clave)
  - [Juego Principal](#juego-principal)
  - [Gestión de Palabras](#gestión-de-palabras)
  - [Estadísticas del Jugador](#estadísticas-del-jugador)
- [Arquitectura y Tecnologías](#arquitectura-y-tecnologías)
- [Estructura de Archivos](#estructura-de-archivos)
- [Consideraciones y Desafíos](#consideraciones-y-desafíos)
- [Instalación](#instalación)
- [Uso](#uso)
- [Contribución](#contribución)
- [Licencia](#licencia)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Créditos](#créditos)
- [Notas Adicionales](#notas-adicionales)

## Funcionalidades Clave

### Juego Principal

- Lógica del juego del ahorcado con un contador de errores.
- Interacción mediante botones para seleccionar letras.
- Sistema de pistas para ayudar al jugador.
- Manejo de estados de victoria y derrota con notificaciones modales.

### Gestión de Palabras

- Interfaz dedicada (`gestorpalabras.html`) para que el usuario pueda agregar, editar y eliminar palabras y sus respectivas pistas.
- Validación de la entrada para asegurar que solo se ingresen letras.
- Persistencia de datos: las palabras personalizadas se guardan de forma local en el sistema del usuario.

### Estadísticas del Jugador

- Sección de estadísticas (`estadisticas.html`) que muestra el rendimiento del usuario.
  - **Estadísticas Globales**: Número de partidas jugadas, ganadas, perdidas y porcentaje de éxito.
  - **Estadísticas por Palabra**: Detalle de cuántas veces se ha jugado cada palabra, su tasa de éxito, promedio de errores, etc.
  - **Historial Reciente**: Un registro de las últimas partidas jugadas con su resultado.
- Los datos también se persisten localmente en el sistema del usuario.

## Arquitectura y Tecnologías

- **Framework**: [Electron](https://www.electronjs.org/). Se utiliza para encapsular el proyecto web en una aplicación de escritorio.
- **Lenguajes**: HTML5, CSS3 y JavaScript (Vanilla JS). El proyecto no utiliza frameworks frontend como React o Vue. La lógica está escrita en JavaScript puro para mantener la aplicación ligera.
- **Manejo de Datos**: Los datos se persisten de forma local en el sistema del usuario. La comunicación entre el proceso principal de Electron y las ventanas de renderizado (HTML/JS) se realiza a través de IPC (Inter-Process Communication) utilizando `ipcMain` e `ipcRenderer`.
- **Empaquetado y Distribución**: Se utiliza [electron-builder](https://www.electron.build/) para generar instaladores y ejecutables para Windows, macOS y Linux.

## Estructura de Archivos

- `main.js`: Archivo principal de Electron que gestiona las ventanas, la comunicación IPC y la lógica de backend para la lectura/escritura de archivos.
- `preload.js`: Archivo de precarga que expone una API segura (`contextBridge`) para que las ventanas de renderizado puedan interactuar con el proceso principal sin acceder directamente a Node.js.
- `index.html`: Vista principal del juego.
- `estadisticas.html`: Vista de la página de estadísticas.
- `gestorpalabras.html`: Vista para la gestión de palabras.
- `datos.js`: Módulo de JavaScript que contiene la lógica para manejar y procesar los datos del juego (leer, guardar, actualizar estadísticas).
- `funciones.js`: Módulo con funciones auxiliares para la lógica del juego (por ejemplo, obtener palabra aleatoria).
- `styles.css`: Hoja de estilos con un diseño moderno, accesible y responsivo.

## Consideraciones y Desafíos

- **Persistencia de Datos**: La implementación de la persistencia de datos debe ser robusta, manejando la lectura y escritura de archivos JSON de forma asíncrona para evitar bloquear la interfaz de usuario.
- **Comunicación Segura**: El uso de `contextBridge` en `preload.js` es fundamental para mantener la seguridad, evitando la inyección de código malicioso.
- **Empaquetado**: La configuración de `electron-builder` debe ser precisa para generar instaladores funcionales y eficientes para múltiples plataformas.
- **Separación de Lógica**: El código está organizado en diferentes archivos (como `main.js`, `preload.js`, `datos.js`, etc.) para una mejor legibilidad y mantenimiento.

## Instalación

Para instalar y configurar el proyecto localmente, sigue los pasos a continuación:

1. **Clona este repositorio**:

   ```bash
   git clone https://github.com/tuusuario/ahorcado-interactivo.git
   cd ahorcado-interactivo
