import { ref } from 'vue'
import axios from 'axios'
import { defineStore } from 'pinia'
import type { Role } from '@/types/users'

export const useRolesStore = defineStore('roles', () => {
	
	const roles = ref<Role[] | null>([
		{
      created_at: '',
      description: '',
      id: 0,
      name: '',
      updated_at: ''
    }
	]);

	const updateRoles = (updatedRoles: Role[] | null) => {
		roles.value = updatedRoles
	}

	const fetchRoles = async () => {
		try {
			const rolesResponse = await axios.get('http://localhost:8000/roles', { withCredentials: true });
	
			if (rolesResponse.status === 200) {
				roles.value = rolesResponse.data
			}
		} catch (error) {
			console.error('Failed to fetch roles: ', error)
		}
	}

	return { roles, updateRoles, fetchRoles }
})
