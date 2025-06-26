<template>
  <header class="header">
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
  background-color: #fff;
  padding: 0 16px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
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
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()

const title = computed(() => {
  return route.meta.title || '기본 타이틀'
})


</script>
