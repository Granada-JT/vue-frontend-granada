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
		margin: 0px 12px;
	}

	.role-dashboard {
		height: 500px;
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-start;
	}

</style>