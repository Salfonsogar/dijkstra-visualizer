import { useEffect, useMemo, useState } from 'react'
import { GraphCanvas } from '../components/GraphCanvas'
import { SimulatorShell } from '../components/SimulatorShell'
import { Toolbar } from '../components/Toolbar'
import { useEndpoints } from '../hooks/useEndpoints'
import { useGraph } from '../hooks/useGraph'
import { useSimulation } from '../hooks/useSimulation'
import { pathSets } from '../lib/dijkstra'
import type { Graph, Tool } from '../lib/graph'
import { editorGraph } from '../lib/presets'

const HINTS: Record<Tool, string> = {
  move: 'Arrastra los nodos para reubicarlos. Puedes combinar esta herramienta con las demás.',
  node: 'Haz clic en un espacio vacío para crear un nodo. Doble clic sobre un nodo para renombrarlo.',
  edge: 'Elige el peso abajo, luego haz clic en un nodo y en otro para crear la arista. Si ya existía, se actualiza.',
  weight: 'Escribe un peso y haz clic en una arista para actualizarlo (o doble clic sobre la arista).',
  delete: 'Haz clic en un nodo o en una arista para eliminarlo.',
}

const STORAGE_KEY = 'dijkstra:editor'

function loadEditor(): Graph | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Graph
    if (!Array.isArray(parsed.nodes) || !Array.isArray(parsed.edges)) return null
    return parsed
  } catch {
    return null
  }
}

export function EditorView() {
  const initial = useMemo(() => loadEditor() ?? editorGraph(), [])
  const [graph, actions] = useGraph(initial)
  const [tool, setTool] = useState<Tool>('move')
  const [weight, setWeight] = useState(1)

  const { sourceId, targetId, setSourceId, setTargetId } = useEndpoints(graph)
  const controller = useSimulation(graph, sourceId)
  const { step, simulation } = controller

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(graph))
    } catch {
      /* almacenamiento no disponible */
    }
  }, [graph])

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
            weight={weight}
            onWeightChange={setWeight}
            directed={graph.directed}
            onDirectedChange={actions.setDirected}
            onClear={actions.clear}
            onRestore={() => actions.replace(editorGraph())}
            restoreLabel="Ejemplo"
          />
          <p className="hint" style={{ margin: '10px 0 0' }}>
            {HINTS[tool]}
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
          onAddNode={(x, y) => actions.addNode({ x, y })}
          onMove={(id, x, y) => actions.moveNode(id, { x, y })}
          onConnect={(a, b) => actions.addEdge(a, b, weight)}
          onDeleteNode={actions.removeNode}
          onDeleteEdge={actions.removeEdge}
          onApplyWeight={(id) => actions.setEdgeWeight(id, weight)}
          onRename={rename}
        />
      </div>
    </SimulatorShell>
  )
}
