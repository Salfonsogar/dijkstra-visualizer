import { useEffect, useRef } from 'react'
import type { Graph } from '../lib/graph'
import type { Step } from '../lib/dijkstra'
import { describeStep } from '../lib/describe'
import { Rich } from './Rich'

interface StepLogProps {
  steps: Step[]
  index: number
  graph: Graph
  source: number
  unit?: string
}

export function StepLog({ steps, index, graph, source, unit }: StepLogProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = ref.current
    if (element) element.scrollTop = element.scrollHeight
  }, [index])

  if (steps.length === 0) {
    return <p className="empty-note">La bitácora aparecerá al iniciar la simulación.</p>
  }

  return (
    <div className="log" ref={ref}>
      {steps.slice(0, index + 1).map((step, i) => (
        <div key={i} className={`log-entry k-${step.kind} ${i === index ? 'active' : ''}`}>
          <Rich text={describeStep(step, graph, source, unit)} />
        </div>
      ))}
    </div>
  )
}
