import { useCallback, useEffect } from 'react'
import { useLocalStorage } from './useLocalStorage'

type Theme = 'light' | 'dark'

function preferredTheme(): Theme {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function useTheme() {
  const [theme, setTheme] = useLocalStorage<Theme>('dijkstra:theme', preferredTheme())

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const toggle = useCallback(() => {
    setTheme((current) => (current === 'light' ? 'dark' : 'light'))
  }, [setTheme])

  return { theme, toggle }
}
