import { useEffect } from 'react'
import type { ReactNode } from 'react'
import type { Graph } from '../lib/graph'
import type { SimulationController } from '../hooks/useSimulation'
import { DistanceTable } from './DistanceTable'
import { Legend } from './Legend'
import { Narration } from './Narration'
import { PriorityQueue } from './PriorityQueue'
import { Pseudocode } from './Pseudocode'
import { ResultPanel } from './ResultPanel'
import { StepLog } from './StepLog'
import { Transport } from './Transport'

interface SimulatorShellProps {
  graph: Graph
  unit?: string
  sourceId: string | null
  targetId: string | null
  onSourceChange: (id: string) => void
  onTargetChange: (id: string) => void
  controller: SimulationController
  pathNodes: Set<string>
  toolbar: ReactNode
  children: ReactNode
}

function Panel({ title, extra, children }: { title: string; extra?: ReactNode; children: ReactNode }) {
  return (
    <section className="panel">
      <div className="panel-title">
        <span>{title}</span>
        {extra}
      </div>
      {children}
    </section>
  )
}

export function SimulatorShell({
  graph,
  unit = '',
  sourceId,
  targetId,
  onSourceChange,
  onTargetChange,
  controller,
  pathNodes,
  toolbar,
  children,
}: SimulatorShellProps) {
  const { simulation, step, index } = controller
  const source = simulation?.source ?? 0

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null
      if (target && ['INPUT', 'SELECT', 'TEXTAREA', 'BUTTON'].includes(target.tagName)) return
      switch (event.key) {
        case 'ArrowRight':
          controller.next()
          event.preventDefault()
          break
        case 'ArrowLeft':
          controller.prev()
          event.preventDefault()
          break
        case ' ':
          controller.toggle()
          event.preventDefault()
          break
        case 'Home':
          controller.first()
          break
        case 'End':
          controller.last()
          break
        default:
          break
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  return (
    <div className="sim-shell">
      <div className="sim-main">
        <div className="panel">{toolbar}</div>
        {children}
        <Narration step={step} graph={graph} source={source} unit={unit} />
        <div className="panel">
          <Legend />
        </div>
      </div>

      <aside className="sim-side">
        <Panel title="Origen y destino">
          <div className="selects">
            <label className="select-field">
              <span>Origen</span>
              <select value={sourceId ?? ''} onChange={(event) => onSourceChange(event.target.value)}>
                {graph.nodes.map((node) => (
                  <option key={node.id} value={node.id}>
                    {node.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="select-field">
              <span>Destino</span>
              <select value={targetId ?? ''} onChange={(event) => onTargetChange(event.target.value)}>
                {graph.nodes.map((node) => (
                  <option key={node.id} value={node.id}>
                    {node.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </Panel>

        <Panel title="Reproducción">
          <Transport controller={controller} disabled={!simulation} />
        </Panel>

        <Panel title="Cola de prioridad" extra={<span className="count">menor dist. primero</span>}>
          <PriorityQueue step={step} graph={graph} unit={unit} />
        </Panel>

        <Panel title="Distancias y predecesores">
          <DistanceTable step={step} graph={graph} unit={unit} pathNodes={pathNodes} />
        </Panel>

        <Panel title="Pseudocódigo">
          <Pseudocode kind={step?.kind ?? null} />
        </Panel>

        <Panel title="Paso a paso">
          <StepLog
            steps={simulation?.steps ?? []}
            index={index}
            graph={graph}
            source={source}
            unit={unit}
          />
        </Panel>

        <ResultPanel
          simulation={simulation}
          index={index}
          targetId={targetId}
          graph={graph}
          unit={unit}
        />
      </aside>
    </div>
  )
}
