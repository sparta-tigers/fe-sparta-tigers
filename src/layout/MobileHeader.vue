<template>
  <header :class="['header', { scrolled: isScrolled }]">
    <div class="title">{{ title }}</div>
    <button class="menu-btn" @click="$emit('toggleMenu')">≡</button>
  </header>

</template>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
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

.header.scrolled {
  background-color: rgba(255, 255, 255, 0.9);
  border-bottom: 1px solid rgba(229, 231, 235, 0.8);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(6px);
}

.title {
  font-weight: bold;
}

.menu-btn {
  cursor: pointer;
  background: none;
  border: none;
  font-size: 1.5rem;
}
</style>

<script setup>
import {useRoute} from 'vue-router'
import {computed} from 'vue'
import {ref, onMounted, onUnmounted} from "vue";

const route = useRoute()

const title = computed(() => {
  return route.meta.title || '기본 타이틀'
})

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
