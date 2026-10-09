const ITEMS = [
  { color: 'var(--primary-2)', label: 'Origen' },
  { color: 'var(--state-cur)', label: 'Nodo actual' },
  { color: 'var(--state-seen)', label: 'Visitado (fijo)' },
  { color: 'var(--state-frontier)', label: 'En cola' },
  { color: 'var(--state-path)', label: 'Camino mínimo' },
  { color: 'var(--state-edge)', label: 'Arista sin usar' },
]

export function Legend() {
  return (
    <div className="legend" aria-label="Leyenda de colores">
      {ITEMS.map((item) => (
        <span className="legend-item" key={item.label}>
          <span className="dot" style={{ background: item.color }} />
          {item.label}
        </span>
      ))}
    </div>
  )
}
