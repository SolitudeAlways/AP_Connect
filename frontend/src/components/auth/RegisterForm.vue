<template>
  <div class="switch-buttons">
  <button :class="{ active: $route.path === '/login' }" @click="router.push('/login')" type="button">
    Вход
  </button>
  <button :class="{ active: $route.path === '/register' }" @click="router.push('/register')" type="button">
    Регистрация
  </button>
</div>
  <div class="form-box">
    <form class="form" @submit.prevent="register">
      <h2>Регистрация</h2>
      <div class="form-group">
        <label>Логин</label>
        <input v-model="form.name" type="text" placeholder="Логин" required />
      </div>
      <div class="form-group">
        <label>E-mail</label>
        <input v-model="form.email" type="email" placeholder="Почта" required />
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Пароль</label>
          <input v-model="form.password" type="password" placeholder="******" required />
        </div>
        <div class="form-group">
          <label>Подтверждение</label>
          <input v-model="form.confirm" type="password" placeholder="******" required />
        </div>
      </div>
      <div class="form-group form-checkbox">
        <input v-model="form.accept" type="checkbox" id="accept" required />
        <label for="accept">Я принимаю все условия пользования</label>
      </div>
      <div v-if="error" class="alert-error">{{ error }}</div>
      <button class="submit-btn" type="submit" :disabled="!form.accept || loading">Продолжить</button>
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
  name: '',
  email: '',
  password: '',
  confirm: '',
  accept: false
})
const error = ref('')
const loading = ref(false)
const router = useRouter()

const register = async () => {
  error.value = ''
  if (form.value.password !== form.value.confirm) {
    error.value = 'Пароли не совпадают'
    return
  }
  loading.value = true
  try {
    await axios.post('http://localhost:3000/users/register', {
      email: form.value.email,
      login: form.value.name, // Используем name как login
      password: form.value.password
    })
    error.value = ''
    form.value = { name: '', email: '', password: '', confirm: '', accept: false }
    alert('Регистрация успешна! Теперь войдите в аккаунт.')
    emit('switch', 'login')
  } catch (e: any) {
    error.value = e.response?.data?.message || 'Ошибка регистрации'
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
  width: 620px;
  background: #fff;
  border-radius: 22px;
  box-shadow: 0 8px 32px rgba(99,102,241,0.13), 0 1.5px 8px rgba(0,0,0,0.04);
  margin: 0 auto;
  padding: 38px 38px 22px 38px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  min-height: 520px;
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
.form-row {
  display: flex;
  gap: 18px;
}
.form-row .form-group {
  flex: 1;
}
input[type="text"],
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
  border-color: #6366f1;
  box-shadow: 0 0 0 2px #a5b4fc44;
}
.form-checkbox {
  flex-direction: row;
  align-items: center;
  gap: 10px;
  font-size: 16px;
  margin-top: 2px;
}
input[type="checkbox"] {
  width: 20px;
  height: 20px;
  accent-color: #2b6cc4;
  border-radius: 5px;
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
input {
  color: black;
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
  .form-row {
    flex-direction: column;
    gap: 10px;
  }
  .submit-btn {
    font-size: 16px;
    padding: 12px;
  }
}
</style>
