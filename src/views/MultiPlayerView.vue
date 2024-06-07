<script setup lang="ts">
import MainTable from "@/components/MainTable.vue"
import { computed, reactive, toRefs, watch } from "vue";
import Ably from 'ably'
import { calculateWinner, generateUsername } from '@/helpers'
import type { GameState } from "@/types";
//Sorry i cant be bothered to separate the networking

const username = generateUsername()

const mpState = reactive<{
  connected: boolean
  currentRoom: string
  host: string,
  opponent: string,
  roomInput: string,
  opponentTimeout: number,
  gameStarted: boolean,
  spectate: boolean
}>({
  connected: false,
  currentRoom: "",
  host: "", //Only valid when currentRoom is set
  spectate: false,
  opponent: "", //Only valid when currentRoom is set
  roomInput: "",
  opponentTimeout: 0,
  gameStarted: false
})

const ably = new Ably.Realtime("G2vyGQ.FuwlkA:a6bRypeOh9KTKadzkKixEuHNtp6CwmzK-GoMUgcQH9A")
// Connect to Ably with your API key
ably.connection.once("connected", () => {
  console.log("[MP] Connected to Ably")
  mpState.connected = true
})

setInterval(() => {
  if (mpState.connected) {
  }
}, 5000)

// Handle disconnection
ably.connection.once("closed", () => {
  console.log("[MP] Connection closed")
  mpState.connected = false
})

const publishGameUpdate = () => {
  const channel = ably.channels.get(mpState.currentRoom)
  channel.publish("gameUpdate", {
    xIsNext: gameState.xIsNext,
    nextGrid: gameState.nextGrid,
    wins: gameState.wins,
    winner: gameState.winner,
    history: gameState.history,
    gridData: gridData,
    timer: timer
  })
}

const registerStartGame = () => {
  // Publish hovered on change
  const channel = ably.channels.get(mpState.currentRoom)
  watch(() => gameState.hovered, () => {
    channel.publish("hovered", { grid: gameState.hovered[0], pos: gameState.hovered[1], username })
  })

  channel.subscribe("hovered", (msg) => {
    if (msg.data.username === username) return
    gameState.opponentHovered = [msg.data.grid, msg.data.pos]
  })
}

/**
 * HOW MULTIPLAYER WORKS
 * Multiplayer is based on host/peer. Host can create a room which gets a random room code. Peer joins with that room code.
 * Peer only sends input when its their turn. Host decides everything.
 * Third and so on peers can spectate.
 */

const createRoom = async () => {
  const room = Math.random().toString(36).substring(2, 8).toUpperCase()
  const channel = ably.channels.get(room)
  channel.subscribe("joinRequest", (msg) => { //Watch for join requests
    console.log("[MP] Join request", msg)

    if (mpState.opponent) {
      channel.publish("joinSpectate", {
        username: msg.data.username,
        host: mpState.host,
        opponent: mpState.opponent
      })
      if (mpState.gameStarted) {
        publishGameUpdate()
      }
      console.log("[MP] Join spectate sent")
      return
    }

    channel.publish("joinAccept", { username })
    console.log("[MP] Join accept sent")
    mpState.opponent = msg.data.username

    setInterval(() => {
      if (mpState.currentRoom) {
        const channel = ably.channels.get(mpState.currentRoom)
        if (mpState.host && mpState.opponent) {
          //Host
          channel.publish('ping', { username })
          //Expect repsonse in 3 seconds
          mpState.opponentTimeout = setTimeout(() => {
            alert("Opponent timed out")
            console.log("[MP] Opponent timed out")
            mpState.opponent = ""
          }, 3000)
        }
      }
    }, 5000)
  })
  channel.subscribe('pong', (msg) => { //Watch for pongs
    clearTimeout(mpState.opponentTimeout)
  })

  mpState.currentRoom = room
  console.log("[MP] Created room", room)
  mpState.host = username
}

