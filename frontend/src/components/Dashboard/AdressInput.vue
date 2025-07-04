<template>
  <div class="connect-form">
    <h2 class="title">Соединиться</h2>
    <input
      class="ip-input"
      type="text"
      placeholder="Введите ip сервера"
      v-model="ip"
    />
    <button class="connect-btn">подключиться</button>
    <div class="status-row">
      статус:
      <span :class="['status', connected ? 'connected' : 'disconnected']">
        {{ connected ? 'подключен' : 'не подключен' }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const ip = ref('')
const connected = ref(false)

function connect() {
  // Здесь должна быть реальная логика подключения
  // Для примера просто меняем статус на "подключен"
  connected.value = true
}
</script>

<style scoped>
.connect-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 4px 24px #3b3bff11;
  padding: 0px 32px 28px 32px;
  width: 340px;
}
.title {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-size: 2rem;
  font-weight: 700;
  color: #2b6cc4;
  margin-bottom: 24px;
}
.ip-input {
  width: 100%;
  padding: 14px 16px;
  border: 2px solid #a7f3d0;
  border-radius: 10px;
  font-size: 18px;
  color: #059669;
  outline: none;
  margin-bottom: 18px;
  background: #f0fdf4;
  transition: border 0.2s, box-shadow 0.2s;
}
.ip-input:focus {
  border-color: #059669;
  box-shadow: 0 0 0 2px #6ee7b7aa;
}
.connect-btn {
  width: 100%;
  background: linear-gradient(90deg, #60a5fa 0%, #2b6cc4 100%);
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 14px;
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s, box-shadow 0.2s;
  box-shadow: 0 2px 8px rgba(99,102,241,0.10);
}
.connect-btn:hover {
  background: linear-gradient(90deg, #2563eb 0%, #1e40af 100%);
}
.status-row {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  margin-top: 18px;
  font-size: 16px;
  font-weight: 600;
  color: #222;
}
.status {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-weight: 700;
  margin-left: 8px;
}
.status.connected {
  color: #059669;
}
.status.disconnected {
  color: #b91c1c;
}
</style>