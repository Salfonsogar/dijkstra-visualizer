import type { Graph } from './graph'

export type StepKind = 'init' | 'select' | 'relax' | 'skip' | 'done'

/**
 * Fotografía inmutable del estado del algoritmo en un instante.
 * `dist`, `prev` y `seen` van indexados por el orden de `graph.nodes`.
 */
export interface Step {
  kind: StepKind
  dist: number[]
  prev: number[]
  seen: boolean[]
  /** Cola de prioridad: nodos alcanzables aún sin fijar, ordenados por distancia. */
  frontier: number[]
  /** Nodo que se está procesando (-1 si ninguno). */
  current: number
  /** Índice de la arista que se relaja (-1 si ninguna). */
  edge: number
  from: number
  to: number
  /** Distancia previa del destino antes de la comparación. */
  previous: number
  /** Distancia alternativa calculada (dist[u] + peso). */
  alt: number
  /** Número de nodos pendientes de fijar. */
  pending: number
}

export interface Simulation {
  /** ids de nodo en el mismo orden que los índices de los pasos. */
  nodeIds: string[]
  source: number
  steps: Step[]
}

const INF = Number.POSITIVE_INFINITY

/**
 * Ejecuta Dijkstra y devuelve la lista completa de pasos (snapshots), lista
 * para reproducirse hacia delante y hacia atrás sin recalcular nada.
 */
export function dijkstra(graph: Graph, sourceId: string | null): Simulation | null {
  const n = graph.nodes.length
  if (!sourceId || n === 0) return null

  const nodeIds = graph.nodes.map((node) => node.id)
  const index = new Map(nodeIds.map((id, i) => [id, i]))
  const source = index.get(sourceId)
  if (source === undefined) return null

  const adjacency: { to: number; w: number; edge: number }[][] = Array.from(
    { length: n },
    () => [],
  )
  graph.edges.forEach((edge, k) => {
    const a = index.get(edge.a)
    const b = index.get(edge.b)
    if (a === undefined || b === undefined) return
    adjacency[a].push({ to: b, w: edge.w, edge: k })
    if (!graph.directed) adjacency[b].push({ to: a, w: edge.w, edge: k })
  })

  const dist = new Array<number>(n).fill(INF)
  const prev = new Array<number>(n).fill(-1)
  const seen = new Array<boolean>(n).fill(false)
  const steps: Step[] = []

  const frontierOf = () =>
    nodeIds
      .map((_, i) => i)
      .filter((i) => !seen[i] && Number.isFinite(dist[i]))
      .sort((a, b) => dist[a] - dist[b])

  const snap = (partial: Partial<Step> & { kind: StepKind }) => {
    steps.push({
      kind: partial.kind,
      dist: [...dist],
      prev: [...prev],
      seen: [...seen],
      frontier: frontierOf(),
      current: partial.current ?? -1,
      edge: partial.edge ?? -1,
      from: partial.from ?? -1,
      to: partial.to ?? -1,
      previous: partial.previous ?? 0,
      alt: partial.alt ?? 0,
      pending: seen.filter((value) => !value).length,
    })
  }

  dist[source] = 0
  snap({ kind: 'init' })

  for (;;) {
    let u = -1
    for (let i = 0; i < n; i++) {
      if (!seen[i] && Number.isFinite(dist[i]) && (u < 0 || dist[i] < dist[u])) u = i
    }
    if (u < 0) break

    seen[u] = true
    snap({ kind: 'select', current: u })

    for (const { to, w, edge } of adjacency[u]) {
      if (seen[to]) continue
      const alt = dist[u] + w
      const previous = dist[to]
      if (alt < previous) {
        dist[to] = alt
        prev[to] = u
        snap({ kind: 'relax', current: u, edge, from: u, to, previous, alt })
      } else {
        snap({ kind: 'skip', current: u, edge, from: u, to, previous, alt })
      }
    }
  }

  snap({ kind: 'done' })
  return { nodeIds, source, steps }
}

/** Reconstruye el camino origen → destino a partir de una foto final. */
export function reconstructPath(step: Step, target: number): number[] {
  if (target < 0 || !Number.isFinite(step.dist[target])) return []
  const path: number[] = []
  const visited = new Set<number>()
  let v = target
  while (v !== -1 && !visited.has(v)) {
    visited.add(v)
    path.unshift(v)
    v = step.prev[v]
  }
  return path
}

/** Conjuntos de ids en el camino óptimo, para resaltar en las vistas. */
export function pathSets(
  graph: Graph,
  nodeIds: string[],
  step: Step | null,
  targetIndex: number,
): { nodes: Set<string>; edges: Set<string> } {
  const nodes = new Set<string>()
  const edges = new Set<string>()
  if (!step) return { nodes, edges }
  const path = reconstructPath(step, targetIndex)
  for (let i = 0; i < path.length; i++) {
    nodes.add(nodeIds[path[i]])
    if (i > 0) {
      const a = nodeIds[path[i - 1]]
      const b = nodeIds[path[i]]
      const edge = graph.edges.find(
        (e) => (e.a === a && e.b === b) || (!graph.directed && e.a === b && e.b === a),
      )
      if (edge) edges.add(edge.id)
    }
  }
  return { nodes, edges }
}
