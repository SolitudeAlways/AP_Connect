<template>
  <div class="switch-buttons">
  <button :class="{ active: $route.path === '/login' }"@click="router.push('/login')"type="button">
    Вход
  </button>
  <button :class="{ active: $route.path === '/register' }" @click="router.push('/register')" type="button">
    Регистрация
  </button>
</div>
  <div class="form-box">
    <form class="form" @submit.prevent="login">
      <h2>Вход</h2>
      <div v-if="error" class="alert-error">{{ error }}</div>
      <div v-if="success" class="alert-success">{{ success }}</div>
      <div class="form-group">
        <label >E-mail</label>
        <input v-model="form.email" type="email" placeholder="Почта" required />
      </div>
      <div class="form-group">
        <label>Пароль</label>
        <input v-model="form.password" type="password" placeholder="******" required />
      </div>
      <button class="submit-btn" type="submit" :disabled="loading">Продолжить</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const emit = defineEmits<{
  (e: 'switch', form: 'login' | 'register'): void
}>()

const form = ref({
  email: '',
  password: ''
})
const error = ref('')
const success = ref('')
const loading = ref(false)

const router = useRouter()

const login = async () => {
  error.value = ''
  success.value = ''
  loading.value = true
  try {
    const response = await axios.post('http://localhost:3000/users/login', {
      email: form.value.email,
      password: form.value.password
    })
    success.value = 'Успешный вход'
    form.value = { email: '', password: '' }
    router.push('/dashboard')
  } catch (e: any) {
    console.log('Отправляем данные:', form.value.email, form.value.password)
    error.value = e.response?.data?.message || 'Ошибка входа'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.switch-buttons {
  margin-top: 12vh;
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 18px;
}
.switch-buttons button {
  padding: 20px 50px;
  border: none;
  border-radius: 15px;
  background: #e0e7ff;
  color: #22223b;
  font-weight: 700;
  cursor: pointer;
  font-size: 16px;
  transition: background 0.2s, color 0.2s;
}
.switch-buttons button.active {
  background: #2b6cc4;
  color: #fff;
}
.form-box {
  width: 420px;
  background: #fff;
  border-radius: 22px;
  box-shadow: 0 8px 32px rgba(99,102,241,0.13), 0 1.5px 8px rgba(0,0,0,0.04);
  margin: 0 auto;
  padding: 38px 38px 22px 38px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  min-height: 370px;
}
.form {
  display: flex;
  flex-direction: column;
  gap: 22px;
}
h2 {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  text-align: left;
  margin-bottom: 12px;
  color: #000000;
  font-size: 2.1rem;
  font-weight: 800;
  letter-spacing: -1px;
}
.form-group {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: black;
  display: flex;
  flex-direction: column;
  gap: 7px;
}
input[type="email"],
input[type="password"] {
  padding: 13px 16px;
  border: 1.5px solid #d1d5db;
  border-radius: 10px;
  font-size: 17px;
  outline: none;
  transition: border 0.2s, box-shadow 0.2s;
  background: #f8fafc;
  box-shadow: 0 1px 2px rgba(99,102,241,0.03);
}
input:focus {
  border-color: #2b6cc4;
  box-shadow: 0 0 0 2px #a5b4fc44;
}
.submit-btn {
  background: linear-gradient(90deg, #60a5fa 0%, #2b6cc4 100%);
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 15px;
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
  margin-top: 10px;
  transition: background 0.2s, box-shadow 0.2s;
  box-shadow: 0 2px 8px rgba(99,102,241,0.10);
}
.submit-btn:disabled {
  background: #e0e7ff;
  color: #64748b;
  cursor: not-allowed;
}
/* .submit-btn:not(:disabled):hover {

} */
.alert-error {
  background: #fee2e2;
  color: #b91c1c;
  border: 1px solid #fca5a5;
  border-radius: 8px;
  padding: 12px 14px;
  margin-bottom: 4px;
  font-size: 16px;
  text-align: left;
}
.alert-success {
  background: #dcfce7; 
  color: #166534;      
  border: 1px solid #86efac;
  border-radius: 8px;
  padding: 12px 14px;
  margin-bottom: 4px;
  font-size: 16px;
  text-align: left;
}
input {
  color: rgb(0, 0, 0);
}
::placeholder {
  color: rgb(117, 117, 117);
}
@media (max-width: 600px) {
  .form-box {
    width: 98vw;
    min-width: 0;
    padding: 16px 4vw 12px 4vw;
    min-height: unset;
  }
  .submit-btn {
    font-size: 16px;
    padding: 12px;
  }
}
</style>
