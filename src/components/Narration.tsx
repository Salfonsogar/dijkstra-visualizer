import type { Graph } from '../lib/graph'
import type { Step } from '../lib/dijkstra'
import { describeStep, kindLabel } from '../lib/describe'
import { Rich } from './Rich'

interface NarrationProps {
  step: Step | null
  graph: Graph
  source: number
  unit?: string
}

export function Narration({ step, graph, source, unit }: NarrationProps) {
  if (!step) {
    return (
      <div className="narration">
        <span className="badge">Listo</span>
        <p>
          Configura el grafo y pulsa <strong>Reproducir</strong> o <strong>Paso</strong> para
          comenzar.
        </p>
      </div>
    )
  }

  return (
    <div className={`narration kind-${step.kind}`} role="status" aria-live="polite">
      <span className="badge">{kindLabel(step.kind)}</span>
      <p>
        <Rich text={describeStep(step, graph, source, unit)} />
      </p>
    </div>
  )
}
