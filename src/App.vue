<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import WelcomeMessage from './components/WelcomeMessage.vue'
import DashBoard from './components/RoleDashBoard.vue';
import LoginView from './views/LoginView.vue';
</script>

<template>
  <WelcomeMessage msg="Welcome!" />
  <LoginView />
  <RouterView />
</template>

<style scoped>
.wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
