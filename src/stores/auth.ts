import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { User } from '@/types/users'

export const useAuthStore = defineStore('auth', () => {

  const isLoggedIn = ref<boolean>(false)

  const loggedInUser = ref<User | null>(null)

  function login() {
    isLoggedIn.value = true
  }

  function logout() {
    isLoggedIn.value = false
    loggedInUser.value = null
  }

  function updateLoggedInUser(userData: User | null) {
		loggedInUser.value = userData
	}

  return { isLoggedIn, login, logout, loggedInUser, updateLoggedInUser }
})