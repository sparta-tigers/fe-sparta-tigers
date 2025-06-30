<template>
  <router-view />
</template>

<script setup>
import {onMounted, onUnmounted, ref} from 'vue'
import {useAlarmStore} from "@/store/useAlarmStore.js";
import {useUserStore} from "@/store/useUserStore.js";
import {useRoute, useRouter} from "vue-router";
const router = useRouter()
const userStore = useUserStore()
const route = useRoute()

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

  const token = localStorage.getItem('jwt_token')
  if (route.meta.requiresAuth && !token) {
    await router.push('/login')
    return
  }

  if (token && !userStore.user) {
    await userStore.getUser()
  }

  if (token && userStore.user) {
    alarmStore.connectSSE()
  }
})


</script>
