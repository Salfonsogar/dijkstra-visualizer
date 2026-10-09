import { useMemo, useState } from 'react'
import { GraphCanvas } from '../components/GraphCanvas'
import { SimulatorShell } from '../components/SimulatorShell'
import { Toolbar } from '../components/Toolbar'
import { useEndpoints } from '../hooks/useEndpoints'
import { useGraph } from '../hooks/useGraph'
import { useSimulation } from '../hooks/useSimulation'
import { pathSets } from '../lib/dijkstra'
import type { Tool } from '../lib/graph'
import { simpleGraph } from '../lib/presets'

const TOOLS: Tool[] = ['move', 'weight']

const HINTS: Record<Tool, string> = {
  move: 'Arrastra los nodos para reorganizar el grafo. También puedes ajustar los pesos para ver cómo cambia la ruta.',
  node: '',
  edge: '',
  weight: 'Escribe un peso y haz clic en una arista para experimentar (o doble clic sobre la arista).',
  delete: '',
}

export function ExampleView() {
  const initial = useMemo(() => simpleGraph(), [])
  const [graph, actions] = useGraph(initial)
  const [tool, setTool] = useState<Tool>('move')
  const [weight, setWeight] = useState(1)

  const { sourceId, targetId, setSourceId, setTargetId } = useEndpoints(graph)
  const controller = useSimulation(graph, sourceId)
  const { step, simulation } = controller

  const targetIndex = simulation && targetId ? simulation.nodeIds.indexOf(targetId) : -1
  const { nodes: pathNodes, edges: pathEdges } = useMemo(
    () =>
      step?.kind === 'done'
        ? pathSets(graph, simulation?.nodeIds ?? [], step, targetIndex)
        : { nodes: new Set<string>(), edges: new Set<string>() },
    [graph, simulation, step, targetIndex],
  )

  const rename = (id: string) => {
    const node = graph.nodes.find((item) => item.id === id)
    if (!node) return
    const name = window.prompt('Nombre del nodo', node.name)
    if (name) actions.renameNode(id, name)
  }

  return (
    <SimulatorShell
      graph={graph}
      sourceId={sourceId}
      targetId={targetId}
      onSourceChange={setSourceId}
      onTargetChange={setTargetId}
      controller={controller}
      pathNodes={pathNodes}
      toolbar={
        <>
          <Toolbar
            tool={tool}
            onToolChange={setTool}
            tools={TOOLS}
            weight={weight}
            onWeightChange={setWeight}
            onRestore={() => actions.replace(simpleGraph())}
            restoreLabel="Reiniciar ejemplo"
          />
          <p className="hint" style={{ margin: '10px 0 0' }}>
            Es el mismo grafo del ejemplo clásico (A→B 4, A→C 1, C→B 2, B→D 1, C→D 5) con dos nodos
            extra. {HINTS[tool]}
          </p>
        </>
      }
    >
      <div className="panel">
        <GraphCanvas
          graph={graph}
          step={step}
          sourceId={sourceId}
          targetId={targetId}
          pathNodes={pathNodes}
          pathEdges={pathEdges}
          tool={tool}
          weight={weight}
          onAddNode={() => undefined}
          onMove={(id, x, y) => actions.moveNode(id, { x, y })}
          onConnect={() => undefined}
          onDeleteNode={() => undefined}
          onDeleteEdge={() => undefined}
          onApplyWeight={(id) => actions.setEdgeWeight(id, weight)}
          onRename={rename}
        />
      </div>
    </SimulatorShell>
  )
}
