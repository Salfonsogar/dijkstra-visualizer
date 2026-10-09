import type { Tool } from '../lib/graph'
import { Gauge, Link, Move, Plus, Refresh, Trash } from './icons'

const TOOL_META: Record<Tool, { label: string; title: string; Icon: typeof Move }> = {
  move: { label: 'Mover', title: 'Arrastra los nodos para reubicarlos', Icon: Move },
  node: { label: 'Nodo', title: 'Haz clic en el lienzo para crear un nodo', Icon: Plus },
  edge: { label: 'Arista', title: 'Clic en un nodo y luego en otro para conectarlos', Icon: Link },
  weight: { label: 'Peso', title: 'Clic en una arista para aplicarle el peso indicado', Icon: Gauge },
  delete: { label: 'Borrar', title: 'Clic en un nodo o arista para eliminarlo', Icon: Trash },
}

interface ToolbarProps {
  tool: Tool
  onToolChange: (tool: Tool) => void
  tools?: Tool[]
  weight?: number
  onWeightChange?: (weight: number) => void
  directed?: boolean
  onDirectedChange?: (directed: boolean) => void
  onClear?: () => void
  onRestore?: () => void
  restoreLabel?: string
}

export function Toolbar({
  tool,
  onToolChange,
  tools = ['move', 'node', 'edge', 'weight', 'delete'],
  weight,
  onWeightChange,
  directed,
  onDirectedChange,
  onClear,
  onRestore,
  restoreLabel = 'Restaurar',
}: ToolbarProps) {
  return (
    <div className="toolbar">
      <div className="tool-group" role="group" aria-label="Herramientas de edición">
        {tools.map((item) => {
          const { label, title, Icon } = TOOL_META[item]
          return (
            <button
              key={item}
              type="button"
              className={`tool ${tool === item ? 'active' : ''}`}
              title={title}
              aria-pressed={tool === item}
              onClick={() => onToolChange(item)}
            >
              <Icon size={15} />
              {label}
            </button>
          )
        })}
      </div>

      <div className="spacer" />

      {weight !== undefined && onWeightChange && (
        <label className="field">
          Peso
          <input
            type="number"
            min={0}
            step={1}
            value={weight}
            onChange={(event) => onWeightChange(Math.max(0, Number(event.target.value)))}
          />
        </label>
      )}

      {directed !== undefined && onDirectedChange && (
        <label className="switch" title="Alternar entre grafo dirigido y no dirigido">
          <input
            type="checkbox"
            checked={directed}
            onChange={(event) => onDirectedChange(event.target.checked)}
          />
          Dirigido
        </label>
      )}

      {onRestore && (
        <button type="button" className="icon-btn" onClick={onRestore} title="Volver al estado inicial">
          <Refresh size={16} />
          {restoreLabel}
        </button>
      )}

      {onClear && (
        <button type="button" className="icon-btn" onClick={onClear} title="Eliminar todos los nodos y aristas">
          <Trash size={16} />
          Limpiar
        </button>
      )}
    </div>
  )
}
