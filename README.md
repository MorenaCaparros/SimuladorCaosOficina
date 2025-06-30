# 🏢 Simulador de Caos en la Oficina

Un juego web interactivo que simula las situaciones más caóticas (y reales) de la vida en la oficina moderna. ¿Podrás sobrevivir un día más sin perder la cordura?

## 📋 Descripción

El **Simulador de Caos en la Oficina** es un juego de preguntas y respuestas donde los jugadores enfrentan situaciones típicas del ambiente laboral. Cada decisión suma puntos de caos que determinan qué tan bien (o mal) manejas el estrés corporativo.

### 🎯 Características

- **3 personajes únicos** con diferentes personalidades laborales y preguntas específicas
- **Sistema de dificultad progresiva** que se adapta a tus puntos de caos
- **Preguntas dinámicas** específicas para cada personaje
- **7 situaciones laborales** con escalamiento de dificultad
- **Sistema de puntuación** basado en "puntos de caos"
- **Múltiples finales** específicos para cada personaje según tu nivel de supervivencia
- **Interfaz responsive** que funciona en cualquier dispositivo
- **Indicadores visuales** de dificultad y progresión
- **Compartir resultados** para reírte con tus colegas

## 🚀 Instalación y Uso

### Prerrequisitos

- Node.js (versión 12 o superior)
- npm (viene incluido con Node.js)

### Instalación

1. **Clona o descarga el repositorio:**
   ```bash
   git clone [URL_DEL_REPOSITORIO]
   cd SimuladorCaosOficina
   ```

2. **Instala las dependencias:**
   ```bash
   npm install
   ```

3. **Inicia el servidor local:**
   ```bash
   npm start
   ```

4. **Abre tu navegador** y ve a `http://localhost:8080`

### Uso Alternativo (sin instalación)

También puedes abrir directamente el archivo `src/index.html` en tu navegador para jugar sin servidor local.

## 🎮 Cómo Jugar

1. **Selecciona tu personaje:**
   - 🧘‍♀️ **La multitasking quemada**: Hace todo, pero ya no siente nada
   - 😵 **El que renunció en silencio**: Está en cuerpo presente, mente ausente
   - 🌟 **La entusiasta que aún cree**: Todavía piensa que todo puede mejorar

2. **Responde las preguntas** sobre situaciones laborales típicas
   - Las preguntas cambian según tu personaje elegido
   - La dificultad aumenta progresivamente con tus puntos de caos

3. **Acumula puntos de caos** según tus decisiones:
   - 0 puntos: Respuesta sensata y profesional
   - 1 punto: Respuesta intermedia con toque de caos
   - 2 puntos: Respuesta caótica total

4. **Experimenta el escalamiento dinámico:**
   - 🟢 **Fácil** (0-2 puntos): Situaciones cotidianas manejables
   - 🟡 **Intermedio** (3-5 puntos): Complicaciones típicas de oficina
   - 🔴 **Difícil** (6+ puntos): Crisis corporativa total

5. **Descubre tu resultado final** específico para tu personaje y puntuación

## 📁 Estructura del Proyecto

```
SimuladorCaosOficina/
├── package.json              # Configuración del proyecto
├── README.md                 # Este archivo
└── src/
    ├── index.html           # Página principal
    ├── css/
    │   └── styles.css       # Estilos del juego
    ├── data/
    │   ├── characters.json  # Datos de personajes
    │   └── questions.json   # Preguntas del juego
    └── js/
        ├── main.js          # Lógica principal del juego
        └── utils.js         # Funciones auxiliares
```

## 🛠️ Tecnologías Utilizadas

- **HTML5** - Estructura de la aplicación
- **CSS3** - Estilos y animaciones
- **Vanilla JavaScript** - Lógica del juego
- **JSON** - Almacenamiento de datos
- **live-server** - Servidor de desarrollo

## 🎨 Personalización

### Agregar Nuevas Preguntas por Personaje

Edita el archivo `src/data/questions.json` y agrega preguntas en la estructura específica:

```json
{
  "characterQuestions": {
    "multitasking": {
      "easy": [
        {
          "question": "Tu nueva situación para multitasking",
          "options": [
            {"answer": "Opción 1", "chaosPoints": 0},
            {"answer": "Opción 2", "chaosPoints": 1},
            {"answer": "Opción 3", "chaosPoints": 2}
          ]
        }
      ],
      "medium": [...],
      "hard": [...]
    },
    "resignado": {
      // Similar estructura para el personaje resignado
    },
    "entusiasta": {
      // Similar estructura para el personaje entusiasta
    }
  }
}
```

### Personalizar Niveles de Dificultad

En `src/js/main.js`, puedes modificar los umbrales de dificultad:

```javascript
function getDifficultyLevel(chaosScore) {
    if (chaosScore <= 2) return 'easy';
    if (chaosScore <= 5) return 'medium';
    return 'hard';
}
```

### Agregar Nuevos Personajes

Modifica el archivo `src/data/characters.json`:

```json
{
  "name": "Nombre del personaje",
  "description": "Descripción divertida",
  "emoji": "🤖"
}
```

## 🤝 Contribuir

1. Haz un fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### Ideas para Contribuir

- 🆕 Agregar más preguntas específicas por personaje
- 🎯 Crear nuevos niveles de dificultad
- 🎨 Mejorar el diseño visual y animaciones
- 🔊 Agregar efectos de sonido
- 📱 Optimizar para móviles
- 🌍 Traducir a otros idiomas
- 📊 Agregar estadísticas detalladas y progresión
- 🎭 Crear nuevos personajes con mecánicas únicas
- 🏆 Sistema de logros por personaje

## 📝 Scripts Disponibles

- `npm start` - Inicia el servidor de desarrollo
- `npm run build` - Comando de build (personalizable)

## 🐛 Solución de Problemas

### La página no carga las preguntas
- Verifica que estés usando un servidor local (`npm start`)
- Revisa la consola del navegador para errores
- Asegúrate de que `src/data/questions.json` tenga formato JSON válido

### Error de CORS
- Usa `npm start` en lugar de abrir el archivo directamente
- O configura tu navegador para permitir archivos locales

## 🔮 Roadmap

- [ ] Sistema de logros y badges por personaje
- [ ] Modo multijugador con personajes específicos
- [ ] Guardar progreso y estadísticas por personaje
- [ ] Más niveles de dificultad y situaciones extremas
- [ ] Integración con redes sociales
- [ ] Versión mobile app
- [ ] Sistema de personalización de personajes
- [ ] Modo "supervivencia" sin límite de preguntas

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## ✨ Créditos

Creado con 💻 y mucho ☕ por desarrolladores que también sobreviven al caos diario de la oficina.

---

¿Encontraste un bug o tienes una idea genial? ¡Abre un issue o contribuye al proyecto! 🚀

*"En el caos de la oficina, algunos encuentran el orden... otros simplemente encuentran más café"* ☕
