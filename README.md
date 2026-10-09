# Dijkstra Visualizer

Visualizador **interactivo** y **educativo** del algoritmo de Dijkstra (ruta más corta), construido con **React + Vite + TypeScript**.

> Versión modernizada y ampliada de un visualizador original en un único archivo HTML. Ahora con interfaz
> renovada, paso a paso reproducible, cola de prioridad en vivo, pseudocódigo resaltado, tema claro/oscuro y
> mapa real.

## ✨ Características

- **Aprender**: guía con intuición, pseudocódigo, complejidad y limitaciones del algoritmo.
- **Crea tu grafo**: editor con crear/mover/conectar/borrar nodos y aristas, grafos dirigidos o no dirigidos.
- **Ejemplo guiado**: grafo clásico precargado para seguir el algoritmo.
- **Mapa real**: red de ciudades de Colombia sobre OpenStreetMap; los pesos se calculan por distancia geodésica (km).
- **Reproducción paso a paso**: play/pausa, velocidad, barra de progreso, primer/último paso y navegación con teclado.
- **Cola de prioridad en vivo**: muestra qué nodo se extrae como mínimo en cada paso.
- **Pseudocódigo resaltado**: resalta la línea que se está ejecutando.
- **Tabla de distancias y predecesores** con el estado de cada nodo.
- **Bitácora narrada** de cada paso y **resultado final** con la ruta y su costo.
- **Mejoras de UX**: tema claro/oscuro, persistencia del grafo del editor, leyenda de colores, diseño responsive y atajos de teclado.

## 🧠 El algoritmo

Dijkstra resuelve la ruta más corta desde un origen en grafos con **pesos no negativos**. Es voraz: fija el nodo
no visitado con la menor distancia tentativa y relaja sus aristas. Con un montículo binario su costo es
`O((V + E) log V)`.

## 🚀 Desarrollo local

```bash
npm install
npm run dev
```

## 📦 Build de producción

```bash
npm run build     # genera /dist
npm run preview   # sirve /dist en local
```

El proyecto se publica en GitHub Pages con la ruta base `/dijkstra-visualizer/` (configurada en `vite.config.ts`).

## 🛠️ Stack

- [React 19](https://react.dev/)
- [Vite](https://vite.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Leaflet](https://leafletjs.com/) + [React Leaflet](https://react-leaflet.js.org/) para el mapa
- OpenStreetMap como fuente de tiles (sin API key)

## 📁 Estructura

```
src/
  lib/          # modelo de grafo, motor de Dijkstra, geo, presets
  hooks/        # grafo, simulación, tema, persistencia, endpoints
  components/   # UI: lienzo SVG, mapa, transporte, paneles, iconos
  views/        # Aprender, Editor, Ejemplo, Mapa
```

## 🔗 Despliegue

El sitio se publica automáticamente con GitHub Actions (`.github/workflows/deploy.yml`) en cada push a `main`:

**https://salfonsogar.github.io/dijkstra-visualizer/**

## 📄 Licencia

MIT.
