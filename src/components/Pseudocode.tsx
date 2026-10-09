import type { StepKind } from '../lib/dijkstra'

const LINES = [
  'función Dijkstra(G, origen):',
  '  para cada vértice v en G:',
  '    dist[v] ← ∞ ; prev[v] ← nulo',
  '  dist[origen] ← 0',
  '  Q ← { todos los vértices }',
  '  mientras Q no esté vacía:',
  '    u ← vértice de Q con menor dist',
  '    quitar u de Q',
  '    para cada vecino v de u:',
  '      alt ← dist[u] + peso(u, v)',
  '      si alt < dist[v]:',
  '        dist[v] ← alt ; prev[v] ← u',
  '  devolver dist, prev',
]

const ACTIVE: Record<StepKind, number[]> = {
  init: [1, 2, 3, 4],
  select: [5, 6, 7],
  relax: [9, 10, 11],
  skip: [9, 10],
  done: [12],
}

export function Pseudocode({ kind }: { kind: StepKind | null }) {
  const active = kind ? ACTIVE[kind] : []
  return (
    <div className="pseudo">
      {LINES.map((line, index) => (
        <div key={index} className={`pseudo-line ${active.includes(index) ? 'active' : ''}`}>
          <span className="ln">{index + 1}</span>
          <span>{line}</span>
        </div>
      ))}
    </div>
  )
}
