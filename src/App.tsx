import ky from "ky"
import { useEffect, useRef, useState } from "react"
import Mozyq from "./Mozyq"

export default function App() {
  const [prog, setProg] = useState(0)

  const [current, setCurrent] = useState<string>()
  const [tiles, setTiles] = useState<string[]>([])
  const [clicked, setClicked] = useState<number>(-1)
  const [x, setX] = useState(0)
  const [y, setY] = useState(0)
  const [transition, setTransition] = useState(true)

  const data = useRef<{ [key: string]: string[] }>(null)
  const n = useRef<number>(-1)

  useEffect(() => {
    ky.get('output.json', {
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
    if (clicked !== -1) return
    setX(0)
    setY(0)
  }, [clicked])

  useEffect(() => {
    if (current === undefined) return
    setTiles(data.current![current])
    setClicked(-1)
  }, [current])


  function onClick(i: number) {
    setClicked(i)
    const r = Math.floor(i / n.current)
    const c = i % n.current
    setX(c)
    setY(r)
    console.log({ i, r, c, n: n.current })
    setTimeout(() => {
      setTransition(false)
      setCurrent(tiles[i])
      setClicked(-1)
      setTimeout(() => {
        setTransition(true)
      }, 100)
    }, 1_000)
  }

  if (prog < 100) return <main style={{ color: 'white' }}>Loading... {prog.toFixed(2)}%</main>

  return <main>
    <div className={["container", clicked === -1 ? '' : 'zooming'].join(' ')}>
      <Mozyq main={current!} zoom={clicked !== -1} x={x} y={y} transition={transition}>
        {
          tiles.map((name, i) =>
            i === clicked
              // MOZYQ
              ? <Mozyq key={i} main={name} zoom={false} x={0} y={0} transition={false}>
                {
                  data.current![name].map((tt, ii) =>
                    <img
                      key={ii}
                      className="tile"
                      src={`norm/${tt}.small.avif`}
                      alt=""
                    />
                  )
                }
              </Mozyq>

              : <img
                key={i}
                className="tile"
                src={`norm/${name}.small.avif`}
                onClick={
                  clicked === -1
                    ? () => onClick(i)
                    : undefined
                }
              />
          )}
      </Mozyq>
    </div>
  </main>
}
