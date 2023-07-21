<template>
  <p>Hello!</p>
  <button @click="handleGoogleLogin">Login with Google</button>
</template>

<script setup>
import { useAuthStore } from '../store/auth'
const authStore = useAuthStore();

async function handleGoogleLogin(){
  // console.log('AuthStore', authStore)
  await authStore.authWithGooglePopup()
}
</script>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
