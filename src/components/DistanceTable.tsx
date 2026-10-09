import type { Graph } from '../lib/graph'
import type { Step } from '../lib/dijkstra'

interface DistanceTableProps {
  step: Step | null
  graph: Graph
  unit?: string
  pathNodes: Set<string>
}

type Status = { label: string; cls: string }

function statusFor(
  nodeId: string,
  index: number,
  step: Step,
  frontier: Set<number>,
  pathNodes: Set<string>,
): Status {
  if (pathNodes.has(nodeId)) return { label: 'Camino', cls: 'path' }
  if (step.kind !== 'done' && step.current === index) return { label: 'Actual', cls: 'current' }
  if (step.seen[index]) return { label: 'Fijado', cls: 'seen' }
  if (frontier.has(index)) return { label: 'En cola', cls: 'frontier' }
  return { label: 'Sin visitar', cls: 'unseen' }
}

export function DistanceTable({ step, graph, unit = '', pathNodes }: DistanceTableProps) {
  if (!step) return <p className="empty-note">Aún no hay distancias calculadas.</p>

  const frontier = new Set(step.frontier)

  return (
    <div className="table-scroll">
      <table className="dist">
        <thead>
          <tr>
            <th>Nodo</th>
            <th>Distancia</th>
            <th>Padre</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {graph.nodes.map((node, index) => {
            const status = statusFor(node.id, index, step, frontier, pathNodes)
            const rowClass =
              status.cls === 'current' ? 'is-current' : status.cls === 'path' ? 'is-path' : ''
            return (
              <tr key={node.id} className={rowClass}>
                <td>
                  <strong>{node.name}</strong>
                </td>
                <td className="mono">
                  {Number.isFinite(step.dist[index]) ? `${step.dist[index]}${unit}` : '∞'}
                </td>
                <td>{step.prev[index] >= 0 ? graph.nodes[step.prev[index]].name : '—'}</td>
                <td>
                  <span className={`state-badge ${status.cls}`}>{status.label}</span>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
