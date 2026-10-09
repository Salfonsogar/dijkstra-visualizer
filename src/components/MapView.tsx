import { useEffect, useMemo, useState } from 'react'
import { MapContainer, Marker, Polyline, TileLayer, Tooltip, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { Graph, GraphNode, Tool } from '../lib/graph'
import type { Step } from '../lib/dijkstra'

const DEFAULT_CENTER: [number, number] = [4.6, -74.1]
const DEFAULT_ZOOM = 6

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => {
    switch (char) {
      case '&':
        return '&amp;'
      case '<':
        return '&lt;'
      case '>':
        return '&gt;'
      case '"':
        return '&quot;'
      default:
        return '&#39;'
    }
  })
}

interface AddLayerProps {
  enabled: boolean
  onAdd: (lat: number, lng: number) => void
}

function AddLayer({ enabled, onAdd }: AddLayerProps) {
  useMapEvents({
    click(event) {
      if (enabled) onAdd(event.latlng.lat, event.latlng.lng)
    },
  })
  return null
}

interface MapViewProps {
  graph: Graph
  step: Step | null
  sourceId: string | null
  targetId: string | null
  pathNodes: Set<string>
  pathEdges: Set<string>
  tool: Tool
  unit?: string
  editable?: boolean
  onAddNode: (lat: number, lng: number) => void
  onMove: (id: string, lat: number, lng: number) => void
  onConnect: (a: string, b: string) => void
  onDeleteNode: (id: string) => void
  onDeleteEdge: (id: string) => void
  onRename: (id: string) => void
}

export function MapView({
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
  onRename,
}: MapViewProps) {
  const [pendingId, setPendingId] = useState<string | null>(null)

  useEffect(() => {
    setPendingId(null)
  }, [tool])

  const indexById = useMemo(() => {
    const map = new Map<string, number>()
    graph.nodes.forEach((node, index) => map.set(node.id, index))
    return map
  }, [graph.nodes])

  const center = useMemo<[number, number]>(() => {
    const located = graph.nodes.filter((node) => node.lat != null && node.lng != null)
    if (located.length === 0) return DEFAULT_CENTER
    const lat = located.reduce((sum, node) => sum + (node.lat ?? 0), 0) / located.length
    const lng = located.reduce((sum, node) => sum + (node.lng ?? 0), 0) / located.length
    return [lat, lng]
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [graph.nodes.length])

  const markers = graph.nodes
    .filter((node) => node.lat != null && node.lng != null)
    .map((node) => {
      const index = indexById.get(node.id) ?? -1
      const isPath = pathNodes.has(node.id)
      const isCurrent = !!step && step.kind !== 'done' && step.current === index
      const isSeen = !!step && step.seen[index]
      const isFrontier = !!step && step.frontier.includes(index)
      let cls = ''
      if (isPath) cls = 'path'
      else if (isCurrent) cls = 'cur'
      else if (isSeen) cls = 'seen'
      else if (isFrontier) cls = 'frontier'
      if (node.id === sourceId) cls += ' src'
      if (node.id === targetId) cls += ' target'
      if (pendingId === node.id) cls += ' frontier'
      const dist = step
        ? Number.isFinite(step.dist[index])
          ? `${step.dist[index]}${unit}`
          : '∞'
        : ''
      return { node, cls, dist }
    })

  const signature = markers.map((m) => `${m.node.id}:${m.cls}:${m.dist}:${m.node.name}`).join('|')

  const icons = useMemo(() => {
    const map = new Map<string, L.DivIcon>()
    for (const { node, cls, dist } of markers) {
      map.set(
        node.id,
        L.divIcon({
          className: '',
          iconSize: [0, 0],
          html: `<div class="mk ${cls}">${escapeHtml(node.name)}${dist ? `<small>${dist}</small>` : ''}</div>`,
        }),
      )
    }
    return map
    // Recalcula solo cuando cambia la firma visual de los marcadores.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signature])

  const handleNodeClick = (id: string) => {
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

  const coord = (node: GraphNode): [number, number] => [node.lat ?? 0, node.lng ?? 0]

  return (
    <div className="map-wrap">
      <MapContainer center={center} zoom={DEFAULT_ZOOM} scrollWheelZoom style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap"
          maxZoom={18}
        />
        <AddLayer enabled={editable && tool === 'node'} onAdd={onAddNode} />

        {graph.edges.map((edge) => {
          const a = graph.nodes.find((node) => node.id === edge.a)
          const b = graph.nodes.find((node) => node.id === edge.b)
          if (!a || !b || a.lat == null || b.lat == null) return null
          const isPath = pathEdges.has(edge.id)
          const isHot = step ? graph.edges[step.edge]?.id === edge.id : false
          const color = isPath ? '#f43f5e' : isHot ? '#f59e0b' : '#94a3b8'
          const weight = isPath || isHot ? 6 : 3
          return (
            <Polyline
              key={edge.id}
              positions={[coord(a), coord(b)]}
              pathOptions={{ color, weight, opacity: 0.9 }}
              eventHandlers={{
                click: () => {
                  if (editable && tool === 'delete') onDeleteEdge(edge.id)
                },
              }}
            >
              <Tooltip permanent direction="center" className="wl">
                {edge.w} km
              </Tooltip>
            </Polyline>
          )
        })}

        {markers.map(({ node }) => (
          <Marker
            key={node.id}
            position={coord(node)}
            icon={icons.get(node.id)}
            draggable={tool === 'move'}
            eventHandlers={{
              dragend: (event) => {
                const latlng = (event.target as L.Marker).getLatLng()
                onMove(node.id, latlng.lat, latlng.lng)
              },
              click: () => handleNodeClick(node.id),
              dblclick: () => editable && onRename(node.id),
            }}
          />
        ))}
      </MapContainer>
    </div>
  )
}
