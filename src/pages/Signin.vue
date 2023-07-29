<template>
  <p>Hello! Sign in or Quickplay</p>
  <button @click="handleGoogleLogin">Login with Google</button>
  <button disabled>QuickPlay</button>
</template>
<script setup>
import { useAuthStore } from '../store/auth'
import { useRouter } from 'vue-router'
import { watch } from 'vue'
import { storeToRefs } from 'pinia'
const router = useRouter();
const authStore = useAuthStore();
const { hasUserData } = storeToRefs(authStore);

async function handleGoogleLogin() {
  await authStore.authWithGooglePopup();
}

watch(hasUserData, (newVal, oldVal) => {
  if(newVal) {
    router.push({ name: "Game" })
  }
})
</script>