# Ahorcado Interactivo
![Electron](https://img.shields.io/badge/Electron-47848F?style=for-the-badge&logo=electron&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
Una aplicación de escritorio multiplataforma que reinventa el clásico juego del ahorcado con funcionalidades modernas y personalizables.
## 🎯 Características
- **Juego clásico mejorado**: Experiencia de juego fluida con interfaz moderna
- **Multiplataforma**: Compatible con Windows, macOS y Linux
- **Gestión de palabras**: Añade, edita y elimina tus propias palabras y pistas
- **Seguimiento de estadísticas**: Registro detallado de tu rendimiento y progreso
- **Completamente offline**: Funciona sin necesidad de conexión a internet
- **Diseño responsive**: Interfaz adaptable a diferentes tamaños de ventana
- **Efectos de sonido**: Feedback auditivo para una experiencia inmersiva
## 🛠️ Tecnologías Utilizadas
- **Electron**: Framework para aplicaciones de escritorio nativas
- **JavaScript**: Lógica de aplicación y funcionalidades
- **HTML5**: Estructura de la interfaz de usuario
- **CSS3**: Estilos y diseño responsive
- **Node.js**: Acceso al sistema de archivos y operaciones de backend
## 📦 Instalación
### Descarga e instalación
1. Visita la sección de [Releases](https://github.com/tu-usuario/ahorcado-interactivo/releases)
2. Descarga el instalador para tu sistema operativo:
   - Windows: `Ahorcado Setup 1.0.0.exe`
   - macOS: `Ahorcado-1.0.0.dmg`
   - Linux: `Ahorcado-1.0.0.AppImage`
### Instalación en Windows
1. Ejecuta el archivo `.exe` descargado
2. Sigue las instrucciones del asistente de instalación
3. La aplicación se instalará y creará un acceso directo
### Instalación en macOS
1. Abre el archivo `.dmg` descargado
2. Arrastra la aplicación a la carpeta de Aplicaciones
3. Ejecuta desde Launchpad o Spotlight
### Instalación en Linux
1. Otorga permisos de ejecución: `chmod +x Ahorcado-1.0.0.AppImage`
2. Ejecuta: `./Ahorcado-1.0.0.AppImage`
## 🎮 Cómo Jugar
1. **Inicia la aplicación** desde el menú de inicio o acceso directo
2. **Selecciona "Jugar"** en el menú principal
3. **Haz clic en "Obtener Palabra"** para comenzar una partida
4. **Adivina letras** haciendo clic en el teclado virtual
5. **Utiliza las pistas** proporcionadas para ayudarte
6. **Gana** adivinando la palabra antes de completar el dibujo del ahorcado
## 📊 Gestión de Palabras y Estadísticas
### Añadir palabras personalizadas
1. Ve a "Gestionar Palabras" desde el menú principal
2. Escribe tu palabra en el campo correspondiente
3. Añade una pista opcional
4. Haz clic en "Agregar Palabra"
### Ver tus estadísticas
1. Selecciona "Ver Estadísticas" en el menú principal
2. Consulta tus:
   - Estadísticas globales (partidas jugadas, ganadas, % éxito)
   - Rendimiento por palabra específica
   - Historial reciente de partidas
## 🗂️ Estructura del Proyecto
```
ahorcado-interactivo/
├── assets/
│   ├── images/          # Imágenes del juego (etapas del ahorcado)
│  
├── js/
│   ├── datos.js         # Gestión de datos y persistencia
│   ├── renderer.js      # Donde se inicia el juego y funciona la logica.
│   ├── funciones.js     # Funciones auxiliares
│   ├── estadisticas.js  # Lógica de estadísticas
│   ├── gestorPalabras.js # Gestión de palabras personalizadas
│   └── preload.js       # Comunicación segura entre procesos
├── css/
│   └── styles.css      # Estilos globales
├── index.html          # Pantalla de inicio
├── data.html           # Informacion de como se juega
├── menu.html           # Menú principal
├── gestorpalabras.html # Gestor de palabras
├── estadisticas.html   # Pantalla de estadísticas
├── main.js             # Proceso principal de Electron
└── package.json        # Configuración y dependencias
```
## 📋 Requisitos del Sistema
- **Sistema operativo**: Windows 10/11, macOS 10.13+, o Linux moderno
- **Memoria RAM**: 4 GB mínimo (8 GB recomendado)
- **Espacio en disco**: 200 MB libres
- **Procesador**: Intel Core i3 7ª gen o equivalente
## 🔧 Desarrollo
### Prerrequisitos
- Node.js (v16 o superior)
- npm
### Instalación de dependencias
```bash
npm install
```
### Ejecutar en modo desarrollo
```bash
npm start
```
### Construir la aplicación
```bash
npm run dist
```
## 📚 Documentación
El proyecto cuenta con documentación exhaustiva:
- [Informe Técnico](./docs/INFORME_TECNICO.md) - Detalles de arquitectura y decisiones técnicas
- [Manual de Usuario](./docs/MANUAL_USUARIO.md) - Guía completa de uso de la aplicación
- [Documentación del Código](./docs/JS_DOC.md) - Documentación JSDoc del código fuente
## 🐛 Solución de Problemas
### La aplicación no se inicia
- Verifica que la instalación se completó correctamente
- Revisa que tu antivirus no esté bloqueando la ejecución
- Reinicia tu equipo e intenta nuevamente
### No se guardan las palabras o estadísticas
- Asegúrate de tener permisos de escritura en el directorio de instalación
- Verifica que las palabras solo contengan letras (sin números o símbolos)
## 📝 Licencia
Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.
## 🤝 Contribuciones
Las contribuciones son bienvenidas. Por favor:
1. Haz un fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request
## 📧 Contacto
Para preguntas o sugerencias sobre el proyecto, puedes contactar a través de:
- [Issues de GitHub](https://github.com/2Diego2/Ahorcado-con-Electron-JS/issues)
- Email: diegoabelleyra74@gmail.com
---
¡Disfruta del Ahorcado Interactivo! 🎯
```
