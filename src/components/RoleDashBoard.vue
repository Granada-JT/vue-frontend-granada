<script setup lang="ts">
import { useRolesStore } from '@/stores/roles'

const rolesStore = useRolesStore()

const handleSubmit = async (e: Event) => {
  try {
    const formData = new FormData(e.target as HTMLFormElement);
    const values = Object.fromEntries(formData.entries());
		
		// ToDo: Add API Call
  } catch (error) {
    console.error(error);
  }
}

const handleDelete = async (roleId: number) => {
	// ToDo Delete role api call
}

const handleUpdate = async (roleId: number) => {
	// Todo Update role api call
}
</script>

<template>
	<div class="roledb-wrapper">
		<div class="role-dashboard">
			<form @submit.prevent="handleSubmit">
				<h1>Create Role</h1>
				<label>Role Name:</label>
				<input type="text" name="roleName" />
				<label>Role Description:</label>
				<input type="text" name="roleDescription" />
				<button type="submit">Create role</button>
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
		margin: 0px 12px;
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

	.actions {
		display:flex;
		flex-direction: row;
	}

</style>