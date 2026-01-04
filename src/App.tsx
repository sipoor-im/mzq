import ky from "ky"
import { useEffect, useState } from "react"

export default function App() {
  const [prog, setProg] = useState(0)
  const [data, setData] = useState<{ [key: string]: string[] }>()

  useEffect(() => {
    ky.get('/output.json', {
      onDownloadProgress: (progress) => {
        setProg(progress.percent * 100)
      }
    }).json().then((data) => {
      setData(data as any)
    })
  }, [])

  function isData(data: any): data is { [key: string]: string[] } {
    return data && typeof data === 'object'
  }

  if (!isData(data)) return <main>Loading... {prog.toFixed(2)}%</main>


  return <main>{Object.keys(data)[0]}</main>
}
