<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toast-notification'
import axios, { AxiosError } from 'axios'
import { useAuthStore } from '@/stores/auth'
import { useUsersStore } from '@/stores/users'
import { useRolesStore } from '@/stores/roles'
import LoginItem from './LoginItem.vue'

const password = ref<string>('')
const email = ref<string>('')
const authStore = useAuthStore()
const usersStore = useUsersStore()
const rolesStore = useRolesStore()
const router = useRouter()
const toast = useToast()

const handleSubmit = async () => {
  try {
    toast.clear()
    toast.info('Logging In', {
      position: 'top',
      dismissible: false
    })

    await axios.get('http://localhost:8000/sanctum/csrf-cookie', { withCredentials: true })

    const xsrfTokenRow = document.cookie
      .split('; ')
      .find((row) => row.startsWith('XSRF-TOKEN='));

    const xsrfToken = xsrfTokenRow ? decodeURIComponent(xsrfTokenRow.split('=')[1]) : undefined

    const postLoginResponse = await axios.post(
      'http://localhost:8000/login',
      {
        email: email.value,
        password: password.value,
      },
      {
        headers: {
          'X-XSRF-TOKEN': xsrfToken,
        },
        withCredentials: true,
      }
    )

    const getUserByEmailResponse = await axios.get(
      `http://localhost:8000/users/email/${email.value}`,
      {
        headers: {
          'X-XSRF-TOKEN': xsrfToken,
        },
        withCredentials: true,
      }
    )

    if (postLoginResponse.status === 200) {
      toast.clear()
      toast.success('Logged In Successfully', {
        position: 'top',
        duration: 3000
      })

      authStore.login()

      if (getUserByEmailResponse.status === 200) {
        authStore.updateLoggedInUser(getUserByEmailResponse.data)
      }
      router.push('/home')
      await usersStore.fetchUsers();
      await rolesStore.fetchRoles();
    }

  } catch (error) {
    toast.clear()
    const axiosError = error as AxiosError
    if (axiosError.status === 401) {
      toast.clear()
      toast.error('Incorrect Email or Password. Please Try Again', {
        position: 'top',
        dismissible: true,
        duration: 30000
      })
      
    } else {
      toast.error('Failed to Login', {
        position: 'top',
        duration: 3000
      })

      console.error('Failed to Login:', error)
    }
  }
}

const handleLogout = () => {
  try {
    toast.clear()
    toast.info('Logging Out', {
      position: 'top',
      dismissible: false
    })

    authStore.logout()
    usersStore.updateUsers(null)

    toast.clear()
    toast.success('Logged Out Successfully', {
      position: 'top',
      duration: 3000
    })

  } catch (error) {
    console.error('Failed to Logout: ', error)
  }
}

</script>
<style>
  form {
    display: flex;
    flex-direction: column;
    justify-self: center;
    align-items: center;
    text-align: center;
  }
  .form-footer {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 20px
  }
  button {
    width: 100px;
    height: 40px;
    border-radius: 100px;
    background-color: #00bd7e;
    border: none;
    color: #ffffff;
    cursor: pointer;
    font-size: 15px;
    transition: all 0.3s ease;
  }
  button:hover {
    background-color: #00966c;
    transform: scale(1.1);
    box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.2);
  }
  input {
    height: 30px;
    border-radius: 5px;;
    box-shadow: none;
    border: none;
  }
  .logout {
    margin: auto;
  }
</style>

<template>
  <form @submit.prevent="handleSubmit">
    <LoginItem v-if="!authStore.isLoggedIn">
      <template #heading>
        Email:
      </template>
      <input type="email" v-model="email" />
    </LoginItem>

    <LoginItem v-if="!authStore.isLoggedIn">
      <template #heading>
        Password:
      </template>
      <div class="form-footer">
        <input type="password" v-model="password" />
        <button type="submit">Login</button>
      </div>
    </LoginItem>
    <button
      class="logout"
      v-if="authStore.isLoggedIn"
      @click="handleLogout"
    >
      Logout
    </button>
  </form>
</template>