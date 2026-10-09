import { useCallback, useEffect, useMemo, useState } from 'react'
import type { Graph } from '../lib/graph'
import type { Simulation, Step } from '../lib/dijkstra'
import { dijkstra } from '../lib/dijkstra'

export interface SimulationController {
  simulation: Simulation | null
  step: Step | null
  index: number
  total: number
  playing: boolean
  speed: number
  atStart: boolean
  atEnd: boolean
  setSpeed: (value: number) => void
  play: () => void
  pause: () => void
  toggle: () => void
  next: () => void
  prev: () => void
  first: () => void
  last: () => void
  goTo: (index: number) => void
}

const BASE_DELAY_MS = 900

/**
 * Reproduce paso a paso una ejecución de Dijkstra. Los pasos se recalculan
 * cuando cambia el grafo y la reproducción se reinicia automáticamente.
 */
export function useSimulation(graph: Graph, sourceId: string | null): SimulationController {
  const simulation = useMemo(() => dijkstra(graph, sourceId), [graph, sourceId])
  const total = simulation?.steps.length ?? 0

  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState(1)

  useEffect(() => {
    setIndex(0)
    setPlaying(false)
  }, [simulation])

  useEffect(() => {
    if (index > total - 1) setIndex(Math.max(0, total - 1))
  }, [total, index])

  useEffect(() => {
    if (!playing) return
    if (total === 0 || index >= total - 1) {
      setPlaying(false)
      return
    }
    const timer = window.setTimeout(
      () => setIndex((current) => Math.min(current + 1, total - 1)),
      BASE_DELAY_MS / speed,
    )
    return () => window.clearTimeout(timer)
  }, [playing, index, total, speed])

  const goTo = useCallback(
    (next: number) => {
      setIndex(Math.max(0, Math.min(next, Math.max(0, total - 1))))
    },
    [total],
  )

  const play = useCallback(() => {
    if (total <= 1) return
    setIndex((current) => (current >= total - 1 ? 0 : current))
    setPlaying(true)
  }, [total])

  const toggle = useCallback(() => {
    if (playing) setPlaying(false)
    else play()
  }, [playing, play])

  const step = simulation?.steps[index] ?? null

  return {
    simulation,
    step,
    index,
    total,
    playing,
    speed,
    atStart: index <= 0,
    atEnd: total === 0 || index >= total - 1,
    setSpeed,
    play,
    pause: () => setPlaying(false),
    toggle,
    next: () => setIndex((current) => Math.min(current + 1, Math.max(0, total - 1))),
    prev: () => setIndex((current) => Math.max(current - 1, 0)),
    first: () => setIndex(0),
    last: () => setIndex(Math.max(0, total - 1)),
    goTo,
  }
}
