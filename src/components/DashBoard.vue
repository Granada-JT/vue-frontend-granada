<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useUsersStore } from '@/stores/users'

const authStore = useAuthStore()
const usersStore = useUsersStore()
</script>

<template>
	<p v-if="authStore.isLoggedIn">{{ usersStore.users?.[0].name }}</p>
</template>