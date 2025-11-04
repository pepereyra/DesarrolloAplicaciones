# TP3 - Consumo de API Pokémon

## Descripción

Este proyecto es una práctica de laboratorio que demuestra el consumo de una API REST utilizando JavaScript moderno con `async/await` y `fetch`. La aplicación obtiene datos de la [PokeAPI](https://pokeapi.co) y los muestra en una tabla HTML interactiva.

## Características

- ✅ Consumo de API REST usando `async/await`
- ✅ Interfaz responsive y moderna
- ✅ Manejo de errores robusto
- ✅ Indicadores de carga
- ✅ Diseño atractivo con gradientes y efectos
- ✅ Información completa de Pokémon (imagen, tipos, habilidades, etc.)

## Tecnologías Utilizadas

- **HTML5**: Estructura semántica
- **CSS3**: Estilos modernos con Flexbox/Grid, gradientes y animaciones
- **JavaScript ES6+**: 
  - `async/await` para operaciones asíncronas
  - `fetch` API para llamadas HTTP
  - `Promise.all` para operaciones concurrentes
  - Manejo de errores con `try/catch`

## Estructura del Proyecto

```
tp3/
├── index.html      # Página principal
├── styles.css      # Estilos CSS
├── script.js       # Lógica JavaScript
└── README.md       # Documentación
```

## API Utilizada

**PokeAPI**: https://pokeapi.co/api/v2/

Endpoints utilizados:
- `GET /pokemon?limit=20` - Lista de Pokémon
- `GET /pokemon/{id}` - Detalles específicos de cada Pokémon

## Funcionalidades

### Principales
- **Cargar Pokémon**: Obtiene los primeros 20 Pokémon de la API
- **Limpiar Tabla**: Elimina todos los datos de la tabla
- **Responsive**: Se adapta a diferentes tamaños de pantalla

### Datos Mostrados
- ID del Pokémon
- Nombre
- Imagen (sprite oficial)
- Altura y peso
- Tipos (con colores característicos)
- Habilidades

## Cómo Usar

1. Abrir `index.html` en un navegador web
2. Hacer clic en "Cargar Pokémon"
3. Esperar a que se carguen los datos
4. Explorar la información en la tabla

## Atajos de Teclado

- **Enter**: Cargar datos de Pokémon
- **Escape**: Limpiar tabla

## Características Técnicas

### JavaScript Moderno
- Uso de `async/await` para código más legible
- Manejo de múltiples llamadas concurrentes con `Promise.all`
- Destructuring y arrow functions
- Template literals para generación de HTML

### Manejo de Errores
- Validación de respuestas HTTP
- Mensajes de error informativos
- Fallbacks para imágenes no disponibles

### UX/UI
- Indicadores de carga visual
- Animaciones suaves
- Hover effects
- Diseño moderno con glassmorphism

## Requisitos

- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Conexión a internet para acceder a la API

## Autor

Práctica de Laboratorio - TP3
UADE - Desarrollo de Aplicaciones

---

*Este proyecto fue desarrollado como parte de la práctica de consumo de APIs REST y manejo de operaciones asíncronas en JavaScript.*
