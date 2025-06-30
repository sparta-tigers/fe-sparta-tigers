<template>
  <div class="not-found">
    <h1>404 - 페이지를 찾을 수 없습니다</h1>
    <p>요청하신 페이지를 찾을 수 없습니다.</p>
    <button @click="goHome">메인으로 이동</button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function goHome() {
  router.push('/')
}
</script>

<style scoped>
.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
  background-color: #f5f5f5;
  color: #333;
  padding: 2rem;
}

.not-found h1 {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.not-found p {
  margin-bottom: 2rem;
}

.not-found button {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  background-color: #ff6600;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.not-found button:hover {
  background-color: #e25500;
}
</style>
