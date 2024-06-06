<script setup lang="ts">
import MainTable from "@/components/MainTable.vue"
import { calculateWinner } from "@/helpers";
import { reactive } from "vue";

const gridData = reactive(Array(9).fill(0).map(() => Array(9).fill(undefined)))

const state = reactive<{
  xIsNext: boolean
  nextGrid: number
  hovered: [number, number]
  opponentHovered: [number, number]
  wins: (string | '')[]
  winner: string
  history: { player: string, grid: number, pos: number }[]
  inputAllowed: boolean
}>({
  xIsNext: true,
  nextGrid: -1,
  hovered: [-1, -1],
  opponentHovered: [-1, -1],
  wins: Array(9).fill(''),
  winner: '',
  history: [],
  inputAllowed: false
})

const handleClick = (grid: number, pos: number) => {
  if (
    gridData[grid][pos] || //Grid has been taken
    (state.nextGrid !== -1 && state.nextGrid !== grid) //Allowed to play in grid
  ) return
  console.log('clicked', grid, pos)
  gridData[grid][pos] = state.xIsNext ? "X" : "O"
  state.xIsNext = !state.xIsNext
  state.nextGrid = state.wins[pos] ? -1 : pos
  state.hovered = [-1, -1]
  const winner = calculateWinner(gridData[grid]) //Check winner for smaller grids
  if (winner) state.wins[grid] = winner
  if (state.wins[state.nextGrid]) state.nextGrid = -1 //If last move in a capture is in the captured grid, opponent gets to choose anywhere

  const overAllWinner = calculateWinner(state.wins)
  if (overAllWinner) state.winner = overAllWinner

  state.history.push({ player: state.xIsNext ? "O" : "X", grid, pos })
}
</script>

<template>
  <main class="main">
    <MainTable @clicked="handleClick" :grid-data="gridData" :state="state" />
  </main>
</template>

<style>
.main {
  margin-left: auto;
  margin-right: auto;
  width: max-content;
  margin-top: 10vh;
}
</style>