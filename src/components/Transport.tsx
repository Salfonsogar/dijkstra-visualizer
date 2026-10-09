import type { SimulationController } from '../hooks/useSimulation'
import { First, Last, Next, Pause, Play, Prev } from './icons'

export function Transport({
  controller,
  disabled,
}: {
  controller: SimulationController
  disabled?: boolean
}) {
  const { index, total, playing, speed, setSpeed, atStart, atEnd } = controller
  const max = Math.max(0, total - 1)

  return (
    <div className="transport">
      <input
        type="range"
        min={0}
        max={max}
        value={index}
        onChange={(event) => controller.goTo(Number(event.target.value))}
        disabled={disabled || total <= 1}
        aria-label="Progreso de la simulación"
      />
      <div className="transport-btns">
        <button type="button" className="tbtn" onClick={controller.first} disabled={disabled || atStart} title="Ir al inicio (Home)">
          <First />
        </button>
        <button type="button" className="tbtn" onClick={controller.prev} disabled={disabled || atStart} title="Paso anterior (←)">
          <Prev />
        </button>
        <button
          type="button"
          className={`tbtn play ${playing ? 'playing' : ''}`}
          onClick={controller.toggle}
          disabled={disabled || total <= 1}
          title={playing ? 'Pausar (Espacio)' : 'Reproducir (Espacio)'}
          aria-label={playing ? 'Pausar' : 'Reproducir'}
        >
          {playing ? <Pause /> : <Play />}
        </button>
        <button type="button" className="tbtn" onClick={controller.next} disabled={disabled || atEnd} title="Paso siguiente (→)">
          <Next />
        </button>
        <button type="button" className="tbtn" onClick={controller.last} disabled={disabled || atEnd} title="Ir al final (End)">
          <Last />
        </button>
      </div>
      <div className="progress-row">
        <span className="step-counter">
          {total ? index + 1 : 0} / {total}
        </span>
        <input
          type="range"
          min={0.5}
          max={3}
          step={0.5}
          value={speed}
          onChange={(event) => setSpeed(Number(event.target.value))}
          disabled={disabled}
          aria-label="Velocidad de reproducción"
          style={{ flex: 1 }}
        />
        <span className="step-counter">{speed}×</span>
      </div>
    </div>
  )
}
