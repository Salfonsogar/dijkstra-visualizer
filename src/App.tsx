import { useState } from 'react'
import { Header } from './components/Header'
import { Tabs } from './components/Tabs'
import type { TabItem } from './components/Tabs'
import { useTheme } from './hooks/useTheme'
import { EditorView } from './views/EditorView'
import { ExampleView } from './views/ExampleView'
import { LearnView } from './views/LearnView'
import { MapGraphView } from './views/MapGraphView'

const REPO_URL = 'https://github.com/Salfonsogar/dijkstra-visualizer'

const TABS: TabItem[] = [
  { id: 'learn', label: 'Aprender', index: '1' },
  { id: 'editor', label: 'Crea tu grafo', index: '2' },
  { id: 'example', label: 'Ejemplo guiado', index: '3' },
  { id: 'map', label: 'Mapa real', index: '4' },
]

export function App() {
  const { theme, toggle } = useTheme()
  const [tab, setTab] = useState('learn')

  return (
    <div className="app">
      <Header theme={theme} onToggleTheme={toggle} repoUrl={REPO_URL} />
      <Tabs tabs={TABS} active={tab} onChange={setTab} />

      {tab === 'learn' && <LearnView />}
      {tab === 'editor' && <EditorView />}
      {tab === 'example' && <ExampleView />}
      {tab === 'map' && <MapGraphView />}

      <footer className="footer">
        <span>
          Hecho con React + Vite + TypeScript · Algoritmo de Dijkstra (1959) · Inspirado en un
          visualizador original en HTML
        </span>
        <a href={REPO_URL} target="_blank" rel="noreferrer">
          github.com/Salfonsogar/dijkstra-visualizer
        </a>
      </footer>
    </div>
  )
}

export default App
