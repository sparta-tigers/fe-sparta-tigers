<template>
  <router-view />
  <MainFooter v-if="!isMobile"></MainFooter>
</template>

<script setup>
import MainFooter from './layout/MainFooter.vue'
import { ref, onMounted, onUnmounted } from 'vue'

const isMobile = ref(false)

function checkMobile() {
  isMobile.value = window.innerWidth <= 768
}

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})
onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})
</script>
