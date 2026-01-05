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
    ky.get('/mzq/output.json', {
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
    gsap.set(mzq.current, { scale: 1 / n.current, x: '0%', y: '0%' })
  }, [current])


  function onClick(i: number) {
    setClicked(i)
    const r = Math.floor(i / n.current)
    const c = i % n.current
    console.log({ i, r, c, n: n.current })
    gsap.to(mzq.current, {
      x: `${-c * 100}%`,
      y: `${-r * 100}%`,
      scale: 1,
      duration: 4,
      ease: "power2.in",
      onComplete: () => {
        setCurrent(tiles[i])
        setClicked(-1)
      }
    })
  }

  if (prog < 100) return <main style={{ color: 'white' }}>Loading... {prog.toFixed(2)}%</main>

  return <main>
    <div style={{ position: 'relative', overflow: 'hidden' }}>
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
                      src={`normalized/${tt}.avif`}
                      alt=""
                    />
                  )
                }
              </Mozyq>

              : <img
                key={i}
                className="tile"
                src={`normalized/${name}.avif`}
                onClick={() => onClick(i)}
              />
          )}
      </Mozyq>
    </div>
  </main>
}
