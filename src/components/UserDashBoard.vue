<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'

const roleId = ref(0)

const handleSubmit = async (e: Event) => {
  try {
    const formData = new FormData(e.target as HTMLFormElement);
    const values = Object.fromEntries(formData.entries());
		if (values.nominatedPassword !== values.confirmPassword) {
      throw new Error('Passwords do not match.');
    }

		const payload = {
			name: values.fullname,
			email: values.email,
			password: values.confirmPassword,
			role_id: roleId.value
		}

		await axios.get('http://localhost:8000/sanctum/csrf-cookie', { withCredentials: true });

		const xsrfTokenRow = document.cookie
			.split('; ')
			.find((row) => row.startsWith('XSRF-TOKEN='));

		const xsrfToken = xsrfTokenRow ? decodeURIComponent(xsrfTokenRow.split('=')[1]) : undefined;

		const response = await axios.post('http://localhost:8000/users', payload,
			{
        headers: {
          'X-XSRF-TOKEN': xsrfToken,
        },
        withCredentials: true,
      }
		)

		if (response.status === 201) {
			(e.target as HTMLFormElement).reset();
		}
		
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
				<input type="text" name="fullname" />
			<label>
				Email Address:
			</label>
			<input type="email" name="email" />
			<label>
				Password:
			</label>
			<input type="password" name="nominatedPassword" />
			<label>
				Confirm Password:
			</label>
			<input type="password" name="confirmPassword" />
			<label>
				Assign Role:
			</label>
			<input type="number" name="role" v-model="roleId"/>
			<button type="submit">Create User</button>
		</form>
	</div>
</template>

<style>
	.user-dashboard {
		height: 500px;
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: flex-start;
		flex-direction: column;
		margin-top: 20px;
	}

	input {
    height: 30px;
    border-radius: 5px;;
    box-shadow: none;
    border: none;
  }

	label {
		align-self: flex-start;
		margin: 14px 0px 2px 0px;
	}

	button {
		margin-top: 20px;
	}

	.logout {
		background-color: brown;
	}

	.logout:hover {
		background-color: rgb(233, 43, 43);
	}
</style>