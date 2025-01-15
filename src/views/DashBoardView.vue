<script setup lang="ts">
import RoleDashBoard from '../components/RoleDashBoard.vue'
import { useAuthStore } from '@/stores/auth'
import UserDashBoard from '@/components/UserDashBoard.vue';

const authStore = useAuthStore()
</script>

<template>
  <UserDashBoard v-if="authStore.isLoggedIn" />
  <RoleDashBoard  v-if="authStore.isLoggedIn" />
</template>
