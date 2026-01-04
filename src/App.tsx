import gsap from "gsap"
import ky from "ky"
import { useEffect, useRef, useState } from "react"
import Mozyq from "./Mozyq"

export default function App() {
  const [prog, setProg] = useState(0)

  const [current, setCurrent] = useState<string>()
  const [tiles, setTiles] = useState<string[]>([])
  const [clicked, setClicked] = useState<number>(-1)

  const mzq = useRef<HTMLDivElement>(null)
  const data = useRef<{ [key: string]: string[] }>(null)
  const n = useRef<number>(-1)

  useEffect(() => {
    ky.get('/output.json', {
      onDownloadProgress: (progress) => {
        setProg(progress.percent * 100)
      }
    }).json().then((d) => {
      data.current = d as any
      const ts = Object.keys(d as any)
      const k = ts[0]
      n.current = Math.round(Math.sqrt(data.current![k].length))
      setCurrent(k)
    })
  }, [])

  useEffect(() => {
    if (current === undefined) return
    const tiles = data.current![current]
    setTiles(tiles)
  }, [current])


  function onClick(i: number) {
    setClicked(i)
    const r = Math.round(i / n.current)
    const c = i % n.current
    console.log({ i, r, c, n: n.current })
    gsap.to(mzq.current, {
      x: `${-c * 100}%`,
      y: `${-r * 100}%`,
      scale: 1,
      duration: 2,
      ease: "power2.inOut"
    })
  }

  if (prog < 100) return <main>Loading... {prog.toFixed(2)}%</main>

  return <main>
    <div style={{ border: '1px solid red', position: 'relative', overflow: 'hidden' }}>
      <Mozyq ref={mzq} main={current!} >
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
                onClick={() => onClick(i)}
              />
          )}
      </Mozyq>
    </div>
  </main>
}
