<script setup lang="ts">
import DashBoard from '../components/DashBoard.vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

console.log('dashboard isloggedin: ', authStore.isLoggedIn)
</script>

<template>
  <DashBoard />
</template>
