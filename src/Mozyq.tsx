import { Children, type ReactNode } from "react"

interface Props {
    main: string
    zoom: boolean
    x: number
    y: number
    transition: boolean
    children: ReactNode
}

export default function Mozyq({ main, zoom, x, y, transition, children }: Props) {
    const n = Math.round(Math.sqrt(Children.count(children)))
    const ox = (x + x / (n - 1)) * (100 / n)
    const oy = (y + y / (n - 1)) * (100 / n)

    return <div
        className={["mozyq", transition ? '' : 'no-transition'].join(' ')}
        style={{
            transformOrigin: `${ox}% ${oy}%`,
            transform: `scale(${zoom ? n : 1})`,
        }}
    >
        <img className="main" src={`norm/${main}.avif`} />

        <div className="grid" style={{
            gridTemplateColumns: `repeat(${n}, 1fr)`,
            gridTemplateRows: `repeat(${n}, 1fr)`,
        }}>
            {children}
        </div>
    </div>
}