<div align="center">
  <h1> La Poderosa  - Calculadora Universitaria</h1>
  <p><i>La extensión definitiva de Chrome que todo estudiante universitario necesita para no sufrir al final del semestre.</i></p>
</div>

---

##  ¿Qué es La Poderosa?

**"La Poderosa"** es una extensión de Google Chrome diseñada por y para estudiantes universitarios. Su objetivo principal es hacer que el cálculo, seguimiento y control de tus calificaciones sea lo más rápido, exacto y visualmente atractivo posible. Olvídate de tu viejo archivo de Excel y las fórmulas dañadas.

##  Funcionalidades Principales

###  Calculadora Rápida
Obtén información al instante ingresando las calificaciones redondeadas tal y como lo exige la regla universitaria:
- Soporte completo para escenario con **1er Parcial, 2do Parcial, Práctico y Mejoramiento**.
- Personaliza la configuración porcentual Teórico/Práctico (Por defecto: 70% / 30%).
- Te dirá **exactamente qué nota necesitas** en los próximos exámenes para lograr pasar.
- La tortuga interactiva cambiará de ánimo dependiendo del status de tu materia.

###  Calculadora Detallada
Para las materias donde cada decimal de lección o tarea cuenta.
- Organiza tu semestre generando filas dinámicas por parcial (Lecciones, Tareas, Actividades, Proyectos, y Examen).
- Define la ponderación (peso %) de cada ítem, la app computa todo, y envía tu nota parcial matemáticamente **truncada al entero más cercano**, simulando 1:1 el ambiente real del sistema Académico ESPOL.
- Botón ágil de «Limpiar Todo» para resetear notas conservando los pesos que ingresaste.

###  Historial Inteligente & Scraping
Lleva el control maestro de tu semestre.
- **Promedio Histórico:** Tu nota global visible a primera vista en texto gigante.
- **Proyección de Franja de Registro:** Calcula tu estado para la próxima matrícula y te lanza tu aproximación de Franja y horarios. (Ej. `Primera Franja - 10:00 AM`).
- **Scraping desde Académico Integrado:** Da clic en el botón *Importar*, y la extensión leerá y extraerá toda la tabla actual directo desde la web `academico.espol.edu.ec` automáticamente hacia tu Storage.

###  Persistencia a Prueba de Balas (Anti-Baldeo)
Todo lo que tipeaste se reanuda a menos de que tú lo borres:
Los datos (componentes, parciales y pesos) se auto-guardan a cada milisegundo en la memoria `chrome.storage.local`. Ve a Google, regresa, ve al Académico, cierra el popup y cuando vuelvas... nada se perderá.

---

## 🛠 Cómo Instalar (Modo Desarrollador)

Al ser un proyecto para el campus, puedes instalarlo manualmente así:

1. Descarga el código (`.zip`) o haz clon en este repositorio en tu computadora.
2. Ve a las extensiones en la barra de Google Chrome pegando esta liga: `chrome://extensions/`.
3. Prende el switch de **Modo de desarrollador** (esquina superior derecha).
4. Selecciona **Cargar descomprimida** (*Load unpacked*).
5. Selecciona la carpeta `espol-calculator`.
6. ¡Fija a **La Poderosa** en la barra y calcúlate ese semestre!

---

## 🔧 Tecnologías Usadas
- Totalmente escrito en **HTML5, CSS y JavaScript Vanilla**: ultra-ligero y rápido sin depender de instaladores ni node_modules de frameworks pesados.
- Diseño Moderno: Tipografía *Inter*, *Serif* y estéticas de Dashboards de alta fidelidad.
- Integración pura con Chrome API (`scripting` activo para cruce de URLs, y `storage` para bases de datos documentales locales).

---

<p align="center">Concebido con mucho dolor y sudor tras semanas de evaluación. 🩵🇪🇨</p>