const joinRoom = () => {
  const room = mpState.roomInput
  if (!room) return
  const channel = ably.channels.get(room)
  channel.publish("joinRequest", { username })
  console.log("[MP] Join request sent")

  let joinTimeout = setTimeout(() => {
    console.log("[MP] Join request timed out")
    channel.unsubscribe("joinAccept")
  }, 3000)

  channel.subscribe("joinAccept", (msg) => {
    clearTimeout(joinTimeout)
    console.log("[MP] Join accept", msg)
    mpState.currentRoom = room
    mpState.host = msg.data.username
    mpState.opponent = username

    channel.subscribe('ping', (msg) => {
      channel.publish('pong', { username })
    })

    channel.subscribe('startGame', (msg) => {
      console.log("[MP] Start game", msg)
      mpState.gameStarted = true
      registerStartGame()
    })

    channel.subscribe('gameUpdate', (msg) => {
      console.log("[MP] Game update", msg)
      //Update game state
      gameState.xIsNext = msg.data.xIsNext
      gameState.nextGrid = msg.data.nextGrid
      gameState.wins = msg.data.wins
      gameState.winner = msg.data.winner
      gameState.history = msg.data.history
      //Assign each row to grid data to get around the const issue
      gridData.forEach((row, i) => row.splice(0, row.length, ...msg.data.gridData[i]))
      gameState.inputAllowed = !mpState.spectate && (IAmHost.value ? gameState.xIsNext : !gameState.xIsNext)

      timer.host = msg.data.timer.host
      timer.opponent = msg.data.timer.opponent
    })
  })

  channel.subscribe("joinSpectate", (msg) => {
    if (msg.data.username !== username) return
    clearTimeout(joinTimeout)
    console.log("[MP] Join spectate", msg)
    mpState.currentRoom = room
    mpState.spectate = true
    mpState.host = msg.data.host
    mpState.opponent = msg.data.opponent

    channel.subscribe('startGame', (msg) => {
      console.log("[MP] Start game", msg)
      mpState.gameStarted = true
      registerStartGame()
    })

    channel.subscribe('gameUpdate', (msg) => {
      console.log("[MP] Game update", msg)
      if (!mpState.gameStarted) mpState.gameStarted = true
      //Update game state
      gameState.xIsNext = msg.data.xIsNext
      gameState.nextGrid = msg.data.nextGrid
      gameState.wins = msg.data.wins
      gameState.winner = msg.data.winner
      gameState.history = msg.data.history
      //Assign each row to grid data to get around the const issue
      gridData.forEach((row, i) => row.splice(0, row.length, ...msg.data.gridData[i]))
      gameState.inputAllowed = !mpState.spectate && (IAmHost.value ? gameState.xIsNext : !gameState.xIsNext)

      timer.host = msg.data.timer.host
      timer.opponent = msg.data.timer.opponent
    })
  })
}

const leaveRoom = () => {
  const channel = ably.channels.get(mpState.currentRoom)
  channel.detach()
  mpState.currentRoom = ""
  mpState.host = ""
  mpState.opponent = ""
}

const startGame = () => {
  const channel = ably.channels.get(mpState.currentRoom)
  channel.publish("startGame", { username })
  mpState.gameStarted = true

  channel.subscribe('input', (msg) => {
    console.log("[MP] Input received", msg)
    handleClick(msg.data.grid, msg.data.pos)
  })

  gameState.inputAllowed = true

  registerStartGame()
}

const IAmHost = computed(() => mpState.host === username)

const gridData = reactive(Array(9).fill(0).map(() => Array(9).fill(undefined)))

const gameState = reactive<GameState>({
  xIsNext: true,
  nextGrid: -1,
  hovered: [-1, -1],
  opponentHovered: [-1, -1],
  wins: Array(9).fill(''),
  winner: '',
  history: [],
  inputAllowed: false
})

const timer = reactive({
  host: 0,
  opponent: 0
})

setInterval(() => {
  if (mpState.gameStarted) {
    if (gameState.xIsNext) {
      timer.host += 1
    } else {
      timer.opponent += 1
    }
  }
}, 1000)

