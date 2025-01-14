<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useUsersStore } from '@/stores/users'

const authStore = useAuthStore()
const usersStore = useUsersStore()
</script>

<template>
	<div class="roledb-wrapper">
		<button class="logout">Logout</button>
		<div class="role-dashboard">Role DashBoard</div>
	</div>
</template>

<style>
	.roledb-wrapper {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		align-self: flex-end;
	}

	.role-dashboard {
		height: 500px;
		width: 500px;
	}

	.logout {
		background-color: brown;
	}

	.logout:hover {
		background-color: rgb(233, 43, 43);
	}
</style>