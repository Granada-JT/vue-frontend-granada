<script setup lang="ts">
import { ref } from 'vue'
import axios, { AxiosError } from 'axios'
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

const errors = ref({
  fullName: '',
  email: '',
  nominatedPassword: '',
  confirmPassword: '',
  roleId: '',
})

const validateForm = (): boolean => {
  let isValid = true
  errors.value = {
    fullName: '',
    email: '',
    nominatedPassword: '',
    confirmPassword: '',
    roleId: '',
  }

  if (!fullName.value.trim()) {
    errors.value.fullName = 'Full name is required'
    isValid = false
  }
  if (!email.value.trim()) {
    errors.value.email = 'Email is required.'
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    errors.value.email = 'Invalid email address'
    isValid = false
  }
  if (!nominatedPassword.value.trim()) {
    errors.value.nominatedPassword = 'Password is required'
    isValid = false
  }
	if (nominatedPassword.value.trim() && nominatedPassword.value.length < 8) {
		errors.value.nominatedPassword = 'Min. of 8 characters required'
    isValid = false
	}
  if (nominatedPassword.value !== confirmPassword.value) {
    errors.value.confirmPassword = 'Passwords do not match'
    isValid = false
  }
  if (!roleId.value || roleId.value <= 0) {
    errors.value.roleId = 'Invalid role id'
    isValid = false
  }

  return isValid
}

const handleSubmit = async () => {
	if (!validateForm()) return

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
			toast.clear()
			toast.info('Updating User', {
				position: 'top',
				dismissible: false,
				duration: 86400000
			})

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
				toast.clear()
				toast.success('User Updated Successfully', {
					position: 'top',
					duration: 3000
				})
      }
		} else {
			toast.clear()
			toast.info('Creating User', {
				position: 'top',
				dismissible: false,
				duration: 86400000
			})

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
				toast.clear()
				toast.success('User Created Successfully', {
					position: 'top',
					duration: 3000
				})
			}
		}

  } catch (error) {
		if (isUpdate.value) {
			console.error('Failed Updating User: ', error)
			toast.clear()
			toast.error('Failed Updating User', {
				position: 'top',
				duration: 3000
			})
		} else {
			console.error('Failed Creating User: ', error)
			toast.clear()
			const axiosError = error as AxiosError
			let errorMsg = ''

			if (axiosError.response && axiosError.response.data) {
				const responseData = axiosError.response.data as { message?: string };
				if (responseData.message?.includes('name')) {
					errorMsg = 'Name already exists';
				}
				if (responseData.message?.includes('email')) {
					errorMsg = 'Email already exists';
				}
				if (responseData.message?.includes('role')) {
					errorMsg = 'Invalid role id';
				}
			}

			toast.error(`Failed Creating User: ${errorMsg}`, {
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
				roleId.value = user.role_id,
				confirmPassword.value = ''
			}
		})
	}
}

const handleDelete = async (id: number) => {
	try {
		toast.clear()
		toast.info('Deleting User', {
			position: 'top',
			dismissible: false,
			duration: 86400000
		})

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
			toast.clear()
			toast.success('User Deleted Successfully', {
				position: 'top',
				duration: 3000
			})
		}
	} catch (error) {
		console.error('Failed Deleting User: ', error)
		toast.clear()
		toast.error('Failed Deleting User', {
			position: 'top',
			duration: 3000
		})
	}
}

const handleCancel = () => {
	isUpdate.value = false
	fullName.value = ''
	email.value = ''
	nominatedPassword.value = ''
	confirmPassword.value = ''
	roleId.value = 0
}
</script>

<template>
	<div class="user-dashboard">
		<form class="user-form" @submit.prevent="handleSubmit">
			<h1 v-if="!isUpdate">Create User</h1>
			<h1 v-else>Update User</h1>
			<div>
				<div class="input-block">
					<label>
						Full Name:
					</label>
					<input type="text" name="fullname" v-model="fullName" />
					<span class="error" v-if="errors.fullName">{{ errors.fullName }}</span>
				</div>
				<div class="input-block">
					<label>
						Email Address:
					</label>
					<input type="email" name="email" v-model="email" />
					<span class="error" v-if="errors.email">{{ errors.email }}</span>
				</div>
			</div>
			<div>
				<div class="input-block">
					<label>
						Password:
					</label>
					<input type="password" name="nominatedPassword" v-model="nominatedPassword" />
					<span class="error" v-if="errors.nominatedPassword">{{ errors.nominatedPassword }}</span>
				</div>
				<div class="input-block">
					<label>
						Confirm Password:
					</label>
					<input type="password" name="confirmPassword" v-model="confirmPassword"/>
					<span class="error" v-if="errors.confirmPassword">{{ errors.confirmPassword }}</span>
				</div>
			</div>
			<div class="input-block">
				<label>
					Assign Role:
				</label>
				<input type="number" name="role" v-model="roleId"/>
				<span class="error" v-if="errors.roleId">{{ errors.roleId }}</span>
			</div>
			<div class="sumbmit-btns">
				<button type="submit" v-if="!isUpdate">Create User</button>
				<button type="submit" v-else class="update-btn">Update User</button>
				<button v-if="isUpdate" @click="handleCancel" class="cancel-btn" type="submit">Cancel</button>
			</div>
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

	.error {
		color: #fa6565;
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
		background-color: #2f6681;
	}
</style>