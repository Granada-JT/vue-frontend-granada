<script setup lang="ts">
import { ref } from 'vue'
import axios, { AxiosError } from 'axios'
import { useRolesStore } from '@/stores/roles'
import { useToast } from 'vue-toast-notification'

const roleName = ref<string>('')
const roleDescription = ref<string>('')
const isUpdate = ref<boolean>(false)
const roleId = ref<number>(0)

const toast = useToast()
const rolesStore = useRolesStore()

const errors = ref({
  roleName: '',
  roleDescription: ''
})

const validateForm = (): boolean => {
  let isValid = true
  errors.value = {
    roleName: '',
    roleDescription: ''
  }

  if (!roleName.value.trim()) {
    errors.value.roleName = 'Role name is required'
    isValid = false
  }
  if (!roleDescription.value.trim()) {
    errors.value.roleDescription = 'Role description is required'
    isValid = false
  }

  return isValid
}

const handleSubmit = async () => {
	if (!validateForm()) return

  try {
		await axios.get('http://localhost:8000/sanctum/csrf-cookie', { withCredentials: true });

		const xsrfTokenRow = document.cookie
			.split('; ')
			.find((row) => row.startsWith('XSRF-TOKEN='));

		const xsrfToken = xsrfTokenRow ? decodeURIComponent(xsrfTokenRow.split('=')[1]) : undefined;

		const payload = {
			name: roleName.value,
			description: roleDescription.value
		}

		if (isUpdate.value) {
			toast.clear()
			toast.info('Updating Role', {
				position: 'top',
				dismissible: false,
				duration: 86400000
			})

			const updateResponse = await axios.put(`http://localhost:8000/roles/${roleId.value}`, payload, {
				headers: {
					'X-XSRF-TOKEN': xsrfToken,
				},
				withCredentials: true
			})

			if (updateResponse.status === 200) {
				rolesStore.fetchRoles();
				roleName.value = ''
				roleDescription.value = ''
				isUpdate.value = false
				toast.clear()
				toast.success('Role Updated Successfully', {
					position: 'top',
					duration: 3000
				})
			}
		} else {
			toast.clear()
			toast.info('Creating Role', {
				position: 'top',
				dismissible: false,
				duration: 86400000
			})

			const response = await axios.post('http://localhost:8000/roles', payload,
				{
					headers: {
						'X-XSRF-TOKEN': xsrfToken,
					},
					withCredentials: true,
				}
			)

			if (response.status === 201) {
				rolesStore.fetchRoles();
				roleName.value = ''
				roleDescription.value = ''
				toast.clear()
				toast.success('Role Created Successfully', {
					position: 'top',
					duration: 3000
				})
			}
		}

  } catch (error) {
		if (isUpdate.value) {
			console.error('Failed Updating Role: ', error)
			toast.clear()
			toast.error('Failed Updating Role', {
				position: 'top',
				duration: 3000
			})
		} else {
			console.error('Failed Creating Role: ', error)
			toast.clear()
			const axiosError = error as AxiosError
			let errorMsg = ''

			if (axiosError.response && axiosError.response.data) {
				const responseData = axiosError.response.data as { message?: string };
				if (responseData.message?.includes('name')) {
					errorMsg = 'Role name already exists';
				}
			}

			toast.error(`Failed Ceating Role: ${errorMsg}`, {
				position: 'top',
				duration: 3000
			})
		}
  }
}

const handleDelete = async (id: number) => {
	try {
		toast.clear()
		toast.info('Deleting Role', {
			position: 'top',
			dismissible: false,
			duration: 86400000
		})
		await axios.get('http://localhost:8000/sanctum/csrf-cookie', { withCredentials: true });

		const xsrfTokenRow = document.cookie
			.split('; ')
			.find((row) => row.startsWith('XSRF-TOKEN='));

		const xsrfToken = xsrfTokenRow ? decodeURIComponent(xsrfTokenRow.split('=')[1]) : undefined;

		const response = await axios.delete(`http://localhost:8000/roles/${id}`, {
			headers: {
				'X-XSRF-TOKEN': xsrfToken,
			},
			withCredentials: true,
		})

		if (response.status === 204) {
			rolesStore.fetchRoles();
			toast.clear()
			toast.success('Role Deleted Successfully', {
				position: 'top',
				duration: 3000
			})
		}
	} catch (error) {
		console.error('Failed Deleting Role: ', error)
		toast.clear()
		toast.error('Failed Deleting Role', {
			position: 'top',
			duration: 3000
		})
	}
}

const handleUpdate = async (id: number) => {
	isUpdate.value = true
	roleId.value = id
	const rolesArray = rolesStore.roles
	if (rolesArray) {
		rolesArray.map((role) => {
			if (id === role.id) {
				roleName.value = role.name
				roleDescription.value = role.description
			}
		})
	}
}

const handleCancel = () => {
	isUpdate.value = false
	roleName.value = ''
	roleDescription.value = ''
}
</script>

<template>
	<div class="roledb-wrapper">
		<div class="role-dashboard">
			<form @submit.prevent="handleSubmit">
				<h1 v-if="!isUpdate">Create Role</h1>
				<h1 v-if="isUpdate">Update Role</h1>
				<label>Role Name:</label>
				<input type="text" name="roleName" v-model="roleName"/>
				<span class="error" v-if="errors.roleName">{{ errors.roleName }}</span>
				<label>Role Description:</label>
				<textarea type="text" name="roleDescription" v-model="roleDescription"></textarea>
				<span class="error" v-if="errors.roleDescription">{{ errors.roleDescription }}</span>
				<div class="submit-btns">
					<button v-if="!isUpdate" type="submit">Create Role</button>
					<button v-else type="submit" class="update-btn">Update Role</button>
					<button v-if="isUpdate" @click="handleCancel" class="cancel-btn" type="submit">Cancel</button>
				</div>
			</form>
			<div class="table">
				<h1>Roles</h1>
				<table>
					<thead>
						<tr>
							<th>ID</th>
							<th>Name</th>
							<th>Description</th>
							<th>Actions</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="role in rolesStore.roles" :key="role.id">
							<td>{{ role.id }}</td>
							<td>{{ role.name }}</td>
							<td>{{ role.description }}</td>
							<td class="actions">
								<button class="update-btn" @click="handleUpdate(role.id)">Update</button>
								<button class="delete-btn" @click="handleDelete(role.id)">Delete</button>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	</div>
</template>

<style>
	.roledb-wrapper {
		display: flex;
		align-items: center;
		justify-content: flex-start;
		flex-direction: column;
		margin: 20px 12px 0px 12px;
		text-align: center;
	}

	.role-dashboard {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-start;
		gap: 20px
	}

	.v-toast__item--success {
		background-color: hsla(160, 100%, 37%, 1);
	}

	.v-toast__item--error {
		background-color: #9b1e1e;
	}

	.v-toast__item--info {
		background-color: #3974a1;
	}

	.role-dashboard input {
		align-self: flex-start;
		width: 400px;
	}

	.role-dashboard textarea {
		height: 110px;
		width: 400px;
		border-radius: 5px;
		resize: none;
		padding: 10px;
		font-family: inherit;
	}

	.role-dashboard .table {
		max-height: 408px;
	}

	.submit-btns {
		display: flex;
		gap: 20px;
	}

	.cancel-btn {
		background-color: #9b1e1e;
	}

	.cancel-btn:hover {
		background-color: #7a1515;
	}

	.table > h1 {
		margin: 20px 0;
	}

	.actions {
		display:flex;
		flex-direction: row;
	}

</style>