import type { Graph } from './graph'
import { uid } from './graph'
import { haversineKm } from './geo'

interface SeedNode {
  name: string
  x: number
  y: number
  lat?: number
  lng?: number
}

interface SeedEdge {
  a: number
  b: number
  w: number
}

function build(
  nodes: SeedNode[],
  edges: SeedEdge[],
  directed: boolean,
): Graph {
  const ids = nodes.map(() => uid('n'))
  return {
    directed,
    nodes: nodes.map((node, i) => ({
      id: ids[i],
      name: node.name,
      x: node.x,
      y: node.y,
      lat: node.lat,
      lng: node.lng,
    })),
    edges: edges.map((edge) => ({
      id: uid('e'),
      a: ids[edge.a],
      b: ids[edge.b],
      w: edge.w,
    })),
  }
}

/** Ejemplo didáctico clásico: A→B 4, A→C 1, C→B 2, B→D 1, C→D 5 (+ E y F). */
export function simpleGraph(): Graph {
  return build(
    [
      { name: 'A', x: 0.1, y: 0.5 },
      { name: 'B', x: 0.42, y: 0.2 },
      { name: 'C', x: 0.4, y: 0.8 },
      { name: 'D', x: 0.72, y: 0.5 },
      { name: 'E', x: 0.92, y: 0.24 },
      { name: 'F', x: 0.92, y: 0.82 },
    ],
    [
      { a: 0, b: 1, w: 4 },
      { a: 0, b: 2, w: 1 },
      { a: 2, b: 1, w: 2 },
      { a: 1, b: 3, w: 1 },
      { a: 2, b: 3, w: 5 },
      { a: 3, b: 4, w: 3 },
      { a: 3, b: 5, w: 6 },
      { a: 4, b: 5, w: 2 },
    ],
    true,
  )
}

/** Grafo de arranque del editor para que nunca empiece vacío. */
export function editorGraph(): Graph {
  return build(
    [
      { name: 'A', x: 0.1, y: 0.5 },
      { name: 'B', x: 0.38, y: 0.18 },
      { name: 'C', x: 0.38, y: 0.82 },
      { name: 'D', x: 0.66, y: 0.5 },
      { name: 'E', x: 0.92, y: 0.5 },
    ],
    [
      { a: 0, b: 1, w: 4 },
      { a: 0, b: 2, w: 2 },
      { a: 1, b: 2, w: 1 },
      { a: 1, b: 3, w: 5 },
      { a: 2, b: 3, w: 8 },
      { a: 2, b: 4, w: 10 },
      { a: 3, b: 4, w: 2 },
    ],
    false,
  )
}

interface City {
  name: string
  lat: number
  lng: number
}

const CITIES: City[] = [
  { name: 'Bogotá', lat: 4.711, lng: -74.072 },
  { name: 'Medellín', lat: 6.244, lng: -75.581 },
  { name: 'Cali', lat: 3.452, lng: -76.532 },
  { name: 'Barranquilla', lat: 10.964, lng: -74.796 },
  { name: 'Cartagena', lat: 10.391, lng: -75.479 },
  { name: 'Bucaramanga', lat: 7.119, lng: -73.123 },
  { name: 'Cúcuta', lat: 7.894, lng: -72.507 },
  { name: 'Manizales', lat: 5.07, lng: -75.514 },
  { name: 'Pereira', lat: 4.814, lng: -75.696 },
  { name: 'Ibagué', lat: 4.438, lng: -75.232 },
  { name: 'Neiva', lat: 2.927, lng: -75.282 },
  { name: 'Villavicencio', lat: 4.142, lng: -73.627 },
  { name: 'Santa Marta', lat: 11.241, lng: -74.199 },
]

const CITY_EDGES: SeedEdge[] = [
  { a: 0, b: 9, w: 0 },
  { a: 0, b: 11, w: 0 },
  { a: 0, b: 5, w: 0 },
  { a: 0, b: 1, w: 0 },
  { a: 9, b: 8, w: 0 },
  { a: 9, b: 2, w: 0 },
  { a: 9, b: 10, w: 0 },
  { a: 8, b: 7, w: 0 },
  { a: 8, b: 2, w: 0 },
  { a: 8, b: 1, w: 0 },
  { a: 7, b: 1, w: 0 },
  { a: 1, b: 4, w: 0 },
  { a: 1, b: 5, w: 0 },
  { a: 5, b: 6, w: 0 },
  { a: 5, b: 12, w: 0 },
  { a: 4, b: 3, w: 0 },
  { a: 3, b: 12, w: 0 },
  { a: 2, b: 10, w: 0 },
]

/** Red aproximada de ciudades de Colombia. Los pesos se calculan por distancia real. */
export function citiesGraph(): Graph {
  const graph = build(
    CITIES.map((city) => ({ name: city.name, x: 0.5, y: 0.5, lat: city.lat, lng: city.lng })),
    CITY_EDGES,
    false,
  )
  const byId = new Map(graph.nodes.map((node) => [node.id, node]))
  for (const edge of graph.edges) {
    const a = byId.get(edge.a)
    const b = byId.get(edge.b)
    if (a?.lat != null && a.lng != null && b?.lat != null && b.lng != null) {
      edge.w = haversineKm({ lat: a.lat, lng: a.lng }, { lat: b.lat, lng: b.lng })
    }
  }
  return graph
}
