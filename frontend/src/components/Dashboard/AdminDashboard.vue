<template>
  <div class="admin-dashboard">
    <div class="server-ip-row">
      <span class="server-ip">&lt;IP адрес сервера&gt;</span>
    </div>
    <div class="clients-list">
      <div v-for="client in clients":key="client.id"class="client-card">
        <span class="client-num">{{ client.id }}</span>
        <span class="client-ip">IP: {{ client.ip }}</span>
      </div>
    </div>
    <button class="disconnect-btn">РАЗЪЕДИНИТЬ ВСЕХ</button>
  </div>
</template>

<script setup lang="ts">
const clients = [
  { id: 1, ip: '192.168.0.2' },
  { id: 2, ip: '192.168.0.3' },
  { id: 3, ip: '192.168.0.4' },
  { id: 4, ip: '192.168.0.5' },
]
</script>

<style scoped>
.admin-dashboard {
  background: #fff;
  border-radius: 24px;
  box-shadow: 0 4px 24px #3b3bff11;
  padding: 36px 40px 28px 40px;
  width: 520px;
  margin: 40px auto;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.server-ip-row {
  display: flex;
  align-items: center;
  gap: 18px;
  margin-bottom: 24px;
}
.server-ip {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2b6cc4;
}
.simple-text {
  font-size: 1.1rem;
  color: #222;
}
.clients-list {
  display: flex;
  flex-direction: row;
  gap: 18px;
  margin-bottom: 8px;
  align-items: flex-end;
}
.client-card {
  background: #f4f7fb;
  border: 2.5px solid #222;
  border-radius: 12px;
  width: 100px;
  height: 70px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 700;
  color: #222;
  box-shadow: 0 2px 8px #3b3bff11;
  cursor: pointer;
  transition: border 0.2s, box-shadow 0.2s;
}
.client-card:hover {
  border-color: #2b6cc4;
  box-shadow: 0 4px 16px #60a5fa33;
}
.client-num {
  font-size: 1.3rem;
  font-weight: 700;
}
.client-ip {
  font-size: 0.9rem;
  color: #666;
  margin-top: 2px;
}
.admin-hints {
  margin: 18px 0 0 0;
}
.disconnect-btn {
  margin: 32px 0 0 0;
  background: linear-gradient(90deg, #60a5fa 0%, #2b6cc4 100%);
  color: #fff;
  border: none;
  border-radius: 12px;
  padding: 18px 0;
  width: 100%;
  font-size: 1.3rem;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 0 2px 8px #3b3bff22;
  transition: background 0.2s, box-shadow 0.2s;
}
.disconnect-btn:hover {
  background: linear-gradient(90deg, #2563eb 0%, #1e40af 100%);
}

</style> 