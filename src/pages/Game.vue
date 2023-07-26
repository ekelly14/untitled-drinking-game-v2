<template>
  <div>
    <Setup v-if="!isGameActive" />
    <div v-else>
      Game has started!
    </div>
  </div>
</template>
<script setup>
import { useAuthStore } from '../store/auth'
import { storeToRefs } from 'pinia'
import Setup from '../components/Setup.vue'
const authStore = useAuthStore();
const { isGameActive } = storeToRefs(authStore);
</script>