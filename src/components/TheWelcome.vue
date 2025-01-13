<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'
import WelcomeItem from './LoginItem.vue'

const password = ref('')
const email = ref('')
const handleSubmit = async () => {
  try {
    await axios.get('http://localhost:8000/sanctum/csrf-cookie', { withCredentials: true });

    const xsrfTokenRow = document.cookie
      .split('; ')
      .find((row) => row.startsWith('XSRF-TOKEN='));

    const xsrfToken = xsrfTokenRow ? decodeURIComponent(xsrfTokenRow.split('=')[1]) : undefined;

    await axios.post(
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
</style>

<template>
  <form @submit.prevent="handleSubmit">
    <WelcomeItem>
      <template #heading>
        Email:
      </template>
      <input type="email" v-model="email" />
    </WelcomeItem>

    <WelcomeItem>
      <template #heading>
        Password:
      </template>
      <div class="form-footer">
        <input type="password" v-model="password" />
        <button type="submit">Login</button>
      </div>
    </WelcomeItem>
  </form>
</template>