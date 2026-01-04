import gsap from "gsap"
import ky from "ky"
import { useEffect, useRef, useState } from "react"

export default function App() {
  const [prog, setProg] = useState(0)
  const [data, setData] = useState<{ [key: string]: string[] }>()
  const [current, setCurrent] = useState<string>()
  const [tiles, setTiles] = useState<string[]>([])
  const [n, setN] = useState(0)

  const grid = useRef<HTMLDivElement>(null)

  useEffect(() => {
    ky.get('/output.json', {
      onDownloadProgress: (progress) => {
        setProg(progress.percent * 100)
      }
    }).json().then((data) => {
      setData(data as any)
      setCurrent(Object.keys(data as any)[0])
    })
  }, [])

  useEffect(() => {
    if (current === undefined) return
    const tiles = data![current]
    setTiles(tiles)
    setN(Math.round(Math.sqrt(tiles.length)))
  }, [current])

  function isData(data: any): data is { [key: string]: string[] } {
    return data && typeof data === 'object'
  }

  function onClick(i: number) {
    // setCurrent(tiles[i])
    const r = Math.floor(i / n)
    const c = i % n
    gsap.to(grid.current, {
      scale: 1,
      translateX: `-${c * 100}%`,
      translateY: `-${r * 100}%`,
      duration: 3,
      onComplete: () => {
        setCurrent(tiles[i])
        gsap.set(grid.current, {
          scale: 1 / n,
          translateX: '0%',
          translateY: '0%',
        })
      }
    })
  }

  if (!isData(data)) return <main>Loading... {prog.toFixed(2)}%</main>


  return <main>
    <div style={{ border: '1px solid red', position: 'relative', overflow: 'hidden' }}>
      <img src={`normalized/${current}`} alt="" />
      <div id='grid' ref={grid} style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        top: 0,
        left: 0,
        border: '1px solid blue',
        display: 'grid',
        gridTemplateColumns: `repeat(${n}, 1fr)`,
        gridTemplateRows: `repeat(${n}, 1fr)`,
        transformOrigin: 'top left',
        transform: `scale(${1 / n})`,
      }}>
        {
          tiles!.map((name, i) =>
            <img
              key={name}
              className="tile"
              src={`normalized/${name}`}
              onClick={() => onClick(i)} />
          )
        }
      </div>
    </div>
  </main>
}
