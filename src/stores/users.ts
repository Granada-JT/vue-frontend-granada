import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { User, Role } from '@/types/users'

export const useUsersStore = defineStore('users', () => {
	
	const users = ref<User[] | null>([
		{
			id: 0,
			name: '',
			email: '',
			password: '',
			role: {
				id: 0,
				name: '',
				description: null,
				created_at: '',
				updated_at: '',
			},
			role_id: 0,
			created_at: '',
			updated_at: '',
		},
	]);

	function updateUsers(updatedUsers: User[] | null) {
		users.value = updatedUsers
	}

	return { users, updateUsers }
})