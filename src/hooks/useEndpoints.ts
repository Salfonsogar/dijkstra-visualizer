import { useEffect, useState } from 'react'
import type { Graph } from '../lib/graph'

/** Mantiene origen y destino válidos aunque el grafo cambie. */
export function useEndpoints(graph: Graph, preferSource?: string, preferTarget?: string) {
  const [sourceId, setSourceId] = useState<string | null>(
    preferSource && graph.nodes.some((n) => n.id === preferSource)
      ? preferSource
      : (graph.nodes[0]?.id ?? null),
  )
  const [targetId, setTargetId] = useState<string | null>(
    preferTarget && graph.nodes.some((n) => n.id === preferTarget)
      ? preferTarget
      : (graph.nodes[graph.nodes.length - 1]?.id ?? null),
  )

  useEffect(() => {
    if (!sourceId || !graph.nodes.some((node) => node.id === sourceId)) {
      setSourceId(graph.nodes[0]?.id ?? null)
    }
  }, [graph, sourceId])

  useEffect(() => {
    if (!targetId || !graph.nodes.some((node) => node.id === targetId)) {
      setTargetId(graph.nodes[graph.nodes.length - 1]?.id ?? null)
    }
  }, [graph, targetId])

  return { sourceId, targetId, setSourceId, setTargetId }
}
