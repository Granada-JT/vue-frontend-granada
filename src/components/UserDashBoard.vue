<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useUsersStore } from '@/stores/users'

const authStore = useAuthStore()
const usersStore = useUsersStore()
</script>

<template>
		<div class="user-dashboard">User DashBoard</div>
</template>

<style>
	div {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
	}

	.user-dashboard {
		height: 500px;
		width: 500px
	}

	.logout {
		background-color: brown;
	}

	.logout:hover {
		background-color: rgb(233, 43, 43);
	}
</style>