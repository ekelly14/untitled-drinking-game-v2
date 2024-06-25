<template>
  Player menu
  <button @click="handlePlayerSubmit">Start Game</button>
</template>
<script setup>
import { useAuthStore } from "../store/auth"
const authStore = useAuthStore();

function handlePlayerSubmit() {
  authStore.setGameStatus("active");
}
</script>