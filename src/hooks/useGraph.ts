import { useCallback, useState } from 'react'
import type { Graph, GraphNode } from '../lib/graph'
import { cloneGraph, nextName, uid } from '../lib/graph'

export interface GraphActions {
  addNode: (coords?: Partial<GraphNode>) => string
  removeNode: (id: string) => void
  renameNode: (id: string, name: string) => void
  moveNode: (id: string, coords: Partial<GraphNode>) => void
  addEdge: (a: string, b: string, w: number) => void
  removeEdge: (id: string) => void
  setEdgeWeight: (id: string, w: number) => void
  reweightEdges: (weight: (a: GraphNode, b: GraphNode) => number) => void
  setDirected: (directed: boolean) => void
  clear: () => void
  replace: (graph: Graph) => void
}

/** Estado del grafo con operaciones inmutables basadas en ids estables. */
export function useGraph(initial: Graph): [Graph, GraphActions] {
  const [graph, setGraph] = useState<Graph>(initial)

  const addNode = useCallback((coords: Partial<GraphNode> = {}) => {
    const id = uid('n')
    setGraph((current) => {
      const node: GraphNode = {
        id,
        name: coords.name?.trim() || nextName(current.nodes),
        x: coords.x ?? 0.5,
        y: coords.y ?? 0.5,
        lat: coords.lat,
        lng: coords.lng,
      }
      return { ...current, nodes: [...current.nodes, node] }
    })
    return id
  }, [])

  const removeNode = useCallback((id: string) => {
    setGraph((current) => ({
      ...current,
      nodes: current.nodes.filter((node) => node.id !== id),
      edges: current.edges.filter((edge) => edge.a !== id && edge.b !== id),
    }))
  }, [])

  const renameNode = useCallback((id: string, name: string) => {
    const clean = name.trim()
    if (!clean) return
    setGraph((current) => ({
      ...current,
      nodes: current.nodes.map((node) =>
        node.id === id ? { ...node, name: clean } : node,
      ),
    }))
  }, [])

  const moveNode = useCallback((id: string, coords: Partial<GraphNode>) => {
    setGraph((current) => ({
      ...current,
      nodes: current.nodes.map((node) =>
        node.id === id ? { ...node, ...coords } : node,
      ),
    }))
  }, [])

  const addEdge = useCallback((a: string, b: string, w: number) => {
    if (a === b) return
    const weight = Math.max(0, w)
    setGraph((current) => {
      const existing = current.edges.find(
        (edge) =>
          (edge.a === a && edge.b === b) ||
          (!current.directed && edge.a === b && edge.b === a),
      )
      if (existing) {
        return {
          ...current,
          edges: current.edges.map((edge) =>
            edge.id === existing.id ? { ...edge, w: weight } : edge,
          ),
        }
      }
      return { ...current, edges: [...current.edges, { id: uid('e'), a, b, w: weight }] }
    })
  }, [])

  const removeEdge = useCallback((id: string) => {
    setGraph((current) => ({
      ...current,
      edges: current.edges.filter((edge) => edge.id !== id),
    }))
  }, [])

  const setEdgeWeight = useCallback((id: string, w: number) => {
    const weight = Math.max(0, w)
    setGraph((current) => ({
      ...current,
      edges: current.edges.map((edge) => (edge.id === id ? { ...edge, w: weight } : edge)),
    }))
  }, [])

  const reweightEdges = useCallback((weight: (a: GraphNode, b: GraphNode) => number) => {
    setGraph((current) => {
      const byId = new Map(current.nodes.map((node) => [node.id, node]))
      return {
        ...current,
        edges: current.edges.map((edge) => {
          const a = byId.get(edge.a)
          const b = byId.get(edge.b)
          return a && b ? { ...edge, w: weight(a, b) } : edge
        }),
      }
    })
  }, [])

  const setDirected = useCallback((directed: boolean) => {
    setGraph((current) => ({ ...current, directed }))
  }, [])

  const clear = useCallback(() => {
    setGraph((current) => ({ ...current, nodes: [], edges: [] }))
  }, [])

  const replace = useCallback((next: Graph) => {
    setGraph(cloneGraph(next))
  }, [])

  return [
    graph,
    {
      addNode,
      removeNode,
      renameNode,
      moveNode,
      addEdge,
      removeEdge,
      setEdgeWeight,
      reweightEdges,
      setDirected,
      clear,
      replace,
    },
  ]
}
