<script setup lang="ts">
import SmallTable from '@/components/SmallTable.vue';
import { provide, reactive } from 'vue';

const gridData = reactive(Array(9).fill(0).map(() => Array(9).fill(undefined)))

console.log(gridData)

const state = reactive<{
    xIsNext: boolean
    nextGrid: number
    hoveredGrid: number
    wins: (string | '')[]
    winner: string
    history: { player: string, grid: number, pos: number }[]
}>({
    xIsNext: true,
    nextGrid: -1,
    hoveredGrid: -1,
    wins: Array(9).fill(''),
    winner: '',
    history: []
})

/**
 * Stolen from react example
 * @param squares The grid
 */
function calculateWinner(squares: string[]) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        } else if (squares.every((x) => x)) return "?" //Draw
    }
    return null;
}
const handleClick = (grid: number, pos: number) => {
    if (
        gridData[grid][pos] || //Grid has been taken
        (state.nextGrid !== -1 && state.nextGrid !== grid) //Allowed to play in grid
    ) return
    console.log('clicked', grid, pos)
    gridData[grid][pos] = state.xIsNext ? "X" : "O"
    state.xIsNext = !state.xIsNext
    state.nextGrid = state.wins[pos] ? -1 : pos
    state.hoveredGrid = -1
    const winner = calculateWinner(gridData[grid]) //Check winner for smaller grids
    if (winner) state.wins[grid] = winner
    if (state.wins[state.nextGrid]) state.nextGrid = -1 //If last move in a capture is in the captured grid, opponent gets to choose anywhere

    const overAllWinner = calculateWinner(state.wins)
    if (overAllWinner) state.winner = overAllWinner

    state.history.push({ player: state.xIsNext ? "X" : "O", grid, pos })
}
</script>

<template>
    <div style="display: flex;">

        <div>
            <div class=" nextplayer-text" :class='state.winner ? "W" : state.xIsNext ? "X" : "O"'>
                <b v-if="!state.winner">
                    {{ state.xIsNext ? "X" : "O" }} To Play
                </b>
                <b v-else>
                    {{ state.winner }} wins!
                </b>
            </div>
            <table class="main-table">
                <tr v-for="i in [0, 1, 2]" key="i">
                    <td v-for="j in [0, 1, 2]" key="j">
                        <SmallTable :grid="gridData[i * 3 + j]"
                            @clicked="(pos: number) => (handleClick(i * 3 + j, pos))"
                            @hovered="(pos: number) => { state.hoveredGrid = pos }"
                            :isActive="!state.winner && (state.nextGrid == -1 || state.nextGrid == i * 3 + j)"
                            :isHovered="state.hoveredGrid == i * 3 + j" :winner="state.wins[i * 3 + j]"
                            :lastMove="(state.history[state.history.length - 1]?.grid == i * 3 + j) ? state.history[state.history.length - 1]?.pos : undefined">
                        </SmallTable>
                    </td>
                </tr>
            </table>
        </div>

        <ul style="max-height: 500px; overflow-y: auto; width: 250px;">
            <h2>History</h2>
            <li v-for="move in state.history" :key="move.grid * 9 + move.pos"
                :style="{ fontWeight: move === state.history[state.history.length - 1] ? 'bold' : 'normal' }">
                {{ move.player }}: Grid ({{ Math.floor(move.grid / 3) }}, {{ move.grid % 3 }}) Pos ({{
                Math.floor(move.pos / 3) }}, {{ move.pos % 3 }})
            </li>
        </ul>

    </div>
</template>

<style>
.nextplayer-text {
    font-size: xx-large;
    padding: 5px;
}

.nextplayer-text.O {
    text-align: right;
}

.nextplayer-text.W {
    text-align: center;
}

.main-table {
    border-collapse: collapse;

    th,
    td {
        padding: 10px;
        border: 1px solid #555;
    }
}
</style>