<script setup lang="ts">
import router from '@/router';

</script>

<template>
  <main class="main">
    <div class="game-mode" @click="router.push('/game')">
      Offline - Splitscreen
    </div>
    <div class="game-mode" @click="router.push('/game-mp')">
      Online - With a friend
    </div>
  </main>
</template>

<style>
.game-mode {
  height: 100px;
  width: 400px;
  font-size: larger;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  user-select: none;
  background-color: #333;
  border: 1px solid #555;
}

.game-mode.disabled,
.game-mode.disabled:hover,
.game-mode.disabled:active {
  background-color: #222;
  border: 1px solid #000;
  pointer-events: none;
}

.game-mode:hover {
  background-color: #444;
  border: 1px solid #555;
}

.game-mode:active {
  background-color: #222;
  border: 1px solid #555;
}

.main {
  margin-left: auto;
  margin-right: auto;
  width: max-content;
  margin-top: 10vh;
}
</style>