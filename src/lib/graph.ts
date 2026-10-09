/**
 * Modelo de grafo independiente de la vista.
 *
 * Las coordenadas son opcionales porque el mismo modelo se dibuja de dos
 * formas: en SVG (x, y normalizados 0..1) o sobre un mapa (lat, lng).
 */

export type Tool = 'move' | 'node' | 'edge' | 'weight' | 'delete'

export interface GraphNode {
  id: string
  name: string
  x: number
  y: number
  lat?: number
  lng?: number
}

export interface GraphEdge {
  id: string
  a: string
  b: string
  w: number
}

export interface Graph {
  nodes: GraphNode[]
  edges: GraphEdge[]
  directed: boolean
}

let counter = 0

/** Identificador estable y único para nodos/aristas (evita usar índices). */
export function uid(prefix = 'id'): string {
  counter += 1
  return `${prefix}_${Date.now().toString(36)}_${counter}`
}

/** Devuelve el siguiente nombre libre: A, B, ... Z, N1, N2... */
export function nextName(nodes: GraphNode[]): string {
  const used = new Set(nodes.map((n) => n.name.trim().toUpperCase()))
  for (let i = 0; i < 26; i++) {
    const candidate = String.fromCharCode(65 + i)
    if (!used.has(candidate)) return candidate
  }
  let n = 1
  while (used.has(`N${n}`)) n++
  return `N${n}`
}

export function findEdge(graph: Graph, a: string, b: string): GraphEdge | undefined {
  return graph.edges.find(
    (e) => (e.a === a && e.b === b) || (!graph.directed && e.a === b && e.b === a),
  )
}

export function edgePathId(graph: Graph, a: string, b: string): string | undefined {
  return findEdge(graph, a, b)?.id
}

export function cloneGraph(graph: Graph): Graph {
  return {
    directed: graph.directed,
    nodes: graph.nodes.map((n) => ({ ...n })),
    edges: graph.edges.map((e) => ({ ...e })),
  }
}

export const EMPTY_GRAPH: Graph = { nodes: [], edges: [], directed: true }
