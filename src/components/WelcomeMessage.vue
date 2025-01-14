<script setup lang="ts">
defineProps<{
  msg: string
}>()
import { useAuthStore } from '@/stores/auth'
import { useUsersStore } from '@/stores/users'
import UserDashBoard from './UserDashBoard.vue';

const authStore = useAuthStore()
const usersStore = useUsersStore()
</script>

<template>
  <div class="greetings">
    <h1 class="green">{{ msg }}</h1>
    <h3 v-if="!authStore.isLoggedIn">
      Please login to continue.
    </h3>
    <h1 v-if="usersStore.users.length > 0">{{ usersStore.users[0].name }}</h1>
    <UserDashBoard v-if="authStore.isLoggedIn" />
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
