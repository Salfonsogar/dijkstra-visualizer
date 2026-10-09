import { useMemo, useState } from 'react'
import { MapView } from '../components/MapView'
import { SimulatorShell } from '../components/SimulatorShell'
import { Toolbar } from '../components/Toolbar'
import { useEndpoints } from '../hooks/useEndpoints'
import { useGraph } from '../hooks/useGraph'
import { useSimulation } from '../hooks/useSimulation'
import { pathSets } from '../lib/dijkstra'
import { haversineKm } from '../lib/geo'
import type { GraphNode, Tool } from '../lib/graph'
import { citiesGraph } from '../lib/presets'

const TOOLS: Tool[] = ['move', 'node', 'edge', 'delete']

const HINTS: Record<Tool, string> = {
  move: 'Arrastra un marcador para mover la ciudad: las distancias de sus conexiones se recalculan solas.',
  node: 'Haz clic en el mapa para añadir una nueva ciudad o punto.',
  edge: 'Haz clic en dos marcadores para conectarlos. El peso es la distancia en línea recta (km).',
  weight: '',
  delete: 'Haz clic en un marcador o en una línea para eliminarlo.',
}

function distance(a: GraphNode, b: GraphNode): number {
  if (a.lat == null || a.lng == null || b.lat == null || b.lng == null) return 0
  return haversineKm({ lat: a.lat, lng: a.lng }, { lat: b.lat, lng: b.lng })
}

export function MapGraphView() {
  const initial = useMemo(() => citiesGraph(), [])
  const [graph, actions] = useGraph(initial)
  const [tool, setTool] = useState<Tool>('move')

  const cartagenaId = initial.nodes.find((node) => node.name === 'Cartagena')?.id
  const { sourceId, targetId, setSourceId, setTargetId } = useEndpoints(
    graph,
    initial.nodes[0]?.id,
    cartagenaId,
  )
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

  const handleConnect = (a: string, b: string) => {
    const nodeA = graph.nodes.find((node) => node.id === a)
    const nodeB = graph.nodes.find((node) => node.id === b)
    if (!nodeA || !nodeB) return
    actions.addEdge(a, b, distance(nodeA, nodeB))
  }

  const rename = (id: string) => {
    const node = graph.nodes.find((item) => item.id === id)
    if (!node) return
    const name = window.prompt('Nombre del lugar', node.name)
    if (name) actions.renameNode(id, name)
  }

  return (
    <SimulatorShell
      graph={graph}
      unit=" km"
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
            onClear={actions.clear}
            onRestore={() => actions.replace(citiesGraph())}
            restoreLabel="Red de ejemplo"
          />
          <p className="hint" style={{ margin: '10px 0 0' }}>
            {HINTS[tool]}
          </p>
        </>
      }
    >
      <div className="panel flush">
        <MapView
          graph={graph}
          step={step}
          sourceId={sourceId}
          targetId={targetId}
          pathNodes={pathNodes}
          pathEdges={pathEdges}
          tool={tool}
          unit=" km"
          onAddNode={(lat, lng) => actions.addNode({ lat, lng })}
          onMove={(id, lat, lng) => {
            actions.moveNode(id, { lat, lng })
            actions.reweightEdges(distance)
          }}
          onConnect={handleConnect}
          onDeleteNode={actions.removeNode}
          onDeleteEdge={actions.removeEdge}
          onRename={rename}
        />
      </div>
    </SimulatorShell>
  )
}
