<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'
import { useRolesStore } from '@/stores/roles'
import { useToast } from 'vue-toast-notification'

const toast = useToast()
const rolesStore = useRolesStore()
const roleName = ref<string>('')
const roleDescription = ref<string | null>('')
const isUpdate = ref<boolean>(false)
const roleId = ref<number>(0)

const handleSubmit = async (e: Event) => {
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
				toast.success('Role Updated Successfully', {
					position: 'top',
					duration: 3000
				})
			}
		} else {
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
				toast.success('Role Created Successfully', {
					position: 'top',
					duration: 3000
				})
			}
		}

  } catch (error) {
		if (isUpdate.value) {
			console.error('Failed Updating Role: ', error)
			toast.error('Failed Updating Role', {
				position: 'top',
				duration: 3000
			})
		} else {
			console.error('Failed Creating Role: ', error)
			toast.error('Failed Ceating Role', {
				position: 'top',
				duration: 3000
			})
		}
  }
}

const handleDelete = async (id: number) => {
	try {
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
			toast.success('Role Deleted Successfully', {
				position: 'top',
				duration: 3000
			})
		}
	} catch (error) {
		console.error('Failed in deleting role: ', error)
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
				<label>Role Description:</label>
				<textarea type="text" name="roleDescription" v-model="roleDescription"></textarea>
				<div class="submit-btns">
					<button v-if="!isUpdate" type="submit">Create Role</button>
					<button v-else="isUpdate" type="submit">Update Role</button>
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
		background-color: rgb(233, 43, 43);
	}

	.table > h1 {
		margin: 20px 0;
	}

	.actions {
		display:flex;
		flex-direction: row;
	}

</style>