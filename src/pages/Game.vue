<template>
  <div @click="handleNextCard">
    <DeckSetup v-if="gameStatus === 'decks_menu'" />
    <PlayerSetup v-if="gameStatus === 'player_menu'" />
    <div v-if="gameStatus === 'active'">
      <!-- Game has started! -->
      <!-- <button @click="handleNextCard">Next Prompt</button> -->
      <div v-if="game.currentCard">
        {{ game.currentCard.prompt }}
      </div>
    </div>
    <div v-if="gameStatus === 'game_over'">
      Game over! play again do it do it now
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../store/auth'
import { storeToRefs } from 'pinia'
import DeckSetup from '../components/DeckSetup.vue'
import PlayerSetup from '../components/PlayerSetup.vue'
const authStore = useAuthStore();
const { gameStatus, game } = storeToRefs(authStore);

function handleNextCard() {
  if(gameStatus.value === "active"){
    authStore.getNextCard();
  } else if(gameStatus.value === "game_over"){
    authStore.resetGame();
  }
}
</script>