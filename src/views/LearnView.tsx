import { Alert, Book, Info, MapIcon, Sparkles, Target } from '../components/icons'

export function LearnView() {
  return (
    <div className="learn">
      <section className="learn-hero">
        <span className="badge-pill">
          <Sparkles size={14} /> Guía rápida
        </span>
        <h2 style={{ marginTop: 12 }}>El algoritmo de Dijkstra</h2>
        <p className="lead">
          Publicado por Edsger W. Dijkstra en 1959, resuelve el problema de la <b>ruta más corta</b>{' '}
          desde un nodo origen hacia todos los demás en un grafo con pesos <b>no negativos</b>. Es un
          algoritmo <b>voraz</b> (greedy): en cada paso fija el nodo no visitado con la menor distancia
          tentativa y usa esa decisión para relajar a sus vecinos.
        </p>
        <div className="callout" style={{ marginTop: 14 }}>
          <Info />
          <div>
            <b>Intuición clave:</b> si todas las aristas pesan ≥ 0, cuando eliges el nodo con la menor
            distancia pendiente, ninguna ruta futura puede mejorarla. Por eso su distancia pasa a ser
            definitiva y el nodo se «fija».
          </div>
        </div>
      </section>

      <div className="cards">
        <article className="card">
          <h3>
            <span className="icon">
              <Target size={17} />
            </span>
            Cómo funciona
          </h3>
          <ol style={{ margin: 0, paddingLeft: 18 }}>
            <li>Asigna distancia 0 al origen e ∞ al resto.</li>
            <li>Mete todos los nodos en una cola de prioridad.</li>
            <li>Extrae el nodo de menor distancia y fíjalo.</li>
            <li>
              Para cada vecino, calcula <span className="kbd">dist[u] + peso</span> y mejóralo si es
              menor.
            </li>
            <li>Repite hasta vaciar la cola.</li>
          </ol>
        </article>

        <article className="card">
          <h3>
            <span className="icon">
              <Book size={17} />
            </span>
            Predecesores
          </h3>
          <p>
            Además de la distancia, guardamos <span className="kbd">prev[v]</span>: el nodo desde el que
            llegamos mejor a <span className="kbd">v</span>. Al terminar, retroceder por{' '}
            <span className="kbd">prev</span> reconstruye la ruta más corta.
          </p>
        </article>

        <article className="card">
          <h3>
            <span className="icon">
              <MapIcon size={17} />
            </span>
            Casos de uso
          </h3>
          <ul>
            <li>GPS y navegación por calles.</li>
            <li>Enrutamiento en redes y routers (OSPF).</li>
            <li>Mapas de videojuegos y robótica.</li>
            <li>Caminos de menor costo en logística.</li>
          </ul>
        </article>
      </div>

      <div className="learn-grid">
        <section className="card">
          <h3>Pseudocódigo</h3>
          <div className="code-block">{`función Dijkstra(G, origen):
  para cada v en G:
    dist[v] ← ∞ ; prev[v] ← nulo
  dist[origen] ← 0
  Q ← { todos los vértices }

  mientras Q no esté vacía:
    u ← vértice de Q con menor dist
    quitar u de Q
    para cada vecino v de u:
      alt ← dist[u] + peso(u, v)
      si alt < dist[v]:
        dist[v] ← alt
        prev[v] ← u

  devolver dist, prev`}</div>
        </section>

        <section className="card">
          <h3>Complejidad</h3>
          <table className="complexity-table">
            <thead>
              <tr>
                <th>Cola de prioridad</th>
                <th>Tiempo</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Arreglo / búsqueda lineal</td>
                <td className="mono">O(V²)</td>
              </tr>
              <tr>
                <td>Montículo binario (heap)</td>
                <td className="mono">O((V + E) log V)</td>
              </tr>
              <tr>
                <td>Montículo de Fibonacci</td>
                <td className="mono">O(E + V log V)</td>
              </tr>
            </tbody>
          </table>
          <p style={{ marginTop: 12, fontSize: '0.84rem' }}>
            <b>V</b> = vértices, <b>E</b> = aristas. La versión con heap es la estándar en la práctica.
          </p>
        </section>
      </div>

      <section className="card">
        <h3>
          <span className="icon">
            <Alert size={17} />
          </span>
          Cuándo NO usarlo
        </h3>
        <div className="callout warn">
          <Alert />
          <div>
            Dijkstra <b>falla con pesos negativos</b>: al fijar un nodo asume que su distancia no puede
            mejorar, y una arista negativa podría romperlo. Para pesos negativos usa{' '}
            <b>Bellman-Ford</b>; para una sola ruta entre dos puntos con heurística usa{' '}
            <b>A*</b> (que es Dijkstra + heurística).
          </div>
        </div>
      </section>

      <section className="card">
        <h3>Atajos de teclado</h3>
        <div className="cards">
          <div>
            <p>
              <span className="kbd">←</span> / <span className="kbd">→</span> paso anterior y siguiente
            </p>
          </div>
          <div>
            <p>
              <span className="kbd">Espacio</span> reproducir o pausar
            </p>
          </div>
          <div>
            <p>
              <span className="kbd">Inicio</span> / <span className="kbd">Fin</span> primer y último paso
            </p>
          </div>
        </div>
      </section>

      <div className="callout">
        <Sparkles />
        <div>
          Recorre las pestañas <b>Crea tu grafo</b>, <b>Ejemplo guiado</b> y <b>Mapa real</b> para ver el
          algoritmo avanzar sobre el grafo, la cola de prioridad y la tabla de distancias.
        </div>
      </div>
    </div>
  )
}
