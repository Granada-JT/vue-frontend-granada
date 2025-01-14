<script setup lang="ts">
import RoleDashBoard from '../components/RoleDashBoard.vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

console.log('dashboard isloggedin: ', authStore.isLoggedIn)
</script>

<template>
  <RoleDashBoard />
</template>