export interface GameState {
    xIsNext: boolean
    nextGrid: number
    hovered: [number, number]
    opponentHovered: [number, number]
    wins: (string | '')[]
    winner: string
    history: { player: string, grid: number, pos: number }[]
    inputAllowed: boolean
}