<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import { useUsersStore } from '@/stores/users'
import LoginItem from './LoginItem.vue'
import type { User } from '@/types/users'

const password = ref('')
const email = ref('')
const users = ref<User[]>([]);

const authStore = useAuthStore()
const usersStore = useUsersStore()

const router = useRouter()

const fetchUsers = async () => {
  try {
    const usersResponse = await axios.get('http://localhost:8000/users', { withCredentials: true });

    if (usersResponse.status === 200) {
      users.value = usersResponse.data
      usersStore.updateUsers(usersResponse.data)
    }
  } catch (error) {
    console.error('Failed to fetch users:', error);
  }
};

const handleSubmit = async () => {
  try {
    await axios.get('http://localhost:8000/sanctum/csrf-cookie', { withCredentials: true });

    const xsrfTokenRow = document.cookie
      .split('; ')
      .find((row) => row.startsWith('XSRF-TOKEN='));

    const xsrfToken = xsrfTokenRow ? decodeURIComponent(xsrfTokenRow.split('=')[1]) : undefined;

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
    );

    if (postLoginResponse.status === 200) {
      authStore.login()
      router.push('/home')
      await fetchUsers();
    }

  } catch (error) {
    console.error('Failed to login:', error);
  }
};

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
    <button class="logout" v-if="authStore.isLoggedIn">Logout</button>
  </form>
</template>