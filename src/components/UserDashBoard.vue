<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useUsersStore } from '@/stores/users'
import type { CreateUser } from '@/types/users'

const authStore = useAuthStore()
const usersStore = useUsersStore()

const fullname = ref('')
const email = ref('')
const nominatedPassword = ref('')
const confirmPassword = ref('')
const role = ref('')

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
	<div class="user-dashboard">
		<h1>Create User</h1>
		<form @submit.prevent="handleSubmit">
			<label>
				Full Name:
			</label>
				<input type="text" name="fullname" v-model="fullname" />
			<label>
				Email Address:
			</label>
			<input type="email" name="email" v-model="email" />
			<label>
				Password:
			</label>
			<input type="password" name="nominatedPassword" v-model="nominatedPassword" />
			<label>
				Confirm Password:
			</label>
			<input type="password" name="confirmPassword" v-model="confirmPassword" />
			<label>
				Assign Role:
			</label>
			<input type="text" name="role" v-model="role" />
			<button type="submit">Create User</button>
		</form>
	</div>
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

	input {
    height: 30px;
    border-radius: 5px;;
    box-shadow: none;
    border: none;
  }

	.user-dashboard label {
		align-self: flex-start;
		margin: 14px 0px 2px 0px;
	}

	.user-dashboard button {
		margin-top: 20px;
	}
</style>