<template>
  <router-view />
</template>

<script setup>
import MainFooter from './layout/MainFooter.vue'
import { ref, onMounted, onUnmounted } from 'vue'
import {useAlarmStore} from "@/store/useAlarmStore.js";
import {useUserStore} from "@/store/useUserStore.js";
const userStore = useUserStore()

const isMobile = ref(false)

function checkMobile() {
  isMobile.value = window.innerWidth <= 768
}

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})


const alarmStore = useAlarmStore()

onMounted(async () => {
  checkMobile()
  window.addEventListener('resize', checkMobile)

  alarmStore.connectSSE();

  if (!userStore.user && localStorage.getItem('jwt_token')) {
    await userStore.getUser()
  }
})

</script>
