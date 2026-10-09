import type { Graph } from '../lib/graph'
import type { Simulation } from '../lib/dijkstra'
import { reconstructPath } from '../lib/dijkstra'

interface ResultPanelProps {
  simulation: Simulation | null
  index: number
  targetId: string | null
  graph: Graph
  unit?: string
}

export function ResultPanel({ simulation, index, targetId, graph, unit = '' }: ResultPanelProps) {
  if (!simulation || !targetId) return null

  const target = simulation.nodeIds.indexOf(targetId)
  const done = index >= simulation.steps.length - 1

  if (!done) {
    return (
      <div className="panel">
        <div className="panel-title">Resultado</div>
        <p className="empty-note">
          Ejecuta hasta el final (⏭) para descubrir la ruta más corta y su costo total.
        </p>
      </div>
    )
  }

  const last = simulation.steps[simulation.steps.length - 1]
  const path = reconstructPath(last, target)

  if (target < 0 || path.length === 0) {
    return (
      <div className="result unreachable">
        <span className="result-label">Sin conexión</span>
        <div className="result-path">
          No existe un camino desde el origen hasta {graph.nodes[target]?.name ?? 'el destino'}.
        </div>
      </div>
    )
  }

  const names = path.map((nodeIndex) => graph.nodes[nodeIndex].name)

  return (
    <div className="result">
      <span className="result-label">Ruta más corta</span>
      <div className="result-path">
        {names.map((name, i) => (
          <span key={i}>
            {i > 0 && <span className="arrow"> → </span>}
            {name}
          </span>
        ))}
      </div>
      <div className="result-cost">
        Costo total: <strong>{last.dist[target]}{unit}</strong> · {path.length} nodos
      </div>
    </div>
  )
}
