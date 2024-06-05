<script setup lang="ts">
import { inject } from 'vue';


const emit = defineEmits<{
    (e: 'clicked', pos: number): void
    (e: 'hovered', pos: number): void
}>()

const { grid, isActive, isHovered, winner, lastMove } = defineProps(['grid', 'isActive', 'isHovered', 'winner', 'lastMove'])


const handleClick = (pos: number) => {
    emit('clicked', pos)
}

const handleHover = (pos: number) => {
    emit('hovered', pos)
}
</script>

<template>
    <div class="table-container">
        <div class="overlay">
            <div class="tutorial-text" v-if="isHovered && !winner">
                Your opponent plays here next.
            </div>
            <div class="tutorial-text warn" v-if="isHovered && winner">
                Your opponent will be free to play in any grid.
            </div>
            <div class="winner-text" v-if="!isHovered && winner">
                {{ winner }}
            </div>
        </div>
        <div class="playfield">
            <table class="small-table">
                <tr v-for="i in [0, 1, 2]" key="i">
                    <td v-for="j in [0, 1, 2]" key="j" @click="handleClick(i * 3 + j)"
                        @mouseenter="handleHover(i * 3 + j)" @mouseleave="emit('hovered', -1)" :class="{
                disabled: grid[i * 3 + j] || !isActive || winner,
                last: lastMove === i * 3 + j
            }">
                        {{ grid[i * 3 + j] }}
                    </td>
                </tr>
            </table>
        </div>
    </div>
</template>

<style>
.table-container {
    position: relative;
    z-index: 1;
}

.slot {
    filter: brightness(0.6) grayscale(1);
}

.overlay {
    position: absolute;
    width: 100%;
    height: 100%;
    pointer-events: none
}

.tutorial-text {
    width: 120px;
    color: #fff;
    background: gray;
    text-align: center;
    border-radius: 6px;
    padding: 5px 0;
    position: absolute;
    z-index: 1;
    bottom: 25%;
    left: 50%;
    margin-left: -60px;
}

.tutorial-text.warn {
    background: darkgoldenrod;
}

.winner-text {
    width: 120px;
    color: white;
    font-size: 128px;
    text-align: center;
    font-weight: lighter;
    border-radius: 6px;
    padding: 5px 0;
    position: absolute;
    z-index: 1;
    top: -20%;
    left: 50%;
    margin-left: -60px;
}

.playfield.hovered {
    background-color: lightblue;
    z-index: 10;
}

.small-table {

    th,
    td {
        height: 48px;
        width: 48px;
        background-color: #333;
        border: 1px solid #555;
        margin-right: -1px;
        margin-top: -1px;
        padding: 0;
        line-height: 16px;
        font-size: 32px;
        text-align: center;
        float: left;
        user-select: none;
    }

    td.disabled,
    td.disabled:hover,
    td.disabled:active {
        background-color: #222;
        border: 1px solid #000;
        pointer-events: none;
    }

    td.last {
        background-color: rgba(255, 255, 0, 0.2);
        border: 1px solid #000;
        pointer-events: none;
    }

    th,
    td:hover {
        background-color: #444;
        border: 1px solid #555;
    }

    th,
    td:active {
        background-color: #222;
        border: 1px solid #555;
    }
}
</style>