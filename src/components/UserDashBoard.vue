<script setup lang="ts">
import { ref, watch } from 'vue'
import axios from 'axios'
import { useUsersStore } from '@/stores/users'

const roleId = ref(0)

const usersStore = useUsersStore()

watch(
  () => usersStore.users,
  (newUsers) => {
    console.log('users updated:', JSON.parse(JSON.stringify(newUsers)))
  }
)

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

const handleUpdate = async (id: number) => {
	// ToDo Update user api call
}

const handleDelete = async (id: number) => {
	// ToDo Delete user api call
}

</script>

<template>
	<div class="user-dashboard">
		<form class="user-form" @submit.prevent="handleSubmit">
			<h1>Create User</h1>
			<div>
				<div class="input-block">
					<label>
						Full Name:
					</label>
					<input type="text" name="fullname" />
				</div>
				<div class="input-block">
					<label>
						Email Address:
					</label>
					<input type="email" name="email" />
				</div>
			</div>
			<div>
				<div class="input-block">
					<label>
						Password:
					</label>
					<input type="password" name="nominatedPassword" />
				</div>
				<div class="input-block">
					<label>
						Confirm Password:
					</label>
					<input type="password" name="confirmPassword" />
				</div>
			</div>
			<div class="input-block">
				<label>
					Assign Role:
				</label>
				<input type="number" name="role" v-model="roleId"/>
			</div>
			<button type="submit">Create User</button>
		</form>
    <div class="table">
      <h1>Users</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Full Name</th>
            <th>Email</th>
            <th>Role ID</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in usersStore.users" :key="user.id">
            <td>{{ user.id }}</td>
            <td>{{ user.name }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.role_id }}</td>
            <td>
              <button class="update-btn" @click="handleUpdate(user.id)">Update</button>
              <button class="delete-btn" @click="handleDelete(user.id)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style>
	.user-dashboard {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		margin-top: 20px;
		gap: 20px;
		text-align: center;
	}

	.user-form {
		display: flex;
		flex-direction: column;
		width: 100%;
	}

	.user-form > div {
		display: flex;
		gap: 10px;
	}

	.input-block {
		display: flex;
		flex-direction: column;
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
		cursor: pointer;
	}

	.logout {
		background-color: brown;
	}

	.logout:hover {
		background-color: rgb(233, 43, 43);
	}

	table {
		width: 100%;
		border-collapse: collapse;
	}

	table, th, td {
		border: 1px solid #ddd;
	}

	th, td {
		padding: 8px;
		text-align: left;
	}

	th {
		background-color: #f4f4f4;
		color: #181818;
	}
	.table button {
    margin: 2px;
    padding: 5px 10px;
    border: none;
    border-radius: 3px;
    cursor: pointer;
  }

  .table button:hover {
    background-color: #000000;
  }

	.delete-btn {
		background-color: #9b1e1e;
	}

	.update-btn {
		background-color: #3974a1;
	}
</style>