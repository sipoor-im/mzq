import ky from "ky"
import { useEffect, useRef, useState } from "react"
import Mozyq from "./Mozyq"

export default function App() {
  const [prog, setProg] = useState(0)

  const [current, setCurrent] = useState<string>()
  const [tiles, setTiles] = useState<string[]>([])
  const [clicked, setClicked] = useState<number>(-1)

  const data = useRef<{ [key: string]: string[] }>(null)
  const n = useRef<number>(-1)

  useEffect(() => {
    ky.get('/output.json', {
      onDownloadProgress: (progress) => {
        setProg(progress.percent * 100)
      }
    }).json().then((d) => {
      data.current = d as any
      const k = Object.keys(d as any)[0]
      n.current = Math.round(Math.sqrt((d as any)[k].length))
      setCurrent(k)
    })
  }, [])

  useEffect(() => {
    if (current === undefined) return
    const tiles = data.current![current]
    setTiles(tiles)
  }, [current])


  function onClick(name: string, i: number) {
    console.log("CLICK", name, i)
    setClicked(i)
  }

  if (prog < 100) return <main>Loading... {prog.toFixed(2)}%</main>

  return <main>
    <h1>{clicked}</h1>
    <div style={{ border: '1px solid red', position: 'relative', overflow: 'hidden' }}>
      <Mozyq main={current!} >
        {
          tiles.map((name, i) =>
            i === clicked
              // MOZYQ
              ? <Mozyq key={i} main={name} >
                {
                  data.current![name].map((tt, ii) =>
                    <img
                      key={ii}
                      className="tile"
                      src={`normalized/${tt}`}
                      alt=""
                    />
                  )
                }
              </Mozyq>

              : <img
                key={i}
                className="tile"
                src={`normalized/${name}`}
                onClick={() => onClick(name, i)} />
          )}
      </Mozyq>
    </div>
  </main>
}
