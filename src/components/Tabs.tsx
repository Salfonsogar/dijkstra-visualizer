export interface TabItem {
  id: string
  label: string
  index: string
}

interface TabsProps {
  tabs: TabItem[]
  active: string
  onChange: (id: string) => void
}

export function Tabs({ tabs, active, onChange }: TabsProps) {
  return (
    <nav className="tabs" role="tablist" aria-label="Secciones">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={active === tab.id}
          className={`tab ${active === tab.id ? 'active' : ''}`}
          onClick={() => onChange(tab.id)}
        >
          <span className="tab-index">{tab.index}</span>
          {tab.label}
        </button>
      ))}
    </nav>
  )
}
