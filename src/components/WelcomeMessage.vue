<script setup lang="ts">
defineProps<{
  msg: string
}>()
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
</script>

<template>
  <div class="greetings">
    <h1 class="green">{{ msg }}</h1>
    <h3 v-if="!authStore.isLoggedIn">
      Please login to continue.
    </h3>
    <h1 v-if="authStore.loggedInUser">{{ authStore.loggedInUser.name }}</h1>
  </div>
</template>

<style scoped>

h3 {
  font-size: 1.2rem;
}

.greetings {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

</style>
