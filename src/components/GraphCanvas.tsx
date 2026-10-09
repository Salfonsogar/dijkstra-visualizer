import { useEffect, useMemo, useRef, useState } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'
import type { Graph, Tool } from '../lib/graph'
import type { Step } from '../lib/dijkstra'

const NODE_R = 22

interface GraphCanvasProps {
  graph: Graph
  step: Step | null
  sourceId: string | null
  targetId: string | null
  pathNodes: Set<string>
  pathEdges: Set<string>
  tool: Tool
  weight: number
  unit?: string
  editable?: boolean
  onAddNode: (x: number, y: number) => void
  onMove: (id: string, x: number, y: number) => void
  onConnect: (a: string, b: string) => void
  onDeleteNode: (id: string) => void
  onDeleteEdge: (id: string) => void
  onApplyWeight: (id: string) => void
  onRename: (id: string) => void
}

export function GraphCanvas({
  graph,
  step,
  sourceId,
  targetId,
  pathNodes,
  pathEdges,
  tool,
  unit = '',
  editable = true,
  onAddNode,
  onMove,
  onConnect,
  onDeleteNode,
  onDeleteEdge,
  onApplyWeight,
  onRename,
}: GraphCanvasProps) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const dragId = useRef<string | null>(null)
  const [size, setSize] = useState({ w: 0, h: 0 })
  const [pendingId, setPendingId] = useState<string | null>(null)

  useEffect(() => {
    const element = wrapRef.current
    if (!element) return
    const measure = () => setSize({ w: element.clientWidth, h: element.clientHeight })
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    setPendingId(null)
  }, [tool])

  const indexById = useMemo(() => {
    const map = new Map<string, number>()
    graph.nodes.forEach((node, index) => map.set(node.id, index))
    return map
  }, [graph.nodes])

  const pos = (id: string) => {
    const node = graph.nodes.find((n) => n.id === id)
    return { x: (node?.x ?? 0.5) * size.w, y: (node?.y ?? 0.5) * size.h }
  }

  const toLocal = (event: { clientX: number; clientY: number }) => {
    const rect = svgRef.current?.getBoundingClientRect()
    if (!rect || rect.width === 0 || rect.height === 0) return null
    return { x: event.clientX - rect.left, y: event.clientY - rect.top, w: rect.width, h: rect.height }
  }

  const handleBackgroundDown = (event: ReactPointerEvent<SVGRectElement>) => {
    if (!editable || tool !== 'node') return
    const local = toLocal(event)
    if (!local) return
    onAddNode(local.x / local.w, local.y / local.h)
  }

  const handleNodeDown = (event: ReactPointerEvent, id: string) => {
    event.stopPropagation()

    if (tool === 'move') {
      dragId.current = id
      try {
        svgRef.current?.setPointerCapture(event.pointerId)
      } catch {
        /* captura opcional */
      }
      return
    }
    if (!editable) return

    if (tool === 'edge') {
      if (!pendingId) setPendingId(id)
      else if (pendingId === id) setPendingId(null)
      else {
        onConnect(pendingId, id)
        setPendingId(null)
      }
    } else if (tool === 'delete') {
      onDeleteNode(id)
    }
  }

  const handlePointerMove = (event: ReactPointerEvent) => {
    const id = dragId.current
    if (!id) return
    const local = toLocal(event)
    if (!local) return
    const x = Math.min(0.97, Math.max(0.03, local.x / local.w))
    const y = Math.min(0.95, Math.max(0.05, local.y / local.h))
    onMove(id, x, y)
  }

  const endDrag = () => {
    dragId.current = null
  }

  const handleEdgeDown = (event: ReactPointerEvent, id: string) => {
    event.stopPropagation()
    if (!editable) return
    if (tool === 'delete') onDeleteEdge(id)
    else if (tool === 'weight') onApplyWeight(id)
  }

  const cursor =
    tool === 'node'
      ? 'crosshair'
      : tool === 'delete'
        ? 'pointer'
        : tool === 'edge'
          ? 'pointer'
          : 'default'

  return (
    <div className="canvas-wrap" ref={wrapRef}>
      {graph.nodes.length === 0 && editable && (
        <div className="canvas-empty">
          <div>
            <strong>Tu grafo está vacío.</strong>
            <p>Selecciona la herramienta «Nodo» y haz clic aquí para crear el primero.</p>
          </div>
        </div>
      )}
      <svg
        ref={svgRef}
        className="graph-svg"
        width={size.w}
        height={size.h}
        viewBox={`0 0 ${size.w || 1} ${size.h || 1}`}
        style={{ cursor }}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
      >
        <rect x={0} y={0} width={size.w} height={size.h} fill="transparent" onPointerDown={handleBackgroundDown} />

        {graph.edges.map((edge, edgeIndex) => {
          const a = pos(edge.a)
          const b = pos(edge.b)
          const isPath = pathEdges.has(edge.id)
          const isHot = step?.edge === edgeIndex
          const cls = isPath ? 'path' : isHot ? 'hot' : ''
          const mx = (a.x + b.x) / 2
          const my = (a.y + b.y) / 2
          const angle = Math.atan2(b.y - a.y, b.x - a.x)
          const ax = b.x - Math.cos(angle) * (NODE_R + 3)
          const ay = b.y - Math.sin(angle) * (NODE_R + 3)
          const spread = 0.42
          const len = 11

          return (
            <g key={edge.id}>
              <line className={`edge ${cls}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} />
              {graph.directed && (
                <polygon
                  className={`arrow ${cls}`}
                  points={[
                    `${ax},${ay}`,
                    `${ax - Math.cos(angle - spread) * len},${ay - Math.sin(angle - spread) * len}`,
                    `${ax - Math.cos(angle + spread) * len},${ay - Math.sin(angle + spread) * len}`,
                  ].join(' ')}
                />
              )}
              <text className="edge-label" x={mx} y={my}>
                {edge.w}
              </text>
              <line
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke="transparent"
                strokeWidth={16}
                style={{ cursor: editable && (tool === 'delete' || tool === 'weight') ? 'pointer' : 'default' }}
                onPointerDown={(event) => handleEdgeDown(event, edge.id)}
                onDoubleClick={() => editable && onApplyWeight(edge.id)}
              />
            </g>
          )
        })}

        {graph.nodes.map((node) => {
          const point = pos(node.id)
          const index = indexById.get(node.id) ?? -1
          const isSource = node.id === sourceId
          const isTarget = node.id === targetId
          const isPath = pathNodes.has(node.id)
          const isCurrent = !!step && step.kind !== 'done' && step.current === index
          const isSeen = !!step && step.seen[index]
          const isFrontier = !!step && step.frontier.includes(index)

          let fill = 'var(--surface)'
          let text = 'var(--text)'
          let stroke = 'var(--primary-2)'
          if (isPath) {
            fill = 'var(--state-path)'
            text = '#fff'
            stroke = 'var(--state-path)'
          } else if (isCurrent) {
            fill = 'var(--state-cur)'
            text = '#3b2500'
            stroke = 'var(--state-cur)'
          } else if (isSeen) {
            fill = 'var(--state-seen)'
            text = '#04231a'
            stroke = 'var(--state-seen)'
          } else if (isFrontier) {
            stroke = 'var(--state-frontier)'
          }

          const distLabel =
            step !== null
              ? Number.isFinite(step.dist[index])
                ? `${step.dist[index]}${unit}`
                : '∞'
              : null

          return (
            <g
              key={node.id}
              className={`node-group ${tool === 'move' ? 'draggable' : ''}`}
              transform={`translate(${point.x}, ${point.y})`}
              onPointerDown={(event) => handleNodeDown(event, node.id)}
              onDoubleClick={() => editable && onRename(node.id)}
            >
              {isSource && <circle className="halo source" r={NODE_R + 7} />}
              {isTarget && <circle className="halo target" r={NODE_R + 7} />}
              {pendingId === node.id && <circle className="halo pending" r={NODE_R + 7} />}
              {isFrontier && !isSeen && !isCurrent && (
                <circle className="halo frontier" r={NODE_R + 7} />
              )}
              <circle className="node-circle" r={NODE_R} fill={fill} stroke={stroke} />
              <text className="node-name" fill={text}>
                {node.name}
              </text>
              {distLabel !== null && (
                <text className="node-dist" y={-NODE_R - 11}>
                  {distLabel}
                </text>
              )}
            </g>
          )
        })}
      </svg>
    </div>
  )
}
