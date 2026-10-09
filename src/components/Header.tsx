import { Github, Logo, Moon, Sun } from './icons'

interface HeaderProps {
  theme: 'light' | 'dark'
  onToggleTheme: () => void
  repoUrl: string
}

export function Header({ theme, onToggleTheme, repoUrl }: HeaderProps) {
  return (
    <header className="app-header">
      <div className="brand">
        <span className="brand-logo">
          <Logo size={32} />
        </span>
        <div>
          <h1>Dijkstra Visualizer</h1>
          <p className="subtitle">
            Aprende el algoritmo de la ruta más corta con grafos interactivos, paso a paso y sobre un mapa real.
          </p>
        </div>
      </div>
      <div className="app-actions">
        <a className="icon-btn" href={repoUrl} target="_blank" rel="noreferrer" title="Ver código en GitHub">
          <Github size={17} />
          <span>GitHub</span>
        </a>
        <button
          type="button"
          className="icon-btn"
          onClick={onToggleTheme}
          title={theme === 'dark' ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
          aria-label="Cambiar tema"
        >
          {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
        </button>
      </div>
    </header>
  )
}
