<template>
  <span>Setting up the Game</span>
  <span>Choose decks to play with</span>
  <div v-for="(deck, index) in userData.decks" :key="index">
    <div>
      <input type="checkbox" :id="deck.name" :value="deck.name" v-model="selectedDecks" />
      <label class="card-title" :for="deck.name">{{ deck.name }}</label>
      <span>{{ deck.description }}</span>
    </div>
  </div>
  <button @click="handleStartGame" :disabled="!selectedCards.length">Start Game</button>
</template>
<script setup>
import { useAuthStore } from '../store/auth'
import { storeToRefs } from 'pinia'
import { ref, toRaw, toValue, computed } from 'vue'
import _flatten from "lodash/flatten"
const authStore = useAuthStore();
const { userData } = storeToRefs(authStore);

const selectedDecks = ref([])
const selectedCards = computed(() => {
  return _flatten(selectedDecks.value.map(deck => {
    return toRaw(authStore.userData).decks.find(o => o.name === deck).cards
  }))
})

function handleStartGame() {
  console.log('starting Game')
  console.log(selectedCards.value)
  authStore.addCardsToGame(selectedCards.value)
  authStore.setGameStatus("player_menu")
}
</script>
<style scoped>
.card-title {
  font-weight: bold;
}
</style>