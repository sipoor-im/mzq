import { Children, type ReactNode, type RefObject } from "react"

interface Props {
    main: string
    children: ReactNode
    ref?: RefObject<HTMLDivElement | null>
}

export default function Mozyq({ main, children, ref }: Props) {
    const n = Math.round(Math.sqrt(Children.count(children)))

    return <div
        ref={ref}
        className="mozyq"
        style={{
            transformOrigin: 'top left',
            transform: `scale(${1 / n})`
        }}
    >
        <img className="main" src={`normalized/${main}`} style={{
            transformOrigin: 'top left',
            transform: `scale(${n})`
        }} />
        <div className="grid" style={{
            gridTemplateColumns: `repeat(${n}, 1fr)`,
            gridTemplateRows: `repeat(${n}, 1fr)`,
        }}>
            {children}
        </div>
    </div>
}