<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useUsersStore } from '@/stores/users'

const authStore = useAuthStore()
const usersStore = useUsersStore()

const handleSubmit = async (e: Event) => {
  try {
    const formData = new FormData(e.target as HTMLFormElement);
    const values = Object.fromEntries(formData.entries());
		
		// ToDo: Add API Call
  } catch (error) {
    console.error(error);
  }
}
</script>

<template>
	<div class="roledb-wrapper">
		<button class="logout">Logout</button>
		<div class="role-dashboard">
			<h1>Create Role</h1>
			<form @submit.prevent="handleSubmit">
				<label>Role Name:</label>
				<input type="text" name="roleName" />
				<label>Role Description:</label>
				<input type="text" name="roleDescription" />
				<button type="submit">Create role</button>
			</form>
		</div>
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
		width: 100%;
	}

	.logout {
		background-color: brown;
	}

	.logout:hover {
		background-color: rgb(233, 43, 43);
	}
</style>