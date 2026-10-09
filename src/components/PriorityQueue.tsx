import type { Graph } from '../lib/graph'
import type { Step } from '../lib/dijkstra'

interface PriorityQueueProps {
  step: Step | null
  graph: Graph
  unit?: string
}

export function PriorityQueue({ step, graph, unit = '' }: PriorityQueueProps) {
  if (!step) {
    return <p className="empty-note">La cola se llena al iniciar la simulación.</p>
  }

  const dist = (value: number) => (Number.isFinite(value) ? `${value}${unit}` : '∞')

  return (
    <div className="queue">
      {step.kind === 'select' && (
        <div className="queue-item current">
          <span className="qname">
            <span className="queue-rank">★</span>
            {graph.nodes[step.current]?.name}
          </span>
          <span className="qdist">{dist(step.dist[step.current])} · mínimo</span>
        </div>
      )}

      {step.frontier.length === 0 ? (
        <p className="empty-note">
          {step.kind === 'select'
            ? 'No quedan más nodos en la cola.'
            : 'Cola vacía: no hay nodos alcanzables pendientes.'}
        </p>
      ) : (
        step.frontier.map((nodeIndex, rank) => (
          <div key={graph.nodes[nodeIndex].id} className="queue-item">
            <span className="qname">
              <span className="queue-rank">{rank + 1}</span>
              {graph.nodes[nodeIndex].name}
            </span>
            <span className="qdist">{dist(step.dist[nodeIndex])}</span>
          </div>
        ))
      )}
    </div>
  )
}
