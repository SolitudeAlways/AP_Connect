<template>
  <div class="auth-wrapper">
    <div class="switch-buttons">
      <button :class="['switch-btn', { active: currentForm === 'register' }]" @click="switchForm('register')">Регистрация</button>
      <button :class="['switch-btn', { active: currentForm === 'login' }]" @click="switchForm('login')">Авторизация</button>
    </div>
    <RegisterForm v-if="currentForm === 'register'" @switch="switchForm" />
    <LoginForm v-else @switch="switchForm" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import RegisterForm from './components/RegisterForm.vue'
import LoginForm from './components/LoginForm.vue'

const currentForm = ref<'login' | 'register'>('login')

function switchForm(form: 'login' | 'register') {
  currentForm.value = form
}
</script>

<style scoped>
.auth-wrapper {
  min-height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px 8px;
}
.switch-buttons {
  display: flex;
  gap: 18px;
  margin-bottom: 36px;
  justify-content: center;
}
.switch-btn {
  padding: 16px 44px;
  font-size: 20px;
  font-weight: 700;
  border: none;
  border-radius: 12px 12px;
  background: white;
  color: #2b6cc4;
  cursor: pointer;
  box-shadow: 0 2px 8px #2b6cc4;
  transition: background 0.2s, color 0.2s, box-shadow 0.2s;
}
.switch-btn.active {
  background: #2b6cc4;
  color: #fff;
  z-index: 1;
}
@media (max-width: 600px) {
  .switch-btn {
    padding: 12px 18px;
    font-size: 16px;
  }
  .switch-buttons {
    gap: 8px;
    margin-bottom: 18px;
  }
}
</style>
