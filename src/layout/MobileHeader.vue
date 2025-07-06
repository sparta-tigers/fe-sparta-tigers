<script setup>
import {ref, onMounted, onUnmounted} from "vue";
import {useRoute} from 'vue-router'
import {computed} from 'vue'

defineProps({
  isToken: Boolean
})

const route = useRoute()
const title = computed(() => route.meta.title || '기본 타이틀')

const isScrolled = ref(false);
const handleScroll = () => {
  isScrolled.value = window.scrollY > 20;
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
})
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
})
</script>

<template>
  <header :class="['header', { scrolled: isScrolled }]">
    <div class="header-inner">
      <div class="title">{{ title }}</div>
      <button
          v-if="isToken"
          class="auth-btn"
          @click="$emit('logout')"
      >
        로그아웃
      </button>
      <button
          v-else
          class="auth-btn"
          @click="$emit('login')"
      >
        로그인
      </button>
    </div>
  </header>
</template>

<style scoped>
.header {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 7vh;
  padding: 0 16px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 40;
  background-color: transparent;
  border-bottom: 1px solid transparent;
  transition: all 0.5s ease;
}

.header-inner {
  width: 100%;
  max-width: 700px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header.scrolled {
  background-color: rgba(255, 255, 255, 0.9);
  border-bottom: 1px solid rgba(229, 231, 235, 0.8);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(6px);
}

.auth-btn {
  margin-left: auto;
  padding: 6px 12px;
  font-size: 14px;
  border: none;
  background-color: #007bff; /* 파란색 */
  color: white;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
}

.auth-btn:hover {
  background-color: #0056b3;
}

.title {
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 10px;
}
</style>