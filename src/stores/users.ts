import { ref } from 'vue'
import axios from 'axios'
import { defineStore } from 'pinia'
import type { User } from '@/types/users'

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

	const updateUsers = (updatedUsers: User[] | null) => {
		users.value = updatedUsers
	}

	const fetchUsers = async () => {
		try {
			const usersResponse = await axios.get('http://localhost:8000/users', { withCredentials: true });
	
			if (usersResponse.status === 200) {
				users.value = usersResponse.data
			}
		} catch (error) {
			console.error('Failed to fetch users:', error);
		}
	}

	return { users, updateUsers, fetchUsers }
})