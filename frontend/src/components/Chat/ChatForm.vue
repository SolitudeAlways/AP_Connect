<template>
  <div class="chat-form">
    <div class="chat-header">
      <h3>Чат</h3>
      <div class="users-online">
        Пользователи онлайн: {{ connectedUsers.length }}
      </div>
    </div>
    
    <div class="messages-list" ref="messagesList">
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
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { io, Socket } from 'socket.io-client'
import { useRouter } from 'vue-router'

interface ChatMessage {
  message: string
  username: string
  timestamp: string | Date
}

const router = useRouter()
const message = ref('')
const messages = ref<ChatMessage[]>([])
const connectedUsers = ref<string[]>([])
const socket = ref<Socket | null>(null)
const messagesList = ref<HTMLElement>()

// Получаем данные пользователя из localStorage
const username = ref(localStorage.getItem('username'))
const userId = ref(localStorage.getItem('userId'))

// Проверяем, залогинен ли пользователь
if (!username.value || !userId.value) {
  console.warn('Пользователь не залогинен, перенаправляем на страницу входа')
  router.push('/login')
}

function sendMessage() {
  if (message.value.trim() && socket.value && username.value && userId.value) {
    socket.value.emit('sendMessage', {
      message: message.value.trim(),
      username: username.value.trim(),
      userId: userId.value
    })
    message.value = ''
  }
}

function formatTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return dateObj.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

function scrollToBottom() {
  nextTick(() => {
    if (messagesList.value) {
      messagesList.value.scrollTop = messagesList.value.scrollHeight
    }
  })
}

onMounted(() => {
  // Проверяем еще раз перед подключением
  if (!username.value || !userId.value) {
    console.error('Нет данных пользователя для подключения к чату')
    return
  }

  console.log('Подключение к чату:', { username: username.value, userId: userId.value })

  // Подключаемся к серверу
  socket.value = io('http://localhost:3000', {
    withCredentials: true
  })

  // Обработка ошибок соединения
  socket.value.on('connect_error', (err) => {
    console.error('Ошибка подключения к серверу:', err)
  })

  socket.value.on('connect', () => {
    console.log('Успешно подключились к серверу')
  })

  socket.value.on('disconnect', () => {
    console.log('Отключились от сервера')
  })

  // Присоединяемся к чату
  socket.value.emit('joinChat', { 
    username: username.value,
    userId: userId.value 
  })

  // Слушаем новые сообщения
  socket.value.on('newMessage', (msg: ChatMessage) => {
    // Преобразуем timestamp в Date если это строка
    if (typeof msg.timestamp === 'string') {
      msg.timestamp = new Date(msg.timestamp)
    }
    messages.value.push(msg)
    scrollToBottom()
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
h3 {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-size: 2rem;
  font-weight: 700;
}
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
  letter-spacing: -0.4px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-size: 0.9rem;
  color: #666;
  font-weight: 600;
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
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-weight: 600;
  color: #2b6cc4;
  font-size: 0.9rem;
}

.timestamp {
  font-weight: 500;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-size: 0.8rem;
  color: #666;
}

.message-text {
  font-weight: 500;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
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

/* .send_button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px #3b3bff33;
} */

.send_button:active {
  transform: translateY(5px);
}

::placeholder {
  color: #999;
}
</style>