const handleClick = (grid: number, pos: number) => {
  console.log(gameState.inputAllowed)
  if (IAmHost.value) {
    if (
      gridData[grid][pos] || //Grid has been taken
      (gameState.nextGrid !== -1 && gameState.nextGrid !== grid) //Allowed to play in grid
    ) return
    console.log('clicked', grid, pos)
    gridData[grid][pos] = gameState.xIsNext ? "X" : "O"
    gameState.xIsNext = !gameState.xIsNext
    gameState.nextGrid = gameState.wins[pos] ? -1 : pos
    gameState.hovered = [0, 0]
    const winner = calculateWinner(gridData[grid]) //Check winner for smaller grids
    if (winner) gameState.wins[grid] = winner
    if (gameState.wins[gameState.nextGrid]) gameState.nextGrid = -1 //If last move in a capture is in the captured grid, opponent gets to choose anywhere

    const overAllWinner = calculateWinner(gameState.wins)
    if (overAllWinner) gameState.winner = overAllWinner

    gameState.history.push({ player: gameState.xIsNext ? "O" : "X", grid, pos })

    publishGameUpdate()
  } else {
    const channel = ably.channels.get(mpState.currentRoom)
    channel.publish("input", {
      grid: grid,
      pos: pos
    })
    console.log('[MP] Input sent', grid, pos)
  }
  gameState.inputAllowed = !mpState.spectate && (IAmHost.value ? gameState.xIsNext : !gameState.xIsNext)
}

</script>

<template>
  <main class="main">
    <div v-if="!mpState.connected">
      Connecting to multiplayer services...
    </div>
    <div v-else-if="mpState.currentRoom && !mpState.gameStarted">
      <div class="button" @click="leaveRoom()">Leave Room</div>
      <h1>
        Room code: {{ mpState.currentRoom }}
      </h1>
      [HOST] {{ mpState.host }}{{ IAmHost && !mpState.spectate ? "(YOU)" : "" }}
      VS
      {{ mpState.opponent || "???" }}{{ !IAmHost && !mpState.spectate ? "(YOU)" : "" }}


      <div class="button" @click="startGame()" v-if="mpState.opponent && IAmHost">Start game</div>
      <div v-else>Waiting for host to start game...</div>
      <div v-if="mpState.spectate">You are spectating the match</div>
    </div>
    <div v-else-if="mpState.currentRoom && mpState.gameStarted">
      <MainTable @clicked="handleClick" :grid-data="gridData" :state="gameState" />
      <span v-if="mpState.spectate">Spectating -</span>
      [X] {{ mpState.host }} {{ Math.floor(timer.host / 60) }}:{{ (timer.host % 60).toString().padStart(2, "0") }} -
      {{ Math.floor(timer.opponent / 60) }}:{{ (timer.opponent % 60).toString().padStart(2, "0") }} {{ mpState.opponent
      }}
      [O] - {{ mpState.currentRoom }}
    </div>
    <div v-else>
      <h1>Multiplayer</h1>
      Your username is {{ username }}

      <div class="button" @click="createRoom()">Create room</div>
      <input class="input" style="width: 100%;" placeholder="Room code" v-model="mpState.roomInput"
        @input="mpState.roomInput = mpState.roomInput.toUpperCase()">
      <div class="button" @click="joinRoom()">Join room</div>

      Multiplayer is powered by Ably, subject to their privacy policy and terms of service.
    </div>
  </main>
</template>

<style>
.button,
.input {
  font-size: larger;
  margin-right: -1px;
  margin-top: -1px;
  padding: 13px 7px;
  user-select: none;
  background-color: #333;
  border: 1px solid #555;
  color: white
}

.input {
  background-color: #222;
}

.button.disabled,
.button.disabled:hover,
.button.disabled:active {
  background-color: #222;
  border: 1px solid #000;
  pointer-events: none;
}

.button:hover {
  background-color: #444;
  border: 1px solid #555;
}

.button:active {
  background-color: #222;
  border: 1px solid #555;
}

.main {
  margin-left: auto;
  margin-right: auto;
}
</style>