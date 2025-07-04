<template>
  <div class="div_connection">
  <AdressInput />
  <admin-dashboard />
  <chat-form/>
  </div>
</template>

<script setup lang="ts">
import AdminDashboard from './AdminDashboard.vue';
import AdressInput from './AdressInput.vue';
import ChatForm from '../Chat/ChatForm.vue';
import { ref } from 'vue'
const ip = ref('')
</script>

<style scoped>
.div_connection {
    display: flex;
    flex-direction: column;
    align-items: center;
}
</style> 