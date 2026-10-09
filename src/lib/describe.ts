import type { Graph } from './graph'
import type { Step } from './dijkstra'

const INFINITY = '∞'

/** Frase humana del paso actual. Los tramos entre ** se resaltan en la UI. */
export function describeStep(
  step: Step,
  graph: Graph,
  source: number,
  unit = '',
): string {
  const name = (i: number) => graph.nodes[i]?.name ?? '?'
  const dist = (value: number) => (Number.isFinite(value) ? `${value}${unit}` : INFINITY)
  const weight = step.edge >= 0 ? (graph.edges[step.edge]?.w ?? 0) : 0

  switch (step.kind) {
    case 'init':
      return `Se fija **dist(${name(source)}) = 0** y el resto en ${INFINITY}. Todos los nodos entran en la cola de prioridad.`
    case 'select':
      return `**Extraer mínimo:** ${name(step.current)}, con distancia tentativa **${dist(step.dist[step.current])}**. Al ser el menor de la cola, se fija como definitivo.`
    case 'relax':
      return `**Relajar ${name(step.from)} → ${name(step.to)}:** ${dist(step.dist[step.from])} + ${weight} = **${dist(step.alt)}** < ${dist(step.previous)} → mejora. Se actualizan dist(${name(step.to)}) y su predecesor a ${name(step.from)}.`
    case 'skip':
      return `**Sin mejora en ${name(step.from)} → ${name(step.to)}:** ${dist(step.dist[step.from])} + ${weight} = **${dist(step.alt)}** ≥ ${dist(step.previous)}. Se conserva el camino actual.`
    case 'done':
      return `**Fin del algoritmo.** No quedan nodos alcanzables por procesar; las distancias mínimas quedaron fijadas.`
    default:
      return ''
  }
}

export function kindLabel(kind: Step['kind']): string {
  switch (kind) {
    case 'init':
      return 'Inicio'
    case 'select':
      return 'Extraer'
    case 'relax':
      return 'Mejora'
    case 'skip':
      return 'Descarte'
    case 'done':
      return 'Fin'
    default:
      return ''
  }
}
