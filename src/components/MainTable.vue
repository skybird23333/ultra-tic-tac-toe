<script setup lang="ts">
import SmallTable from '@/components/SmallTable.vue';
import { provide, reactive } from 'vue';
import { calculateWinner } from '@/helpers';

const { state, gridData } = defineProps<{
    state: {
        xIsNext: boolean
        nextGrid: number
        hovered: [number, number]
        opponentHovered: [number, number]
        wins: (string | '')[]
        winner: string
        history: { player: string, grid: number, pos: number }[]
        inputAllowed: boolean
    },
    gridData: string[][]
}>()

const emit = defineEmits<{
    (e: 'clicked', grid: number, pos: number): void
}>()

const handleClick = (grid: number, pos: number) => {
    emit('clicked', grid, pos)
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
                            @hovered="(pos: number) => { state.hovered = [i * 3 + j, pos] }"
                            :isActive="state.inputAllowed && !state.winner && (state.nextGrid == -1 || state.nextGrid == i * 3 + j)"
                            :isHovered="state.hovered[1] == i * 3 + j" :winner="state.wins[i * 3 + j]"
                            :lastMove="(state.history[state.history.length - 1]?.grid == i * 3 + j) ? state.history[state.history.length - 1]?.pos : undefined"
                            :opponentHoverPos="state.opponentHovered[0] == i * 3 + j ? state.opponentHovered[1] : undefined">
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