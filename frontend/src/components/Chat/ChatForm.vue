<template>
  <div class="chat-form">
    <div class="chat-header">
      <h3>Чат</h3>
      <div class="users-online">
        Пользователи онлайн: {{ connectedUsers.length }}
      </div>
    </div>
    
    <div class="messages-list">
      <div v-for="(msg, idx) in messages" :key="idx" class="message">
        <div class="message-header">
          <span class="username">{{ msg.username }}</span>
          <span class="timestamp">{{ formatTime(msg.timestamp) }}</span>
        </div>
        <div class="message-text">{{ msg.message }}</div>
      </div>
    </div>
    
    <div class="sendText-div">
      <input
        class="sendText-input"
        type="text"
        placeholder="Введите сообщение..."
        v-model="message"
        @keyup.enter="sendMessage"
      />
      <button @click="sendMessage" class="send_button">Отправить</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { io, Socket } from 'socket.io-client'

interface ChatMessage {
  message: string
  username: string
  timestamp: Date
}

const message = ref('')
const messages = ref<ChatMessage[]>([])
const connectedUsers = ref<string[]>([])
const socket = ref<Socket | null>(null)

// Получаем имя пользователя из localStorage или используем случайное
const username = ref(localStorage.getItem('username') || `User${Math.floor(Math.random() * 1000)}`)

function sendMessage() {
  if (message.value.trim() && socket.value) {
    socket.value.emit('sendMessage', {
      message: message.value,
      username: username.value
    })
    message.value = ''
  }
}

function formatTime(date: Date): string {
  return new Date(date).toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(() => {
  // Подключаемся к серверу
  socket.value = io('http://localhost:3000', {
    withCredentials: true
  })

  // Присоединяемся к чату
  socket.value.emit('joinChat', { username: username.value })

  // Слушаем новые сообщения
  socket.value.on('newMessage', (msg: ChatMessage) => {
    messages.value.push(msg)
  })

  // Слушаем список пользователей
  socket.value.on('userList', (users: string[]) => {
    connectedUsers.value = users
  })

  // Слушаем присоединение пользователей
  socket.value.on('userJoined', (user: string) => {
    console.log(`Пользователь ${user} присоединился`)
  })

  // Слушаем выход пользователей
  socket.value.on('userLeft', (user: string) => {
    console.log(`Пользователь ${user} покинул чат`)
  })
})

onUnmounted(() => {
  if (socket.value) {
    socket.value.disconnect()
  }
})
</script>

<style scoped>
.chat-form {
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 4px 24px #3b3bff11;
  padding: 20px;
  width: 600px;
  min-height: 500px;
  position: relative;
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.chat-header h3 {
  margin: 0;
  color: #333;
}

.users-online {
  font-size: 0.9rem;
  color: #666;
}

.messages-list {
  flex: 1;
  overflow-y: auto;
  margin-bottom: 20px;
  max-height: 350px;
}

.message {
  margin-bottom: 15px;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 10px;
  border-left: 4px solid #60a5fa;
}

.message-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
}

.username {
  font-weight: 600;
  color: #2b6cc4;
  font-size: 0.9rem;
}

.timestamp {
  font-size: 0.8rem;
  color: #666;
}

.message-text {
  color: #333;
  line-height: 1.4;
}

.sendText-div {
  display: flex;
  gap: 10px;
  align-items: center;
}

.sendText-input {
  flex: 1;
  height: 40px;
  padding: 10px 16px;
  border: 2px solid #e1e5e9;
  border-radius: 10px;
  font-size: 16px;
  color: #333;
  outline: none;
  background: #fff;
  transition: border-color 0.2s;
}

.sendText-input:focus {
  border-color: #60a5fa;
}

.send_button {
  background: linear-gradient(90deg, #60a5fa 0%, #2b6cc4 100%);
  color: #fff;
  border: none;
  border-radius: 10px;
  height: 40px;
  padding: 0 20px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 2px 8px #3b3bff22;
  transition: all 0.2s;
}

.send_button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px #3b3bff33;
}

.send_button:active {
  transform: translateY(0);
}

::placeholder {
  color: #999;
}
</style>