<script setup lang="ts">
import RoleDashBoard from '../components/RoleDashBoard.vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
</script>

<template>
  <RoleDashBoard />
</template>