<script setup lang="ts">
import { ref } from 'vue'
import WelcomeItem from './LoginItem.vue'
import DocumentationIcon from './icons/IconDocumentation.vue'
import ToolingIcon from './icons/IconTooling.vue'

const openReadmeInEditor = () => fetch('/__open-in-editor?file=README.md')

const password = ref('')
const email = ref('')
const handleSubmit = () => {
  // TO DO: Add login logic / API Call here
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