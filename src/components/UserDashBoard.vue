<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'
import { useUsersStore } from '@/stores/users'
import { useToast } from 'vue-toast-notification'

const fullName = ref<string>('')
const email = ref<string>('')
const nominatedPassword = ref<string>('')
const confirmPassword = ref<string>('')
const roleId = ref<number>(0)
const isUpdate = ref<boolean>(false)
const userId = ref<number>(0)
const toast = useToast()

const usersStore = useUsersStore()

const handleSubmit = async (e: Event) => {
  try {
		if (nominatedPassword.value !== confirmPassword.value) {
      throw new Error('Passwords do not match.')
    }

		const payload = {
			name: fullName.value,
			email: email.value,
			password: confirmPassword.value,
			role_id: roleId.value
		}

		await axios.get('http://localhost:8000/sanctum/csrf-cookie', { withCredentials: true })

		const xsrfTokenRow = document.cookie
			.split('; ')
			.find((row) => row.startsWith('XSRF-TOKEN='));

		const xsrfToken = xsrfTokenRow ? decodeURIComponent(xsrfTokenRow.split('=')[1]) : undefined

		if (isUpdate.value) {
      const response = await axios.put(`http://localhost:8000/users/${userId.value}`, payload, {
        headers: {
          'X-XSRF-TOKEN': xsrfToken,
        },
        withCredentials: true,
      })

      if (response.status === 200) {
				usersStore.fetchUsers()
				isUpdate.value = false
				fullName.value = ''
				email.value = ''
				nominatedPassword.value = ''
				confirmPassword.value = ''
				roleId.value = 0
				toast.success('User Updated Successfully', {
					position: 'top',
					duration: 3000
				})
      }
		} else {
			const response = await axios.post('http://localhost:8000/users', payload,
				{
					headers: {
						'X-XSRF-TOKEN': xsrfToken,
					},
					withCredentials: true,
				}
			)

			if (response.status === 201) {
				usersStore.fetchUsers()
				fullName.value = ''
				email.value = ''
				nominatedPassword.value = ''
				confirmPassword.value = ''
				roleId.value = 0
				toast.success('User Created Successfully', {
					position: 'top',
					duration: 3000
				})
			}
		}

  } catch (error) {
		if (isUpdate.value) {
			console.error('Failed Updating User: ', error)
			toast.error('Failed Updating User', {
				position: 'top',
				duration: 3000
			})
		} else {
			console.error('Failed Creating User: ', error)
			toast.error('Failed Creating User', {
				position: 'top',
				duration: 3000
			})
		}
  }
}

const handleUpdate = async (id: number) => {
	isUpdate.value = true
	userId.value = id
	const usersArray = usersStore.users
	if (usersArray) {
		usersArray.map((user) => {
			if (id === user.id) {
				fullName.value = user.name,
				email.value = user.email,
				nominatedPassword.value = user.password,
				roleId.value = user.role_id
			}
		})
	}
}

const handleDelete = async (id: number) => {
	try {
		await axios.get('http://localhost:8000/sanctum/csrf-cookie', { withCredentials: true });

		const xsrfTokenRow = document.cookie
			.split('; ')
			.find((row) => row.startsWith('XSRF-TOKEN='));

		const xsrfToken = xsrfTokenRow ? decodeURIComponent(xsrfTokenRow.split('=')[1]) : undefined;

		const response = await axios.delete(`http://localhost:8000/users/${id}`, {
			headers: {
				'X-XSRF-TOKEN': xsrfToken,
			},
			withCredentials: true,
		});

		if (response.status === 204) {
			usersStore.fetchUsers()
			toast.success('User Deleted Successfully', {
				position: 'top',
				duration: 3000
			})
		}
	} catch (error) {
		console.error('Failed Deleting User: ', error)
		toast.error('Failed Deleting User', {
			position: 'top',
			duration: 3000
		})
	}
}

</script>

<template>
	<div class="user-dashboard">
		<form class="user-form" @submit.prevent="handleSubmit">
			<h1 v-if="!isUpdate">Create User</h1>
			<h1 v-else="isUpdate">Update User</h1>
			<div>
				<div class="input-block">
					<label>
						Full Name:
					</label>
					<input type="text" name="fullname" v-model="fullName" />
				</div>
				<div class="input-block">
					<label>
						Email Address:
					</label>
					<input type="email" name="email" v-model="email" />
				</div>
			</div>
			<div>
				<div class="input-block">
					<label>
						Password:
					</label>
					<input type="password" name="nominatedPassword" v-model="nominatedPassword" />
				</div>
				<div class="input-block">
					<label>
						Confirm Password:
					</label>
					<input type="password" name="confirmPassword" v-model="confirmPassword"/>
				</div>
			</div>
			<div class="input-block">
				<label>
					Assign Role:
				</label>
				<input type="number" name="role" v-model="roleId"/>
			</div>
			<button type="submit" v-if="!isUpdate">Create User</button>
			<button type="submit" v-else="isUpdate">Update User</button>
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
    border-radius: 5px;
    box-shadow: none;
    border: none;
		padding: 10px;
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
		background-color: #9b1e1e;
	}

	.logout:hover {
		background-color: #7a1515;	}

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

	.delete-btn {
		background-color: #9b1e1e;
	}

	.delete-btn:hover {
		background-color: #7a1515;
	}

	.update-btn {
		background-color: #3974a1;
	}

	.update-btn:hover {
		background-color: #2f6681; /* a slightly darker shade of #3974a1 */
	}
</style>