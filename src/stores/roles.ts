import { ref } from 'vue'
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

	function updateRoles(updatedRoles: Role[] | null) {
		roles.value = updatedRoles
	}

	return { roles, updateRoles }
})
