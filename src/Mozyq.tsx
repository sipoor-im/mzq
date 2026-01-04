import { Children, type ReactNode } from "react"

interface Props {
    main: string
    children: ReactNode
}

export default function Mozyq({ main, children }: Props) {
    const n = Math.round(Math.sqrt(Children.count(children)))

    return <div className="mozyq">
        <img src={`normalized/${main}`} alt="" />
        <div className="grid" style={{
            gridTemplateColumns: `repeat(${n}, 1fr)`,
            gridTemplateRows: `repeat(${n}, 1fr)`,
            transform: `scale(${1 / n})`,
        }}>
            {children}
        </div>
    </div>
}